/**
 * portfolioData.js - Portfolio Content Data (MERGED)
 *
 * PURPOSE: Centralized data structure for all portfolio content
 * FEATURES: Merged data from both files, GitHub Pages compatible, comprehensive content
 */

// Wrapped in try-catch for error handling
try {
  const portfolioData = {
    projects: {
      // SOUND INSTALLATIONS - only physical installations, no music tracks
      soundInstallations: [
        
        {
          id: "ambient-sound-production",
          title: "Ambient Sound Production Experiments",
          description: "Explorations in generative sound design shaped by presence, data, and environment.",
          fullDescription:
            "Working with sound as a subtle presence—designing systems that generate evolving audio textures in response to environmental inputs. These experiments are guided by a meditative, process-driven approach to coding and sonic composition.",
          medium: "Generative audio, environmental data, custom-built software/hardware systems",
          category: "SOUND SYSTEMS / ENVIRONMENTAL AUDIO",
          color: "saffron",
          technical: "Arduino, environmental sensors, real-time sound synthesis, custom DSP pipelines",
        },
      ],

      // MUSIC TRACKS - Asymmetrica collection (only for sidebar, not main grid)
      musicTracks: [
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
              embedId: "520992353",
              coverArt: "https://f4.bcbits.com/img/a2895831314_3.jpg",
            },
          ],
        },
        {
          id: "asymmetrica-a-reasonable-crashout",
          title: "A Reasonable Crashout",
          description: "A chaotic yet rhythmic experiment in modular-style sequencing inside Ableton Live.",
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
              embedId: "4106544270",
              coverArt: "https://f4.bcbits.com/img/a3078624707_3.jpg",
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
              embedId: "2743015108",
              coverArt: "https://f4.bcbits.com/img/a3367478296_3.jpg",
            },
            {
              title: "stranded deep",
              trackId: "2338898025",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep",
              embedId: "2338898025",
              coverArt: "https://f4.bcbits.com/img/a0936658150_3.jpg",
            },
          ],
        },
        {
          id: "asymmetrica-tiptoe",
          title: "Tiptoe",
          description:
            "A delicate balance of tension and subtle sonic shifts, tiptoeing between ambient textures and rhythmic pulses.",
          fullDescription:
            "Tiptoe navigates quiet spaces filled with fragile sound detail, exploring the interface between near silence and low-frequency movements. It's an experiment in minimalism and patience.",
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
          description: "An experimental dive into layered synthetic timbres and expansive sound fields.",
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
          description: "A sonic exploration of elasticity and temporal extension within digital sound design.",
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
          description: "A reflective piece examining memory through fragmented sound and abstract textures.",
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
          description: "An exploration of mechanical repetition and evolving digital patterns.",
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
      ],

      // PERFORMANCE
      performance: [
        {
          id: "gesture-performance-system",
          title: "Gesture-Controlled Performance System",
          description:
            "A modular gesture-driven audiovisual system where the body becomes the instrument—generating sound, visuals, and presence in real time.",
          fullDescription:
            "This ongoing system merges gesture detection, real-time sound design, and generative visuals into a single performance toolkit. Built with MediaPipe and TouchDesigner, it uses body movement to manipulate soundscapes and visuals simultaneously—blurring the lines between code, choreography, and live ritual. First presented at *Fever Dream*—a glitch-poetic installation exploring digital anxiety through spoken word and ambient sound production—the system has evolved into a modular, expressive platform for live A/V performance.",
          medium:
            "Gesture interfaces, real-time sound/visual generation, sensor-based interaction, ambient performance systems",
          category: "GESTURE INTERFACES • LIVE A/V • EMBODIED SYSTEMS",
          color: "electric-lime",
          themes: "Embodied interaction, real-time synthesis, performance as code, gestural language",
          technology: "MediaPipe, TouchDesigner, Python, OSC protocol, computer vision",
          images: [
            "./assets/images/fever-dream-performance.jpg",
            "./assets/images/fever-dream-performance-1.jpg",
            "./assets/images/fever-dream-poster.jpg",
          ],
        },
      ],

      // INSTALLATIONS
      installations: [
        {
          id: "rain-reminders",
          title: "Rain Reminders",
          description:
            "A 1.8-meter-tall kinetic sound sculpture featuring a slowly rotating rain stick suspended on a raw wooden and steel armature.",
          fullDescription:
            "Rain Reminders is a meditative kinetic installation that reimagines the rain stick—not as a novelty or ritual toy, but as a durational sound object. The sculpture features a custom motor-driven rotation system that turns a handmade 80 cm rain stick slowly on its horizontal axis. As it rotates, seeds cascade inside, producing a gentle, unamplified texture reminiscent of rainfall.\n\nConstructed from coarse and industrial materials—steel square tube rods, a 6x4 wood beam, grey duct tape, and many exposed screws—the piece emphasizes its own rough logic and raw construction. A jute or coir mat rests underneath, visually grounding the machine while softening its material boundary with the floor.\n\nThe surface of the rain stick is sealed in grey duct tape, echoing a Dadaist appreciation for found aesthetics and provisional design. Wiring remains visible. Materials are left unpolished. The form resists smoothness.\n\nConceptually, the piece addresses acoustic ritual through mechanical persistence. It began as a personal response to tinnitus—an inner weather I've lived with for four years—where white noise became the only reliable relief. In this context, the sculpture becomes a kind of sonic prosthesis, a quiet companion humming gently in the background, made by and for its maker.\n\nThis is not a spectacle. It's a machine for listening. A contradiction between industrial form and soft sound. An object that operates in the background, inviting focused attention through its very persistence. Rain Reminders is a reminder—of time, of noise, of stillness, and of the rituals we build to live beside them.",
          medium: "Motorized kinetic sculpture, acoustic rain stick, wood, steel, raw hardware, exposed electronics",
          category: "KINETIC SCULPTURE • NOISE • ARDUINO",
          color: "saffron",
          dimensions: "1.8m (height)",
          technical:
            "Custom low-RPM motor system, handmade rain stick with internal grain cascade, steel and wood framework, coir matting",
          themes:
            "Tinnitus and White Noise, Acoustic Ritual and Duration, Dadaism and Raw Construction, Meditative Distraction",
          images: [
            "./assets/images/rain-stick-3.JPG",
            "./assets/images/rain-stick-2.JPG",
            "./assets/images/rain-stick-1.JPG",
          ],
        },
        {
          id: "symmetrical-fictions",
          title:
            "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation v1 - Abstract",
          description:
            "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription:
            'Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation\n\nAbstract:\nSymmetrical Fictions is a video installation and research project that challenges the boundaries between rationality and fiction, technology and unconscious structure, by recomposing satellite imagery into speculative, symmetrical geographies. Drawing from satellite datasets (such as NASA\'s Earth Imagery), the installation mirrors and tiles planetary surfaces — including deserts, glaciers, post-industrial ruins, and human settlements — creating impossible yet eerily coherent landscapes. These “symmetrical fictions” form a visual language that gestures beyond the real, exploring an epistemology situated between perception, memory, and planetary imagination. Using this visual language, the installation invites viewers into a spatial-temporal collapse, exploring what it means to desire order in an entropic world, exploring how the unconscious mind transcends binary and linear reasoning, seeking instead a non-linear approach to understanding reality.\n\nThis project does not seek control over matter, and instead, aims to transmute data into poetic experience. Rather than simply extracting or observing, the work repurposes technologies of surveillance and observation to propose new cartographies of planetary subjectivity. These are not maps for navigation, but spaces for dwelling — visualizations of symmetry not as perfection, but as excess and more-than-rational order.\n\nBy blurring the lines between fiction and matter, narrative and geometry, image and epistemology, Symmetrical Fictions contributes to debates on interdisciplinary practices, epistemic diversity, and the limits of positivist knowledge systems. The project argues that all technologies — no matter how advanced — carry poetic residues and unconscious architectures. The symmetrical images created here are not merely aesthetic ends but tools for reflecting on and feeling through our planetary condition. They suggest that the visual, much like the unconscious, is not governed solely by reason but by associative intensities and formal impossibilities. This installation also reimagines the relationship between human structures and the natural world through the lens of the alchemist archetype. In a similar way that alchemy sought to transform base materials into something greater, the project repurposes planetary data, traditionally used for control or extraction, into speculative visual compositions. By reassembling the chaotic, fragmented textures of our planet into symmetrical, imagined landscapes, the installation challenges conventional understandings of space, order, and nature, proposing new ways of engaging with the planet.\n\nThe project also addresses the mystification of digital systems by reclaiming visual data to present speculative environments that shift our understanding of "place." By using natural and human-made terrains, it reimagines landscapes as speculative environments, at once familiar and otherworldly. These landscapes emerge from the entropy of the Anthropocene — a geological epoch marked by human impact and ecological fragmentation. The installation points at the tension between nature and human infrastructure, using digital tools typically reserved for control and surveillance to explore new forms of visual expression and spatial organization. The symmetrical landscapes created through this process invite reflection on the human desire for coherence in a fragmented world.\n\nUltimately, these images, and the installation as a whole, act as a form of aesthetic resistance to techno-positivist knowledge systems. It uses symmetric fiction as a methodology, merging unconscious structure, planetary data, and speculative art to encourage post-rational transmutation. The installation offers a speculative vision of balance and coherence in a world marked by instability and entropy, suggesting that, even in the face of overwhelming complexity, there may be a way to reclaim and reorganize our fragmented world.',
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          category: "INSTALLATION & RESEARCH",
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          images: [
            "./assets/images/39.jpg",
            "./assets/images/72.jpg",
            "./assets/images/73.jpg",
            "./assets/images/6.jpg",
          ],
          urls: {
            pdf: "./assets/documents/symmetrical-fictions-paper.pdf",
          },
        },
      ],

      // OTHERS (drawings, writing, etc)
      // others: [
      //   {
      //     id: "ritual-computing-solo-sessions",
      //     title: "Ritual Computing and Coding Sessions",
      //     description:
      //       "Solo sessions of meditative coding and sketching in TouchDesigner—private rituals of thought, structure, and experimentation.",
      //     fullDescription:
      //       "These sessions are personal, introspective rituals where code becomes a tool for artistic inquiry and self-reflection. They are not participatory performances but private explorations—into the aesthetics of computation, the poetics of systems, and the possibilities of AI as a creative collaborator.",
      //     medium: "Code sketching, procedural visuals, AI collaboration",
      //     category: "SOLO • RESEARCH-BASED",
      //     color: "electric-lime",
      //     documentation: "In-progress sketches and logs",
      //     images: [
      //       "./assets/images/ritual-computing-1.png",
      //       "./assets/images/ritual-computing-2.png",
      //       "./assets/images/ritual-computing-3.jpg",
      //     ],
      //   },
      //   {
      //     id: "digital-sketches",
      //     title: "Digital Sketches + Visual Explorations",
      //     description:
      //       "A collection of digital drawings exploring geometric patterns, urban textures, and algorithmic aesthetics.",
      //     fullDescription:
      //       "These sketches serve as visual research for larger projects, exploring the intersection of traditional South Asian geometric patterns with contemporary digital aesthetics. They range from quick gestural studies to more developed compositions that inform installation and performance work.",
      //     medium: "Digital drawing, algorithmic pattern generation, mixed media",
      //     category: "VISUAL RESEARCH",
      //     color: "saffron",
      //     themes: "Geometric abstraction, urban textures, cultural pattern synthesis",
      //     tools: "TouchDesigner, generative algorithms",
      //     images: ["./assets/images/sketch1.jpg", "./assets/images/sketch2.png", "./assets/images/sketch3.png"],
      //   },
      // ],
    },

    // Get all Bandcamp tracks for the sidebar
    getAllBandcampTracks: function () {
      const tracks = []

      // Only collect bandcamp tracks from music tracks section (for sidebar only)
      this.projects.musicTracks.forEach((project) => {
        if (project.bandcampTracks) {
          project.bandcampTracks.forEach((track) => {
            tracks.push({
              ...track,
              projectTitle: project.title,
              projectId: project.id,
              projectColor: project.color,
            })
          })
        }
      })

      return tracks
    },

    thesis: {
      title: "Symmetrical Fictions: Urban Landscapes as Performative Systems",
      abstract:
        'This thesis explores the intersection of urban soundscapes, generative systems, and speculative environments through a practice-based investigation of how environmental data can be translated into aesthetic experience. Drawing from sound studies, new materialism, and computational aesthetics, the research develops methodologies for creating responsive audio-visual installations that reveal hidden urban rhythms.\n\nThrough projects like Rain Reminders and the Asymmetrica audio collection, the work examines how digital technologies can mediate our relationship with urban environments, creating what I term "symmetrical fictions"—speculative narratives that emerge from the translation of environmental data into sensory experience.\n\nThe research contributes to discussions around algorithmic composition, environmental sensing, and the politics of urban space, proposing new forms of situated media art that bridge computational and phenomenological approaches to understanding place.',
      sections: [
        {
          title: "Research Methodology",
          content:
            "This research employs practice-based methodology, using artistic production as a primary mode of inquiry. The investigation combines:\n\n• Computational approaches to environmental data processing\n• Phenomenological analysis of urban soundscapes\n• Collaborative workshops and public installations\n• Critical reflection on technological mediation",
        },
      ],
    },

    contact: {
      description:
        "Interested in collaboration, commissions, or discussing research intersections around sound, technology, and environment.",
      about: {
        name: "Atharva Gupta",
        image: "https://audiodevout.github.io/assets/images/atharva.jpeg",
        description:
          "I am an experimental artist and researcher working at the intersection of sound, technology, and space. My practice explores how computational systems can become vehicles for meditative experience, cultural memory, and speculative futures. Through installations, performances, and research, I investigate the unstable boundaries between organic and synthetic, rational and intuitive, individual and collective.\n\nMy work often incorporates elements relating to entropy and noise, (a)symmetry, and healing through technology, reimagined through contemporary digital tools. Currently based between experimental sound activities, creative coding and academic research contexts, I develop projects that challenge techno-positivist narratives while creating space for contemplative engagement with technology.",
        credentials: [
          "Experimental Sound Artist (Asymmetrica)",
          "Kinetic Sculptures & Interactive Installations",
          "AudioVisual Performances & Live Coding",
          "TouchDesigner Tutorials & Creative Technology (AudioDevOut)",
          "Academic Researcher in Media Arts & Technology",
        ],
        currentFocus: [
          "Computational systems as vehicles for meditative experience",
          "Post-rational approaches to technology and embodied interaction",
          "Kinetic sculptures and durational sound objects",
          "Gesture-controlled performance systems and real-time A/V",
          "Speculative cartography and planetary imagination",
        ],
      },
      social: [
        {
          name: "Email",
          url: "mailto:atharva152@gmail.com",
          color: "default",
        },
        {
          name: "Bandcamp",
          url: "https://asymmetrica.bandcamp.com",
          color: "saffron",
        },
        {
          name: "YouTube",
          url: "https://www.youtube.com/@audiodevout",
          color: "cerulean",
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/asymmetrica_/",
          color: "neon-magenta",
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/atharva--gupta/",
          color: "default",
        },
      ],
    },

    // Complete CV data from original data.js
    cv: {
      name: "Atharva Gupta",
      tagline: "Art Researcher and Educator",
      location: "Groningen, NL",
      email: "atharva152@gmail.com",
      phone: "+31 627 326 458",

      education: [
        {
          degree: "Master of Arts (MA), Fine Arts",
          institution: "Minerva Academy, Hanze University of Applied Sciences",
          location: "Groningen, NL",
          period: "Sep 2024 – Aug 2026",
          description: "Media, Art, Design and Technology",
          coursework: [],
        },
        {
          degree: "Master of Arts (MA), Arts and Culture",
          institution: "University of Groningen",
          location: "Groningen, NL",
          period: "Sep 2022 – Aug 2023",
          description: "Arts, Cognition and Criticism",
          coursework: [],
        },
        {
          degree: "Bachelor of Arts",
          institution: "Christ University",
          location: "Bangalore, IN",
          period: "Aug 2017 – Jun 2020",
          description: "Triple Major: Psychology, Sociology and Literature",
          coursework: [],
        },
      ],

      experience: [
        {
          title: "Freelance Art Producer",
          organization: "Art Researcher and Educator",
          location: "Groningen, NL",
          period: "Oct. 2023 - Present",
          description: "Independent practice focusing on experimental media art and education",
          achievements: [
            "Conducted TouchDesigner tutorials on YouTube under the name AudioDevOut",
            "Engaged in experimental music production and sound design under the name Asymmetrica",
            "Worked as a Visual Jockey (VJ) for events including club nights and poetry readings",
          ],
        },
        {
          title: "Research and Development Intern",
          organization: "Broedplaats De Campagne",
          location: "Groningen, NL",
          period: "Feb. 2023 – Oct. 2023",
          description: "Large-scale art installations and XR technology development",
          achievements: [
            "Worked on large-scale art installations under Artist and Theatre Professional Chantalla Pleiter",
            "Contributed to the creation and presentation of 4 different projects related to XR technologies and sound design at festivals like Noorderzon Performing Arts Festival and Expeditie Next",
            "Handled day-to-day research, logistics and maintenance of equipment related to the projects",
          ],
        },
      ],

      exhibitions: [
        {
          id: "nervous-systems-kel30",
          title: "Nervous Systems",
          description: "A group exhibition by first-year MADTech students at KEL-30.",
          fullDescription:
            "Presented on July 24th, this exhibition showcased experimental and interdisciplinary works by the first-year MADTech students, exploring themes of connectivity, embodiment, and emergent systems within new media and contemporary art.",
          medium: "Installation, performance, new media",
          category: "EXHIBITION",
          color: "electric-lime",
          themes: "Connectivity, embodiment, emergent systems, interdisciplinary collaboration",
          images: ["./assets/images/nervous-system-1.jpg"],
          urls: {},
        },
        {
          id: "fever-dream-minerva",
          title: "Fever Dream",
          description: "A collaborative performance at Minerva Academy.",
          fullDescription:
            "Held on May 30th, this project featured MADTech performers alongside musicians from the NAIP program at the Conservatory and the collective Akiyoxmadzine. The work delved into sonic abstraction, meditative distraction, and embodied states of anxiety through audiovisual installation and live improvisation.",
          medium: "Performance, audiovisual installation, sound art",
          category: "EXHIBITION",
          color: "crimson",
          themes: "Sound art, embodiment, anxiety, improvisation, interdisciplinary collaboration",
          videos: ["https://www.youtube.com/watch?v=sSkNm3GcGq8"],
          images: ["./assets/images/fever-dream-poster.jpg"],
        },
      ],
      publications: [],
      awards: [],

      skills: {
        "Creative Practice": [
          "Art Education",
          "Creative Coding",
          "New Media Performances",
          "Artistic Cultural Research",
          "Interactive/Kinetic Sculptures",
          "Sound Design/Experimental Music Production",
        ],
        Technologies: ["TouchDesigner", "Ableton Live", "Arduino (Physical Builds and Coding)", "Max (Cycling '74)", "Python"],
      },

      languages: [
        { language: "English", proficiency: "Native" },
        { language: "Hindi", proficiency: "Native" },
      ],

      interests: ["Interactive Audiovisual Installations", "Workshops", "Digital Art", "Gaming"],
    },
  }

  // Make data globally available
  window.portfolioData = portfolioData
} catch (error) {
  console.error("Error loading portfolio data:", error)
}
