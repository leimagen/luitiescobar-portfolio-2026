/**
 * Creates the "Site settings" document with the copy currently shipped in the site code,
 * so editing starts from the real texts instead of empty fields.
 * Safe to re-run: it never overwrites an existing document.
 *
 *   cd studio && npx sanity exec scripts/seedSettings.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { ui } from '../../src/i18n/ui';
import {
  defaultCertifications, defaultEmail, defaultExperience, defaultLanguages,
  defaultLocation, defaultSocials, defaultTools,
} from '../../src/data/siteDefaults';
import { disciplineDefaults } from '../../src/data/disciplineDefaults';

type Key = keyof (typeof ui)['en'];
const client = getCliClient({ apiVersion: '2026-10-01' });

const str = (en: string, es: string) => ({ _type: 'localeString', en, es });
const txt = (en: string, es: string) => ({ _type: 'localeText', en, es });
const s = (k: Key) => str(ui.en[k], ui.es[k]);
const t = (k: Key) => txt(ui.en[k], ui.es[k]);
const key = (i: number, prefix: string) => `${prefix}${i}`;

const disciplineCopy = Object.fromEntries(
  disciplineDefaults.map((d) => [
    d.id === '3d' ? 'threeD' : d.id,
    {
      _type: 'object',
      description: txt(d.description.en, d.description.es),
      tags: str(d.tags.en, d.tags.es),
      ...(d.reel ? { reel: { _type: 'object', title: d.reel.title, ...(d.reel.src ? { videoUrl: d.reel.src } : {}) } } : {}),
    },
  ]),
);

const doc = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  heroGreeting: s('hero.greeting'),
  heroTitle1: s('hero.title.1'),
  heroTitle2: s('hero.title.2'),
  heroTitle3: s('hero.title.3'),
  introP1: t('intro.p1'),
  introP2: t('intro.p2'),

  aboutRole: s('about.role'),
  aboutLead: t('about.lead'),
  selfTaught: t('about.selftaught'),
  experience: defaultExperience.map((e, i) => ({
    _key: key(i, 'job'),
    _type: 'job',
    company: e.company,
    role: str(e.role.en, e.role.es),
    place: str(e.place.en, e.place.es),
    start: `${e.start}-01`,
    ...(e.end ? { end: `${e.end}-01` } : {}),
    summary: txt(e.summary.en, e.summary.es),
  })),
  tools: defaultTools,
  certifications: defaultCertifications.map((c, i) => ({
    _key: key(i, 'cert'),
    _type: 'certification',
    title: c.title,
    ...(c.detail ? { detail: str(c.detail.en, c.detail.es) } : {}),
  })),
  languages: defaultLanguages.map((l, i) => ({
    _key: key(i, 'lang'),
    _type: 'language',
    name: str(l.name.en, l.name.es),
    level: str(l.level.en, l.level.es),
  })),

  email: defaultEmail,
  location: str(defaultLocation.en, defaultLocation.es),
  availability: s('contact.availability'),
  contactTitle1: s('contact.title.1'),
  contactTitle2: s('contact.title.2'),
  contactText: t('contact.text'),
  socials: defaultSocials.map((so, i) => ({ _key: key(i, 'social'), _type: 'social', label: so.label, url: so.href })),

  ...disciplineCopy,

  metaTitle: s('meta.title'),
  metaDescription: t('meta.description'),
};

const res = await client.createIfNotExists(doc);
console.log(res._createdAt === res._updatedAt ? 'Site settings created' : 'Site settings already existed — left untouched');
