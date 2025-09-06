/**
 * portfolioData.js - Portfolio Content Data (MERGED)
 *
 * PURPOSE: Centralized data structure for all portfolio content
 * FEATURES: Relative file paths for GitHub Pages, complete CV data from original data.js
 */

// Wrapped in try-catch for error handling
try {
  const portfolioData = {
    projects: {
      soundInstallations: [
        {
          id: "rain-reminders",
          title: "Rain Reminders",
          description:
            "A 1.8-meter-tall kinetic sound sculpture featuring a slowly rotating rain stick suspended on a raw wooden and steel armature.",
          fullDescription:
            "Rain Reminders is a meditative kinetic installation that reimagines the rain stick—not as a novelty or ritual toy, but as a durational sound object. The sculpture features a custom motor-driven rotation system that turns a handmade 80 cm rain stick slowly on its horizontal axis. As it rotates, seeds cascade inside, producing a gentle, unamplified texture reminiscent of rainfall.\n\nConstructed from coarse and industrial materials—steel square tube rods, a 6x4 wood beam, grey duct tape, and many exposed screws—the piece emphasizes its own rough logic and raw construction. A jute or coir mat rests underneath, visually grounding the machine while softening its material boundary with the floor.\n\nThe surface of the rain stick is sealed in grey duct tape, echoing a Dadaist appreciation for found aesthetics and provisional design. Wiring remains visible. Materials are left unpolished. The form resists smoothness.\n\nConceptually, the piece addresses acoustic ritual through mechanical persistence. It began as a personal response to tinnitus—an inner weather I've lived with for four years—where white noise became the only reliable relief. In this context, the sculpture becomes a kind of sonic prosthesis, a quiet companion humming gently in the background, made by and for its maker.\n\nThis is not a spectacle. It's a machine for listening. A contradiction between industrial form and soft sound. An object that operates in the background, inviting focused attention through its very persistence. Rain Reminders is a reminder—of time, of noise, of stillness, and of the rituals we build to live beside them.",
          medium:
            "Motorized kinetic sculpture, acoustic rain stick, wood, steel, raw hardware, exposed electronics",
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
            "./assets/images/rain-stick-1.JPG"
          ]
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
              embedId: "520992353",
              coverArt: "https://f4.bcbits.com/img/a2895831314_3.jpg"
            }
          ]
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
              embedId: "4106544270",
              coverArt: "https://f4.bcbits.com/img/a3078624707_3.jpg"
            }
          ]
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
              coverArt: "https://f4.bcbits.com/img/a3367478296_3.jpg"
            },
            {
              title: "stranded deep",
              trackId: "2338898025",
              url: "https://asymmetrica.bandcamp.com/track/stranded-deep",
              embedId: "2338898025",
              coverArt: "https://f4.bcbits.com/img/a0936658150_3.jpg"
            }
          ]
        }
      ],

      performance: [
        {
          id: "gesture-performance-system",
          title: "Gesture-Controlled Performance System",
          description:
            "A modular gesture-driven audiovisual system where the body becomes the instrument—generating sound, visuals, and presence in real time.",
          fullDescription:
            "This ongoing system merges gesture detection, real-time sound design, and generative visuals into a single performance toolkit. Built with MediaPipe and TouchDesigner, it uses body movement to manipulate soundscapes and visuals simultaneously—blurring the lines between code, choreography, and live ritual. First presented at *Fever Dream*—a glitch-poetic installation exploring digital anxiety through spoken word and ambient sound production—the system has evolved into a modular, expressive platform for live A/V performance.",
          medium: "Gesture interfaces, real-time sound/visual generation, sensor-based interaction, ambient performance systems",
          category: "GESTURE INTERFACES • LIVE A/V • EMBODIED SYSTEMS",
          color: "electric-lime",
          themes: "Embodied interaction, real-time synthesis, performance as code, gestural language",
          technology: "MediaPipe, TouchDesigner, Python, OSC protocol, computer vision",
          images: [
            "./assets/images/fever-dream-performance.jpg",
            "./assets/images/fever-dream-performance-1.jpg",
            "./assets/images/fever-dream-poster.jpg"
          ]
        }
      ]
    },

    thesis: {
      title: "Symmetrical Fictions: Urban Landscapes as Performative Systems",
      abstract: "This thesis explores the intersection of urban soundscapes, generative systems, and speculative environments through a practice-based investigation of how environmental data can be translated into aesthetic experience. Drawing from sound studies, new materialism, and computational aesthetics, the research develops methodologies for creating responsive audio-visual installations that reveal hidden urban rhythms.\n\nThrough projects like Rain Reminders and the Asymmetrica audio collection, the work examines how digital technologies can mediate our relationship with urban environments, creating what I term \"symmetrical fictions\"—speculative narratives that emerge from the translation of environmental data into sensory experience.\n\nThe research contributes to discussions around algorithmic composition, environmental sensing, and the politics of urban space, proposing new forms of situated media art that bridge computational and phenomenological approaches to understanding place.",
      sections: [
        {
          title: "Research Methodology",
          content: "This research employs practice-based methodology, using artistic production as a primary mode of inquiry. The investigation combines:\n\n• Computational approaches to environmental data processing\n• Phenomenological analysis of urban soundscapes\n• Collaborative workshops and public installations\n• Critical reflection on technological mediation"
        }
      ]
    },

    contact: {
      description: "Interested in collaboration, commissions, or discussing research intersections around sound, technology, and environment.",
      about: {
        name: "Atharva Gupta",
        image: "https://audiodevout.github.io/assets/images/atharva.jpeg",
        description: "I am an experimental artist and researcher working at the intersection of sound, technology, and space. My practice explores how computational systems can become vehicles for meditative experience, cultural memory, and speculative futures. Through installations, performances, and research, I investigate the unstable boundaries between organic and synthetic, rational and intuitive, individual and collective.\n\nMy work often incorporates elements relating to entropy and noise, (a)symmetry, and healing through technology, reimagined through contemporary digital tools. Currently based between experimental sound activities, creative coding and academic research contexts, I develop projects that challenge techno-positivist narratives while creating space for contemplative engagement with technology.",
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
          name: "Email",
          url: "mailto:atharva152@gmail.com",
          color: "default"
        },
        {
          name: "Bandcamp",
          url: "https://asymmetrica.bandcamp.com",
          color: "saffron"
        },
        {
          name: "YouTube",
          url: "https://www.youtube.com/@audiodevout",
          color: "cerulean"
        },
        {
          name: "Instagram",
          url: "https://www.instagram.com/asymmetrica_/",
          color: "neon-magenta"
        },
        {
          name: "LinkedIn",
          url: "https://www.linkedin.com/in/atharva--gupta/",
          color: "default"
        }
      ]
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
          coursework: []
        },
        {
          degree: "Master of Arts and Culture",
          institution: "University of Groningen",
          location: "Groningen, NL",
          period: "Sep 2022 – Aug 2023",
          description: "Arts, Cognition and Criticism",
          coursework: []
        },
        {
          degree: "Bachelor of Arts",
          institution: "Christ University",
          location: "Bangalore, IN",
          period: "Aug 2017 – Jun 2020",
          description: "Triple Major: Psychology, Sociology and Literature",
          coursework: []
        }
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
            "Worked as a Visual Jockey (VJ) for events including club nights and poetry readings"
          ]
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
            "Handled day-to-day research, logistics and maintenance of equipment related to the projects"
          ]
        },
        {
          title: "Research Assistant",
          organization: "University of Groningen",
          location: "Groningen, NL",
          period: "Oct. 2022 – Aug. 2023",
          description: "Urban soundscape research project management",
          achievements: [
            "Research assistant for the project 'Listen Here Now' - A study into the urban soundscapes of Groningen by Rudolf Agricola School of Sustainable Development",
            "Oversaw core project responsibilities, participant communication, logistics, and marketing. Also including audio-visual logistics, procurement, and maintenance of equipment"
          ]
        }
      ],
      
      exhibitions: [],
      publications: [],
      awards: [],
      
      skills: {
        "Creative Practice": [
          "Art Research",
          "Art Education",
          "New Media Art", 
          "Visual Arts",
          "Cultural Research",
          "Concept Art",
          "Interactive Media",
          "Creative Concept Design",
          "Sound Design"
        ],
        "Technologies": [
          "TouchDesigner",
          "Ableton Live",
          "Arduino IDE",
          "Max (Cycling '74)",
          "Python"
        ]
      },
      
      languages: [
        { language: "English", proficiency: "Native" },
        { language: "Hindi", proficiency: "Native" },
        { language: "Dutch", proficiency: "Conversational" }
      ],
      
      interests: [
        "Interactive Audiovisual Installations",
        "Workshops", 
        "Digital Art",
        "Gaming"
      ]
    }
  };

  // Make data globally available
  window.portfolioData = portfolioData;

} catch (error) {
  console.error('Error loading portfolio data:', error);
}