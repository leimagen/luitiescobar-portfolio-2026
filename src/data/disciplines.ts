import type { Lang } from '../i18n/ui';

export type DisciplineId = 'design' | 'motion' | 'ai' | '3d';

export interface Discipline {
  id: DisciplineId;
  slug: string;
  /** CSS custom properties holding the discipline's blob gradient (see global.css). */
  colors: [string, string];
  name: Record<Lang, string>;
  /** Word shown big on the discipline card, one entry per line. */
  word: Record<Lang, string[]>;
  tags: Record<Lang, string>;
}

export const disciplines: Discipline[] = [
  {
    id: 'design',
    slug: 'graphic-design',
    colors: ['var(--design-a)', 'var(--design-b)'],
    name: { en: 'Graphic Design', es: 'Diseño Gráfico' },
    word: { en: ['Graphic', 'Design'], es: ['Diseño', 'Gráfico'] },
    tags: { en: 'Branding · Ads · Web', es: 'Branding · Ads · Web' },
  },
  {
    id: 'motion',
    slug: 'motion-design',
    colors: ['var(--motion-a)', 'var(--motion-b)'],
    name: { en: 'Motion', es: 'Motion' },
    word: { en: ['Motion', 'Design'], es: ['Motion', 'Design'] },
    tags: { en: '2D · 2.5D · 3D', es: '2D · 2.5D · 3D' },
  },
  {
    id: 'ai',
    slug: 'ai-media',
    colors: ['var(--ai-a)', 'var(--ai-b)'],
    name: { en: 'AI Media', es: 'AI Media' },
    word: { en: ['AI', 'Media'], es: ['AI', 'Media'] },
    tags: { en: 'Image · Video · Hybrid', es: 'Imagen · Video · Híbrido' },
  },
  {
    id: '3d',
    slug: '3d',
    colors: ['var(--three-a)', 'var(--three-b)'],
    name: { en: '3D', es: '3D' },
    word: { en: ['3D'], es: ['3D'] },
    tags: { en: 'Models · Interiors · Industrial', es: 'Modelos · Interiores · Industrial' },
  },
];

export const disciplineById = Object.fromEntries(disciplines.map((d) => [d.id, d])) as Record<DisciplineId, Discipline>;
