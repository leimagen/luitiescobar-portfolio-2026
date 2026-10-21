import { env } from 'cloudflare:workers';

/** Anonymous visitor id: salted SHA-256 of IP + user agent. Nothing personal is stored. */
export async function visitorId(request: Request) {
  const ip = request.headers.get('cf-connecting-ip') ?? '';
  const ua = request.headers.get('user-agent') ?? '';
  const data = new TextEncoder().encode(`${env.LIKES_SALT ?? 'luitiescobar'}|${ip}|${ua}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
