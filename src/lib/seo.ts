import type { Lang } from '../i18n/ui';
import { email, location, socials } from '../data/site';

/** Google Analytics 4 property carried over from the previous site (only loaded in production builds). */
export const GA_ID = 'G-J1EW2HGLJB';

export const SITE = 'https://luitiescobar.com';

const jobTitle: Record<Lang, string> = { en: 'Multidisciplinary Designer', es: 'Diseñador multidisciplinario' };
const bio: Record<Lang, string> = {
  en: 'Multidisciplinary designer with over 15 years of experience in graphic design, motion design, AI media and 3D, for global brands including Marvel, Xbox, Disney, Hallmark, PlayStation and Samsung.',
  es: 'Diseñador multidisciplinario con más de 15 años de experiencia en diseño gráfico, motion design, AI media y 3D, para marcas globales como Marvel, Xbox, Disney, Hallmark, PlayStation y Samsung.',
};

/** schema.org Person + WebSite, shared by every page. */
export function siteGraph(lang: Lang) {
  const person = {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: 'Luiti Escobar',
    alternateName: 'Luis Escobar',
    jobTitle: jobTitle[lang],
    description: bio[lang],
    url: SITE,
    image: `${SITE}/og-default.jpg`,
    email,
    sameAs: [...socials.map((s) => s.href), 'https://vimeo.com/luitivimeo'],
    knowsAbout: ['Graphic Design', 'Branding', 'Digital Marketing', 'Web Design', 'Motion Design', 'Motion Graphics', '2D Animation', '2.5D Animation', '3D Animation', 'Broadcast Design', 'Generative AI', 'AI Video', '3D Modeling', 'Interior Design', 'Industrial Design', 'Adobe After Effects', 'Blender', 'DaVinci Resolve'],
    address: { '@type': 'PostalAddress', addressLocality: location.en.split(',')[0], addressCountry: 'ES' },
  };
  const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE, name: 'Luiti Escobar', inLanguage: ['en', 'es'], publisher: { '@id': `${SITE}/#person` } };
  return [person, website];
}
