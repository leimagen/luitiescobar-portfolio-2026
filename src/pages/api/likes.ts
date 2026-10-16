import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { notifyLike } from '../../lib/notify';

// Runs on the Worker (everything else on the site is prerendered).
export const prerender = false;

const SLUG = /^[a-z0-9][a-z0-9-]{0,95}$/;
const MAX_SLUGS = 120;
const HOST = /^[a-z0-9.-]{3,100}$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Anonymous visitor id: salted SHA-256 of IP + user agent. Nothing personal is stored. */
async function visitorId(request: Request) {
  const ip = request.headers.get('cf-connecting-ip') ?? '';
  const ua = request.headers.get('user-agent') ?? '';
  const data = new TextEncoder().encode(`${env.LIKES_SALT ?? 'luitiescobar'}|${ip}|${ua}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** GET /api/likes?slugs=a,b,c → { counts: { a: 3 }, liked: ["a"] } */
export const GET: APIRoute = async ({ request, url }) => {
  const slugs = [...new Set((url.searchParams.get('slugs') ?? '').split(','))].filter((s) => SLUG.test(s)).slice(0, MAX_SLUGS);
  if (!slugs.length) return json({ counts: {}, liked: [] });

  const marks = slugs.map(() => '?').join(',');
  const visitor = await visitorId(request);
  const [counts, mine] = await env.DB.batch<{ slug: string; n?: number }>([
    env.DB.prepare(`SELECT slug, COUNT(*) AS n FROM likes WHERE slug IN (${marks}) GROUP BY slug`).bind(...slugs),
    env.DB.prepare(`SELECT slug FROM likes WHERE visitor = ? AND slug IN (${marks})`).bind(visitor, ...slugs),
  ]);

  return json({
    counts: Object.fromEntries(counts.results.map((r) => [r.slug, r.n ?? 0])),
    liked: mine.results.map((r) => r.slug),
  });
};

/** POST /api/likes { slug, liked } → { slug, count, liked } */
export const POST: APIRoute = async ({ request, url, locals }) => {
  // only accept likes coming from the site itself
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== url.host) return json({ error: 'forbidden' }, 403);

  let body: { slug?: unknown; liked?: unknown; ref?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid body' }, 400);
  }
  const slug = typeof body.slug === 'string' ? body.slug : '';
  if (!SLUG.test(slug) || typeof body.liked !== 'boolean') return json({ error: 'invalid input' }, 400);

  const visitor = await visitorId(request);
  const write = body.liked
    ? env.DB.prepare('INSERT OR IGNORE INTO likes (slug, visitor, created_at) VALUES (?, ?, ?)').bind(slug, visitor, Date.now())
    : env.DB.prepare('DELETE FROM likes WHERE slug = ? AND visitor = ?').bind(slug, visitor);
  const count = env.DB.prepare('SELECT COUNT(*) AS n FROM likes WHERE slug = ?').bind(slug);
  const [written, result] = await env.DB.batch<{ n: number }>([write, count]);
  const total = result.results[0]?.n ?? 0;

  // new like → Telegram message, sent after the response so the button stays instant
  if (body.liked && written.meta.changes) {
    const cf = (request as { cf?: { country?: string; city?: string } }).cf;
    const ref = typeof body.ref === 'string' && HOST.test(body.ref) ? body.ref : undefined;
    const task = notifyLike({ slug, visitor, count: total, country: cf?.country, city: cf?.city, userAgent: request.headers.get('user-agent') ?? '', ref, origin: url.origin })
      .catch((e) => console.error('notify', e));
    const ctx = (locals as { cfContext?: { waitUntil(p: Promise<unknown>): void } }).cfContext;
    ctx ? ctx.waitUntil(task) : await task;
  }

  return json({ slug, count: total, liked: body.liked });
};
