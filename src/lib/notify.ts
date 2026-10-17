import { env } from 'cloudflare:workers';

/**
 * Telegram message to the site owner when a project gets a new like.
 * Needs two Worker secrets: TELEGRAM_BOT_TOKEN (from @BotFather) and TELEGRAM_CHAT_ID.
 * Without them it silently does nothing.
 */
const MAX_PER_HOUR = 30;

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Spanish project title straight from Sanity, so new projects work without a rebuild. */
async function projectTitle(slug: string): Promise<string> {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';
  if (!projectId) return slug;
  const query = encodeURIComponent('*[_type == "project" && slug.current == $slug][0]{ "es": title.es, "en": title.en }');
  try {
    const res = await fetch(`https://${projectId}.apicdn.sanity.io/v2026-10-01/data/query/${dataset}?query=${query}&$slug=${encodeURIComponent(JSON.stringify(slug))}`);
    const { result } = (await res.json()) as { result?: { es?: string; en?: string } };
    return result?.es || result?.en || slug;
  } catch {
    return slug;
  }
}

/** "Móvil · Safari en iOS" from the user agent (rough on purpose) */
function device(ua: string): string {
  const kind = /iPad|Tablet/i.test(ua) ? 'Tablet' : /Mobi|iPhone|Android/i.test(ua) ? 'Móvil' : 'Escritorio';
  const browser = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox\//.test(ua) ? 'Firefox' : /Chrome\//.test(ua) ? 'Chrome' : /Safari\//.test(ua) ? 'Safari' : '';
  const os = /iPhone|iPad|iOS/.test(ua) ? 'iOS' : /Android/.test(ua) ? 'Android' : /Windows/.test(ua) ? 'Windows' : /Mac OS X|Macintosh/.test(ua) ? 'macOS' : /Linux/.test(ua) ? 'Linux' : '';
  return [kind, [browser, os].filter(Boolean).join(' en ')].filter(Boolean).join(' · ');
}

interface LikeEvent {
  slug: string;
  visitor: string;
  count: number;
  country?: string;
  city?: string;
  userAgent: string;
  /** external site the visitor came from, e.g. "linkedin.com" */
  ref?: string;
  origin: string;
}

export async function notifyLike({ slug, visitor, count, country, city, userAgent, ref, origin }: LikeEvent) {
  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return;

  // once per visitor and project, and a global cap so a bot can't flood the chat
  const now = Date.now();
  const [inserted, recent] = await env.DB.batch<{ n: number }>([
    env.DB.prepare('INSERT OR IGNORE INTO like_notifications (slug, visitor, created_at) VALUES (?, ?, ?)').bind(slug, visitor, now),
    env.DB.prepare('SELECT COUNT(*) AS n FROM like_notifications WHERE created_at > ?').bind(now - 3_600_000),
  ]);
  if (!inserted.meta.changes || (recent.results[0]?.n ?? 0) > MAX_PER_HOUR) return;

  const title = await projectTitle(slug);
  const countryName = country && country !== 'XX' && country !== 'T1' ? new Intl.DisplayNames(['es'], { type: 'region' }).of(country) : undefined;
  const place = [city, countryName].filter(Boolean).join(', ');
  const url = `${origin}/es/work/${slug}/`;
  const text = [
    '❤️ <b>Nuevo like en tu portafolio</b>',
    '',
    `<b>${escapeHtml(title)}</b>`,
    `${count} ${count === 1 ? 'like' : 'likes'} en total`,
    '',
    place ? `📍 ${escapeHtml(place)}` : null,
    userAgent ? `💻 ${device(userAgent)}` : null,
    ref ? `🔗 Llegó desde ${escapeHtml(ref)}` : null,
    '',
    url,
  ].filter((line) => line !== null).join('\n');

  // accept the token even if it was pasted with a "bot" prefix, quotes or as part of an API URL
  const token = env.TELEGRAM_BOT_TOKEN.match(/\d+:[\w-]{30,}/)?.[0];
  if (!token) return console.error('telegram: TELEGRAM_BOT_TOKEN does not look like a bot token');
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
  });
  if (!res.ok) console.error('telegram', res.status, await res.text());
}
