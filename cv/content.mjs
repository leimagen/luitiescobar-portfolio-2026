// CV content in English and Spanish. Kept apart from the site data because the CV carries more
// detail (bullets per role, phone number). No em dashes anywhere (house style).
// Build: node cv/build.mjs  →  cv/out/*.pdf

export const contact = {
  name: 'Luiti Escobar',
  phone: '',
  email: 'info@luitiescobar.com',
  web: 'luitiescobar.com',
  linkedin: 'linkedin.com/in/lesco',
  behance: 'behance.net/luiti2d',
};

export const cv = {
  en: {
    lang: 'en',
    title: 'Multidisciplinary Designer',
    disciplines: ['Graphic Design', 'Motion Design', 'AI Media', '3D'],
    location: 'Valencia, Spain',
    availability: 'Available for on-site and hybrid roles. Open to remote.',
    labels: {
      profile: 'Profile',
      experience: 'Experience',
      earlier: 'Earlier experience',
      skills: 'Skills',
      tools: 'Tools',
      training: 'Training',
      languages: 'Languages',
      portfolio: 'Portfolio',
      present: 'Present',
      page: 'Page',
    },
    summary: [
      'Multidisciplinary designer with over 15 years of experience in digital design, art direction, motion design and brand-driven visual systems, working for agencies, broadcasters and global brands such as Samsung, Marvel, Xbox, Disney and PlayStation.',
      'Strong in high-volume, multi-format production for product launches and regional campaigns across 20+ markets, always within strict brand guidelines. Today I also direct AI-generated video and imagery and build 3D work, bringing both strategic thinking and hands-on execution.',
    ],
    skills: [
      ['Graphic design', 'Digital advertising, branding and visual identity, key visuals, social media content, web and UI design, typography and layout.'],
      ['Motion design', '2D and 2.5D animation, motion graphics, broadcast design (IDs, bumpers, lower thirds, packaging), logo animation and video editing.'],
      ['AI media', 'AI video and image direction: character and element sheets, prompting, multi-shot generation and editing into finished pieces.'],
      ['3D', 'Modelling, materials, lighting and rendering in Blender for products, devices and design projects.'],
      ['Production', 'Campaign localization and versioning, multi-format adaptation, brand guidelines, high-volume delivery and quality control.'],
    ],
    jobs: [
      {
        company: 'Cheil Worldwide (Samsung)', role: 'Senior Digital Designer', place: 'Panama · Remote', start: '2021-11', end: '2026-01',
        bullets: [
          'Designed and produced digital advertising for Samsung Latin America and the Caribbean, delivering assets for more than 20 markets.',
          'Created social media content, banners, key visuals and animated assets for product launches, seasonal activations and regional campaigns, aligned with Samsung brand guidelines.',
          'Adapted, localized and versioned campaigns across formats, languages and specifications, keeping visual consistency and quality control on weekly deadlines.',
        ],
      },
      {
        company: 'Tomorrow Digital (El Joint)', role: 'Senior Motion Designer · Art Director', place: 'Panama', start: '2019-02', end: '2021-03',
        bullets: [
          'Led art direction and motion design for agency clients such as Digicel: brand campaigns, social animation and digital advertising for Central American and Caribbean markets.',
          'Gave creative direction to junior designers and kept campaigns consistent across platforms, audiences and goals.',
        ],
      },
      {
        company: 'Corporación Medcom · Oye TV', role: 'Senior Motion Designer · Art Director', place: 'Panama', start: '2016-11', end: '2017-11',
        bullets: [
          'Designed and animated the full broadcast identity of Oye, the new TV channel from Medcom Group: channel IDs, bumpers, lower thirds and on-air packages.',
          'Defined the on-screen visual and motion guidelines used from launch, together with an Argentine production company.',
        ],
      },
      {
        company: 'Canal NEX', role: 'Senior Motion Designer', place: 'Panama', start: '2015-08', end: '2016-11',
        bullets: [
          'Produced motion graphics, promo IDs, show titles and program packaging for the channel and its original programming.',
        ],
      },
      {
        company: 'ModOp (formerly Creative Asylum)', role: 'Flash Developer · Motion Designer', place: 'Panama · Los Angeles', start: '2011-11', end: '2014-10',
        bullets: [
          'Built interactive web experiences, Flash apps and mini-games (ActionScript 3.0) and animated campaigns for Marvel, Xbox, Disney, Hallmark and PlayStation.',
          'Promoted from Flash Animator to Flash Developer.',
        ],
      },
    ],
    earlier: [
      { company: 'AG Video Panamá', role: 'Motion Designer · Senior Graphic Designer', start: '2009-10', end: '2011-11' },
      { company: 'Avantpix Panamá', role: 'Junior Digital Graphic Designer', start: '2007-09', end: '2009-05' },
      { company: 'Estudio Digital Grupo Creativo EDGC', role: 'Junior Motion Designer · Junior Web Designer', start: '2005-02', end: '2007-08' },
    ],
    tools: ['Adobe Illustrator', 'Photoshop', 'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Blender', 'Adobe Firefly', 'Kling AI', 'Seedance (Dreamina)', 'ComfyUI', 'ChatGPT', 'Claude Code', 'Claude Design'],
    selftaught: 'Self-taught, learning continuously through agency work, real projects and specialized online training.',
    training: [
      ['Desarrollo con IA: El nuevo programador (AI-assisted development)', 'Brais Moure · Big School'],
      ['EF SET English Certificate', '74/100 · C2 Proficient (2021)'],
      ['Adobe After Effects Intermediate Training', ''],
      ['ActionScript 3.0 Online Training', ''],
      ['Motion design, 3D animation, Blender and DaVinci Resolve', 'Ongoing'],
    ],
    languages: [['Spanish', 'Native'], ['English', 'C2 Proficient']],
    portfolioNote: 'Case studies, motion reel and AI media work',
  },

  es: {
    lang: 'es',
    title: 'Diseñador multidisciplinario',
    disciplines: ['Diseño Gráfico', 'Motion Design', 'AI Media', '3D'],
    location: 'Valencia, España',
    availability: 'Disponible para posiciones presenciales e híbridas. Abierto a remoto.',
    labels: {
      profile: 'Perfil',
      experience: 'Experiencia',
      earlier: 'Experiencia anterior',
      skills: 'Habilidades',
      tools: 'Herramientas',
      training: 'Formación',
      languages: 'Idiomas',
      portfolio: 'Portafolio',
      present: 'Actualidad',
      page: 'Página',
    },
    summary: [
      'Diseñador multidisciplinario con más de 15 años de experiencia en diseño digital, dirección de arte, motion design y sistemas visuales de marca, para agencias, canales de televisión y marcas globales como Samsung, Marvel, Xbox, Disney y PlayStation.',
      'Especializado en producción multiformato a gran escala para lanzamientos y campañas regionales en más de 20 mercados, siempre dentro de guías de marca estrictas. Hoy también dirijo video e imagen generados con IA y desarrollo trabajo 3D, aportando tanto el pensamiento estratégico como la ejecución.',
    ],
    skills: [
      ['Diseño gráfico', 'Publicidad digital, branding e identidad visual, key visuals, contenido para redes, diseño web y de UI, tipografía y maquetación.'],
      ['Motion design', 'Animación 2D y 2.5D, motion graphics, diseño de broadcast (IDs, bumpers, lower thirds, packaging), animación de logos y edición de video.'],
      ['AI media', 'Dirección de video e imagen con IA: character sheets y hojas de elementos, prompting, generación multitoma y edición hasta la pieza final.'],
      ['3D', 'Modelado, materiales, iluminación y render en Blender para productos, dispositivos y proyectos de diseño.'],
      ['Producción', 'Localización y versionado de campañas, adaptación multiformato, guías de marca, entregas de alto volumen y control de calidad.'],
    ],
    jobs: [
      {
        company: 'Cheil Worldwide (Samsung)', role: 'Diseñador Digital Senior', place: 'Panamá · Remoto', start: '2021-11', end: '2026-01',
        bullets: [
          'Diseño y producción de publicidad digital para Samsung Latinoamérica y el Caribe, con entregas para más de 20 mercados.',
          'Contenido para redes, banners, key visuals y piezas animadas para lanzamientos de producto, activaciones estacionales y campañas regionales, alineados con las guías de marca de Samsung.',
          'Adaptación, localización y versionado de campañas en distintos formatos, idiomas y especificaciones, manteniendo la consistencia visual y el control de calidad con entregas semanales.',
        ],
      },
      {
        company: 'Tomorrow Digital (El Joint)', role: 'Diseñador de Movimiento Senior · Director de Arte', place: 'Panamá', start: '2019-02', end: '2021-03',
        bullets: [
          'Dirección de arte y motion design para clientes de agencia como Digicel: campañas de marca, animación para redes y publicidad digital para Centroamérica y el Caribe.',
          'Dirección creativa de diseñadores junior y coherencia de campañas entre plataformas, audiencias y objetivos.',
        ],
      },
      {
        company: 'Corporación Medcom · Oye TV', role: 'Diseñador de Movimiento Senior · Director de Arte', place: 'Panamá', start: '2016-11', end: '2017-11',
        bullets: [
          'Diseño y animación de la identidad de broadcast completa de Oye, el nuevo canal de Medcom Group: IDs, bumpers, lower thirds y paquetes gráficos.',
          'Definición de las guías visuales y de movimiento usadas desde el lanzamiento, junto a una productora argentina.',
        ],
      },
      {
        company: 'Canal NEX', role: 'Diseñador de Movimiento Senior', place: 'Panamá', start: '2015-08', end: '2016-11',
        bullets: [
          'Motion graphics, promo IDs, títulos de programas y packaging para el canal y su programación original.',
        ],
      },
      {
        company: 'ModOp (antes Creative Asylum)', role: 'Flash Developer · Diseñador de Movimiento', place: 'Panamá · Los Ángeles', start: '2011-11', end: '2014-10',
        bullets: [
          'Experiencias web interactivas, aplicaciones y minijuegos Flash (ActionScript 3.0) y campañas animadas para Marvel, Xbox, Disney, Hallmark y PlayStation.',
          'Promovido de Flash Animator a Flash Developer.',
        ],
      },
    ],
    earlier: [
      { company: 'AG Video Panamá', role: 'Diseñador de Movimiento · Diseñador Gráfico Senior', start: '2009-10', end: '2011-11' },
      { company: 'Avantpix Panamá', role: 'Diseñador Gráfico Digital Junior', start: '2007-09', end: '2009-05' },
      { company: 'Estudio Digital Grupo Creativo EDGC', role: 'Diseñador de Movimiento Junior · Web Designer Junior', start: '2005-02', end: '2007-08' },
    ],
    tools: ['Adobe Illustrator', 'Photoshop', 'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Blender', 'Adobe Firefly', 'Kling AI', 'Seedance (Dreamina)', 'ComfyUI', 'ChatGPT', 'Claude Code', 'Claude Design'],
    selftaught: 'Autodidacta, con aprendizaje continuo a través de agencias, proyectos reales y formación especializada online.',
    training: [
      ['Desarrollo con IA: El nuevo programador', 'Brais Moure · Big School'],
      ['EF SET English Certificate', '74/100 · C2 Proficient (2021)'],
      ['Adobe After Effects Intermediate Training', ''],
      ['ActionScript 3.0 Online Training', ''],
      ['Motion design, animación 3D, Blender y DaVinci Resolve', 'Formación continua'],
    ],
    languages: [['Castellano', 'Nativo'], ['Inglés', 'C2 Proficient']],
    portfolioNote: 'Casos de estudio, reel de motion y trabajos de AI media',
  },
};
