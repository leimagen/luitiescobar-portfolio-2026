import type { DisciplineId } from './disciplines';

/**
 * Placeholder projects until the CMS (Sanity) is connected.
 * `cover` is a gradient stand-in; real projects will carry an image with its own aspect ratio.
 */
export interface Project {
  slug: string;
  title: string;
  discipline: DisciplineId;
  /** width / height of the cover, drives the masonry proportions */
  aspect: number;
  cover: [string, string];
  likes: number;
  featured?: boolean;
}

export const projects: Project[] = [
  { slug: 'nebula-coffee-branding', title: 'Nébula Coffee — Branding', discipline: 'design', aspect: 4 / 5, cover: ['#ffd9a8', '#ff8a3c'], likes: 12, featured: true },
  { slug: 'showreel-2026', title: 'Showreel 2026', discipline: 'motion', aspect: 1, cover: ['#bfefff', '#3a6bff'], likes: 49, featured: true },
  { slug: 'casa-lumbre-interior', title: 'Casa Lumbre — Interior', discipline: '3d', aspect: 2 / 3, cover: ['#e3f9c4', '#3ed23e'], likes: 86, featured: true },
  { slug: 'synthetic-seasons', title: 'Synthetic Seasons', discipline: 'ai', aspect: 16 / 10, cover: ['#ffd0d9', '#ff2e7a'], likes: 123, featured: true },
  { slug: 'atlas-fintech-ads', title: 'Atlas Fintech Ads', discipline: 'design', aspect: 2 / 3, cover: ['#1f1f1f', '#ffb23c'], likes: 160 },
  { slug: 'orbit-3d-loop', title: 'Orbit — 3D Loop', discipline: 'motion', aspect: 4 / 3, cover: ['#0f1a3a', '#00d4ff'], likes: 17 },
  { slug: 'aero-chair', title: 'Aero Chair', discipline: '3d', aspect: 9 / 16, cover: ['#eef1e8', '#b6f23a'], likes: 54 },
  { slug: 'dream-portraits', title: 'Dream Portraits', discipline: 'ai', aspect: 1, cover: ['#2a0f17', '#ff5a3c'], likes: 91 },
  { slug: 'verde-market-identity', title: 'Verde Market Identity', discipline: 'design', aspect: 4 / 3, cover: ['#fbe7cf', '#ff8a3c'], likes: 128 },
  { slug: 'paper-cut-25d', title: 'Paper Cut 2.5D', discipline: 'motion', aspect: 4 / 5, cover: ['#d6e1ff', '#3a6bff'], likes: 165 },
  { slug: 'desk-lamp-concept', title: 'Desk Lamp Concept', discipline: '3d', aspect: 2 / 3, cover: ['#d9efd0', '#3ed23e'], likes: 22 },
  { slug: 'ai-fashion-lookbook', title: 'AI Fashion Lookbook', discipline: 'ai', aspect: 1, cover: ['#ffe2d6', '#ff2e7a'], likes: 59 },
];

export const projectCountBy = (id: DisciplineId) => ({ design: 24, motion: 18, ai: 11, '3d': 15 })[id];
export const featuredFor = (id: DisciplineId) => projects.find((p) => p.discipline === id && p.featured)!;
