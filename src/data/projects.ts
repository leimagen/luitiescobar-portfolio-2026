import type { DisciplineId } from './disciplines';

/**
 * Placeholder projects until the CMS (Sanity) is connected.
 * `cover` is a gradient stand-in; real projects will carry an image with its own aspect ratio.
 */
export interface Project {
  slug: string;
  title: string;
  discipline: DisciplineId;
  subcategory: string;
  /** width / height of the cover, drives the masonry proportions */
  aspect: number;
  cover: [string, string];
  likes: number;
  /** ISO date, used for "Recent" sorting */
  date: string;
  /** shown on the discipline card of the Home */
  featured?: boolean;
  /** shown in "Selected work" on the Home */
  selected?: boolean;
}

type Row = [slug: string, title: string, subcategory: string, aspect: number, cover: [string, string], likes: number, date: string, flags?: 'featured' | 'selected' | 'both'];

const rows: Record<DisciplineId, Row[]> = {
  design: [
    ['nebula-coffee-branding', 'Nébula Coffee — Branding', 'branding', 4 / 5, ['#ffd9a8', '#ff8a3c'], 12, '2026-09-01', 'both'],
    ['atlas-fintech-ads', 'Atlas Fintech Ads', 'ads', 2 / 3, ['#1f1f1f', '#ffb23c'], 160, '2026-07-12', 'selected'],
    ['verde-market-identity', 'Verde Market Identity', 'branding', 4 / 3, ['#fbe7cf', '#ff8a3c'], 128, '2026-05-20', 'selected'],
    ['solar-fest-posters', 'Solar Fest Posters', 'digital-marketing', 2 / 3, ['#ffb23c', '#f4efe6'], 74, '2026-04-02'],
    ['mono-studio-web', 'Mono Studio Web', 'web', 16 / 10, ['#f4efe6', '#1f1f1f'], 33, '2026-03-18'],
    ['kora-packaging', 'Kora Packaging', 'branding', 1, ['#ff8a3c', '#fbe7cf'], 58, '2026-02-10'],
    ['pulse-social-kit', 'Pulse Social Kit', 'digital-marketing', 9 / 16, ['#ffd9a8', '#ff8a3c'], 41, '2025-12-04'],
    ['brisa-web-redesign', 'Brisa Web Redesign', 'web', 4 / 3, ['#fbe7cf', '#ffb23c'], 26, '2025-10-21'],
  ],
  motion: [
    ['showreel-2026', 'Showreel 2026', '3d', 4 / 3, ['#bfefff', '#3a6bff'], 49, '2026-09-10', 'both'],
    ['orbit-3d-loop', 'Orbit — 3D Loop', '3d', 4 / 5, ['#0f1a3a', '#00d4ff'], 17, '2026-08-22', 'selected'],
    ['logo-reveal-pack', 'Logo Reveal Pack', '2d', 1, ['#e8eefc', '#3a6bff'], 86, '2026-08-01'],
    ['paper-cut-25d', 'Paper Cut 2.5D', '2-5d', 2 / 3, ['#d6e1ff', '#0f1a3a'], 165, '2026-07-15', 'selected'],
    ['explainer-atlas', 'Explainer: Atlas', '2d', 16 / 10, ['#00d4ff', '#e8eefc'], 160, '2026-06-30'],
    ['liquid-type', 'Liquid Type', '2d', 9 / 16, ['#3a6bff', '#bfefff'], 17, '2026-06-02'],
    ['neon-night-spot', 'Neon Night Spot', '3d', 4 / 5, ['#bfefff', '#3a6bff'], 54, '2026-05-11'],
    ['kinetic-poster', 'Kinetic Poster', '2d', 2 / 3, ['#0f1a3a', '#00d4ff'], 91, '2026-04-19'],
    ['ui-motion-kit', 'UI Motion Kit', '2d', 1, ['#e8eefc', '#3a6bff'], 128, '2026-03-27'],
    ['bloom-titles', 'Bloom Titles', '2-5d', 4 / 3, ['#d6e1ff', '#0f1a3a'], 165, '2026-02-14'],
    ['drift-short', 'Drift — Short', '2-5d', 4 / 5, ['#00d4ff', '#e8eefc'], 22, '2026-01-08'],
    ['isometric-city', 'Isometric City', '3d', 1, ['#3a6bff', '#bfefff'], 59, '2025-11-30'],
  ],
  ai: [
    ['synthetic-seasons', 'Synthetic Seasons', 'image', 16 / 10, ['#ffd0d9', '#ff2e7a'], 123, '2026-09-05', 'both'],
    ['dream-portraits', 'Dream Portraits', 'image', 1, ['#2a0f17', '#ff5a3c'], 91, '2026-08-14', 'selected'],
    ['ai-fashion-lookbook', 'AI Fashion Lookbook', 'hybrid', 1, ['#ffe2d6', '#ff2e7a'], 59, '2026-07-03', 'selected'],
    ['latent-landscapes', 'Latent Landscapes', 'image', 4 / 3, ['#2a0f17', '#ffd0d9'], 44, '2026-06-09'],
    ['gen-video-tides', 'Gen Video: Tides', 'video', 16 / 10, ['#ff5a3c', '#ffe2d6'], 67, '2026-05-01'],
    ['myth-machines', 'Myth Machines', 'hybrid', 2 / 3, ['#ff2e7a', '#2a0f17'], 38, '2026-03-22'],
    ['prompted-interiors', 'Prompted Interiors', 'image', 4 / 5, ['#f7ece9', '#ff5a3c'], 29, '2026-02-02'],
    ['neo-botanica', 'Neo Botanica', 'video', 9 / 16, ['#ffd0d9', '#ff2e7a'], 52, '2025-12-15'],
  ],
  '3d': [
    ['casa-lumbre-interior', 'Casa Lumbre — Interior', 'interiors', 2 / 3, ['#e3f9c4', '#3ed23e'], 86, '2026-09-08', 'both'],
    ['aero-chair', 'Aero Chair', 'industrial', 9 / 16, ['#eef1e8', '#b6f23a'], 54, '2026-08-18', 'selected'],
    ['desk-lamp-concept', 'Desk Lamp Concept', 'industrial', 2 / 3, ['#d9efd0', '#3ed23e'], 22, '2026-07-21', 'selected'],
    ['loft-render', 'Loft Render', 'interiors', 16 / 10, ['#14210f', '#b6f23a'], 61, '2026-06-11'],
    ['speaker-industrial', 'Speaker — Industrial Design', 'industrial', 1, ['#eef1e8', '#3ed23e'], 35, '2026-05-06'],
    ['pavilion-01', 'Pavilion 01', 'interiors', 4 / 3, ['#d9efd0', '#14210f'], 47, '2026-03-30'],
    ['toy-robot-model', 'Toy Robot Model', 'models', 4 / 5, ['#b6f23a', '#eef1e8'], 73, '2026-02-21'],
    ['ceramic-set', 'Ceramic Set', 'models', 1, ['#e3f9c4', '#3ed23e'], 19, '2026-01-12'],
  ],
};

export const projects: Project[] = (Object.entries(rows) as [DisciplineId, Row[]][]).flatMap(([discipline, list]) =>
  list.map(([slug, title, subcategory, aspect, cover, likes, date, flags]) => ({
    slug, title, discipline, subcategory, aspect, cover, likes, date,
    featured: flags === 'featured' || flags === 'both',
    selected: flags === 'selected' || flags === 'both',
  })),
);

export const projectsFor = (id: DisciplineId) => projects.filter((p) => p.discipline === id).sort((a, b) => b.date.localeCompare(a.date));
export const projectCountBy = (id: DisciplineId) => projects.filter((p) => p.discipline === id).length;
export const featuredFor = (id: DisciplineId) => projects.find((p) => p.discipline === id && p.featured)!;

/** Home "Selected work": interleave disciplines so the grid mixes colors. */
const order: DisciplineId[] = ['design', 'motion', '3d', 'ai'];
export const selectedWork = (() => {
  const lists = order.map((id) => projects.filter((p) => p.discipline === id && p.selected));
  const out: Project[] = [];
  for (let i = 0; lists.some((l) => l[i]); i++) lists.forEach((l) => l[i] && out.push(l[i]));
  return out;
})();
