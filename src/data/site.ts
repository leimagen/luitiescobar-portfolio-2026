import type { Lang } from '../i18n/ui';

/**
 * Site-wide profile data, taken from the full CV (LuitiEscobar_CV_GraphicDesigner).
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
    role: { en: 'Senior Digital Designer', es: 'Diseñador Digital Senior' },
    place: { en: 'Panama · Remote', es: 'Panamá · Remoto' },
    summary: {
      en: 'Digital advertising for Samsung Latin America and the Caribbean across 20+ markets — social content, banners and promotional assets for product launches, seasonal activations and regional campaigns.',
      es: 'Publicidad digital para Samsung Latinoamérica y el Caribe en más de 20 mercados — contenido para redes, banners y piezas promocionales para lanzamientos, activaciones estacionales y campañas regionales.',
    },
  },
  {
    start: '2019-02', end: '2021-03', company: 'Tomorrow Digital (El Joint)',
    role: { en: 'Senior Motion Designer · Art Director', es: 'Diseñador de Movimiento Senior · Director de Arte' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Art direction and motion design for agency clients such as Digicel — social animation, brand campaigns and digital advertising, plus creative direction for junior designers.',
      es: 'Dirección de arte y motion design para clientes de agencia como Digicel — animación para redes, campañas de marca y publicidad digital, además de dirección creativa a diseñadores junior.',
    },
  },
  {
    start: '2016-11', end: '2017-11', company: 'Corporación Medcom · Oye TV',
    role: { en: 'Senior Motion Designer · Art Director', es: 'Diseñador de Movimiento Senior · Director de Arte' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Full broadcast identity for Oye, the new TV channel from Medcom Group — channel IDs, bumpers, lower thirds and on-air packages, and the motion guidelines that defined it from launch.',
      es: 'Identidad de broadcast completa para Oye, el nuevo canal de Medcom Group — IDs, bumpers, lower thirds y paquetes gráficos, y las guías de movimiento que lo definieron desde su lanzamiento.',
    },
  },
  {
    start: '2015-08', end: '2016-11', company: 'Canal NEX',
    role: { en: 'Senior Motion Designer', es: 'Diseñador de Movimiento Senior' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Motion graphics, promo IDs, program packaging and broadcast design for the channel and its original programming.',
      es: 'Motion graphics, promo IDs, packaging de programas y diseño de broadcast para el canal y su programación original.',
    },
  },
  {
    start: '2011-11', end: '2014-10', company: 'ModOp (formerly Creative Asylum)',
    role: { en: 'Flash Developer · Motion Designer', es: 'Flash Developer · Diseñador de Movimiento' },
    place: { en: 'Panama · Los Angeles', es: 'Panamá · Los Ángeles' },
    summary: {
      en: 'Interactive web experiences and animated campaigns for Marvel, Xbox, Disney, Hallmark and PlayStation; Flash apps and mini-games in ActionScript 3.0. Promoted from Flash Animator to Flash Developer.',
      es: 'Experiencias web interactivas y campañas animadas para Marvel, Xbox, Disney, Hallmark y PlayStation; aplicaciones y minijuegos Flash en ActionScript 3.0. Promovido de Flash Animator a Flash Developer.',
    },
  },
  {
    start: '2009-10', end: '2011-11', company: 'AG Video Panamá',
    role: { en: 'Motion Designer · Senior Graphic Designer', es: 'Diseñador de Movimiento · Diseñador Gráfico Senior' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Interfaces for websites and multimedia experiences — web and app UI, motion graphics and digital advertising.',
      es: 'Interfaces para sitios web y experiencias multimedia — UI web y de aplicaciones, motion graphics y publicidad digital.',
    },
  },
  {
    start: '2007-09', end: '2009-05', company: 'Avantpix Panamá',
    role: { en: 'Junior Digital Graphic Designer', es: 'Diseñador Gráfico Digital Junior' },
    place: { en: 'Panama', es: 'Panamá' },
    summary: {
      en: 'Web and UI design for digital projects and multimedia platforms.',
      es: 'Diseño web y de UI para proyectos digitales y plataformas multimedia.',
    },
  },
  {
    start: '2005-02', end: '2007-08', company: 'Estudio Digital Grupo Creativo EDGC (formerly Cyberbox)',
    role: { en: 'Junior Motion Designer · Junior Web Designer', es: 'Diseñador de Movimiento Junior · Web Designer Junior' },
    place: { en: 'Valencia, Venezuela', es: 'Valencia, Venezuela' },
    summary: {
      en: 'Web concepts, multimedia design and Flash animation, mentored by the agency founder, Rolando Robles.',
      es: 'Conceptualización web, diseño multimedia y animación Flash bajo la mentoría del fundador de la agencia, Rolando Robles.',
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
