/**
 * Creates the AI Media project "Nómada Sur - 'Sangre Real' AI teaser" as a DRAFT.
 * The teaser (with audio) is served by the site from /public/media/ai; images come from scripts/ai/.cache.
 * Individual character sheets stay private by design; only the band lineup reference is published.
 * Skips if the slug already exists.
 *
 *   cd studio && npx sanity exec scripts/ai/sangreRealTeaser.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const client = getCliClient({ apiVersion: '2026-10-01' });
const SLUG = 'nomada-sur-sangre-real-ai-teaser';
const CACHE = join(process.cwd(), 'scripts', 'ai', '.cache');
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);

const exists = await client.fetch(`count(*[_type == "project" && slug.current == $slug])`, { slug: SLUG }, { perspective: 'raw' });
if (exists) {
  console.log('Project already exists - nothing to do.');
  process.exit(0);
}

async function image(file: string, alt: string) {
  const asset = await client.assets.upload('image', readFileSync(join(CACHE, file)), { filename: file });
  return { _type: 'altImage', alt, asset: { _type: 'reference', _ref: asset._id } };
}

const cover = await image('sangre-band-fisheye.webp', 'Nómada Sur: digital versions of the four members, fisheye shot in a scrapyard');
const stage = await image('sangre-band-stage.webp', 'Nómada Sur performing on a flooded red stage under neon lightning bolts');
const lineup = await image('sangre-band-lineup.webp', 'Lineup reference of the four Nómada Sur members, showing their height differences');
const location = await image('sangre-location-sheet.webp', 'Location sheet: stage with neon lightning bolts, drums and amps on a reflective red floor');
const guitar = await image('sangre-guitar-sheet.webp', 'Element sheet: black Telecaster-style guitar from every angle, with details');
const car = await image('sangre-car-sheet.webp', 'Element sheet: concept sports car, exterior views and red interior');

const span = (text: string, bold = false) => ({ _type: 'span', _key: key(), text, marks: bold ? ['strong'] : [] });
const p = (...parts: (string | [string])[]) => ({
  _type: 'block', _key: key(), style: 'normal', markDefs: [],
  children: parts.map((x) => (Array.isArray(x) ? span(x[0], true) : span(x))),
});
const h2 = (text: string) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
const li = (...parts: (string | [string])[]) => ({ ...p(...parts), listItem: 'number', level: 1 });
const single = (img: object) => ({ ...img, _key: key() });
const row = (imgs: object[]) => ({ _type: 'imageRow', _key: key(), images: imgs.map((i) => ({ ...i, _key: key() })) });

const en = [
  h2('The idea'),
  p('My band Nómada Sur hasn\'t played together in years. This time we "shot" a video with ', ['no cameras, no set'], ', and with me an ocean away. It\'s the teaser for our upcoming single, published on our social channels, and it turned into a huge learning experience in multimedia generation.'),
  h2('Building the cast'),
  p('The actors are digital versions of the four of us. After asking the members for their consent to use their image, I gave ChatGPT visual references of each one, together with the visual style direction and specific instructions, and generated a ', ['character sheet'], ' for every member, plus element sheets for each instrument, each prop and each location.'),
  p('The individual character sheets stay private, because publishing them would make it too easy to clone our identities. They made it possible to build this lineup reference of the whole band, where even the height differences are visible, which kept every clip coherent.'),
  single(lineup),
  row([location, guitar, car]),
  h2('Directing and editing with AI'),
  p('With those elements I generated several video tests in Seedance 2.5 (Dreamina) and Kling AI, assisted by ', ['Claude Code as my technical director'], ': scripts, camera angles and prompt support. Then I fed the clips back to Claude Code, which used Python, ffmpeg and editing skills to assemble the teaser in sync with the audio track, ready to publish.'),
  single(stage),
  h2('Key learnings'),
  li(['Lock the faces before animating anything.'], ' Character sheets first, video second.'),
  li(['References must match the video\'s style.'], ' Mixing photos with rotoscoped looks sends the model opposite signals.'),
  li(['AI copies everything it sees.'], ' For the 90s promo attitude I used photos of another band, but described them in text instead of attaching them, so their faces wouldn\'t leak into ours.'),
  li(['Edit effects belong in the edit.'], ' AI is great at action and atmosphere; timing is better controlled in post.'),
  p('The teaser is the first test of something much bigger I\'m now working on.'),
];

const es = [
  h2('La idea'),
  p('Mi banda Nómada Sur lleva años sin tocar junta. Esta vez "grabamos" un video ', ['sin cámaras, sin set'], ', y conmigo a un océano de distancia. Es el teaser de nuestro próximo single, publicado en nuestras redes, y se convirtió en un aprendizaje gigante sobre generación de contenido multimedia.'),
  h2('Construir el elenco'),
  p('Los actores son versiones digitales de nosotros cuatro. Después de pedir consentimiento a los integrantes para usar su imagen, le di a ChatGPT referencias visuales de cada uno, junto con la dirección de estilo visual e instrucciones específicas, y generé un ', ['character sheet'], ' de cada integrante, además de hojas de elementos para cada instrumento, cada prop y cada locación.'),
  p('Los character sheets individuales se mantienen privados, porque publicarlos facilitaría clonar nuestras identidades. Gracias a ellos pude crear esta referencia de la banda completa, donde ya se ven incluso las diferencias de estatura, lo que mantuvo la coherencia entre piezas.'),
  single(lineup),
  row([location, guitar, car]),
  h2('Dirigir y editar con IA'),
  p('Con esos elementos generé varias pruebas de video en Seedance 2.5 (Dreamina) y Kling AI, asistido por ', ['Claude Code como director técnico'], ': guiones, ángulos de cámara y apoyo con los prompts. Luego le pasé los clips a Claude Code, que con Python, ffmpeg y skills de edición montó el teaser en sincronía con el track de audio, listo para publicar.'),
  single(stage),
  h2('Aprendizajes clave'),
  li(['Fijar las caras antes de animar nada.'], ' Primero las hojas de personaje, después el video.'),
  li(['Las referencias deben estar en el mismo estilo que el video.'], ' Mezclar fotos con rotoscopia le da al modelo señales opuestas.'),
  li(['La IA copia todo lo que ve.'], ' Para la actitud de promo noventera usé fotos de otra banda, pero las describí en texto en vez de adjuntarlas, para que sus caras no se colaran en las nuestras.'),
  li(['Los efectos de montaje se hacen en el montaje.'], ' La IA es buena con la acción y la atmósfera; el tiempo se controla mejor editando.'),
  p('El teaser es la primera prueba de algo mucho más grande en lo que ya estoy trabajando.'),
];

await client.create({
  _id: `drafts.${randomUUID()}`,
  _type: 'project',
  title: { _type: 'localeString', en: 'Nómada Sur - "Sangre Real" AI teaser', es: 'Nómada Sur - Teaser con IA de "Sangre Real"' },
  slug: { _type: 'slug', current: SLUG },
  coverImage: cover,
  video: '/media/ai/nomada-sur-sangre-real-teaser.mp4',
  discipline: 'ai',
  subcategory: 'video',
  date: '2026-10-07',
  year: '2026',
  selected: true,
  featured: true,
  client: 'Nómada Sur',
  role: { _type: 'localeString', en: 'Creative direction, AI generation, Editing', es: 'Dirección creativa, Generación con IA, Edición' },
  tools: 'ChatGPT, Seedance 2.5 (Dreamina), Kling AI, Claude Code, Python, ffmpeg',
  lead: {
    _type: 'localeText',
    en: 'A 24-second teaser for my band Nómada Sur\'s upcoming single. No cameras, no set and me an ocean away, just digital versions of the four of us, generated and directed with AI.',
    es: 'Un teaser de 24 segundos para el próximo single de mi banda Nómada Sur. Sin cámaras, sin set y conmigo a un océano de distancia, solo versiones digitales de nosotros cuatro, generadas y dirigidas con IA.',
  },
  body: { _type: 'localeBlockContent', en, es },
});

console.log(`Draft created: ${SLUG}`);
