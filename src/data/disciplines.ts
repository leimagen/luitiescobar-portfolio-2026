import type { Lang } from '../i18n/ui';

export type DisciplineId = 'design' | 'motion' | 'ai' | '3d';

export interface Subcategory {
  id: string;
  label: Record<Lang, string>;
}

export interface Discipline {
  id: DisciplineId;
  slug: string;
  /** CSS custom properties holding the discipline's blob gradient (see global.css). */
  colors: [string, string];
  /** Second blob used on the section page, for contrast. */
  accent: DisciplineId;
  name: Record<Lang, string>;
  /** Word shown big on cards and section headers, one entry per line. */
  word: Record<Lang, string[]>;
  tags: Record<Lang, string>;
  description: Record<Lang, string>;
  subcategories: Subcategory[];
  /** Showreel shown at the top of the section page. `src` stays empty until the video is uploaded. */
  reel?: { title: string; src?: string; poster?: string };
}

const l = (en: string, es: string = en) => ({ en, es });

export const disciplines: Discipline[] = [
  {
    id: 'design',
    slug: 'graphic-design',
    colors: ['var(--design-a)', 'var(--design-b)'],
    accent: 'motion',
    name: l('Graphic Design', 'Diseño Gráfico'),
    word: { en: ['Graphic', 'Design'], es: ['Diseño', 'Gráfico'] },
    tags: l('Branding · Ads · Web'),
    description: l(
      'Branding, digital marketing, ads and web design — visual systems built to stay consistent across every format.',
      'Branding, marketing digital, ads y diseño web — sistemas visuales pensados para mantenerse consistentes en cualquier formato.',
    ),
    subcategories: [
      { id: 'branding', label: l('Branding') },
      { id: 'digital-marketing', label: l('Digital Marketing', 'Marketing Digital') },
      { id: 'ads', label: l('Ads Design', 'Diseño de Ads') },
      { id: 'web', label: l('Web Design', 'Diseño Web') },
    ],
  },
  {
    id: 'motion',
    slug: 'motion-design',
    colors: ['var(--motion-a)', 'var(--motion-b)'],
    accent: 'design',
    name: l('Motion'),
    word: { en: ['Motion', 'Design'], es: ['Motion', 'Design'] },
    tags: l('2D · 2.5D · 3D'),
    description: l(
      '2D, 2.5D and 3D animation — logo reveals, explainers, kinetic type and loops that give brands a pulse.',
      'Animación 2D, 2.5D y 3D — logo reveals, explainers, tipografía cinética y loops que le dan pulso a las marcas.',
    ),
    subcategories: [
      { id: '2d', label: l('2D') },
      { id: '2-5d', label: l('2.5D') },
      { id: '3d', label: l('3D') },
    ],
    reel: { title: 'Motion Reel 2026' },
  },
  {
    id: 'ai',
    slug: 'ai-media',
    colors: ['var(--ai-a)', 'var(--ai-b)'],
    accent: '3d',
    name: l('AI Media'),
    word: { en: ['AI', 'Media'], es: ['AI', 'Media'] },
    tags: l('Image · Video · Hybrid', 'Imagen · Video · Híbrido'),
    description: l(
      'AI-generated images and video, combined with design craft to create visuals that could not exist any other way.',
      'Imágenes y video generados con IA, combinados con oficio de diseño para crear visuales que no podrían existir de otra forma.',
    ),
    subcategories: [
      { id: 'image', label: l('Image', 'Imagen') },
      { id: 'video', label: l('Video') },
      { id: 'hybrid', label: l('Hybrid', 'Híbrido') },
    ],
  },
  {
    id: '3d',
    slug: '3d',
    colors: ['var(--three-a)', 'var(--three-b)'],
    accent: 'ai',
    name: l('3D'),
    word: { en: ['3D'], es: ['3D'] },
    tags: l('Models · Interiors · Industrial', 'Modelos · Interiores · Industrial'),
    description: l(
      '3D models, interior and architectural visualization, and industrial design concepts with a tactile finish.',
      'Modelos 3D, visualización de interiorismo y arquitectura, y conceptos de diseño industrial con acabado táctil.',
    ),
    subcategories: [
      { id: 'models', label: l('Models', 'Modelos') },
      { id: 'interiors', label: l('Interiors & Architecture', 'Interiorismo y Arquitectura') },
      { id: 'industrial', label: l('Industrial Design', 'Diseño Industrial') },
    ],
  },
];

export const disciplineById = Object.fromEntries(disciplines.map((d) => [d.id, d])) as Record<DisciplineId, Discipline>;
