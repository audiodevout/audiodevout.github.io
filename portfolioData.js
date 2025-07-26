/**
 * portfolioData.js - Portfolio Content Data (FIXED)
 *
 * PURPOSE: Centralized data structure for all portfolio content
 * FIXES: Fixed media paths for GitHub Pages compatibility, added fallback handling
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
          category: "KINETIC SCULPTURE • NOISE • ARDUINO",
          color: "saffron",
          dimensions: "1.6m (height)",
          technical: "Motorized rotation system, custom electronics, grains as acoustic elements",
          themes: "Meditative Sound, Industrial Aesthetics and Dadaism, Tinnitus Awareness",
          // FIXED: Use relative paths that work with GitHub Pages
          audioFile: "./assets/audio/rain-reminders-sample.mp3",
          images: ["./assets/images/rain-reminders-1.png", "./assets/images/rain-reminders-2.png"],
        },
        {
          id: "asymmetrica-audio-collection",
          title: "Asymmetrica – Experimental Audio Works",
          description:
            "A personal archive of sonic experiments exploring digital anxiety, temporal displacement, and meditative machinery.",
          fullDescription:
            "Asymmetrica is my ongoing solo project rooted in experimental audio, where I explore the unstable edge between organic resonance and synthetic control. These compositions are part of my sonic research practice—an evolving collection of sketches, studies, and resolved pieces. Using a mix of field recordings, generative synthesis, and digital manipulation, I craft sounds that navigate disorientation, tension, and glitch-as-texture.",
          medium: "Digital audio, experimental electronics, sound design",
          category: "AUDIO COLLECTION",
          color: "electric-lime",
          themes:
            "Digital processing, temporal manipulation, organic-synthetic synthesis, machine improvisation, glitch and failure as aesthetic",
          technology:
            "Digital Audio Workstation, granular and modular synthesis, field recording, Max/MSP, TouchDesigner",
          bandcampTracks: [
            {
              title: "stranded deep but fast",
              trackId: "2743015108",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep-but-fast",
            },
            {
              title: "stranded deep",
              trackId: "2338898025",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep",
            },
            {
              title: "tiptoe",
              trackId: "1726285270",
              url: "https://asymmetrica.bandcamp.com/track/tiptoe",
            },
            {
              title: "supersounds",
              trackId: "960218379",
              url: "https://asymmetrica.bandcamp.com/track/supersounds",
            },
            {
              title: "stretching",
              trackId: "2000021307",
              url: "https://asymmetrica.bandcamp.com/track/stretching",
            },
            {
              title: "the machine",
              trackId: "73420518",
              url: "https://asymmetrica.bandcamp.com/track/the-machine",
            },
            {
              title: "not as i remember it",
              trackId: "750668778",
              url: "https://asymmetrica.bandcamp.com/track/not-as-i-remember-it",
            },
            {
              title: "automaton",
              trackId: "3985467816",
              url: "https://asymmetrica.bandcamp.com/track/automaton",
            },
          ],
        },
      ],

      performance: [
        {
          id: "gesture-performance-system",
          title: "Gesture-Controlled Performance System",
          description:
            "A real-time audiovisual performance system that uses body gestures to generate sound, visuals, and stage presence simultaneously. Debuted at the Fever Dream event.",
          fullDescription:
            "This is an ongoing system developed using MediaPipe and TouchDesigner to enable live performance through gesture alone. The body becomes the instrument—controlling generative sound, reactive visuals, and performative movement in synchrony. The system first debuted at the *Fever Dream* event, a poetic installation exploring digital anxiety through glitch electronics and spoken word. Since then, it has evolved into a modular tool for expressive live A/V performances, blurring boundaries between code, movement, and emotion. It is equal parts tool, artwork, and ritual.",
          medium: "Gesture interfaces, TouchDesigner, live sound and visual generation, poetic systems",
          category: "GESTURE CONTROL • LIVE A/V • SYSTEM DESIGN",
          color: "cerulean",
          themes: "Human-computer interaction, glitch aesthetics, subconscious processing, embodied computation",
          technology: "MediaPipe, TouchDesigner, real-time audio and visual synthesis",
          videos: [
            
            "./assets/videos/live-av-performance-1.mp4",
            "./assets/videos/live-av-performance-2.mp4"
          ],
          images: ["./assets/images/fever-dream-performance.jpg","./assets/images/fever-dream-poster.jpg"]
        },
        
      ],

      // REPLACE the existing generativeAV and interactive arrays with:
      installations: [
        // Move all projects from generativeAV array here and add tags
        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation",
          description: "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription: "Symmetrical Fictions is a video installation and research project that challenges the boundaries between rationality and fiction, technology and unconscious structure, by recomposing satellite imagery into speculative, symmetrical geographies. Drawing from satellite datasets, the installation mirrors and tiles planetary surfaces creating impossible yet eerily coherent landscapes.",
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          category: "INSTALLATION & RESEARCH",
          tags: ["generative", "video", "research"], // ADD TAGS
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          // videos: ["./assets/videos/symmetrical-fictions-excerpt.mp4"],
          images: ["./assets/images/39.jpg", "./assets/images/72.jpg", "./assets/images/73.jpg", "./assets/images/6.jpg"],
          urls: {
            pdf: "./assets/documents/symmetrical-fictions-paper.pdf",
          },
        },
        {
          id: "ritual-computing-solo-sessions",
          title: "Ritual Computing and Coding Sessions",
          description: "Solo sessions of meditative coding and sketching in TouchDesigner—private rituals of thought, structure, and experimentation.",
          fullDescription: "These sessions are personal, introspective rituals where code becomes a tool for artistic inquiry and self-reflection. They are not participatory performances but private explorations—into the aesthetics of computation, the poetics of systems, and the possibilities of AI as a creative collaborator. Through repeated practice, I engage with code as both medium and method, researching form, structure, and the intersection of technology with artistic process.",
          medium: "Code sketching, procedural visuals, AI collaboration",
          category: "SOLO • RESEARCH-BASED",
          tags: ["generative", "code", "research"], // ADD TAGS
          color: "electric-lime",
          documentation: "In-progress sketches and logs",
          images: ["./assets/images/ritual-computing-1.png", "./assets/images/ritual-computing-2.png", "./assets/images/ritual-computing-3.jpg"],
        },
        {
          id: "audiodevout-channel",
          title: "audiodevout – TouchDesigner + Sound Art Tutorials",
          description: "My experimental channel for audiovisual art, TouchDesigner tutorials, and generative sound installations.",
          fullDescription: "audiodevout is where I document and share my creative explorations at the intersection of code, visuals, and sound. I use this channel to break down complex TouchDesigner workflows into accessible tutorials, often with a glitchy, meditative, or rhythmically reactive aesthetic.",
          medium: "TouchDesigner, real-time generative visuals, sound-reactive systems",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["generative", "tutorial", "sound"], // ADD TAGS
          color: "cerulean",
          urls: {
            youtube: "https://www.youtube.com/@audiodevout",
            patreon: "https://www.patreon.com/audiodevout",
          },
          images: ["./assets/images/audiodevout-thumbnail-1.jpg", "./assets/images/audiodevout-thumbnail-2.jpg"],
        },
        // Move all projects from interactive array here and add tags
        {
          id: "gesture-detection",
          title: "Gesture Detection Interface",
          description: "Real-time hand tracking system for controlling digital audio and visual parameters through physical movement.",
          fullDescription: "Using computer vision and machine learning to create intuitive gestural interfaces that bridge physical expression with digital sound manipulation.",
          medium: "Computer vision, real-time audio processing, gesture recognition",
          category: "INTERFACE DESIGN",
          tags: ["interactive", "gesture", "interface"], // ADD TAGS
          color: "electric-lime",
          technical: "MediaPipe, real-time audio synthesis, Python, Max/MSP integration",
          videos: ["./assets/videos/gesture-detection-demo.mp4"],
          images: ["./assets/images/gesture-interface-setup.jpg"],
        },
        {
          id: "ambient-sound-production",
          title: "Ambient Sound Production Experiments",
          description: "Explorations in generative sound design shaped by presence, data, and environment.",
          fullDescription: "Working with sound as a subtle presence—designing systems that generate evolving audio textures in response to environmental inputs. These experiments are guided by a meditative, process-driven approach to coding and sonic composition.",
          medium: "Generative audio, environmental data, custom-built software/hardware systems",
          category: "SOUND SYSTEMS / ENVIRONMENTAL AUDIO",
          tags: ["generative", "responsive", "sensor-based", "atmospheric"],
          color: "saffron",
          technical: "Arduino, environmental sensors, real-time sound synthesis, custom DSP pipelines",
          // audioFile: "./assets/audio/ambient-sound-production-sample.mp3",
          // images: ["./assets/images/ambient-sound-1.jpg", "./assets/images/ambient-sound-2.jpg"],
        }

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
          // FIXED: Updated image paths
          images: [
            "./assets/images/sketch1.jpg",
            "./assets/images/sketch2.png",
            "./assets/images/sketch3.png"
          ],
        },
      ],

      writing: [
        {
          id: "symmetrical-fictions-paper",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation",
          description: "A research paper exploring the theoretical framework behind the video installation project.",
          fullDescription:
            "This abstract examines how symmetrical recomposition of satellite imagery can serve as a methodology for post-rational transmutation, challenging techno-positivist knowledge systems through speculative cartography and planetary imagination.",
          medium: "Academic paper, theoretical research",
          category: "RESEARCH & THEORY",
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          images: ["./assets/images/39.jpg", "./assets/images/72.jpg", "./assets/images/73.jpg", "./assets/images/6.jpg"],
          urls: {
            pdf: "./assets/documents/symmetrical-fictions-paper.pdf",
          },
        },
      ],
    },

     contact: {
      about: {
        title: "About",
        description: `I am an experimental artist and researcher working at the intersection of sound, technology, and space. 
        My practice explores how computational systems can become vehicles for meditative experience, cultural memory, and speculative futures.
        Through installations, performances, and research, I investigate the unstable boundaries between organic and synthetic, 
        rational and intuitive, individual and collective. My work often incorporates elements relating to entropy and noise, (a)symmetry, and healing through technology, reimagined through contemporary digital tools.
        Currently based between experimental sound activities, creative codingn and academic research contexts, I develop projects that challenge techno-positivist 
        narratives while creating space for contemplative engagement with technology.`,
        image: "./assets/images/atharva.jpeg",
        credentials: [
          "Experimental Sound Artist (Asymmetrica)",
          "Kinetic Sculptures",
          "AudioVisual Performances",
          "TouchDesigner Tutorials (AudioDevOut)"
        ]
      },
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
