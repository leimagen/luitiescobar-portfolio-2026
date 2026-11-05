import { getImage } from 'astro:assets';

/**
 * Poster for a Vimeo reel: the thumbnail chosen on Vimeo, downloaded and optimized at build time,
 * so visitors make no request to Vimeo until they press play. Changing the thumbnail on Vimeo
 * takes effect on the next build. Any failure just means no poster.
 */
export async function vimeoPoster(url?: string): Promise<string | undefined> {
  if (!url || !/vimeo\.com\//.test(url)) return undefined;
  try {
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}&width=1920`);
    if (!res.ok) throw new Error(`oEmbed ${res.status}`);
    const { thumbnail_url: src } = (await res.json()) as { thumbnail_url?: string };
    if (!src) return undefined;
    return (await getImage({ src, inferSize: true, format: 'webp', quality: 82 })).src;
  } catch (e) {
    console.warn(`Reel poster skipped: ${(e as Error).message}`);
    return undefined;
  }
}
