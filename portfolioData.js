/**
 * portfolioData.js - Portfolio Content Data (FIXED)
 *
 * PURPOSE: Centralized data structure for all portfolio content
 * FIXES: Proper JavaScript syntax, consistent data structure, error handling
 */

// FIXED: Wrapped in try-catch for error handling
try {
  const portfolioData = {
    projects: {
      soundInstallations: [
        {
          id: "rain-reminders",
          title: "Rain Reminders",
          description:
            "A kinetic sound installation featuring a 1.8-meter-tall rotating rain stick mounted on a vertical wooden and steel structure.",
          fullDescription:
            "The piece explores the contrast between organic acoustic textures and industrial mechanical aesthetics, meditative distraction, and tinnitus awareness. It incorporates motorized rotation, subtle sound generation, and a tactile physical presence.",
          medium:
            "Physical sound sculpture, motorized kinetic installation, acoustic rain stick, wood and steel, electronics (motors)",
          category: "PHYSICAL SCULPTURE",
          color: "saffron",
          dimensions: "1.8m (height) × 0.5m (diameter)",
          technical: "Motorized rotation system, custom electronics, organic acoustic elements",
          themes: "Meditative sound, industrial aesthetics, tinnitus awareness",
          audioFile: null,
          images: [],
        },
        {
          id: "asymmetrica-audio-collection",
          title: "Asymmetrica – Experimental Audio Works",
          description:
            "A personal archive of sonic experiments exploring digital anxiety, temporal displacement, and meditative machinery.",
          fullDescription:
            "Asymmetrica is my ongoing solo project rooted in experimental audio, where I explore the unstable edge between organic resonance and synthetic control. These compositions are part of my sonic research practice—an evolving collection of sketches, studies, and resolved pieces. Using a mix of field recordings, generative synthesis, and digital manipulation, I craft sounds that navigate disorientation, tension, and glitch-as-texture. Some tracks are slow-burning and ambient, others are rhythm-driven or noise-laced. They're all part of a larger investigation into how machines dream, how systems crack, and how perception gets restructured through sound.",
          medium: "Digital audio, experimental electronics, sound design",
          category: "AUDIO COLLECTION",
          color: "electric-lime",
          themes: [
            "Digital processing",
            "Temporal manipulation",
            "Organic-synthetic synthesis",
            "Machine improvisation",
            "Glitch and failure as aesthetic"
          ],
          technology: [
            "Digital Audio Workstation",
            "Granular and modular synthesis",
            "Field recording",
            "Max/MSP",
            "TouchDesigner (audio-reactive systems)"
          ],
          bandcampTracks: [
            {
              title: "stranded deep but fast",
              trackId: "2743015108",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep-but-fast"
            },
            {
              title: "stranded deep",
              trackId: "2338898025",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep"
            },
            {
              title: "tiptoe",
              trackId: "1726285270",
              url: "https://asymmetrica.bandcamp.com/track/tiptoe"
            },
            {
              title: "supersounds",
              trackId: "960218379",
              url: "https://asymmetrica.bandcamp.com/track/supersounds"
            },
            {
              title: "stretching",
              trackId: "2000021307",
              url: "https://asymmetrica.bandcamp.com/track/stretching"
            },
            {
              title: "the machine",
              trackId: "73420518",
              url: "https://asymmetrica.bandcamp.com/track/the-machine"
            },
            {
              title: "not as i remember it",
              trackId: "750668778",
              url: "https://asymmetrica.bandcamp.com/track/not-as-i-remember-it"
            },
            {
              title: "automaton",
              trackId: "3985467816",
              url: "https://asymmetrica.bandcamp.com/track/automaton"
            }
          ]
        }

      ],

      performance: [
        {
          id: "fever-dream",
          title: "Fever Dream",
          description:
            "An audio-reactive poetic installation that externalizes fears and subconscious anxieties, blending glitch electronics with spoken word fragments.",
          fullDescription:
            "It interrogates the abstraction of problem-solving and emotional complexity through sound and text, creating an immersive environment for digital anxiety exploration.",
          medium: "Sound art, interactive audio installation, poetry, glitch electronics",
          category: "INTERACTIVE AUDIO",
          color: "neon-magenta",
          themes: "Subconscious processing, emotional complexity, digital anxiety, glitch aesthetics",
          technology: "Real-time audio processing, responsive text generation, ambient computing",
          audioFile: null,
          images: [],
        },
        {
          id: "live-av-performances",
          title: "Live AudioVisual Performances",
          description:
            "Real-time manipulation of sound and visuals through gestural interfaces, exploring the liminal space between performer and machine.",
          fullDescription:
            "These performances investigate the relationship between human gesture and computational response, using custom interfaces to create immersive audiovisual experiences that blur the boundaries between performer and audience.",
          medium: "TouchDesigner, gesture control, live electronics",
          category: "TOUCHDESIGNER • GESTURE CONTROL",
          color: "cerulean",
          documentation: "Video archives and recordings coming soon",
          videos: [],
        },
        {
          id: "coding-computing-as-a-ritual",
          title: "Ritual Computing and Coding Sessions",
          description:
            "Collaborative experiences where audience and performer co-create digital mantras through shared interfaces and collective sound-making.",
          fullDescription:
            "These sessions explore the potential for technology to facilitate collective ritual experiences, using shared interfaces and responsive systems to create communal digital ceremonies.",
          medium: "Participatory performance, experimental interfaces",
          category: "PARTICIPATORY • EXPERIMENTAL",
          color: "electric-lime",
          documentation: "Live performance documentation",
          videos: [],
        },
      ],

      generativeAV: [
        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation",
          description:
            "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription:
            "Symmetrical Fictions is a video installation and research project that challenges the boundaries between rationality and ction, technology and unconscious structure, by recomposing satellite imagery into speculative, symmetrical geographies. Drawing from satellite datasets (such as NASA's Earth Imagery), the installation mirrors and tiles planetary surfaces — including deserts, glaciers, post-industrial ruins, and human settlements — creating impossible yet eerily coherent landscapes. These “symmetrical ctions” form a visual language that gestures beyond the real, exploring an epistemology situated between perception, memory, and planetary imagination. Using this visual language, the installation invites viewers into a spatial-temporal collapse, exploring what it means to desire order in an entropic world, exploring how the unconscious mind transcends binary and linear reasoning, seeking instead a non-linear approach to understanding reality. This project does not seek control over matter, and instead, aims to transmute data into poetic experience. Rather than simply extracting or observing, the work repurposes technologies of surveillance and observation to propose new cartographies of planetary subjectivity. These are not maps for navigation, but spaces for dwelling — visualizations of symmetry not as perfection, but as excess and more-than-rational order. By blurring the lines between ction and matter, narrative and geometry, image and epistemology, Symmetrical Fictions contributes to debates on interdisciplinary practices, epistemic diversity, and the limits of positivist knowledge systems. The project argues that all technologies — no matter how advanced — carry poetic residues and unconscious architectures. The symmetrical images created here are not merely aesthetic ends but tools for reecting on and feeling through our planetary condition. They suggest that the visual, much like the unconscious, is not governed solely by reason but by associative intensities and formal impossibilities. This installation also reimagines the relationship between human structures and the natural world through the lens of the alchemist archetype. In a similar way that alchemy sought to transform base materials into something greater, the project repurposes planetary data, traditionally used for control or extraction, into speculative visual compositions. By reassembling the chaotic, fragmented textures of our planet into symmetrical, imagined landscapes, the installation challenges conventional understandings of space, order, and nature, proposing new ways of engaging with the planet. The project also addresses the mystication of digital systems by reclaiming visual data to present speculative environments that shift our understanding of place. By using natural and human-made terrains, it reimagines landscapes as speculative environments, at once familiar and otherworldly. These landscapes emerge from the entropy of the Anthropocene — a geological epoch marked by human impact and ecological fragmentation. The installation points at the tension between nature and human infrastructure, using digital tools typically reserved for control and surveillance to explore new forms of visual expression and spatial organization. The symmetrical landscapes created through this process invite reection on the human desire for coherence in a fragmented world. Ultimately, these images, and the installation as a whole, act as a form of aesthetic resistance to techno-positivist knowledge systems. It uses symmetric ction as a methodology, merging unconscious structure, planetary data, and speculative art to encourage post-rational transmutation. The installation oers a speculative vision of balance and coherence in a world marked by instability and entropy, suggesting that, even in the face of overwhelming complexity, there may be a way to reclaim and reorganize our fragmented world.",
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          category: "INSTALLATION & RESEARCH",
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          publications: [],
        },

        {
          id: "galaxy-simulation",
          title: "Galaxy Simulation",
          description:
            "Procedural generation of cosmic structures translated into immersive soundscapes and visual environments.",
          fullDescription:
            "Using algorithmic approaches to simulate galactic formation while creating corresponding audio-visual experiences that mirror the complexity and beauty of cosmic evolution.",
          medium: "Algorithmic composition, procedural generation, space simulation",
          category: "ALGORITHMIC COMPOSITION",
          color: "electric-lime",
          urls: {
            demo: null,
            github: null,
          },
        },
        {
          id: "audiodevout-channel",
          title: "audiodevout – TouchDesigner + Sound Art Tutorials",
          description:
            "My experimental channel for audiovisual art, TouchDesigner tutorials, and generative sound installations.",
          fullDescription:
            "audiodevout is where I document and share my creative explorations at the intersection of code, visuals, and sound. I use this channel to break down complex TouchDesigner workflows into accessible tutorials, often with a glitchy, meditative, or rhythmically reactive aesthetic. The videos range from real-time generative visualizers and particle simulations to noise-based sculpting techniques and musical automation. Alongside YouTube, I run a Patreon where I release exclusive .tox files, project breakdowns, and custom components for TouchDesigner enthusiasts. This channel is both a learning resource and a digital sketchbook where I explore themes of signal, noise, entropy, and digital poetics.",
          medium: "TouchDesigner, real-time generative visuals, sound-reactive systems",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          color: "cerulean",
          urls: {
            youtube: "https://www.youtube.com/@audiodevout",
            patreon: "https://www.patreon.com/audiodevout"
          }
        }

      ],

      interactive: [
        {
          id: "gesture-detection",
          title: "Gesture Detection Interface",
          description:
            "Real-time hand tracking system for controlling digital audio and visual parameters through physical movement.",
          fullDescription:
            "Using computer vision and machine learning to create intuitive gestural interfaces that bridge physical expression with digital sound manipulation.",
          medium: "Computer vision, real-time audio processing, gesture recognition",
          category: "INTERFACE DESIGN",
          color: "electric-lime",
          technical: "MediaPipe, real-time audio synthesis, Python, Max/MSP integration",
          images: [],
        },
        {
          id: "ambient-computing",
          title: "Ambient Computing Experiments",
          description:
            "Exploring subtle, pervasive computing environments that respond to presence and environmental conditions.",
          fullDescription:
            "Developing systems that exist at the periphery of attention, creating ambient soundscapes and visual responses based on environmental data and human presence.",
          medium: "Environmental sensors, ambient audio, responsive computing",
          category: "ENVIRONMENTAL COMPUTING",
          color: "saffron",
          technical: "Arduino, environmental sensors, ambient sound processing",
          images: [],
        },
      ],

      drawings: [
        {
          id: "digital-sketches",
          title: "Digital Sketches + Visual Explorations",
          description:
            "A collection of digital drawings exploring geometric patterns, urban textures, and algorithmic aesthetics.",
          fullDescription:
            "These sketches serve as visual research for larger projects, exploring the intersection of traditional South Asian geometric patterns with contemporary digital aesthetics. They range from quick gestural studies to more developed compositions that inform installation and performance work.",
          medium: "Digital drawing, algorithmic pattern generation, mixed media",
          category: "VISUAL RESEARCH",
          color: "saffron",
          themes: "Geometric abstraction, urban textures, cultural pattern synthesis",
          tools: "TouchDesigner, generative algorithms",
          images: [
            "/assets/image/sketch1.jpg",
            "/assets/image/sketch2.png",
            "/assets/image/sketch3.png"
          ],
        },
      ],

      writing: [
        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation",
          description:
            "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription:
            "Symmetrical Fictions is a video installation and research project that challenges the boundaries between rationality and ction, technology and unconscious structure, by recomposing satellite imagery into speculative, symmetrical geographies. Drawing from satellite datasets (such as NASA's Earth Imagery), the installation mirrors and tiles planetary surfaces — including deserts, glaciers, post-industrial ruins, and human settlements — creating impossible yet eerily coherent landscapes. These “symmetrical ctions” form a visual language that gestures beyond the real, exploring an epistemology situated between perception, memory, and planetary imagination. Using this visual language, the installation invites viewers into a spatial-temporal collapse, exploring what it means to desire order in an entropic world, exploring how the unconscious mind transcends binary and linear reasoning, seeking instead a non-linear approach to understanding reality. This project does not seek control over matter, and instead, aims to transmute data into poetic experience. Rather than simply extracting or observing, the work repurposes technologies of surveillance and observation to propose new cartographies of planetary subjectivity. These are not maps for navigation, but spaces for dwelling — visualizations of symmetry not as perfection, but as excess and more-than-rational order. By blurring the lines between ction and matter, narrative and geometry, image and epistemology, Symmetrical Fictions contributes to debates on interdisciplinary practices, epistemic diversity, and the limits of positivist knowledge systems. The project argues that all technologies — no matter how advanced — carry poetic residues and unconscious architectures. The symmetrical images created here are not merely aesthetic ends but tools for reecting on and feeling through our planetary condition. They suggest that the visual, much like the unconscious, is not governed solely by reason but by associative intensities and formal impossibilities. This installation also reimagines the relationship between human structures and the natural world through the lens of the alchemist archetype. In a similar way that alchemy sought to transform base materials into something greater, the project repurposes planetary data, traditionally used for control or extraction, into speculative visual compositions. By reassembling the chaotic, fragmented textures of our planet into symmetrical, imagined landscapes, the installation challenges conventional understandings of space, order, and nature, proposing new ways of engaging with the planet. The project also addresses the mystication of digital systems by reclaiming visual data to present speculative environments that shift our understanding of place. By using natural and human-made terrains, it reimagines landscapes as speculative environments, at once familiar and otherworldly. These landscapes emerge from the entropy of the Anthropocene — a geological epoch marked by human impact and ecological fragmentation. The installation points at the tension between nature and human infrastructure, using digital tools typically reserved for control and surveillance to explore new forms of visual expression and spatial organization. The symmetrical landscapes created through this process invite reection on the human desire for coherence in a fragmented world. Ultimately, these images, and the installation as a whole, act as a form of aesthetic resistance to techno-positivist knowledge systems. It uses symmetric ction as a methodology, merging unconscious structure, planetary data, and speculative art to encourage post-rational transmutation. The installation oers a speculative vision of balance and coherence in a world marked by instability and entropy, suggesting that, even in the face of overwhelming complexity, there may be a way to reclaim and reorganize our fragmented world.",
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          category: "INSTALLATION & RESEARCH",
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          publications: [],
        },

        ],
    },

    contact: {
      social: [
        {
          name: "YouTube",
          url: "https://www.youtube.com/@audiodevout",
          icon: "youtube",
          color: "cerulean",
        },
        {
          name: "Instagram (Personal)",
          url: "https://www.instagram.com/asymmetrica_/",
          icon: "instagram",
          color: "neon-magenta",
        },
        {
          name: "Instagram (Art)",
          url: "https://www.instagram.com/audiodevout/",
          icon: "instagram",
          color: "electric-lime",
        },
        {
          name: "Bandcamp",
          url: "https://asymmetrica.bandcamp.com/",
          icon: "bandcamp",
          color: "saffron",
        },
        {
          name: "Patreon",
          url: "https://www.patreon.com/audiodevout",
          icon: "patreon",
          color: "electric-lime",
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/atharva--gupta/",
          icon: "linkedin",
          color: "cerulean",
        },
      ],
      description: "Connect for collaborations, commissions, or critical discourse.",
    },

    // FIXED: Added page content structure
    pageContent: {
      home: {
        title: "Experimental Systems",
        subtitle: "by Atharva Gupta",
        description:
          "Exploring the intersection of technology, sound, and space through installation, performance, and research.",
      },
    },
  }

  // FIXED: Make data available globally with error handling
  if (typeof window !== "undefined") {
    window.portfolioData = portfolioData
    console.log("Portfolio data loaded successfully")
  }
} catch (error) {
  console.error("Error loading portfolio data:", error)
  // FIXED: Provide fallback data
  if (typeof window !== "undefined") {
    window.portfolioData = {
      projects: {
        soundInstallations: [],
        performance: [],
        generativeAV: [],
        interactive: [],
        drawings: [],
        writing: [],
      },
      contact: {
        social: [],
        description: "Portfolio data failed to load. Please refresh the page.",
      },
      pageContent: {
        home: {
          title: "Experimental Systems",
          subtitle: "Loading Error",
          description: "Please refresh the page.",
        },
      },
    }
  }
}
