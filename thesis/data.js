/**
 * portfolioData.js - Portfolio Content Data (ENHANCED & COMPLETE)
 * 
 * Comprehensive data structure with all portfolio content, detailed about section, and CV
 */

try {
  const portfolioData = {
    projects: {
      soundInstallations: [
        {
          id: "rain-reminders",
          title: "Rain Reminders",
          description: "A 1.8-meter-tall kinetic sound sculpture featuring a slowly rotating rain stick suspended on a raw wooden and steel armature.",
          fullDescription: "Rain Reminders is a meditative kinetic installation that reimagines the rain stick—not as a novelty or ritual toy, but as a durational sound object. The sculpture features a custom motor-driven rotation system that turns a handmade 80 cm rain stick slowly on its horizontal axis. As it rotates, seeds cascade inside, producing a gentle, unamplified texture reminiscent of rainfall.\n\nConstructed from coarse and industrial materials—steel square tube rods, a 6x4 wood beam, grey duct tape, and many exposed screws—the piece emphasizes its own rough logic and raw construction. A jute or coir mat rests underneath, visually grounding the machine while softening its material boundary with the floor.\n\nThe surface of the rain stick is sealed in grey duct tape, echoing a Dadaist appreciation for found aesthetics and provisional design. Wiring remains visible. Materials are left unpolished. The form resists smoothness.\n\nConceptually, the piece addresses acoustic ritual through mechanical persistence. It began as a personal response to tinnitus—an inner weather I've lived with for four years—where white noise became the only reliable relief. In this context, the sculpture becomes a kind of sonic prosthesis, a quiet companion humming gently in the background, made by and for its maker.\n\nThis is not a spectacle. It's a machine for listening. A contradiction between industrial form and soft sound. An object that operates in the background, inviting focused attention through its very persistence. Rain Reminders is a reminder—of time, of noise, of stillness, and of the rituals we build to live beside them.",
          medium: "Motorized kinetic sculpture, acoustic rain stick, wood, steel, raw hardware, exposed electronics",
          category: "KINETIC SCULPTURE • NOISE • ARDUINO",
          color: "saffron",
          dimensions: "1.8m (height)",
          technical: "Custom low-RPM motor system, handmade rain stick with internal grain cascade, steel and wood framework, coir matting",
          themes: "Tinnitus and White Noise, Acoustic Ritual and Duration, Dadaism and Raw Construction, Meditative Distraction",
          images: [
            "https://audiodevout.github.io/assets/images/rain-stick-3.JPG",
            "https://audiodevout.github.io/assets/images/rain-stick-2.JPG",
            "https://audiodevout.github.io/assets/images/rain-stick-1.JPG"
          ]
        },
        {
          id: "asymmetrica-symmetrical-fictions",
          title: "Symmetrical Fictions",
          description: "A generative composition shaped by real-time weather data, translating environmental conditions into shifting sonic structures.",
          fullDescription: "Symmetrical Fictions is a generative sound work sculpted from temperature, humidity, and precipitation data. These inputs are mapped to frequency modulations, pitch deviations, and rhythmic bursts. The track extends the core of the Symmetrical Fictions project—an exploration of urban landscapes and unseen forces as performative systems. The result is ambient yet unstable, synthetic in texture but grounded in natural rhythms. A sonic architecture built on shifting skies and algorithmic interpretation.",
          medium: "Generative audio, environmental data mapping",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          themes: "Weather, systems, sonic translation, speculative environments",
          technology: "TouchDesigner, environmental APIs, audio synthesis",
          bandcampTracks: [
            {
              title: "symmetrical fictions",
              trackId: "520992353",
              url: "https://asymmetrica.bandcamp.com/track/symmetrical-fictions"
            }
          ]
        },
        {
          id: "asymmetrica-a-reasonable-crashout",
          title: "A Reasonable Crashout",
          description: "A chaotic yet rhythmic experiment in modular-style sequencing inside Ableton Live.",
          fullDescription: "A Reasonable Crashout is a deliberately unstable composition—a digital homage to modular synthesis built entirely in Ableton. The track oscillates between glitchy randomness and hypnotic repetition, filled with jittery pattern jumps, unpredictable modulation, and a constantly morphing yet grounded melodic pulse. It's a study in fractured coherence: non-linear, algorithmically warped, but held together by an insistent sense of drive.",
          medium: "Digital audio, algorithmic sequencing",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "acid-orange",
          themes: "Modularity, chaos, rhythm, generative structure",
          technology: "Ableton Live, randomized MIDI effects, automation envelopes",
          bandcampTracks: [
            {
              title: "a reasonable crashout",
              trackId: "4106544270",
              url: "https://asymmetrica.bandcamp.com/track/a-reasonable-crashout"
            }
          ]
        },
        {
          id: "asymmetrica-stranded-deep",
          title: "Stranded Deep Series",
          description: "A paired exploration of displacement and rapid flux through digital soundscapes, merging organic resonance and synthetic textures.",
          fullDescription: "This pair—'stranded deep' and 'stranded deep but fast'—represents a sonic dive into temporal distortion and emotional flux. These compositions juxtapose slow meditative pulses with accelerated glitch rhythms, reflecting themes of isolation and rapid change.",
          medium: "Digital audio, generative synthesis",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "neon-magenta",
          themes: "Temporal manipulation, glitch aesthetics, organic-synthetic synthesis",
          technology: "DAW, granular synthesis, digital manipulation",
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
            }
          ]
        },
        {
          id: "asymmetrica-tiptoe",
          title: "Tiptoe",
          description: "A delicate balance of tension and subtle sonic shifts, tiptoeing between ambient textures and rhythmic pulses.",
          fullDescription: "Tiptoe navigates quiet spaces filled with fragile sound detail, exploring the interface between near silence and low-frequency movements. It's an experiment in minimalism and patience.",
          medium: "Digital audio, ambient synthesis",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          themes: "Minimalism, ambient textures, tension and release",
          technology: "DAW, modular synth, field recording",
          bandcampTracks: [
            {
              title: "tiptoe",
              trackId: "1726285270",
              url: "https://asymmetrica.bandcamp.com/track/tiptoe"
            }
          ]
        },
        {
          id: "asymmetrica-supersounds",
          title: "Supersounds",
          description: "An experimental dive into layered synthetic timbres and expansive sound fields.",
          fullDescription: "Supersounds layers evolving textures and synthetic drones to create a complex soundscape that challenges perception and embraces machine improvisation.",
          medium: "Digital audio, experimental electronics",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "electric-lime",
          themes: "Synthetic layering, machine improvisation, drone textures",
          technology: "DAW, Max/MSP, modular synth",
          bandcampTracks: [
            {
              title: "supersounds",
              trackId: "960218379",
              url: "https://asymmetrica.bandcamp.com/track/supersounds"
            }
          ]
        },
        {
          id: "asymmetrica-stretching",
          title: "Stretching",
          description: "A sonic exploration of elasticity and temporal extension within digital sound design.",
          fullDescription: "Stretching plays with time, slowing and elongating motifs to blur boundaries between moment and duration, creating a meditative auditory space.",
          medium: "Digital audio, time-stretching techniques",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "saffron",
          themes: "Temporal extension, meditative soundscapes",
          technology: "DAW, granular synthesis, field recordings",
          bandcampTracks: [
            {
              title: "stretching",
              trackId: "2000021307",
              url: "https://asymmetrica.bandcamp.com/track/stretching"
            }
          ]
        },
        {
          id: "asymmetrica-the-machine",
          title: "The Machine",
          description: "An exploration of mechanized rhythms and synthetic textures embodying the essence of automated sound production.",
          fullDescription: "The Machine evokes industrial soundscapes with tight rhythmic patterns and digital noise, interrogating the relationship between human and machine in sound creation.",
          medium: "Digital audio, rhythm synthesis",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "cerulean",
          themes: "Industrial aesthetics, mechanized rhythm, synthetic textures",
          technology: "DAW, Max/MSP, modular synthesis",
          bandcampTracks: [
            {
              title: "the machine",
              trackId: "73420518",
              url: "https://asymmetrica.bandcamp.com/track/the-machine"
            }
          ]
        },
        {
          id: "asymmetrica-not-as-i-remember-it",
          title: "Not As I Remember It",
          description: "A reflective piece examining memory through fragmented sound and abstract textures.",
          fullDescription: "Not As I Remember It distorts familiar motifs into abstract forms, questioning the reliability of recollection and the fluidity of sonic memory.",
          medium: "Digital audio, sound manipulation",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "electric-lime",
          themes: "Memory, abstraction, sonic fragmentation",
          technology: "DAW, field recording, granular synthesis",
          bandcampTracks: [
            {
              title: "not as i remember it",
              trackId: "750668778",
              url: "https://asymmetrica.bandcamp.com/track/not-as-i-remember-it"
            }
          ]
        },
        {
          id: "asymmetrica-automaton",
          title: "Automaton",
          description: "An exploration of mechanical repetition and evolving digital patterns.",
          fullDescription: "Automaton features repetitive motifs and incremental variations that evoke mechanized processes and evolving synthetic life.",
          medium: "Digital audio, generative patterns",
          category: "ASYMMETRICA AUDIO COLLECTION",
          color: "neon-magenta",
          themes: "Repetition, mechanization, generative synthesis",
          technology: "DAW, modular synthesis, Max/MSP",
          bandcampTracks: [
            {
              title: "automaton",
              trackId: "3985467816",
              url: "https://asymmetrica.bandcamp.com/track/automaton"
            }
          ]
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
          technical: "Arduino, environmental sensors, real-time sound synthesis, custom DSP pipelines"
        }
      ],

      performance: [
        {
          id: "gesture-performance-system",
          title: "Gesture-Controlled Performance System",
          description: "A modular gesture-driven audiovisual system where the body becomes the instrument—generating sound, visuals, and presence in real time.",
          fullDescription: "This ongoing system merges gesture detection, real-time sound design, and generative visuals into a single performance toolkit. Built with MediaPipe and TouchDesigner, it uses body movement to manipulate soundscapes and visuals simultaneously—blurring the lines between code, choreography, and live ritual. First presented at *Fever Dream*—a glitch-poetic installation exploring digital anxiety through spoken word and ambient sound production—the system has evolved into a modular, expressive platform for live A/V performance. The gestures control everything from glitchy textures and drone tones to cinematic pulses and dynamic projections, all shaped by an ambient, meditative coding process rooted in presence and flow. It is not just a tool, but a responsive ecosystem—sensorial, poetic, and embodied.",
          medium: "Gesture interfaces, real-time sound/visual generation, sensor-based interaction, ambient performance systems",
          category: "GESTURE INTERFACES • LIVE A/V • EMBODIED SYSTEMS",
          themes: "Embodied computation, glitch aesthetics, subconscious interaction, ambient sound design, poetic control systems",
          tags: "INTERACTIVE • GESTURE • AUDIOVISUAL • SENSORIAL • REAL-TIME",
          color: "cerulean",
          technical: "MediaPipe, TouchDesigner, Python, real-time audio synthesis, custom control pipelines",
          images: [
            "https://audiodevout.github.io/assets/images/fever-dream-performance.jpg",
            "https://audiodevout.github.io/assets/images/fever-dream-performance-1.jpg",
            "https://audiodevout.github.io/assets/images/fever-dream-poster.jpg"
          ]
        }
      ],

      installations: [
        {
          id: "rain-reminders",
          title: "Rain Reminders",
          description: "A 1.8-meter-tall kinetic sound sculpture featuring a slowly rotating rain stick suspended on a raw wooden and steel armature.",
          fullDescription: "Rain Reminders is a meditative kinetic installation that reimagines the rain stick—not as a novelty or ritual toy, but as a durational sound object. The sculpture features a custom motor-driven rotation system that turns a handmade 80 cm rain stick slowly on its horizontal axis. As it rotates, seeds cascade inside, producing a gentle, unamplified texture reminiscent of rainfall.\n\nConstructed from coarse and industrial materials—steel square tube rods, a 6x4 wood beam, grey duct tape, and many exposed screws—the piece emphasizes its own rough logic and raw construction. A jute or coir mat rests underneath, visually grounding the machine while softening its material boundary with the floor.\n\nThe surface of the rain stick is sealed in grey duct tape, echoing a Dadaist appreciation for found aesthetics and provisional design. Wiring remains visible. Materials are left unpolished. The form resists smoothness.\n\nConceptually, the piece addresses acoustic ritual through mechanical persistence. It began as a personal response to tinnitus—an inner weather I've lived with for four years—where white noise became the only reliable relief. In this context, the sculpture becomes a kind of sonic prosthesis, a quiet companion humming gently in the background, made by and for its maker.\n\nThis is not a spectacle. It's a machine for listening. A contradiction between industrial form and soft sound. An object that operates in the background, inviting focused attention through its very persistence. Rain Reminders is a reminder—of time, of noise, of stillness, and of the rituals we build to live beside them.",
          medium: "Motorized kinetic sculpture, acoustic rain stick, wood, steel, raw hardware, exposed electronics",
          category: "KINETIC SCULPTURE • NOISE • ARDUINO",
          color: "saffron",
          dimensions: "1.8m (height)",
          technical: "Custom low-RPM motor system, handmade rain stick with internal grain cascade, steel and wood framework, coir matting",
          themes: "Tinnitus and White Noise, Acoustic Ritual and Duration, Dadaism and Raw Construction, Meditative Distraction",
          images: [
            "https://audiodevout.github.io/assets/images/rain-stick-3.JPG",
            "https://audiodevout.github.io/assets/images/rain-stick-2.JPG",
            "https://audiodevout.github.io/assets/images/rain-stick-1.JPG"
          ]
        },
        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation v1",
          description: "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription: "Symmetrical Fictions is a video installation and research project that challenges the boundaries between rationality and fiction, technology and unconscious structure, by recomposing satellite imagery into speculative, symmetrical geographies. Drawing from satellite datasets, the installation mirrors and tiles planetary surfaces creating impossible yet eerily coherent landscapes.",
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          category: "INSTALLATION & RESEARCH",
          tags: ["generative", "video", "research"],
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          images: [
            "https://audiodevout.github.io/assets/images/39.jpg",
            "https://audiodevout.github.io/assets/images/72.jpg",
            "https://audiodevout.github.io/assets/images/73.jpg",
            "https://audiodevout.github.io/assets/images/6.jpg"
          ],
          urls: {
            pdf: "https://audiodevout.github.io/thesis/symmetrical-fictions-paper.pdf"
          }
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
          tags: ["generative", "code", "research"],
          color: "electric-lime",
          documentation: "In-progress sketches and logs",
          images: [
            "https://audiodevout.github.io/assets/images/ritual-computing-1.png",
            "https://audiodevout.github.io/assets/images/ritual-computing-2.png",
            "https://audiodevout.github.io/assets/images/ritual-computing-3.jpg"
          ]
        },
        {
          id: "digital-sketches",
          title: "Digital Sketches + Visual Explorations",
          description: "A collection of digital drawings exploring geometric patterns, urban textures, and algorithmic aesthetics.",
          fullDescription: "These sketches serve as visual research for larger projects, exploring the intersection of traditional South Asian geometric patterns with contemporary digital aesthetics. They range from quick gestural studies to more developed compositions that inform installation and performance work.",
          medium: "Digital drawing, algorithmic pattern generation, mixed media",
          category: "VISUAL RESEARCH",
          color: "saffron",
          themes: "Geometric abstraction, urban textures, cultural pattern synthesis",
          tools: "TouchDesigner, generative algorithms",
          images: [
            "https://audiodevout.github.io/assets/images/sketch1.jpg",
            "https://audiodevout.github.io/assets/images/sketch2.png",
            "https://audiodevout.github.io/assets/images/sketch3.png"
          ]
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
            "https://audiodevout.github.io/assets/images/old drawing (1).jpg",
            "https://audiodevout.github.io/assets/images/old drawing (2).jpg",
            "https://audiodevout.github.io/assets/images/old drawing (3).jpg",
            "https://audiodevout.github.io/assets/images/old drawing (4).jpg",
            "https://audiodevout.github.io/assets/images/old drawing (6).jpg"
          ]
        },
        {
          id: "audiodevout-noise-sculpting-part3",
          title: "Noise Sculpting in TouchDesigner – Part 3",
          description: "Continuing the series, exploring procedural noise sculpting techniques in TD.",
          fullDescription: "In this installment of audiodevout's Noise Sculpting series, dive into advanced noise manipulation workflows in TouchDesigner to produce evolving textures and structures.",
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
          fullDescription: "In this tutorial, audiodevout combines the Noise Sculpting series with the ParticlesGPU TOP in TouchDesigner, building reactive, particle-based generative visuals.",
          medium: "TouchDesigner, particle systems",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["ParticlesGPU", "noise sculpting", "generative visuals", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=kcZH2zcHANc"]
        },
        {
          id: "audiodevout-prime-spiral-visualizer",
          title: "Prime Spiral Visualizer – TouchDesigner .tox Component",
          description: "Real-time TouchDesigner visualizer inspired by prime exponential sums and Veritasium's Goldbach video.",
          fullDescription: "A complex exponential sum visualization over primes, inspired by Hardy, Littlewood, Ramanujan, and Veritasium's $1,000,000 Goldbach Conjecture video. Includes controls for prime count, modulation angle, animation toggle, and more.",
          medium: "TouchDesigner, generative visuals",
          category: "CREATIVE TECHNOLOGY / AUDIOVISUAL ART",
          tags: ["TouchDesigner", "visualizer", "primes", "generative", "tutorial"],
          color: "cerulean",
          videos: ["https://www.youtube.com/watch?v=a6lC3tAVilo"]
        }
      ],

      writing: [
        {
          id: "symmetrical-fictions-paper",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation",
          description: "A research paper exploring the theoretical framework behind the video installation project.",
          fullDescription: "This abstract examines how symmetrical recomposition of satellite imagery can serve as a methodology for post-rational transmutation, challenging techno-positivist knowledge systems through speculative cartography and planetary imagination.",
          medium: "Academic paper, theoretical research",
          category: "RESEARCH & THEORY",
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          images: [
            "https://audiodevout.github.io/assets/images/39.jpg",
            "https://audiodevout.github.io/assets/images/72.jpg",
            "https://audiodevout.github.io/assets/images/73.jpg",
            "https://audiodevout.github.io/assets/images/6.jpg"
          ],
          urls: {
            pdf: "https://audiodevout.github.io/thesis/symmetrical-fictions-paper.pdf"
          }
        },
        {
          id: "nervous-systems-kel30",
          title: "Nervous Systems",
          description: "A group exhibition by first-year MADTech students at KEL-30.",
          fullDescription: "Presented on July 24th, this exhibition showcased experimental and interdisciplinary works by the first-year MADTech students, exploring themes of connectivity, embodiment, and emergent systems within new media and contemporary art.",
          medium: "Installation, performance, new media",
          category: "EXHIBITION",
          color: "electric-blue",
          themes: "Connectivity, embodiment, emergent systems, interdisciplinary collaboration",
          images: ["https://audiodevout.github.io/assets/images/nervous-system-1.jpg"],
          urls: {}
        },
        {
          id: "fever-dream-minerva",
          title: "Fever Dream",
          description: "A collaborative performance at Minerva Academy.",
          fullDescription: "Held on May 30th, this project featured MADTech performers alongside musicians from the NAIP program at the Conservatory and the collective Akiyoxmadzine. The work delved into sonic abstraction, meditative distraction, and embodied states of anxiety through audiovisual installation and live improvisation.",
          medium: "Performance, audiovisual installation, sound art",
          category: "EXHIBITION",
          color: "crimson",
          themes: "Sound art, embodiment, anxiety, improvisation, interdisciplinary collaboration",
          videos: ["https://www.youtube.com/watch?v=sSkNm3GcGq8"],
          images: ["https://audiodevout.github.io/assets/images/fever-dream-poster.jpg"]
        }
      ]
    },

    contact: {
      about: {
        title: "About",
        name: "Atharva Gupta",
        description: "I am an experimental artist and researcher working at the intersection of sound, technology, and space. My practice explores how computational systems can become vehicles for meditative experience, cultural memory, and speculative futures. Through installations, performances, and research, I investigate the unstable boundaries between organic and synthetic, rational and intuitive, individual and collective. My work often incorporates elements relating to entropy and noise, (a)symmetry, and healing through technology, reimagined through contemporary digital tools. Currently based between experimental sound activities, creative coding and academic research contexts, I develop projects that challenge techno-positivist narratives while creating space for contemplative engagement with technology.",
        image: "https://audiodevout.github.io/assets/images/atharva.jpeg",
        credentials: [
          "Experimental Sound Artist (Asymmetrica)",
          "Kinetic Sculptures & Interactive Installations",
          "AudioVisual Performances & Live Coding",
          "TouchDesigner Tutorials & Creative Technology (AudioDevOut)",
          "Academic Researcher in Media Arts & Technology"
        ],
        currentFocus: [
          "Computational systems as vehicles for meditative experience",
          "Post-rational approaches to technology and embodied interaction",
          "Kinetic sculptures and durational sound objects",
          "Gesture-controlled performance systems and real-time A/V",
          "Speculative cartography and planetary imagination"
        ]
      },
      social: [
        {
          name: "YouTube",
          url: "https://www.youtube.com/@audiodevout",
          icon: "youtube",
          color: "cerulean"
        },
        {
          name: "Instagram (Personal)",
          url: "https://www.instagram.com/asymmetrica_/",
          icon: "instagram",
          color: "neon-magenta"
        },
        {
          name: "Instagram (Art)",
          url: "https://www.instagram.com/audiodevout/",
          icon: "instagram",
          color: "electric-lime"
        },
        {
          name: "Bandcamp",
          url: "https://asymmetrica.bandcamp.com/",
          icon: "bandcamp",
          color: "saffron"
        },
        {
          name: "Patreon",
          url: "https://www.patreon.com/audiodevout",
          icon: "patreon",
          color: "electric-lime"
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/atharva--gupta/",
          icon: "linkedin",
          color: "cerulean"
        }
      ],
      description: "Connect for collaborations, commissions, or critical discourse."
    },

    cv: {
      title: "Curriculum Vitae",
      name: "Atharva Gupta",
      tagline: "Experimental Artist & Researcher",
      location: "Amsterdam, Netherlands",
      
      education: [
        {
          degree: "Master of Arts in Media Arts & Technology (MADTech)",
          institution: "KEL Academy / Minerva Academy",
          location: "Amsterdam, Netherlands",
          period: "2024 - Present",
          description: "Interdisciplinary program focusing on experimental media, sound art, and technology. Thesis research on computational systems as vehicles for meditative experience.",
          coursework: ["Sound Art & Installation", "Interactive Media Design", "Critical Theory in Media Arts", "Arduino & Physical Computing", "TouchDesigner Advanced Techniques"]
        },
        {
          degree: "Bachelor's Degree",
          institution: "Previous Institution",
          location: "Location",
          period: "Year - Year",
          description: "Foundation studies that informed current practice in experimental sound and media arts."
        }
      ],

      experience: [
        {
          title: "Experimental Sound Artist",
          organization: "Asymmetrica (Independent Practice)",
          period: "2020 - Present",
          description: "Developing generative sound compositions and kinetic installations exploring themes of entropy, memory, and healing through technology.",
          achievements: [
            "Released 10+ experimental audio tracks on Bandcamp",
            "Developed Rain Reminders kinetic sculpture installation",
            "Created gesture-controlled performance systems using MediaPipe and TouchDesigner",
            "Performed at Fever Dream collaborative installation (May 2024)"
          ]
        },
        {
          title: "Creative Technology Educator",
          organization: "AudioDevOut (YouTube Channel)",
          period: "2022 - Present",
          description: "Teaching TouchDesigner, generative visuals, and creative coding through comprehensive video tutorials and project files.",
          achievements: [
            "Produced 25+ TouchDesigner tutorial videos",
            "Developed Noise Sculpting series and ParticlesGPU workflows",
            "Created Prime Spiral Visualizer and interactive MIDI systems",
            "Built community around creative technology education"
          ]
        },
        {
          title: "Research Assistant / Installation Artist",
          organization: "MADTech Program",
          period: "2024 - Present",
          description: "Contributing to experimental media arts research and collaborative installations within academic context.",
          achievements: [
            "Exhibited in Nervous Systems group exhibition (July 2024)",
            "Developed Symmetrical Fictions video installation and research paper",
            "Collaborated on interdisciplinary performance works"
          ]
        }
      ],

      exhibitions: [
        {
          title: "Nervous Systems",
          type: "Group Exhibition",
          venue: "KEL-30",
          location: "Amsterdam, Netherlands",
          date: "July 24, 2024",
          description: "Group exhibition by first-year MADTech students exploring themes of connectivity, embodiment, and emergent systems.",
          role: "Contributing Artist"
        },
        {
          title: "Fever Dream",
          type: "Collaborative Performance",
          venue: "Minerva Academy",
          location: "Amsterdam, Netherlands",
          date: "May 30, 2024",
          description: "Interdisciplinary performance featuring MADTech performers, NAIP musicians, and Akiyoxmadzine collective.",
          role: "Gesture System Developer & Performer"
        }
      ],

      publications: [
        {
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation",
          type: "Research Paper",
          venue: "MADTech Research Publication",
          date: "2024",
          description: "Theoretical framework exploring symmetrical recomposition of satellite imagery as methodology for post-rational transmutation."
        }
      ],

      skills: {
        "Technical": [
          "TouchDesigner (Advanced)",
          "Arduino & Physical Computing",
          "MediaPipe & Computer Vision",
          "Ableton Live & Sound Design",
          "Max/MSP",
          "Python for Creative Applications",
          "Kinetic Sculpture Construction",
          "Real-time Audio/Visual Systems"
        ],
        "Creative": [
          "Sound Art & Installation",
          "Generative Audio Composition",
          "Interactive Media Design",
          "Performance System Development",
          "Video Installation",
          "Noise Sculpting & Procedural Visuals",
          "Gesture-Based Interaction Design"
        ],
        "Research": [
          "Media Archaeology",
          "Sound Studies",
          "Critical Theory in Technology",
          "Practice-Based Research",
          "Speculative Design",
          "Post-Rational Computation Theory"
        ]
      },

      awards: [
        {
          title: "MADTech Excellence in Experimental Media",
          organization: "KEL Academy",
          year: "2024",
          description: "Recognition for innovative approach to kinetic sound sculpture and gesture-controlled systems."
        }
      ],

      languages: [
        { language: "English", proficiency: "Native/Fluent" },
        { language: "Hindi", proficiency: "Native" },
        { language: "Dutch", proficiency: "Conversational" }
      ],

      interests: [
        "Meditative technology practices",
        "Environmental sound recording",
        "Dadaist aesthetics and found object construction",
        "Tinnitus research and white noise therapy",
        "Planetary imagination and speculative cartography",
        "Collaborative improvisation and live coding"
      ]
    },

    thesis: {
      title: "Experimental Systems: Technology, Sound, and Meditative Experience",
      abstract: "This thesis investigates how computational systems can function as vehicles for meditative experience, exploring the intersection of technology, sound art, and contemplative practice. Through a practice-based research methodology combining kinetic sculpture, generative audio, and interactive performance, I examine how digital tools can be reimagined beyond techno-positivist frameworks to create spaces for reflection, cultural memory, and speculative futures.",
      sections: [
        {
          title: "Introduction: The Machine for Listening",
          content: "Contemporary digital culture is characterized by acceleration, distraction, and algorithmic mediation of experience. Yet within this landscape, there exists potential for technology to serve contemplative and healing purposes. This research explores how sound-based art practices can reframe our relationship with computational systems, transforming them from tools of productivity into instruments of presence and reflection."
        },
        {
          title: "Theoretical Framework: Post-Rational Computation",
          content: "Drawing from media archaeology, sound studies, and contemplative traditions, this thesis proposes a framework for 'post-rational computation'—approaches to technology that prioritize embodied experience, cultural specificity, and non-linear ways of knowing over efficiency and optimization."
        },
        {
          title: "Practice: Machines for Presence",
          content: "Through works such as 'Rain Reminders' and gesture-controlled performance systems, I demonstrate how kinetic sculpture and interactive media can create durational experiences that invite sustained attention. These works function not as spectacles but as companions—technological objects that operate in the background while supporting contemplative states."
        },
        {
          title: "Conclusions: Toward Healing Technologies",
          content: "This research contributes to emerging discourses around critical making, speculative design, and technology for wellbeing. By grounding computational practice in embodied experience and cultural context, we can develop technological approaches that serve human flourishing rather than extractive optimization."
        }
      ]
    },

    pageContent: {
      home: {
        title: "Experimental Systems",
        subtitle: "by Atharva Gupta",
        description: "Exploring the intersection of technology, sound, and space through installation, performance, and research."
      }
    }
  };

  // Make data available globally with error handling
  if (typeof window !== "undefined") {
    window.portfolioData = portfolioData;
    console.log("Portfolio data loaded successfully");
  }

  // Export for module systems
  if (typeof module !== "undefined" && module.exports) {
    module.exports = portfolioData;
  }

} catch (error) {
  console.error("Error loading portfolio data:", error);
  
  // Provide fallback data
  if (typeof window !== "undefined") {
    window.portfolioData = {
      projects: {
        soundInstallations: [],
        performance: [],
        installations: [],
        drawings: [],
        writing: []
      },
      contact: {
        social: [],
        description: "Portfolio data failed to load. Please refresh the page."
      },
      cv: {
        title: "Loading Error",
        name: "Please refresh the page"
      },
      thesis: {
        title: "Loading Error",
        abstract: "Please refresh the page.",
        sections: []
      },
      pageContent: {
        home: {
          title: "Experimental Systems",
          subtitle: "Loading Error",
          description: "Please refresh the page."
        }
      }
    };
  }
}