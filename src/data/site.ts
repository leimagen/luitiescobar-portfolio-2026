import type { Lang } from '../i18n/ui';

/**
 * Site-wide profile data, taken from the CV (Oct 2026).
 * Everything here moves to the CMS later ("site settings" + list documents) so entries
 * can be added or edited without touching code.
 */
export const email = 'info@luitiescobar.com';

export const location: Record<Lang, string> = { en: 'Valencia, Spain', es: 'Valencia, España' };

export const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/lesco' },
  { label: 'Behance', href: 'https://www.behance.net/luiti2d' },
];

export interface ExperienceItem {
  /** YYYY-MM */
  start: string;
  /** YYYY-MM, or null while ongoing */
  end: string | null;
  role: Record<Lang, string>;
  company: string;
  place: Record<Lang, string>;
  summary: Record<Lang, string>;
}

export const experience: ExperienceItem[] = [
  {
    start: '2021-11', end: '2026-01', company: 'Cheil Worldwide (Samsung)',
    role: { en: 'Graphic Designer / Multimedia Artist', es: 'Diseñador Gráfico / Artista Multimedia' },
    place: { en: 'Panama, remote', es: 'Panamá, remoto' },
    summary: {
      en: 'Digital advertising campaigns for Samsung Latin America and the Caribbean — social content, banners, key visuals and animated assets for 20+ markets.',
      es: 'Campañas de publicidad digital para Samsung Latinoamérica y el Caribe — contenido para redes, banners, key visuals y piezas animadas para más de 20 mercados.',
    },
  },
  {
    start: '2019-02', end: '2021-03', company: 'Tomorrow Digital (El Joint)',
    role: { en: 'Graphic Designer / Multimedia Artist', es: 'Diseñador Gráfico / Artista Multimedia' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Graphic design, visual concepts, motion graphics and 2D animation for agency clients such as Digicel across Central America and the Caribbean.',
      es: 'Diseño gráfico, conceptos visuales, motion graphics y animación 2D para clientes de agencia como Digicel en Centroamérica y el Caribe.',
    },
  },
  {
    start: '2016-11', end: '2017-11', company: 'Corporación Medcom / Oye TV',
    role: { en: 'Multimedia Artist / Motion Designer', es: 'Artista Multimedia / Motion Designer' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Designed and animated the broadcast identity of Oye TV — channel IDs, bumpers, lower thirds and graphic packages from launch.',
      es: 'Diseño y animación de la identidad de broadcast de Oye TV — IDs de canal, bumpers, lower thirds y paquetes gráficos desde su lanzamiento.',
    },
  },
  {
    start: '2015-08', end: '2016-11', company: 'Canal NEX',
    role: { en: 'Multimedia Artist / Motion Designer', es: 'Artista Multimedia / Motion Designer' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Motion graphics, promo IDs, show titles and program packaging for the channel lineup.',
      es: 'Motion graphics, promo IDs, títulos de programas y packaging de shows para la parrilla del canal.',
    },
  },
];

export const tools = ['Adobe Illustrator', 'Photoshop', 'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Blender'];

export const certifications: { title: string; detail?: Record<Lang, string> }[] = [
  { title: 'EF SET English Certificate', detail: { en: '74/100 · C2 Proficient (2021)', es: '74/100 · C2 Proficient (2021)' } },
  { title: 'Adobe After Effects Intermediate Training' },
  { title: 'ActionScript 3.0 Online Training' },
  { title: 'Motion design, 3D animation, Blender & DaVinci Resolve', detail: { en: 'Ongoing training', es: 'Formación continua' } },
];

export const languages: { name: Record<Lang, string>; level: Record<Lang, string> }[] = [
  { name: { en: 'Spanish', es: 'Castellano' }, level: { en: 'Native', es: 'Nativo' } },
  { name: { en: 'English', es: 'Inglés' }, level: { en: 'C2 Proficient', es: 'C2 Proficient' } },
];

/** "Nov 2021 — Jan 2026" / "nov 2021 — ene 2026" */
export function formatPeriod(e: ExperienceItem, lang: Lang) {
  const fmt = new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' });
  const d = (ym: string) => fmt.format(new Date(`${ym}-01T00:00:00Z`)).replace('.', '');
  return `${d(e.start)} — ${e.end ? d(e.end) : lang === 'es' ? 'Actualidad' : 'Present'}`;
}
