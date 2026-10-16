import { readFileSync } from 'node:fs';
import { sanity, type CmsImage } from './sanity';
import { CMS_QUERY } from './cmsQuery';

/**
 * Everything the site reads from Sanity, fetched once per build (top-level await).
 * `cms` is null when Sanity isn't configured; data modules then use their placeholders.
 */
type L<T = string> = { en?: T; es?: T };

export interface CmsProject {
  slug: string;
  title?: L;
  discipline: 'design' | 'motion' | 'ai' | '3d';
  subcategory: string;
  date: string;
  featured?: boolean;
  selected?: boolean;
  client?: string;
  year?: string;
  role?: L;
  tools?: string;
  lead?: L;
  cover: CmsImage;
  video?: string;
  body?: L<unknown[]>;
  gallery?: CmsImage[];
}

interface DisciplineCopy {
  description?: L;
  tags?: L;
  reel?: { title?: string; videoUrl?: string };
}

export interface CmsSettings {
  heroGreeting?: L; heroTitle1?: L; heroTitle2?: L; heroTitle3?: L;
  introP1?: L; introP2?: L;
  aboutRole?: L; aboutLead?: L; selfTaught?: L;
  experience?: { company: string; role?: L; place?: L; start: string; end?: string; summary?: L }[];
  tools?: string[];
  certifications?: { title: string; detail?: L }[];
  languages?: { name?: L; level?: L }[];
  email?: string; location?: L; availability?: L;
  contactTitle1?: L; contactTitle2?: L; contactText?: L;
  socials?: { label: string; url: string }[];
  design?: DisciplineCopy; motion?: DisciplineCopy; ai?: DisciplineCopy; threeD?: DisciplineCopy;
  metaTitle?: L; metaDescription?: L;
}

type CmsData = { settings: CmsSettings | null; projects: CmsProject[] };

// CMS_SNAPSHOT=path/to.json builds from a local dump instead (e.g. drafts, via studio/scripts/snapshot.ts)
const snapshot = import.meta.env.CMS_SNAPSHOT as string | undefined;

export const cms: CmsData | null = snapshot
  ? (JSON.parse(readFileSync(snapshot, 'utf8')) as CmsData)
  : sanity
    ? await sanity.fetch(CMS_QUERY)
    : null;

/** Pick the requested language, falling back to English. */
export const pick = <T>(v: L<T> | undefined, lang: 'en' | 'es'): T | undefined => v?.[lang] ?? v?.en;
