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
          // videos: [
          //   "./assets/videos/rain-stick-video.mp4"
          // ],
          // audioFile: "./assets/audio/rain-reminders-sample.mp3",
          images: [
            "./assets/images/rain-stick-3.JPG",
            "./assets/images/rain-stick-2.JPG",
            "./assets/images/rain-stick-1.JPG"            
          ],
        },

        {
          id: "asymmetrica-symmetrical-fictions",
          title: "Symmetrical Fictions",
          description:
            "A generative composition shaped by real-time weather data, translating environmental conditions into shifting sonic structures.",
          fullDescription:
            "Symmetrical Fictions is a generative sound work sculpted from temperature, humidity, and precipitation data. These inputs are mapped to frequency modulations, pitch deviations, and rhythmic bursts. The track extends the core of the Symmetrical Fictions project—an exploration of urban landscapes and unseen forces as performative systems. The result is ambient yet unstable, synthetic in texture but grounded in natural rhythms. A sonic architecture built on shifting skies and algorithmic interpretation.",
          medium: "Generative audio, environmental data mapping",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          themes: "Weather, systems, sonic translation, speculative environments",
          technology: "TouchDesigner, environmental APIs, audio synthesis",
          bandcampTracks: [
            {
              title: "symmetrical fictions",
              trackId: "520992353",
              url: "https://asymmetrica.bandcamp.com/track/symmetrical-fictions",
            },
          ],
        },

        {
          id: "asymmetrica-a-reasonable-crashout",
          title: "A Reasonable Crashout",
          description:
            "A chaotic yet rhythmic experiment in modular-style sequencing inside Ableton Live.",
          fullDescription:
            "A Reasonable Crashout is a deliberately unstable composition—a digital homage to modular synthesis built entirely in Ableton. The track oscillates between glitchy randomness and hypnotic repetition, filled with jittery pattern jumps, unpredictable modulation, and a constantly morphing yet grounded melodic pulse. It's a study in fractured coherence: non-linear, algorithmically warped, but held together by an insistent sense of drive.",
          medium: "Digital audio, algorithmic sequencing",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "acid-orange",
          themes: "Modularity, chaos, rhythm, generative structure",
          technology: "Ableton Live, randomized MIDI effects, automation envelopes",
          bandcampTracks: [
            {
              title: "a reasonable crashout",
              trackId: "4106544270",
              url: "https://asymmetrica.bandcamp.com/track/a-reasonable-crashout",
            },
          ],
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
          // videos: [
          //   "./assets/videos/rain-stick-video.mp4"
          // ],
          // audioFile: "./assets/audio/rain-reminders-sample.mp3",
          images: [
            "./assets/images/rain-stick-3.JPG",
            "./assets/images/rain-stick-2.JPG",
            "./assets/images/rain-stick-1.JPG"
          ],
        },
        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation v1",
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
        {
          id: "old-drawings-sketchbook-series",
          title: "Old Digital+Analog Drawings",
          description: "Early explorations in digital sketching and coloring using Autodesk SketchBook - studies of form, color, and imagination.",
          fullDescription: "These six drawings mark a formative period of digital creativity, made during an early engagement with Autodesk SketchBook. They reflect a phase of intuitive experimentation, where sketching and digital coloring were driven by curiosity, play, and a desire to shape inner visions. Though rough and spontaneous, these pieces represent personal milestones in visual expression and digital practice.",
          medium: "Analog sketching and digital coloring",
          category: "ARCHIVE • PERSONAL WORK",
          tags: ["digital", "sketches"],
          color: "cerulean",
          documentation: "Archived drawings from early digital sessions",
          images: [
            "./assets/images/old drawing (1).jpg",
            "./assets/images/old drawing (2).jpg",
            "./assets/images/old drawing (3).jpg",
            "./assets/images/old drawing (4).jpg",
            "./assets/images/old drawing (6).jpg"
          ],
        },

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

        // The rest in the same style:

        {
          id: "audiodevout-prime-spiral-visualizer",
          title: "Prime Spiral Visualizer – TouchDesigner .tox Component",
          description: "Real-time TouchDesigner visualizer inspired by prime exponential sums and Veritasium’s Goldbach video.",
          fullDescription: "A complex exponential sum visualization over primes, inspired by Hardy, Littlewood, Ramanujan, and Veritasium’s $1,000,000 Goldbach Conjecture video. Includes controls for prime count, modulation angle, animation toggle, and more.",
          medium: "TouchDesigner, generative visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "visualizer", "primes", "generative", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=a6lC3tAVilo"]
        },
        {
          id: "audiodevout-quick-emboss-filter",
          title: "Quick Emboss Filter for TouchDesigner (FREE COMPONENT FILE)",
          description: "A quick emboss filter tutorial with free component download for TouchDesigner users.",
          fullDescription: "Demonstrates how to create a quick emboss filter effect in TouchDesigner with project files and tox component freely available on Patreon.",
          medium: "TouchDesigner, visual effects",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "emboss filter", "free component", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=CelbrPlWM_k"]
        },
        {
          id: "audiodevout-kaleidoscopic-fractals-particlesgpu",
          title: "Kaleidoscopic Fractals with ParticlesGPU in TouchDesigner - Tutorial",
          description: "Create fractal patterns using ParticlesGPU with tiling, mirroring, and feedback loops.",
          fullDescription: "Explore fractal generation techniques in TouchDesigner combining ParticlesGPU, tiling and mirroring operators, and feedback loops to create stunning kaleidoscopic visuals.",
          medium: "TouchDesigner, particle systems, generative art",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "ParticlesGPU", "fractals", "generative art", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=TUOnPUHWpIU"]
        },
        {
          id: "audiodevout-audioreactive-text-showcase",
          title: "Audioreactive Text in TouchDesigner - Project Showcase",
          description: "A snippet of an audioreactive text project used in a recent VJ performance.",
          fullDescription: "Showcasing an audioreactive text visualization built in TouchDesigner, demonstrating dynamic text effects synced to audio input. Project files are available on Patreon.",
          medium: "TouchDesigner, audioreactive visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "audioreactive", "text", "VJ", "performance"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=GlMgtr-ejzs"]
        },
        {
          id: "audiodevout-noise-sculpting-part6-radial-lighting",
          title: "Noise Sculpting Part 6 - Radial Lighting",
          description: "Abstract structure using geo instancing with circular lighting and shadows.",
          fullDescription: "Techniques for building abstract 3D structures using geometry instancing and introducing radial lighting effects with circular ramps and compositing modes in TouchDesigner.",
          medium: "TouchDesigner, 3D geometry, lighting",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "noise sculpting", "instancing", "lighting", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=mkVa8D8_FIw"]
        },
        {
          id: "audiodevout-controlled-feedback-cache-tops",
          title: "Controlled Feedback with Cache TOPs in TouchDesigner",
          description: "Tutorial on controlling feedback trails using the Cache TOP in TouchDesigner.",
          fullDescription: "Learn how to manage and control feedback effects in TouchDesigner using Cache TOPs for more precise visual trails and effects. Project files available on Patreon.",
          medium: "TouchDesigner, visual effects, feedback control",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "feedback", "Cache TOP", "tutorial", "visual effects"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=TXbIgtYaNqQ"]
        },
        {
          id: "audiodevout-replicator-limit-feedback",
          title: "Replicator-Limit-Feedback (Project Overview)",
          description: "Short overview of a replicator feedback project with Patreon support request.",
          fullDescription: "An introduction and brief overview of the Replicator-Limit-Feedback project with links to Patreon support and future tutorial plans involving Ableton and TouchDesigner.",
          medium: "TouchDesigner, generative visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "feedback", "replicator", "project overview"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=IR0T0t49gnw"]
        },
        {
          id: "audiodevout-particle-structures-mesh-generator",
          title: "Particle Structures with Mesh Generator - Noise Sculpting Part 6",
          description: "Using Mesh Generator and operator techniques to create spiral particle structures.",
          fullDescription: "This project uses the Mesh Generator tool combined with operator tricks in TouchDesigner to produce cool spiral particle structures. Files available for Patreon members.",
          medium: "TouchDesigner, mesh generation, particle systems",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "Mesh Generator", "particles", "spiral", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=XHGeICkx9lU"]
        },
        {
          id: "audiodevout-simple-grid-patterns",
          title: "Simple Grid Patterns with Touchdesigner (Tutorial)",
          description: "Creating simple grid-based visual patterns in TouchDesigner.",
          fullDescription: "A straightforward tutorial for building simple grid patterns in TouchDesigner to help beginners understand basic layout and pattern creation.",
          medium: "TouchDesigner, pattern design",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "grid patterns", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=TbRtV-ix8RE"]
        },
        {
          id: "audiodevout-geometric-iterations-behind-network",
          title: "Geometric Iterations - Behind the Network",
          description: "Simple geometric patterns for a music video project.",
          fullDescription: "Demonstrates noise sculpting and geometric iteration techniques used in a music video project, inspired by tutorials and shared on Patreon.",
          medium: "TouchDesigner, generative visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "noise sculpting", "geometric patterns", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=QG-Kluyuveg"]
        },
        {
          id: "audiodevout-noise-sculpting-part2",
          title: "Noise Sculpting in TouchDesigner - Part 2",
          description: "3D geometry creation with Noise TOP and instancing.",
          fullDescription: "Fresh take on noise sculpting using Noise TOP and instancing to craft diverse 3D patterns in TouchDesigner. Project files on Patreon.",
          medium: "TouchDesigner, procedural geometry",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["noise sculpting", "Noise TOP", "TouchDesigner", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=p9TwiixKvXQ"]
        },
        {
          id: "audiodevout-audioreactive-doodle-geometry-instancing",
          title: "Audioreactive Doodle with Geometry Instancing in TouchDesigner - Behind The Network",
          description: "Overview of an audioreactive geometry instancing project without formal tutorial.",
          fullDescription: "Sharing the network structure and techniques behind an audioreactive geometry instancing project in TouchDesigner, showcasing layering and switching tricks.",
          medium: "TouchDesigner, audioreactive visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "audioreactive", "geometry instancing"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=Hk0uF7s-DjU"]
        },
        {
          id: "audiodevout-moving-crystal-effect",
          title: "Moving Crystal Effect in TouchDesigner (Tutorial)",
          description: "Tutorial to create a twisting, wavy glass-like effect.",
          fullDescription: "Learn to recreate the visual effect of twisting and warping images as seen through glass using TouchDesigner techniques.",
          medium: "TouchDesigner, image effects",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "image distortion", "glass effect", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=pc34xAXCRlg"]
        },
        {
          id: "audiodevout-basic-uv-mapping-noise-sculpting",
          title: "Basic UV Mapping and Noise Sculpting in TouchDesigner (Tutorial)",
          description: "Intro to UV mapping combined with noise sculpting for 3D geometry.",
          fullDescription: "A beginner-friendly tutorial combining UV mapping and noise sculpting techniques to build 3D geometry instancing effects in TouchDesigner.",
          medium: "TouchDesigner, UV mapping, noise sculpting",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "UV mapping", "noise sculpting", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=4rm5dcoQHBc"]
        },
        {
          id: "audiodevout-audioreactive-visuals-003",
          title: "AudioReactive Visuals With TouchDesigner 003",
          description: "Quick audioreactive visual snippet with personal note.",
          fullDescription: "A short video showing reactive visuals with TouchDesigner, including a personal note about wisdom teeth removal and a track ID.",
          medium: "TouchDesigner, audioreactive visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "audioreactive", "visuals"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=J-fppN9-v-o"]
        }
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
