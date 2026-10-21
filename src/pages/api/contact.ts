import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { escapeHtml, sendTelegram } from '../../lib/notify';
import { visitorId } from '../../lib/visitor';

// Runs on the Worker. Sends contact form messages by email (reply goes straight to the visitor)
// and pings Telegram. Nothing from the message is stored; D1 only keeps an anonymous hash for rate limiting.
export const prerender = false;

const MAX_PER_HOUR = 5;
const EMAIL = /^[^\s@<>"]{1,64}@[^\s@<>"]{1,190}\.[a-z]{2,}$/i;
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ');

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

/** POST /api/contact { name, email, type, message, lang, website (honeypot), elapsed (ms on the page) } */
export const POST: APIRoute = async ({ request, url, locals }) => {
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== url.host) return json({ error: 'forbidden' }, 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid body' }, 400);
  }

  // bots: filled the hidden field or submitted faster than a person can type. Pretend it worked.
  if (clean(body.website, 200) || Number(body.elapsed) < 3000) return json({ ok: true });

  const name = oneLine(clean(body.name, 100));
  const email = oneLine(clean(body.email, 200));
  const type = oneLine(clean(body.type, 60));
  const message = clean(body.message, 5000);
  const lang = body.lang === 'es' ? 'es' : 'en';
  if (!name || !EMAIL.test(email) || message.length < 2) return json({ error: 'invalid input' }, 400);

  const visitor = await visitorId(request);
  const now = Date.now();
  const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM contact_rate WHERE visitor = ? AND created_at > ?').bind(visitor, now - 3_600_000);
  const insert = env.DB.prepare('INSERT INTO contact_rate (visitor, created_at) VALUES (?, ?)').bind(visitor, now);
  const [count] = await env.DB.batch<{ n: number }>([recent]);
  if ((count.results[0]?.n ?? 0) >= MAX_PER_HOUR) return json({ error: 'rate limited' }, 429);
  await env.DB.batch([insert]);

  const subject = `${type || 'Contacto'} - ${name}`;
  const text = `${message}\n\n--\n${name} <${email}>\n${type ? `${type} · ` : ''}${lang.toUpperCase()} · luitiescobar.com`;
  const html = `<div style="font:15px/1.6 system-ui,sans-serif;color:#141414">
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>
<hr style="border:0;border-top:1px solid #e6e5df">
<p style="color:#4a4a47;font-size:13px"><b>${escapeHtml(name)}</b> &lt;<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>&gt;<br>${escapeHtml(type)} · ${lang.toUpperCase()} · luitiescobar.com</p>
</div>`;

  let emailed = false;
  if (env.EMAIL && env.CONTACT_TO) {
    try {
      await env.EMAIL.send({
        to: env.CONTACT_TO,
        from: { email: 'web@luitiescobar.com', name: 'luitiescobar.com' },
        replyTo: { email, name },
        subject: `[luitiescobar.com] ${subject}`,
        text,
        html,
      });
      emailed = true;
    } catch (e) {
      console.error('contact email', (e as { code?: string }).code, (e as Error).message);
    }
  }

  const ping = sendTelegram(
    [
      '📩 <b>Nuevo mensaje de contacto</b>',
      '',
      `<b>${escapeHtml(name)}</b> · ${escapeHtml(email)}`,
      type ? `Tipo: ${escapeHtml(type)}` : null,
      '',
      escapeHtml(message.length > 600 ? `${message.slice(0, 600)}…` : message),
      '',
      emailed ? '✉️ También te llegó por email.' : '⚠️ No se pudo enviar por email: responde desde aquí.',
    ].filter((l) => l !== null).join('\n'),
    { linkPreview: false },
  );

  if (emailed) {
    const ctx = (locals as { cfContext?: { waitUntil(p: Promise<unknown>): void } }).cfContext;
    ctx ? ctx.waitUntil(ping.catch(() => false)) : await ping.catch(() => false);
    return json({ ok: true });
  }
  // email failed: the message only counts as delivered if Telegram got it
  return (await ping.catch(() => false)) ? json({ ok: true }) : json({ error: 'not delivered' }, 502);
};
