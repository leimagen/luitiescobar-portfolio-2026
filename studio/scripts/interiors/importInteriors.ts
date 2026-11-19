/**
 * Creates the three 3D interiors/architecture projects as DRAFTS: Modern House with Pool, Fresno House
 * and CS-05 Townhouse. Texts are condensed from the user's process notes; images come from
 * scripts/interiors/.cache (selected and converted from the local project folders, not committed).
 * Skips any slug that already exists.
 *
 *   cd studio && npx sanity exec scripts/interiors/importInteriors.ts --with-user-token
 */
import { getCliClient } from 'sanity/cli';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const client = getCliClient({ apiVersion: '2026-10-01' });
const CACHE = join(process.cwd(), 'scripts', 'interiors', '.cache');
const key = () => randomUUID().replace(/-/g, '').slice(0, 12);

type Img = { _type: 'altImage'; alt: string; asset: { _type: 'reference'; _ref: string } };
const uploaded = new Map<string, Img>();
async function image(file: string, alt: string): Promise<Img> {
  if (!uploaded.has(file)) {
    const asset = await client.assets.upload('image', readFileSync(join(CACHE, `${file}.jpg`)), { filename: `${file}.jpg` });
    uploaded.set(file, { _type: 'altImage', alt, asset: { _type: 'reference', _ref: asset._id } });
  }
  return uploaded.get(file)!;
}

// --- Portable Text helpers ---
type Part = string | [string];
const span = (text: string, bold = false) => ({ _type: 'span', _key: key(), text, marks: bold ? ['strong'] : [] });
const p = (...parts: Part[]) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: parts.map((x) => (Array.isArray(x) ? span(x[0], true) : span(x))) });
const h2 = (text: string) => ({ _type: 'block', _key: key(), style: 'h2', markDefs: [], children: [span(text)] });
const li = (...parts: Part[]) => ({ ...p(...parts), listItem: 'bullet', level: 1 });
const single = (img: Img) => ({ ...img, _key: key() });
const row = (imgs: Img[]) => ({ _type: 'imageRow', _key: key(), images: imgs.map((i) => ({ ...i, _key: key() })) });
const gallery = (imgs: Img[]) => imgs.map((i) => ({ ...i, _key: key() }));

async function exists(slug: string) {
  return (await client.fetch(`count(*[_type == "project" && slug.current == $slug])`, { slug }, { perspective: 'raw' })) > 0;
}

async function create(doc: Record<string, unknown> & { slug: string }) {
  if (await exists(doc.slug)) {
    console.log(`${doc.slug}: already exists, skipped`);
    return;
  }
  const { slug, ...rest } = doc;
  await client.create({ _id: `drafts.${randomUUID()}`, _type: 'project', slug: { _type: 'slug', current: slug }, discipline: '3d', subcategory: 'interiors', year: '2026', ...rest });
  console.log(`${slug}: draft created`);
}

// ------------------------------------------------------------------ Modern House with Pool
{
  const day = await image('fh-day', 'Modern white house with a pool and garden, day render');
  const blue = await image('fh-blue-hour', 'The same house at blue hour, lit interiors and a blue pool, Cycles render');
  const eevee = await image('fh-eevee', 'Blue-hour render of the house in EEVEE, for comparison with Cycles');
  const front = await image('fh-elev-front', 'Front elevation with the few dimensions given');
  const side = await image('fh-elev-side', 'Side elevation with the few dimensions given');
  const shell = await image('fh-shell', 'Blender viewport: the house shell with windows, solid view');
  const xray = await image('fh-stairs-xray', 'Blender viewport, X-ray: floating stair and blinds');
  const furniture = await image('fh-furniture', 'Blender viewport: furnished house, terrace and pool deck');
  const wire = await image('fh-wireframe', 'Aerial wireframe view of the finished model');
  const top = await image('fh-top', 'Top view showing the L-shaped plan around the pool');

  await create({
    slug: 'modern-house-with-pool',
    title: { _type: 'localeString', en: 'Modern House with Pool', es: 'Casa moderna con piscina' },
    coverImage: day,
    date: '2026-08-20',
    selected: false,
    featured: false,
    role: { _type: 'localeString', en: '3D modeling, Lighting, Rendering', es: 'Modelado 3D, Iluminación, Render' },
    tools: 'Blender 5.2 (Cycles, EEVEE), Archimesh, Geometry Nodes, Poly Haven',
    lead: {
      _type: 'localeText',
      en: 'My first architectural visualization: a two-volume modern house with a pool, modeled in Blender from just two elevations and rendered by day and at blue hour.',
      es: 'Mi primera visualización arquitectónica: una casa moderna de dos volúmenes con piscina, modelada en Blender a partir de solo dos alzados y renderizada de día y en la hora azul.',
    },
    body: {
      _type: 'localeBlockContent',
      en: [
        h2('The brief'),
        p('A modern two-storey house made of two white volumes: a ground-floor living wing, a cantilevered upper box with a covered balcony, a roof terrace with a glass balustrade and a garden with a pool. It was my first archviz project, built in Blender from scratch while following an archviz course, with one goal: learning the whole chain, from a drawing to finished day and blue-hour renders.'),
        h2('Reading the drawings'),
        p('The only input was two elevations, front and side, with seven dimensions and ', ['no floor plan'], '. Wall thicknesses, window divisions and the whole interior layout were read off the drawings by proportion and decided by me.'),
        row([front, side]),
        h2('An editable model'),
        p('I blocked the house out the way a builder would, keeping every step editable: volumes with a live Solidify modifier for wall thickness, Boolean cutters for the openings so a window can move without rebuilding its wall, seven parametric Archimesh windows and bevelled slabs so the edges catch the light. The floating stair is built with Geometry Nodes.'),
        row([shell, xray]),
        p('Inside, a kitchen run, living and dining areas and a bedroom; outside, a dining set, a grill and pool loungers.'),
        single(furniture),
        h2('Garden, pool and light'),
        p('The lawn is a particle system of about half a million blades. The pool has a softly displaced water surface, tiled walls and six blue underwater lights for the evening. Day and blue hour share the same scene: I only rotated and dimmed a Poly Haven sky, and 33 lights inside the house and in the garden do the rest.'),
        single(blue),
        h2('Cycles or EEVEE'),
        p('I rendered the blue-hour shot again in EEVEE, Blender\'s real-time engine, to compare speed and look. It needed brighter interior lamps and a faint warm sun to read like the Cycles version, and the water and the soft shadows still render differently.'),
        single(eevee),
        h2('What I took into the next projects'),
        li(['Name everything.'], ' Here most objects kept their default names, which makes a large scene hard to navigate.'),
        li(['Instance heavy vegetation'], ' instead of duplicating it: the trees and bushes were most of the scene\'s weight.'),
        li(['One file for day and dusk,'], ' as two scenes sharing the same house, instead of near-identical copies.'),
        li(['Licensed or CC0 assets for client work.'], ' Course assets are fine for learning.'),
        p('This house set the method for my next two projects, the Fresno House and the CS-05 Townhouse.'),
      ],
      es: [
        h2('El encargo'),
        p('Una casa moderna de dos plantas formada por dos volúmenes blancos: un ala de estar en planta baja, una caja superior en voladizo con un balcón cubierto, una terraza en la azotea con barandilla de vidrio y un jardín con piscina. Fue mi primer proyecto de archviz, construido en Blender desde cero mientras seguía un curso de visualización arquitectónica, con un objetivo: aprender la cadena completa, del plano a los renders finales de día y de hora azul.'),
        h2('Leer los planos'),
        p('La única información eran dos alzados, frontal y lateral, con siete cotas y ', ['sin planta'], '. El grosor de los muros, la división de las ventanas y toda la distribución interior los deduje de los dibujos por proporción y los decidí yo.'),
        row([front, side]),
        h2('Un modelo editable'),
        p('Levanté la casa como lo haría un constructor, manteniendo cada paso editable: volúmenes con un modificador Solidify en vivo para el grosor de los muros, cortadores Boolean para los huecos, de modo que una ventana se puede mover sin rehacer el muro, siete ventanas paramétricas de Archimesh y losas biseladas para que los cantos atrapen la luz. La escalera flotante está hecha con Geometry Nodes.'),
        row([shell, xray]),
        p('Dentro, una cocina en línea, salón, comedor y un dormitorio; fuera, un comedor de exterior, una parrilla y tumbonas junto a la piscina.'),
        single(furniture),
        h2('Jardín, piscina y luz'),
        p('El césped es un sistema de partículas de casi medio millón de briznas. La piscina tiene una superficie de agua con un desplazamiento suave, paredes de azulejo y seis luces azules subacuáticas para la noche. El día y la hora azul comparten la misma escena: solo giré y atenué un cielo de Poly Haven, y 33 luces dentro de la casa y en el jardín hacen el resto.'),
        single(blue),
        h2('¿Cycles o EEVEE?'),
        p('Volví a renderizar la toma de hora azul en EEVEE, el motor en tiempo real de Blender, para comparar velocidad y aspecto. Necesitó lámparas interiores más intensas y un sol cálido muy tenue para parecerse a la versión de Cycles, y aun así el agua y las sombras suaves se ven distintas.'),
        single(eevee),
        h2('Lo que me llevé a los siguientes proyectos'),
        li(['Ponerle nombre a todo.'], ' Aquí casi todos los objetos se quedaron con su nombre por defecto, y así una escena grande se vuelve difícil de recorrer.'),
        li(['Instanciar la vegetación pesada'], ' en lugar de duplicarla: los árboles y arbustos eran la mayor parte del peso de la escena.'),
        li(['Un solo archivo para el día y el anochecer,'], ' como dos escenas que comparten la misma casa, en vez de copias casi idénticas.'),
        li(['Recursos con licencia o CC0 para los proyectos de clientes.'], ' Los del curso sirven para aprender.'),
        p('Esta casa marcó el método de mis dos proyectos siguientes, la Casa Fresno y la casa adosada CS-05.'),
      ],
    },
    gallery: gallery([wire, top]),
  });
}

// ------------------------------------------------------------------ Fresno House
{
  const dayStreet = await image('fr-day-street', 'Fresno House from the street by day: dark grey brick, stone cladding and a black window frame');
  const duskStreet = await image('fr-dusk-street', 'Fresno House at dusk with warm interior lights');
  const duskLiving = await image('fr-dusk-living', 'Living room at dusk with the floating wooden stair');
  const sheets = await image('fr-dwg-sheets', 'The full DWG drawing set: plans, facade and sections');
  const overlay = await image('fr-spec-overlay', 'The specification drawn back over the original plans to check every wall and opening');
  const build = await image('fr-build', 'Blender viewport: the base model, built from the specification');
  const xray = await image('fr-furnished-xray', 'Aerial X-ray view of the furnished house');
  const stair = await image('fr-stair', 'The rebuilt L-shaped stair with floating treads');
  const lawn = await image('fr-lawn', 'Close-up of the final lawn: curved blades over dark soil');
  const bandBefore = await image('fr-banding-before', 'Before: banding in the sky and lamplight after converting to 8 bits');
  const bandAfter = await image('fr-banding-after', 'After: the same image exported with dithering, smooth gradients');
  const tones = await image('fr-tone-variants', 'Three interior light settings compared side by side');

  await create({
    slug: 'fresno-house',
    title: { _type: 'localeString', en: 'Fresno House', es: 'Casa Fresno' },
    coverImage: dayStreet,
    date: '2026-11-12',
    selected: true,
    featured: false,
    role: { _type: 'localeString', en: 'Plan reading, 3D modeling, Interior design, Lighting, Rendering', es: 'Lectura de planos, Modelado 3D, Interiorismo, Iluminación, Render' },
    tools: 'Blender 5.2 (Cycles, Geometry Nodes), Python, LibreDWG, ezdxf, Poly Haven, Claude',
    lead: {
      _type: 'localeText',
      en: 'A modern two-storey house rebuilt from a public DWG drawing set: an editable Blender model, a validated specification and photoreal day and dusk renders.',
      es: 'Una casa moderna de dos plantas reconstruida a partir de un juego de planos DWG público: un modelo editable en Blender, una especificación validada y renders fotorrealistas de día y al anochecer.',
    },
    body: {
      _type: 'localeBlockContent',
      en: [
        h2('The brief'),
        p('A modern two-storey house on a 10 x 20 m lot: a double garage under a cantilevered upper volume, a double-height foyer, three en-suite bedrooms, a rooftop terrace and a back yard. The goal was an editable Blender model and day and dusk renders, with a workflow where every step can be reviewed and changed by hand.'),
        h2('A DWG that was really a PDF'),
        p('The only source was a DWG file, and it turned out to be a PDF import in disguise: no wall or door layers, only loose lines. Instead of tracing images, I read the wall positions numerically from the drawing\'s black wall fills, accurate to about 1 cm, with the openings as the gaps between them. Where the drawings were silent or contradicted each other, I wrote the decision down as an ', ['assumption'], ' instead of guessing: 11 in total.'),
        single(sheets),
        h2('A specification you can check'),
        p('Every measurement went into a plain-text specification: levels, walls, 34 doors and windows, rooms, stair, roofs and site. A validator with automated tests checks it before anything is modeled: every opening must sit on its wall and fit, and the stair risers must add up to the floor height. Drawing the specification back over the original plan was the final check.'),
        single(overlay),
        h2('An editable base model'),
        p('The first 3D layout was built from the specification with an AI tool that I directed (a Claude skill), as a starting base. Walls are plan outlines with a live thickness, and every door or window is a named object that carries its own cut: move it and the hole moves with it. A quality check found 20 places where two surfaces shared the same plane, which flicker in renders; turning the fix into joint rules took that count to zero.'),
        row([build, xray]),
        p('From there I refined the details by hand: an L-shaped stair with floating 6 cm wooden treads, glass railings around the double-height foyer, a black frame box around the front bedroom window and a pergola over the back terrace.'),
        single(stair),
        h2('Materials, context and a lot of lawn'),
        p('Materials are procedural, with no textures or UVs: face brick, stone cladding, render, oak and porcelain. I changed the brick from orange to dark grey, set the house in a real street with a curb, a sidewalk and neighbouring volumes, and planted a jacaranda in a proper 1 x 1 m tree pit. The lawn took four rounds until it matched a photo of lush turf: about 3 million curved blades over dark soil, with a few dry ones.'),
        single(lawn),
        h2('Final renders'),
        p('Four stills at 1920 x 1080, rendered in a background Blender from a saved copy so the working session stays free: from 79 seconds to 6 minutes each on a laptop RTX 3050. Checking the images numerically, not only by eye, caught two problems: the day scene had lost its contrast look, and converting the 16-bit renders to 8 bits for the web turned smooth skies and lamplight into bands. The web versions are exported with ', ['dithering'], ', an invisible noise that breaks up the steps.'),
        row([bandBefore, bandAfter]),
        p('The dusk living room looked too orange to me, so I compared three light settings side by side and chose 3600 K interior lights at 85% power, keeping the facade lights warm so the windows still glow against the blue sky.'),
        single(tones),
        single(duskStreet),
        single(duskLiving),
      ],
      es: [
        h2('El encargo'),
        p('Una casa moderna de dos plantas en un terreno de 10 x 20 m: garaje doble bajo un volumen superior en voladizo, recibidor a doble altura, tres dormitorios con baño, terraza en la azotea y patio trasero. El objetivo era un modelo de Blender editable y renders de día y al anochecer, con un flujo de trabajo en el que cada paso se pueda revisar y cambiar a mano.'),
        h2('Un DWG que en realidad era un PDF'),
        p('La única fuente era un archivo DWG, y resultó ser un PDF importado: sin capas de muros ni de puertas, solo líneas sueltas. En lugar de calcar imágenes, leí la posición de los muros numéricamente a partir de sus rellenos negros, con una precisión de alrededor de 1 cm, y los huecos son los espacios entre ellos. Donde los planos no decían nada o se contradecían, dejé la decisión por escrito como un ', ['supuesto'], ' en vez de adivinar: 11 en total.'),
        single(sheets),
        h2('Una especificación que se puede comprobar'),
        p('Todas las medidas pasaron a una especificación en texto plano: niveles, muros, 34 puertas y ventanas, estancias, escalera, cubiertas y terreno. Un validador con pruebas automáticas la revisa antes de modelar nada: cada hueco debe estar sobre su muro y caber, y los peldaños deben sumar la altura entre plantas. La comprobación final fue dibujar la especificación sobre el plano original.'),
        single(overlay),
        h2('Un modelo base editable'),
        p('El primer modelo 3D se generó a partir de la especificación con una herramienta de IA dirigida por mí (una skill de Claude), como punto de partida. Los muros son contornos de la planta con un grosor en vivo, y cada puerta o ventana es un objeto con nombre que lleva su propio corte: si lo mueves, el hueco se mueve con él. Una revisión de calidad encontró 20 lugares donde dos superficies compartían el mismo plano, algo que parpadea en los renders; convertir la corrección en reglas de encuentro dejó esa cifra en cero.'),
        row([build, xray]),
        p('A partir de ahí ajusté los detalles a mano: una escalera en L con peldaños de madera flotantes de 6 cm, barandillas de vidrio alrededor del recibidor a doble altura, un marco negro alrededor de la ventana del dormitorio delantero y una pérgola sobre la terraza trasera.'),
        single(stair),
        h2('Materiales, contexto y mucho césped'),
        p('Los materiales son procedurales, sin texturas ni UVs: ladrillo cara vista, revestimiento de piedra, revoque, roble y porcelanato. Cambié el ladrillo de naranja a gris oscuro, situé la casa en una calle real con bordillo, acera y volúmenes vecinos, y planté un jacarandá en un alcorque de 1 x 1 m como corresponde. El césped necesitó cuatro rondas hasta parecerse a la foto de un césped frondoso: unos 3 millones de briznas curvadas sobre tierra oscura, con algunas secas.'),
        single(lawn),
        h2('Renders finales'),
        p('Cuatro imágenes a 1920 x 1080, renderizadas en un Blender en segundo plano a partir de una copia guardada, para que la sesión de trabajo quede libre: de 79 segundos a 6 minutos cada una en una RTX 3050 de portátil. Revisar las imágenes con números, no solo a ojo, detectó dos problemas: la escena de día había perdido su ajuste de contraste, y pasar los renders de 16 bits a 8 bits para la web convertía los degradados suaves del cielo y de la luz de las lámparas en franjas. Las versiones web se exportan con ', ['dithering'], ', un ruido invisible que rompe esos escalones.'),
        row([bandBefore, bandAfter]),
        p('El salón al anochecer me pareció demasiado naranja, así que comparé tres ajustes de luz lado a lado y elegí luces interiores de 3600 K al 85% de potencia, manteniendo cálidas las de la fachada para que las ventanas sigan brillando contra el cielo azul.'),
        single(tones),
        single(duskStreet),
        single(duskLiving),
      ],
    },
  });
}

// ------------------------------------------------------------------ CS-05 Townhouse
{
  const dayHero = await image('cs-day-hero', 'CS-05 Townhouse by day: white render, a dark master volume over the carport and a street tree');
  const goldenHero = await image('cs-golden-hero', 'Three-quarter view of the townhouse at golden hour');
  const droneDay = await image('cs-drone-day', 'Aerial view of the townhouse in its neighbourhood by day');
  const droneNight = await image('cs-dusk-street', 'Aerial view of the street at night with lit windows and street lights');
  const goldenTele = await image('cs-golden-tele', '50 mm telephoto view at golden hour, framed by the street tree');
  const duskElevation = await image('cs-dusk-elevation', 'Frontal elevation at dusk with the wall sconces on');
  const duskTerrace = await image('cs-dusk-terrace', 'Upstairs terrace at dusk with teak lounge chairs');
  const living = await image('cs-living', 'Living room at night: bouclé sofa, walnut drum table and arc lamp');
  const dining = await image('cs-dining', 'Dining for six with an oak table and a linen drum pendant');
  const kitchen = await image('cs-kitchen', 'U-shaped kitchen with walnut lower cabinets, cream uppers and brass pendants');
  const master = await image('cs-master', 'Master bedroom with a sage headboard and terracotta throw');
  const bedroom2 = await image('cs-bedroom2', 'Bedroom 2 at night');
  const bedroom3 = await image('cs-bedroom3', 'Bedroom 3 with a desk, shelf and art');
  const bath = await image('cs-masterbath', 'Spa-like bathroom in travertine-look stone with a walnut vanity');
  const foyer = await image('cs-foyer', 'Foyer with a floating oak console and a round brass mirror');
  const patio = await image('cs-dusk-patio', 'Back patio at dusk with uplit plants and an oak batten screen');
  const plan = await image('cs-plan', 'Ground floor plan read from the CAD file');
  const overlay = await image('cs-spec-overlay', 'The specification drawn back over the original plans');
  const xray = await image('cs-xray', 'Aerial X-ray view of the base model with the roof removed');
  const cloth = await image('cs-cloth', 'Close-up of the simulated cloth bedding');
  const fruit = await image('cs-fruit', 'Fruit bowl settled with a rigid-body simulation');

  await create({
    slug: 'cs05-townhouse',
    title: { _type: 'localeString', en: 'CS-05 Townhouse', es: 'Casa adosada CS-05' },
    coverImage: dayHero,
    date: '2026-11-19',
    selected: true,
    featured: true,
    role: { _type: 'localeString', en: 'Plan reading, 3D modeling, Interior design, Lighting, Rendering, Animation, Editing', es: 'Lectura de planos, Modelado 3D, Interiorismo, Iluminación, Render, Animación, Edición' },
    tools: 'Blender 5.2 (Cycles, AgX), Python, LibreDWG, ezdxf, shapely, Poly Haven, Claude',
    lead: {
      _type: 'localeText',
      en: 'A compact two-storey townhouse taken from a CAD drawing to a fully furnished, editable Blender model, with 22 final renders and a promo film cut to the music.',
      es: 'Una casa adosada compacta de dos plantas, llevada de un plano CAD a un modelo de Blender editable y totalmente amueblado, con 22 renders finales y un video promocional editado al ritmo de la música.',
    },
    body: {
      _type: 'localeBlockContent',
      en: [
        h2('The brief'),
        p('A compact two-storey house on a narrow 7.5 x 13 m lot, attached to its neighbours: open living, dining and kitchen, a carport under the master bedroom, a half bath and a laundry yard at the back, and upstairs three bedrooms, two bathrooms and a terrace. Same goal as in my earlier projects: an editable Blender model, built so every step can be reviewed and changed by hand.'),
        h2('From real CAD to a checked specification'),
        p('This time the DWG was real CAD, with walls, doors, windows and dimensions on their own layers, so walls and openings were read straight from the lines, to the millimetre. The drawing was incomplete, and every gap became a written ', ['assumption'], ': 11 in total, such as a front window that appears on the elevation but not on the plan. Everything went into a specification that a validator checks before modeling, and the base model was prepared with AI assistance that I direct (a Claude skill).'),
        row([plan, overlay]),
        single(xray),
        h2('Sky, materials and a realism pass'),
        p('The sky is a photographed 8K HDRI with real clouds. I took the sun out of the image and replaced it with a sun lamp of the same strength and colour, so the clouds stay behind the house while the light comes from the front and the master volume casts its shadow into the carport. A realism pass then swapped the procedural surfaces for scanned CC0 materials calibrated to measured albedo, with a little dirt at the foot of the walls, rounded edges, atmospheric haze and a photographic finish.'),
        single(goldenHero),
        h2('Furnished from my moodboard'),
        p('The interiors follow my moodboard (warm neutrals, low bouclé sofas with sage cushions, dark walnut, fluted wood, linen, sculptural lamps and hidden LED light) and the architect\'s layout. Most pieces were modeled to match it, and every one was checked for collisions against walls, windows and the rest of the furniture.'),
        row([living, dining]),
        row([kitchen, master]),
        p('The bedding is ', ['simulated cloth'], ': the duvet drapes over the sides and flares at the corners, and the pillows are fabric bags inflated by air pressure, which gives them real seams and creases. Loose props follow physics too: the fruit was dropped into the bowl with a rigid-body simulation until every piece came to rest.'),
        row([cloth, fruit]),
        h2('Every room, not only the hero shots'),
        p('I made it a rule to render every space, not just the best angles. Doing it exposed hidden problems, like a light buried inside the stair, and showed which rooms still felt unfinished: bedroom 3 got a desk, a shelf and art, and the narrow foyer a floating console and a round brass mirror.'),
        row([bedroom3, bath]),
        h2('A whole neighbourhood'),
        p('The first renders showed the house between bare walls and grey blocks. Now the street continues on both sides, with a back row of houses, mature trees, a park and a forest belt closing the horizon, planters with grasses and flowers, and slim street lights that make the night shots feel lived in. Every tree was checked against the house geometry so no branch enters a wall.'),
        single(droneDay),
        single(droneNight),
        h2('The film'),
        p('The promo film tells one day in the house: it opens with a drone flying in by day and closes with one flying out at night. The camera moves are linear, like real ones, mixed with close-ups and slow focus pulls. I analysed the music with my own beat-based editing tool (129.6 BPM) and centred every dissolve on a beat, so the cut lands on the music: 50 seconds at 1920 x 1080.'),
        h2('Numbers'),
        li(['22 final renders'], ' at 1920 x 1080, about an hour and a half in total on a laptop GPU.'),
        li(['3 lighting scenes'], ' sharing one house: day, golden hour and dusk.'),
        li(['11 written assumptions'], ', reviewed before anything was built.'),
        li(['4 public-domain paintings'], ' from the Art Institute of Chicago on the walls.'),
      ],
      es: [
        h2('El encargo'),
        p('Una casa compacta de dos plantas en un terreno estrecho de 7,5 x 13 m, adosada a sus vecinas: salón, comedor y cocina abiertos, una cochera bajo el dormitorio principal, un medio baño y un patio de lavado al fondo, y arriba tres dormitorios, dos baños y una terraza. El mismo objetivo que en mis proyectos anteriores: un modelo de Blender editable, hecho para que cada paso se pueda revisar y cambiar a mano.'),
        h2('De un CAD real a una especificación comprobada'),
        p('Esta vez el DWG era un CAD de verdad, con muros, puertas, ventanas y cotas en sus propias capas, así que muros y huecos se leyeron directamente de las líneas, al milímetro. El plano estaba incompleto, y cada vacío se convirtió en un ', ['supuesto'], ' escrito: 11 en total, como una ventana frontal que aparece en el alzado pero no en la planta. Todo pasó a una especificación que un validador revisa antes de modelar, y el modelo base se preparó con ayuda de IA que yo dirijo (una skill de Claude).'),
        row([plan, overlay]),
        single(xray),
        h2('Cielo, materiales y una pasada de realismo'),
        p('El cielo es un HDRI fotografiado en 8K con nubes reales. Quité el sol de la imagen y lo sustituí por una luz solar con la misma intensidad y color, de modo que las nubes quedan detrás de la casa mientras la luz llega de frente y el volumen principal proyecta su sombra en la cochera. Después, una pasada de realismo cambió las superficies procedurales por materiales CC0 escaneados y calibrados a un albedo medido, con un poco de suciedad al pie de los muros, cantos redondeados, bruma atmosférica y un acabado fotográfico.'),
        single(goldenHero),
        h2('Amueblada a partir de mi moodboard'),
        p('Los interiores siguen mi moodboard (neutros cálidos, sofás bajos de bouclé con cojines verde salvia, nogal oscuro, madera acanalada, lino, lámparas escultóricas y luz LED oculta) y la distribución del arquitecto. La mayoría de las piezas las modelé para que encajaran con él, y comprobé que ninguna chocara con muros, ventanas ni con el resto de los muebles.'),
        row([living, dining]),
        row([kitchen, master]),
        p('La ropa de cama es ', ['tela simulada'], ': el edredón cae por los lados y se abre en las esquinas, y las almohadas son bolsas de tela infladas con presión de aire, lo que les da costuras y arrugas reales. Los objetos sueltos también obedecen a la física: la fruta se dejó caer en el frutero con una simulación de cuerpos rígidos hasta que cada pieza quedó en reposo.'),
        row([cloth, fruit]),
        h2('Todas las estancias, no solo las tomas principales'),
        p('Me puse como regla renderizar cada espacio, no solo los mejores ángulos. Eso destapó problemas ocultos, como una luz enterrada dentro de la escalera, y mostró qué estancias aún parecían sin terminar: el dormitorio 3 recibió un escritorio, una repisa y un cuadro, y el estrecho recibidor una consola flotante y un espejo redondo de latón.'),
        row([bedroom3, bath]),
        h2('Un barrio completo'),
        p('Los primeros renders mostraban la casa entre muros desnudos y bloques grises. Ahora la calle continúa a ambos lados, con una fila de casas detrás, árboles maduros, un parque y una franja de bosque que cierra el horizonte, jardineras con gramíneas y flores, y farolas delgadas que hacen que las tomas nocturnas se sientan habitadas. Cada árbol se comprobó contra la geometría de la casa para que ninguna rama atraviese un muro.'),
        single(droneDay),
        single(droneNight),
        h2('El video'),
        p('El video promocional cuenta un día en la casa: empieza con un dron que llega de día y termina con otro que se aleja de noche. Los movimientos de cámara son lineales, como los reales, combinados con primeros planos y cambios de foco lentos. Analicé la música con mi propia herramienta de edición basada en el ritmo (129,6 BPM) y centré cada fundido en un golpe, para que el montaje caiga sobre la música: 50 segundos a 1920 x 1080.'),
        h2('En cifras'),
        li(['22 renders finales'], ' a 1920 x 1080, cerca de una hora y media en total en la GPU de un portátil.'),
        li(['3 escenas de luz'], ' que comparten la misma casa: día, hora dorada y anochecer.'),
        li(['11 supuestos escritos'], ', revisados antes de construir nada.'),
        li(['4 pinturas de dominio público'], ' del Art Institute of Chicago en las paredes.'),
      ],
    },
    gallery: gallery([goldenTele, duskElevation, duskTerrace, bedroom2, foyer, patio]),
  });
}
