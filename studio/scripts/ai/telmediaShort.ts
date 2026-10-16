/**
 * Creates the AI Media project "Telmedia Device — Generative AI Short" as a DRAFT.
 * The short (with audio) is served by the site from /public/media/ai; images come from scripts/ai/.cache.
 * Skips if the slug already exists.
 *
 *   cd studio && npx sanity exec scripts/ai/telmediaShort.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const client = getCliClient({ apiVersion: '2026-10-01' });
const SLUG = 'telmedia-device-generative-ai-short';
const CACHE = join(process.cwd(), 'scripts', 'ai', '.cache');
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);

const exists = await client.fetch(`count(*[_type == "project" && slug.current == $slug])`, { slug: SLUG }, { perspective: 'raw' });
if (exists) {
  console.log('Project already exists — nothing to do.');
  process.exit(0);
}

async function image(file: string, alt: string) {
  const asset = await client.assets.upload('image', readFileSync(join(CACHE, file)), { filename: file });
  return { _type: 'altImage', alt, asset: { _type: 'reference', _ref: asset._id } };
}

const cover = await image('telmedia-cover.jpg', 'Telmedia device on a neon-lit street — frame from the AI short');
const renders = await image('telmedia-renders.jpg', 'Blender renders and wireframe of the Telmedia device model');
const frames = [
  await image('telmedia-frame-1.jpg', 'Reference frame 1 — the device floating on a neon street'),
  await image('telmedia-frame-2.jpg', 'Reference frame 2 — close-up of the screen and Telmedia logo'),
  await image('telmedia-frame-3.jpg', 'Reference frame 3 — the device with an alert icon in an alley'),
];

const span = (text: string, bold = false) => ({ _type: 'span', _key: key(), text, marks: bold ? ['strong'] : [] });
const p = (...parts: (string | [string])[]) => ({
  _type: 'block', _key: key(), style: 'normal', markDefs: [],
  children: parts.map((x) => (Array.isArray(x) ? span(x[0], true) : span(x))),
});
const h2 = (text: string) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
const single = (img: object) => ({ ...img, _key: key() });
const row = (imgs: object[]) => ({ _type: 'imageRow', _key: key(), images: imgs.map((i) => ({ ...i, _key: key() })) });

const en = [
  h2('The starting point'),
  p('This was my first time generating video with Kling AI. I was eager to make something, so I went back to a 3D model of a robot-like device I had built in Blender a couple of years earlier.'),
  single(renders),
  h2('Reference frames'),
  p('I composed three quick frames — the 3D renders placed over stock backgrounds — to use as ', ['keyframes and references'], ' in Kling AI, then wrote a simple prompt describing the scene, the style and the mood.'),
  row(frames),
  h2('The result'),
  p('Including a couple of renders and the final edit, the whole exercise took about ', ['two hours'], '. For a quick test the result holds up well — and more time would buy more quality.'),
  p('Generative tools move almost daily, and it\'s easy to stay buried in routine while the field shifts. This piece is part of a habit I\'m keeping: a few hours every week to explore where these tools are and where they\'re going.'),
];

const es = [
  h2('El punto de partida'),
  p('Era la primera vez que generaba video con Kling AI. Tenía ganas de crear algo, así que volví a un modelo 3D de un dispositivo tipo robot que había hecho en Blender un par de años antes.'),
  single(renders),
  h2('Frames de referencia'),
  p('Armé tres encuadres rápidos — los renders 3D sobre fondos de stock — para usarlos como ', ['key frames y referencia'], ' en Kling AI, y escribí un prompt sencillo describiendo la escena, el estilo y el ambiente.'),
  row(frames),
  h2('El resultado'),
  p('Contando un par de renders y la edición final, el ejercicio tomó unas ', ['dos horas'], '. Para una prueba rápida el resultado se sostiene bien — y con más tiempo, más calidad.'),
  p('Las herramientas generativas avanzan prácticamente a diario, y es fácil quedarse inmerso en la rutina mientras todo cambia. Esta pieza es parte de un hábito que mantengo: dedicar unas horas cada semana a explorar dónde están estas herramientas y hacia dónde van.'),
];

await client.create({
  _id: `drafts.${randomUUID()}`,
  _type: 'project',
  title: { _type: 'localeString', en: 'Telmedia Device — Generative AI short', es: 'Telmedia Device — Corto con IA generativa' },
  slug: { _type: 'slug', current: SLUG },
  coverImage: cover,
  video: '/media/ai/telmedia-device-short.mp4',
  discipline: 'ai',
  subcategory: 'video',
  date: '2026-05-26',
  year: '2026',
  selected: true,
  featured: false,
  role: { _type: 'localeString', en: '3D modelling, AI video generation, Editing', es: 'Modelado 3D, Generación de video con IA, Edición' },
  tools: 'Blender, Kling AI',
  lead: {
    _type: 'localeText',
    en: 'A robot-like device I modelled in Blender, brought to life as a short film with Kling AI — from reference frames to final edit in about two hours.',
    es: 'Un dispositivo tipo robot que modelé en Blender, convertido en un corto con Kling AI — de los frames de referencia a la edición final en unas dos horas.',
  },
  body: { _type: 'localeBlockContent', en, es },
});

console.log(`Draft created: ${SLUG}`);
