/**
 * Fixed disciplines and their subcategories. Keep in sync with src/data/disciplines.ts
 * on the site (ids are what both sides store).
 */
export const disciplineOptions = [
  { title: 'Graphic Design', value: 'design' },
  { title: 'Motion Design', value: 'motion' },
  { title: 'AI Media', value: 'ai' },
  { title: '3D', value: '3d' },
];

export const subcategoryOptions: Record<string, { title: string; value: string }[]> = {
  design: [
    { title: 'Branding', value: 'branding' },
    { title: 'Digital Marketing', value: 'digital-marketing' },
    { title: 'Ads Design', value: 'ads' },
    { title: 'Web Design', value: 'web' },
  ],
  motion: [
    { title: '2D', value: '2d' },
    { title: '2.5D', value: '2-5d' },
    { title: '3D', value: '3d' },
  ],
  ai: [
    { title: 'Image', value: 'image' },
    { title: 'Video', value: 'video' },
    { title: 'Hybrid', value: 'hybrid' },
  ],
  '3d': [
    { title: 'Models', value: 'models' },
    { title: 'Interiors & Architecture', value: 'interiors' },
    { title: 'Industrial Design', value: 'industrial' },
  ],
};
