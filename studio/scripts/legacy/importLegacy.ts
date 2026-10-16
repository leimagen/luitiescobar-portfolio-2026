/**
 * One-off import of the curated legacy work (Behance + previous site) into Sanity as DRAFTS.
 * Nothing is published: review each project in the Studio and publish it there.
 * Re-runnable: projects whose slug already exists (draft or published) are skipped.
 *
 *   cd studio && npx sanity exec scripts/legacy/importLegacy.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

type L<T> = { en: T; es: T };
type Block = ['h2' | 'p', string] | ['ul', string[]];
interface Entry {
  slug: string;
  discipline: string;
  subcategory: string;
  date: string;
  year?: string;
  selected?: boolean;
  featured?: boolean;
  client?: string;
  role?: L<string>;
  tools?: string;
  video?: string;
  title: L<string>;
  lead?: L<string>;
  body?: L<Block[]>;
  cover: string;
  gallery?: string[];
}

const DIR = join(process.cwd(), 'scripts', 'legacy');
const CACHE = join(DIR, '.cache', 'dl');
mkdirSync(CACHE, { recursive: true });

const client = getCliClient({ apiVersion: '2026-10-01' });
const manifest = JSON.parse(readFileSync(join(DIR, 'manifest.json'), 'utf8')) as { projects: Entry[] };
const UA = { 'user-agent': 'Mozilla/5.0 (luitiescobar portfolio import)' };
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);

async function fetchOk(url: string) {
  const res = await fetch(url, { headers: UA, redirect: 'manual' });
  return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
}

/** Resolve a manifest image reference to bytes (cached on disk between runs). */
async function load(ref: string): Promise<{ data: Buffer; filename: string }> {
  const [kind, value] = [ref.slice(0, ref.indexOf(':')), ref.slice(ref.indexOf(':') + 1)];
  if (kind === 'old-site') {
    return { data: readFileSync(join(DIR, '.cache', 'old-site', value)), filename: value };
  }
  const cached = join(CACHE, kind === 'vimeo-thumb' ? `vimeo-${value}.jpg` : value);
  if (existsSync(cached)) return { data: readFileSync(cached), filename: basename(cached) };

  let data: Buffer | null = null;
  if (kind === 'behance') {
    // originals first, then progressively smaller renditions
    for (const size of ['source', 'fs', '1400', 'max_1200', 'disp']) {
      data = await fetchOk(`https://mir-s3-cdn-cf.behance.net/project_modules/${size}/${value}`);
      if (data) break;
    }
  } else if (kind === 'vimeo-thumb') {
    const meta = (await (await fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${value}&width=1920`)).json()) as { thumbnail_url?: string };
    if (meta.thumbnail_url) data = await fetchOk(meta.thumbnail_url);
  }
  if (!data) throw new Error(`Could not download ${ref}`);
  writeFileSync(cached, data);
  return { data, filename: basename(cached) };
}

async function upload(ref: string, alt: string) {
  const { data, filename } = await load(ref);
  const asset = await client.assets.upload('image', data, { filename });
  return { _type: 'altImage', alt, asset: { _type: 'reference', _ref: asset._id } };
}

/** "text with **bold**" → Portable Text spans */
function spans(text: string) {
  // split() with a capture group alternates plain / bold runs: odd indexes are bold
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((t, i) => ({ _type: 'span', _key: key(), text: t, marks: i % 2 ? ['strong'] : [] }))
    .filter((s) => s.text.length);
}

function toPortableText(blocks: Block[] = []) {
  return blocks.flatMap((b) => {
    if (b[0] === 'ul') {
      return b[1].map((item) => ({ _type: 'block', _key: key(), style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: spans(item) }));
    }
    return [{ _type: 'block', _key: key(), style: b[0] === 'h2' ? 'h2' : 'normal', markDefs: [], children: spans(b[1]) }];
  });
}

const existing = new Set<string>(await client.fetch(`*[_type == "project"].slug.current`, {}, { perspective: 'raw' }));
let created = 0;

for (const p of manifest.projects) {
  if (existing.has(p.slug)) {
    console.log(`skip  ${p.slug} (already exists)`);
    continue;
  }
  const cover = await upload(p.cover, p.title.en);
  const gallery = [];
  for (const [i, ref] of (p.gallery ?? []).entries()) {
    gallery.push({ _key: key(), ...(await upload(ref, `${p.title.en} — ${i + 2}`)) });
  }

  const doc = {
    _id: `drafts.${randomUUID()}`,
    _type: 'project',
    title: { _type: 'localeString', ...p.title },
    slug: { _type: 'slug', current: p.slug },
    coverImage: cover,
    ...(p.video ? { video: p.video } : {}),
    discipline: p.discipline,
    subcategory: p.subcategory,
    date: p.date,
    selected: !!p.selected,
    featured: !!p.featured,
    ...(p.client ? { client: p.client } : {}),
    ...(p.year ? { year: p.year } : {}),
    ...(p.role ? { role: { _type: 'localeString', ...p.role } } : {}),
    ...(p.tools ? { tools: p.tools } : {}),
    ...(p.lead ? { lead: { _type: 'localeText', ...p.lead } } : {}),
    ...(p.body ? { body: { _type: 'localeBlockContent', en: toPortableText(p.body.en), es: toPortableText(p.body.es) } } : {}),
    ...(gallery.length ? { gallery } : {}),
  };
  await client.create(doc);
  created++;
  console.log(`draft ${p.slug} (${1 + gallery.length} images)`);
}

console.log(`\nDone: ${created} drafts created. Review and publish them in the Studio.`);
