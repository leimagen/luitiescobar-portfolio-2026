import { cms } from '../lib/cms';
import { disciplineDefaults, type Discipline, type DisciplineId, type Subcategory } from './disciplineDefaults';

export type { Discipline, DisciplineId, Subcategory };

export const disciplines: Discipline[] = disciplineDefaults.map((d) => ({ ...d }));

// apply texts edited in Sanity → Site settings → Disciplines
for (const d of disciplines) {
  const copy = cms?.settings?.[d.id === '3d' ? 'threeD' : d.id];
  if (!copy) continue;
  if (copy.description?.en) d.description = { en: copy.description.en, es: copy.description.es || copy.description.en };
  if (copy.tags?.en) d.tags = { en: copy.tags.en, es: copy.tags.es || copy.tags.en };
  if (copy.reel?.videoUrl) d.reel = { title: copy.reel.title || d.reel?.title || `${d.name.en} Reel`, src: copy.reel.videoUrl };
}

export const disciplineById = Object.fromEntries(disciplines.map((d) => [d.id, d])) as Record<DisciplineId, Discipline>;
