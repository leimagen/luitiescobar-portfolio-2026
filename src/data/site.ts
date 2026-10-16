import type { Lang } from '../i18n/ui';
import { cms } from '../lib/cms';
import {
  defaultCertifications, defaultEmail, defaultExperience, defaultLanguages, defaultLocation,
  defaultSocials, defaultTools, type ExperienceItem,
} from './siteDefaults';

export type { ExperienceItem };

type L = { en?: string; es?: string } | undefined;
const both = (v: L, fallback = ''): Record<Lang, string> => ({ en: v?.en || fallback, es: v?.es || v?.en || fallback });
const st = cms?.settings;

/** Site-wide profile data: Sanity "Site settings" when filled in, else the defaults from the CV. */
export const email = st?.email || defaultEmail;

export const location: Record<Lang, string> = st?.location?.en ? both(st.location) : defaultLocation;

export const socials = st?.socials?.length ? st.socials.map((s) => ({ label: s.label, href: s.url })) : defaultSocials;

export const experience: ExperienceItem[] = st?.experience?.length
  ? st.experience.map((e) => ({
      start: e.start.slice(0, 7),
      end: e.end ? e.end.slice(0, 7) : null,
      company: e.company,
      role: both(e.role),
      place: both(e.place),
      summary: both(e.summary),
    }))
  : defaultExperience;

export const tools = st?.tools?.length ? st.tools : defaultTools;

export const certifications = st?.certifications?.length
  ? st.certifications.map((c) => ({ title: c.title, detail: c.detail?.en ? both(c.detail) : undefined }))
  : defaultCertifications;

export const languages = st?.languages?.length ? st.languages.map((l) => ({ name: both(l.name), level: both(l.level) })) : defaultLanguages;

/** "Nov 2021 - Jan 2026" / "nov 2021 - ene 2026" */
export function formatPeriod(e: ExperienceItem, lang: Lang) {
  const fmt = new Intl.DateTimeFormat(lang, { month: 'short', year: 'numeric', timeZone: 'UTC' });
  const d = (ym: string) => fmt.format(new Date(`${ym}-01T00:00:00Z`)).replace('.', '');
  return `${d(e.start)} - ${e.end ? d(e.end) : lang === 'es' ? 'Actualidad' : 'Present'}`;
}
