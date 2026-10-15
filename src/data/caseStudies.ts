import type { Lang } from '../i18n/ui';
import type { Project } from './projects';
import { disciplineById } from './disciplines';

/**
 * Case-study body blocks. They mirror what the CMS rich-text editor will produce
 * (headings, paragraphs with **bold**, bullet lists, quotes and inline images),
 * so the renderer can be fed from Sanity Portable Text later without redesign.
 */
export type Block =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'images'; items: { aspect: number; cover: [string, string]; alt: string }[] };

export interface CaseStudy {
  client: string;
  year: string;
  role: string;
  tools: string;
  lead: string;
  body: Block[];
  /** full-width image shown after the article */
  closing?: { aspect: number; cover: [string, string]; alt: string };
}

type Localized = Record<Lang, CaseStudy>;

const paperCut: Localized = {
  en: {
    client: 'Nébula Coffee', year: '2026', role: 'Art direction, Animation', tools: 'After Effects, Cinema 4D',
    lead: 'A 45-second animated short built from layered paper textures, parallax depth and hand-timed motion.',
    body: [
      { type: 'heading', text: 'The brief' },
      { type: 'paragraph', text: 'Nébula wanted a campaign piece that felt **handmade and warm**, far from the glossy 3D look of their competitors. The film had to work as a 45s hero and as 6s loops for social.' },
      { type: 'list', items: ['One hero film (16:9) + six vertical cut-downs', "Palette restricted to the brand's four paper tones", 'Delivery in three weeks'] },
      { type: 'images', items: [{ aspect: 4 / 5, cover: ['#e8eefc', '#3a6bff'], alt: 'Paper layers, frame 1' }, { aspect: 4 / 5, cover: ['#bfefff', '#0f1a3a'], alt: 'Paper layers, frame 2' }] },
      { type: 'heading', text: 'Process' },
      { type: 'paragraph', text: 'Every layer was scanned from real cut paper, then rebuilt in 3D space so the camera could move between planes. Timing was keyed by hand to keep a slightly imperfect, stop-motion rhythm.' },
      { type: 'quote', text: '“Motion should feel like it was touched, not computed.”' },
      { type: 'paragraph', text: 'The final grade added subtle grain and light leaks to sell the analog feel.' },
    ],
    closing: { aspect: 21 / 9, cover: ['#d6e1ff', '#3a6bff'], alt: 'Final frame of the film' },
  },
  es: {
    client: 'Nébula Coffee', year: '2026', role: 'Dirección de arte, Animación', tools: 'After Effects, Cinema 4D',
    lead: 'Un corto animado de 45 segundos construido con texturas de papel en capas, profundidad con parallax y movimiento animado a mano.',
    body: [
      { type: 'heading', text: 'El brief' },
      { type: 'paragraph', text: 'Nébula quería una pieza de campaña que se sintiera **hecha a mano y cálida**, lejos del look 3D brillante de su competencia. El film debía funcionar como hero de 45s y como loops de 6s para redes.' },
      { type: 'list', items: ['Un film hero (16:9) + seis versiones verticales', 'Paleta limitada a los cuatro tonos de papel de la marca', 'Entrega en tres semanas'] },
      { type: 'images', items: [{ aspect: 4 / 5, cover: ['#e8eefc', '#3a6bff'], alt: 'Capas de papel, cuadro 1' }, { aspect: 4 / 5, cover: ['#bfefff', '#0f1a3a'], alt: 'Capas de papel, cuadro 2' }] },
      { type: 'heading', text: 'Proceso' },
      { type: 'paragraph', text: 'Cada capa se escaneó a partir de papel cortado real y se reconstruyó en espacio 3D para que la cámara pudiera moverse entre planos. El timing se animó a mano para conservar un ritmo de stop-motion ligeramente imperfecto.' },
      { type: 'quote', text: '“El movimiento debe sentirse tocado, no calculado.”' },
      { type: 'paragraph', text: 'El etalonaje final sumó grano sutil y light leaks para reforzar la sensación analógica.' },
    ],
    closing: { aspect: 21 / 9, cover: ['#d6e1ff', '#3a6bff'], alt: 'Cuadro final del film' },
  },
};

const specific: Record<string, Localized> = { 'paper-cut-25d': paperCut };

/** Generic placeholder so every project page renders until the CMS has real content. */
function placeholder(p: Project, lang: Lang): CaseStudy {
  const d = disciplineById[p.discipline];
  const [a, b] = p.cover;
  const sub = d.subcategories.find((s) => s.id === p.subcategory)?.label[lang] ?? '';
  const year = p.date.slice(0, 4);
  const img = (alt: string, aspect: number, cover: [string, string]) => ({ alt, aspect, cover });
  return lang === 'es'
    ? {
        client: 'Cliente confidencial', year, role: `${d.name.es} · ${sub}`, tools: 'Por definir',
        lead: `Caso de estudio de ${p.title}. Este texto es temporal y se reemplazará con el contenido del CMS.`,
        body: [
          { type: 'heading', text: 'El reto' },
          { type: 'paragraph', text: 'Aquí irá el contexto del proyecto: **qué necesitaba el cliente**, para quién era y qué restricciones había.' },
          { type: 'images', items: [img(`${p.title}, detalle 1`, 4 / 5, [a, b]), img(`${p.title}, detalle 2`, 4 / 5, [b, a])] },
          { type: 'heading', text: 'La solución' },
          { type: 'paragraph', text: 'Descripción del proceso y de las decisiones de diseño que llevaron al resultado final.' },
        ],
        closing: img(`${p.title}, pieza final`, 16 / 9, [a, b]),
      }
    : {
        client: 'Confidential client', year, role: `${d.name.en} · ${sub}`, tools: 'TBD',
        lead: `Case study for ${p.title}. This copy is temporary and will be replaced with CMS content.`,
        body: [
          { type: 'heading', text: 'The challenge' },
          { type: 'paragraph', text: 'Project context goes here: **what the client needed**, who it was for and which constraints applied.' },
          { type: 'images', items: [img(`${p.title}, detail 1`, 4 / 5, [a, b]), img(`${p.title}, detail 2`, 4 / 5, [b, a])] },
          { type: 'heading', text: 'The solution' },
          { type: 'paragraph', text: 'Description of the process and the design decisions behind the final result.' },
        ],
        closing: img(`${p.title}, final piece`, 16 / 9, [a, b]),
      };
}

export function getCaseStudy(p: Project, lang: Lang): CaseStudy {
  return specific[p.slug]?.[lang] ?? placeholder(p, lang);
}

/** Localized display title (the CMS will store both; placeholders reuse the English one). */
const titles: Record<string, Record<Lang, string>> = {
  'paper-cut-25d': { en: 'Paper Cut — a 2.5D story about slow mornings', es: 'Paper Cut — una historia 2.5D sobre mañanas lentas' },
};
export const pageTitle = (p: Project, lang: Lang) => titles[p.slug]?.[lang] ?? p.title;
