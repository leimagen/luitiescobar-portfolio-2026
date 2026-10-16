/**
 * Adds the "Ninja 2062" short (several Kling AI shots edited together, with audio) to the
 * "From Illustration to AI Cinematic Shot" project: it becomes the header video and cover,
 * gets a paragraph in the Ninja section, and the Fantasy Mage loop moves into the body.
 *
 *   cd studio && npx sanity exec scripts/ai/ninjaShort.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const client = getCliClient({ apiVersion: '2026-10-01' });
const SLUG = 'from-illustration-to-ai-cinematic-shot';
const VIDEO = '/media/ai/ninja-2062-short.mp4';
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);

const doc = await client.fetch(`*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0]`, { slug: SLUG });
if (!doc) throw new Error('Project not found');
if (doc.video === VIDEO && doc.body.en.some((b: any) => b.url === '/media/ai/fantasy-mage.mp4')) {
  console.log('Short already added, nothing to do.');
  process.exit(0);
}

const file = join(process.cwd(), 'scripts', 'ai', '.cache', 'ninja-2062-short-frame.jpg');
const asset = await client.assets.upload('image', readFileSync(file), { filename: 'ninja-2062-short-frame.jpg' }); // same file = same asset id
const cover = { _type: 'altImage', alt: 'Ninja 2062 firing an energy blast on a rainy neon street, frame from the AI short', asset: { _type: 'reference', _ref: asset._id } };

const para = (text: string) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] });
const copy = {
  en: 'Ninja 2062 went one step further: the short at the top of this page is an edit of several shots generated with Kling AI, from the original drawing to the fight in the rain.',
  es: 'Ninja 2062 fue un paso más allá: el corto al inicio de esta página es una edición de varias tomas generadas con Kling AI, desde el dibujo original hasta la pelea bajo la lluvia.',
};
const caption = { en: 'Fantasy Mage - illustration to shot', es: 'Fantasy Mage - de la ilustración al plano' };

// one insert per patch (the patch builder keeps only the last insert), all in one transaction
const tx = client.transaction().patch(doc._id, (p) => p.set({
  video: VIDEO,
  coverImage: cover,
  'lead.en': 'Four of my own character illustrations turned into cinematic shots with Kling AI. Each clip starts from the original drawing and ends on a film-like frame, and Ninja 2062 grew into a short of its own.',
  'lead.es': 'Cuatro de mis ilustraciones de personajes convertidas en planos cinematográficos con Kling AI. Cada clip parte del dibujo original y termina en un frame de cine, y Ninja 2062 acabó convirtiéndose en un corto.',
}));
for (const lang of ['en', 'es'] as const) {
  const body: any[] = doc.body[lang];
  // the Ninja section ends with the paragraph right after its loop video
  const ninjaVideo = body.findIndex((b) => b._type === 'videoEmbed' && b.url === '/media/ai/ninja-2062.mp4');
  tx.patch(doc._id, (p) => p.insert('after', `body.${lang}[_key=="${body[ninjaVideo + 1]._key}"]`, [para(copy[lang])]));
  tx.patch(doc._id, (p) => p.insert('after', `body.${lang}[-1]`, [{ _type: 'videoEmbed', _key: key(), url: '/media/ai/fantasy-mage.mp4', loop: true, caption: caption[lang] }]));
}
await tx.commit({ visibility: 'sync' });
console.log('Ninja short added.');
