import type { APIRoute } from 'astro';
import { disciplines } from '../data/disciplines';
import { projects } from '../data/projects';

/** Every public page in both languages, with hreflang alternates (EN at /, ES at /es/). */
export const GET: APIRoute = ({ site }) => {
  const today = new Date().toISOString().slice(0, 10);
  const pages: { path: string; lastmod: string }[] = [
    { path: '/', lastmod: today },
    ...disciplines.map((d) => ({ path: `/${d.slug}/`, lastmod: today })),
    ...projects.map((p) => ({ path: `/work/${p.slug}/`, lastmod: p.date || today })),
    { path: '/about/', lastmod: today },
    { path: '/contact/', lastmod: today },
    { path: '/cookies/', lastmod: '2026-10-17' },
  ];
  const url = (path: string) => new URL(path, site).href;
  const alternates = (path: string) =>
    [['en', path], ['es', `/es${path}`], ['x-default', path]]
      .map(([lang, p]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${url(p)}"/>`)
      .join('');
  const entries = pages.flatMap(({ path, lastmod }) =>
    [path, `/es${path}`].map((p) => `<url><loc>${url(p)}</loc><lastmod>${lastmod}</lastmod>${alternates(path)}</url>`),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
