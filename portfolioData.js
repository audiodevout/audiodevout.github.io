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
          videos: [
            "./assets/videos/rain-stick-video.mp4"
          ],
          // audioFile: "./assets/audio/rain-reminders-sample.mp3",
          images: ["./assets/images/rain-reminders-1.jpg"],
        },
        {
            id: "asymmetrica-stranded-deep",
            title: "Stranded Deep Series",
            description:
              "A paired exploration of displacement and rapid flux through digital soundscapes, merging organic resonance and synthetic textures.",
            fullDescription:
              "This pair—'stranded deep' and 'stranded deep but fast'—represents a sonic dive into temporal distortion and emotional flux. These compositions juxtapose slow meditative pulses with accelerated glitch rhythms, reflecting themes of isolation and rapid change.",
            medium: "Digital audio, generative synthesis",
            category: "ASYMMETRICA AUDIO COLLECTION",
            color: "neon-magenta",
            themes: "Temporal manipulation, glitch aesthetics, organic-synthetic synthesis",
            technology: "DAW, granular synthesis, digital manipulation",
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
            ],
          },

          {
            id: "asymmetrica-tiptoe",
            title: "Tiptoe",
            description:
              "A delicate balance of tension and subtle sonic shifts, tiptoeing between ambient textures and rhythmic pulses.",
            fullDescription:
              "Tiptoe navigates quiet spaces filled with fragile sound detail, exploring the interface between near silence and low-frequency movements. It’s an experiment in minimalism and patience.",
            medium: "Digital audio, ambient synthesis",
            category: "ASYMMETRICA AUDIO COLLECTION",
            color: "cerulean",
            themes: "Minimalism, ambient textures, tension and release",
            technology: "DAW, modular synth, field recording",
            bandcampTracks: [
              {
                title: "tiptoe",
                trackId: "1726285270",
                url: "https://asymmetrica.bandcamp.com/track/tiptoe",
              },
            ],
          },

          {
            id: "asymmetrica-supersounds",
            title: "Supersounds",
            description:
              "An experimental dive into layered synthetic timbres and expansive sound fields.",
            fullDescription:
              "Supersounds layers evolving textures and synthetic drones to create a complex soundscape that challenges perception and embraces machine improvisation.",
            medium: "Digital audio, experimental electronics",
            category: "ASYMMETRICA AUDIO COLLECTION",
            color: "electric-lime",
            themes: "Synthetic layering, machine improvisation, drone textures",
            technology: "DAW, Max/MSP, modular synth",
            bandcampTracks: [
              {
                title: "supersounds",
                trackId: "960218379",
                url: "https://asymmetrica.bandcamp.com/track/supersounds",
              },
            ],
          },

          {
            id: "asymmetrica-stretching",
            title: "Stretching",
            description:
              "A sonic exploration of elasticity and temporal extension within digital sound design.",
            fullDescription:
              "Stretching plays with time, slowing and elongating motifs to blur boundaries between moment and duration, creating a meditative auditory space.",
            medium: "Digital audio, time-stretching techniques",
            category: "ASYMMETRICA AUDIO COLLECTION",
            color: "saffron",
            themes: "Temporal extension, meditative soundscapes",
            technology: "DAW, granular synthesis, field recordings",
            bandcampTracks: [
              {
                title: "stretching",
                trackId: "2000021307",
                url: "https://asymmetrica.bandcamp.com/track/stretching",
              },
            ],
          },

          {
            id: "asymmetrica-the-machine",
            title: "The Machine",
            description:
              "An exploration of mechanized rhythms and synthetic textures embodying the essence of automated sound production.",
            fullDescription:
              "The Machine evokes industrial soundscapes with tight rhythmic patterns and digital noise, interrogating the relationship between human and machine in sound creation.",
            medium: "Digital audio, rhythm synthesis",
            category: "ASYMMETRICA AUDIO COLLECTION",
            color: "cerulean",
            themes: "Industrial aesthetics, mechanized rhythm, synthetic textures",
            technology: "DAW, Max/MSP, modular synthesis",
            bandcampTracks: [
              {
                title: "the machine",
                trackId: "73420518",
                url: "https://asymmetrica.bandcamp.com/track/the-machine",
              },
            ],
          },

          {
            id: "asymmetrica-not-as-i-remember-it",
            title: "Not As I Remember It",
            description:
              "A reflective piece examining memory through fragmented sound and abstract textures.",
            fullDescription:
              "Not As I Remember It distorts familiar motifs into abstract forms, questioning the reliability of recollection and the fluidity of sonic memory.",
            medium: "Digital audio, sound manipulation",
            category: "ASYMMETRICA AUDIO COLLECTION",
            color: "electric-lime",
            themes: "Memory, abstraction, sonic fragmentation",
            technology: "DAW, field recording, granular synthesis",
            bandcampTracks: [
              {
                title: "not as i remember it",
                trackId: "750668778",
                url: "https://asymmetrica.bandcamp.com/track/not-as-i-remember-it",
              },
            ],
          },

          {
            id: "asymmetrica-automaton",
            title: "Automaton",
            description:
              "An exploration of mechanical repetition and evolving digital patterns.",
            fullDescription:
              "Automaton features repetitive motifs and incremental variations that evoke mechanized processes and evolving synthetic life.",
            medium: "Digital audio, generative patterns",
            category: "ASYMMETRICA AUDIO COLLECTION",
            color: "neon-magenta",
            themes: "Repetition, mechanization, generative synthesis",
            technology: "DAW, modular synthesis, Max/MSP",
            bandcampTracks: [
              {
                title: "automaton",
                trackId: "3985467816",
                url: "https://asymmetrica.bandcamp.com/track/automaton",
              },
            ],
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

      performance: [
        {
          id: "gesture-performance-system",
          title: "Gesture-Controlled Performance System",
          description:
            "A modular gesture-driven audiovisual system where the body becomes the instrument—generating sound, visuals, and presence in real time.",
          fullDescription:
            "This ongoing system merges gesture detection, real-time sound design, and generative visuals into a single performance toolkit. Built with MediaPipe and TouchDesigner, it uses body movement to manipulate soundscapes and visuals simultaneously—blurring the lines between code, choreography, and live ritual. First presented at *Fever Dream*—a glitch-poetic installation exploring digital anxiety through spoken word and ambient sound production—the system has evolved into a modular, expressive platform for live A/V performance. The gestures control everything from glitchy textures and drone tones to cinematic pulses and dynamic projections, all shaped by an ambient, meditative coding process rooted in presence and flow. It is not just a tool, but a responsive ecosystem—sensorial, poetic, and embodied.",
          medium: "Gesture interfaces, real-time sound/visual generation, sensor-based interaction, ambient performance systems",
          category: "GESTURE INTERFACES • LIVE A/V • EMBODIED SYSTEMS",
          themes: "Embodied computation, glitch aesthetics, subconscious interaction, ambient sound design, poetic control systems",
          tags: "INTERACTIVE • GESTURE • AUDIOVISUAL • SENSORIAL • REAL-TIME",
          color: "cerulean",
          technical: "MediaPipe, TouchDesigner, Python, real-time audio synthesis, custom control pipelines",
          // videos: [
          //   "./assets/videos/live-av-performance-1.mp4",
          //   "./assets/videos/live-av-performance-2.mp4"
          // ],
          images: [
            "./assets/images/fever-dream-performance.jpg",
            "./assets/images/fever-dream-performance-1.jpg",
            "./assets/images/fever-dream-poster.jpg"
          ]
        }

        
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
        }

      ],

      drawings: [
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
          id: "audiodevout-noise-sculpting-part3",
          title: "Noise Sculpting in TouchDesigner – Part 3",
          description: "Continuing the series, exploring procedural noise sculpting techniques in TD.",
          fullDescription:
            "In this installment of audiodevout’s Noise Sculpting series, dive into advanced noise manipulation workflows in TouchDesigner to produce evolving textures and structures.",
          medium: "TouchDesigner, generative visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "noise sculpting", "tutorial", "generative art"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=Mu1TpRVujuY"]
        },
        {
          id: "audiodevout-particlesgpu-noise-sculpting",
          title: "Noise Sculpting in TouchDesigner with ParticlesGPU",
          description: "Leveraging ParticlesGPU for realtime noise‑driven particle visuals.",
          fullDescription:
            "In this tutorial, audiodevout combines the Noise Sculpting series with the ParticlesGPU TOP in TouchDesigner, building reactive, particle-based generative visuals.",
          medium: "TouchDesigner, particle systems",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["ParticlesGPU", "noise sculpting", "generative visuals", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=kcZH2zcHANc"]
        },
        {
          id: "audiodevout-noise-sculpting-part4",
          title: "Noise Sculpting in TouchDesigner – Part 4",
          description: "Further exploration of noisy geometry manipulation techniques.",
          fullDescription:
            "In Part 4, audiodevout continues to sculpt geometry with noise and compositing in TouchDesigner, refining structure and color interactions.",
          medium: "TouchDesigner, procedural geometry",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["noise sculpting", "geometry", "TouchDesigner", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=s8ea30HlTHE"]
        },
        {
          id: "audiodevout-instancing-to-midi",
          title: "Interactive Instrument – Instancing to MIDI in TouchDesigner",
          description: "Use RenderPick CHOP to extract instancing data and convert clicks into MIDI — click to play in TouchDesigner.",
          fullDescription: "In this tutorial, audiodevout demonstrates a special interactive project that uses TouchDesigner’s RenderPick CHOP to capture instancing data and translate it into MIDI notes, allowing clickable visual geometry to play sound. A clean, high‑performance demo of touch‑mapped MIDI instancing.",
          medium: "TouchDesigner, interactive generative visuals, MIDI integration",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "instancing", "RenderPick CHOP", "MIDI", "interactive", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=Qrtwn5XjDzk"]
        },


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
        {
            id: "prime-spiral-visualizer-tox",
            title: "Prime Spiral Visualizer (.tox download)",
            description: "TouchDesigner project file featuring a prime spiral visualizer, downloadable as a .tox file.",
            fullDescription: "Detailed TouchDesigner project file showcasing a prime spiral visualizer, available for experimentation and learning.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - All members",
            color: "electric-lime",
            urls: {
              Patreon: "https://www.patreon.com/posts/131907000"
            },            
          },
          {
            id: "quick-emboss-filter-tox",
            title: "FREE! Quick Emboss Filter - Project File and TOX",
            description: "Free downloadable TouchDesigner project file featuring a quick emboss filter effect.",
            fullDescription: "Beginner-friendly TouchDesigner project file demonstrating a quick emboss filter effect. Free download.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - All members",
            color: "cerulean",
            urls: {
              Patreon: "https://www.patreon.com/posts/131295324"
            },
          },
          {
            id: "simple-police-lights-bloom",
            title: "(Free!) Simple police lights with switches and bloom",
            description: "TouchDesigner project files showing simple police lights with switches and bloom effects.",
            fullDescription: "Includes files demonstrating police lights simulation with switches and bloom effects. Free for all members.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - All members",
            color: "electric-lime",
            urls: {
              Patreon: "https://www.patreon.com/posts/126001531"
            },
          },
          {
            id: "psychedelic-fractals-particlesgpu",
            title: "PROJECT FILES - Psychedelic Fractals with ParticlesGPU in TouchDesigner",
            description: "Paid project files demonstrating psychedelic fractals using ParticlesGPU in TouchDesigner.",
            fullDescription: "Advanced fractal generation techniques with ParticlesGPU inside TouchDesigner for immersive visuals.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/125860099"
            },
          },
          {
            id: "project-files-audioreactive-text",
            title: "Project Files - Audioreactive Text",
            description: "Paid project files for audioreactive text visualization in TouchDesigner.",
            fullDescription: "TouchDesigner files enabling generative audioreactive text visuals with customizable parameters.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/121479952"
            },
          },
          {
            id: "noise-sculpting-structural-variation",
            title: "Noise Sculpting - Structural Variation (Patreon Exclusive)",
            description: "Paid project files exploring structural variation in noise sculpting techniques.",
            fullDescription: "A deeper dive into noise sculpting with advanced structural variation techniques inside TouchDesigner.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/120456027"
            },
          },
          {
            id: "moving-lights-effect-tops",
            title: "Moving Lights Effect with TOPs (Project File)",
            description: "Paid project files for creating moving light effects with TouchDesigner TOPs.",
            fullDescription: "Files demonstrating dynamic moving lights using TOP operators in TouchDesigner for generative visuals.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/115405003"
            },
          },
          {
            id: "controlled-feedback-cache-tops",
            title: "Project Files - Controlled Feedback with Cache TOPs",
            description: "Paid project files illustrating controlled feedback loops with Cache TOPs in TouchDesigner.",
            fullDescription: "Detailed TouchDesigner projects focusing on feedback control using Cache TOPs for complex visual effects.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/113051861"
            },
          },
          {
            id: "replicator-limit-feedback",
            title: "(Project Files) Replicator-Limit-Feedback - Members Exclusive!!",
            description: "Paid TouchDesigner project files for replicator limit feedback techniques.",
            fullDescription: "Exclusive project files exploring replicator limit feedback methods for generative visuals.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/111659656"
            },
          },
          {
            id: "noise-sculpting-part-6-mesh-generator",
            title: "Project Files - Noise Sculpting Part 6 (Mesh Generator)",
            description: "Free project files for Noise Sculpting Part 6 featuring mesh generation.",
            fullDescription: "TouchDesigner files for mesh generation techniques as part of the Noise Sculpting series, free for all members.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - All members",
            color: "cerulean",
            urls: {
              Patreon: "https://www.patreon.com/posts/108481444"
            },
          },
          {
            id: "noise-sculpting-touchdesigner-particlesgpu-part5",
            title: "PROJECT FILES - Noise Sculpting in TouchDesigner with ParticleGPU - Part 5",
            description: "Paid project files for Noise Sculpting Part 5 using ParticleGPU TOP.",
            fullDescription: "Advanced TouchDesigner files demonstrating noise sculpting techniques combined with ParticleGPU processing.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/107686431"
            },
          },
          {
            id: "simple-grid-patterns-touchdesigner",
            title: "Simple Grid Patterns with Touchdesigner",
            description: "Paid project files showing simple grid patterns in TouchDesigner.",
            fullDescription: "Files demonstrating basic grid pattern creation and manipulation in TouchDesigner.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/106357613"
            },
          },
          {
            id: "particle-instancing-default-project",
            title: "Particle Instancing - Default Project (FREE!)",
            description: "Free default TouchDesigner project files for particle instancing.",
            fullDescription: "Basic TouchDesigner project illustrating particle instancing techniques, available for free.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Public",
            color: "electric-lime",
            urls: {
              Patreon: "https://www.patreon.com/posts/105476204"
            },
          },
          {
            id: "noise-sculpting-part-5-tutorial",
            title: "Noise Sculpting in TouchDesigner - Part 5 (Tutorial)",
            description: "Paid project files and tutorial for Noise Sculpting Part 5.",
            fullDescription: "Tutorial and project files focused on noise sculpting techniques in TouchDesigner Part 5.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/104148759"
            },
          },
          {
            id: "noise-sculpting-geometric-iterations",
            title: "Noise Sculpting Geometric Iterations - Project File",
            description: "Paid project files for geometric iteration techniques in noise sculpting.",
            fullDescription: "TouchDesigner files demonstrating iterative geometry manipulations in noise sculpting projects.",
            medium: "TouchDesigner project file",
            category: "PROJECT FILE - Paid only",
            color: "neon-magenta",
            urls: {
              Patreon: "https://www.patreon.com/posts/103982664"
            },
          }
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
