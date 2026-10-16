/**
 * Creates the AI Media project "From Illustration to AI Cinematic Shot" as a DRAFT.
 * Videos are served by the site itself from /public/media/ai; stills (first frame = original
 * illustration, last frame = AI shot) are uploaded to Sanity from scripts/ai/.cache.
 * Skips if the slug already exists.
 *
 *   cd studio && npx sanity exec scripts/ai/illustrationToAi.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const client = getCliClient({ apiVersion: '2026-10-01' });
const SLUG = 'from-illustration-to-ai-cinematic-shot';
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

const characters = [
  { id: 'ninja-2062', name: 'Ninja 2062' },
  { id: 'fallen-angel', name: 'Fallen Angel' },
  { id: 'stealther', name: 'Stealther' },
  { id: 'fantasy-mage', name: 'Fantasy Mage' },
] as const;

const stills: Record<string, { illustration: object; shot: object }> = {};
for (const c of characters) {
  stills[c.id] = {
    illustration: await image(`${c.id}-illustration.jpg`, `${c.name} — original illustration`),
    shot: await image(`${c.id}-shot.jpg`, `${c.name} — AI cinematic shot`),
  };
}

// --- Portable Text helpers ---
const span = (text: string, bold = false) => ({ _type: 'span', _key: key(), text, marks: bold ? ['strong'] : [] });
const p = (...parts: (string | [string])[]) => ({
  _type: 'block', _key: key(), style: 'normal', markDefs: [],
  children: parts.map((x) => (Array.isArray(x) ? span(x[0], true) : span(x))),
});
const h2 = (text: string) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
const pair = (id: string) => ({ _type: 'imageRow', _key: key(), images: [stills[id].illustration, stills[id].shot].map((i) => ({ ...i, _key: key() })) });
const video = (id: string, caption: string) => ({ _type: 'videoEmbed', _key: key(), url: `/media/ai/${id}.mp4`, loop: true, caption });

const en = [
  h2('The starting point'),
  p('I\'m not primarily an illustrator, but every now and then I enjoy designing characters. I work in "seasons": a month of 3D modelling, a month of programming, a month of drawing. These characters came out of those drawing seasons — some of them painted live on stream.'),
  p('After using ', ['Kling AI 3.0 with Omni reference'], ' to bring my 3D Telmedia device model to life, I applied the same approach to my illustrations. Each clip starts from the original drawing and ends on a cinematic frame — left, the illustration; right, the final shot.'),
  h2('Ninja 2062'),
  pair('ninja-2062'),
  video('ninja-2062', 'Ninja 2062 — illustration to shot'),
  p('The prompt also asked the model to fix the body proportions of the original drawing.'),
  h2('Fallen Angel'),
  pair('fallen-angel'),
  video('fallen-angel', 'Fallen Angel — illustration to shot'),
  p('Even from rougher illustrations, the results kept surprising me — it felt like anything could come to life.'),
  h2('Stealther'),
  pair('stealther'),
  video('stealther', 'Stealther — illustration to shot'),
  p('Ironically, the roughest of the illustrations gave the best result — probably because my prompting had improved by then. The rope still looks a bit funny, but ', ['that end frame'], ' made it worth it.'),
  h2('Fantasy Mage'),
  pair('fantasy-mage'),
];

const es = [
  h2('El punto de partida'),
  p('No soy ilustrador de oficio, pero de vez en cuando disfruto diseñando personajes. Trabajo por "temporadas": un mes de modelado 3D, un mes de programación, un mes de dibujo. Estos personajes salieron de esas temporadas de dibujo — algunos los pinté en vivo en streams.'),
  p('Después de usar ', ['Kling AI 3.0 con referencia Omni'], ' para darle vida a mi modelo 3D del dispositivo Telmedia, apliqué el mismo enfoque a mis ilustraciones. Cada clip parte del dibujo original y termina en un plano cinematográfico — a la izquierda, la ilustración; a la derecha, el plano final.'),
  h2('Ninja 2062'),
  pair('ninja-2062'),
  video('ninja-2062', 'Ninja 2062 — de la ilustración al plano'),
  p('En el prompt también le pedí al modelo corregir las proporciones del cuerpo del dibujo original.'),
  h2('Fallen Angel'),
  pair('fallen-angel'),
  video('fallen-angel', 'Fallen Angel — de la ilustración al plano'),
  p('Incluso partiendo de ilustraciones más toscas, los resultados me seguían sorprendiendo — se sentía como si cualquier cosa pudiera cobrar vida.'),
  h2('Stealther'),
  pair('stealther'),
  video('stealther', 'Stealther — de la ilustración al plano'),
  p('Irónicamente, la más tosca de las ilustraciones dio el mejor resultado — probablemente porque para entonces mis prompts habían mejorado. La cuerda todavía se ve un poco rara, pero ', ['ese frame final'], ' lo valió.'),
  h2('Fantasy Mage'),
  pair('fantasy-mage'),
];

await client.create({
  _id: `drafts.${randomUUID()}`,
  _type: 'project',
  title: { _type: 'localeString', en: 'From Illustration to AI Cinematic Shot', es: 'De la ilustración al plano cinematográfico con IA' },
  slug: { _type: 'slug', current: SLUG },
  coverImage: stills['fantasy-mage'].shot,
  video: '/media/ai/fantasy-mage.mp4',
  discipline: 'ai',
  subcategory: 'hybrid',
  date: '2026-06-03',
  year: '2026',
  selected: true,
  featured: true,
  role: { _type: 'localeString', en: 'Illustration, AI direction, Prompting', es: 'Ilustración, Dirección con IA, Prompting' },
  tools: 'Kling AI 3.0 Omni',
  lead: {
    _type: 'localeText',
    en: 'Four of my own character illustrations turned into cinematic shots with Kling AI — each clip starts from the original drawing and ends on a film-like frame.',
    es: 'Cuatro de mis ilustraciones de personajes convertidas en planos cinematográficos con Kling AI — cada clip parte del dibujo original y termina en un frame de cine.',
  },
  body: { _type: 'localeBlockContent', en, es },
});

console.log(`Draft created: ${SLUG}`);
