/**
 * data.js - Portfolio Content Data
 * Centralized data structure for thesis portfolio content
 */

try {
  const portfolioData = {
    projects: {
      soundInstallations: [
        {
          id: "rain-reminders",
          title: "Rain Reminders",
          description: "A 1.8-meter-tall kinetic sound sculpture featuring a slowly rotating rain stick suspended on a raw wooden and steel armature.",
          fullDescription: "Rain Reminders is a meditative kinetic installation that reimagines the rain stick—not as a novelty or ritual toy, but as a durational sound object. The sculpture features a custom motor-driven rotation system that turns a handmade 80 cm rain stick slowly on its horizontal axis. As it rotates, seeds cascade inside, producing a gentle, unamplified texture reminiscent of rainfall.\n\nConstructed from coarse and industrial materials—steel square tube, raw plywood, coir matting, and exposed electronics—the work emphasizes transparency and honesty in its construction. The exposed motor and wiring become part of the aesthetic, rejecting sleek concealment in favor of an accessible, hand-made quality.\n\nThis work sits at the intersection of kinetic art, sound art, and meditative practice. It functions as both a sculptural object and a generator of durational sound—offering viewers an extended, contemplative encounter with an otherwise familiar instrument. The slow, hypnotic rotation creates subtle variations in the cascading rhythm, ensuring that no two listenings are identical while maintaining an overall sense of consistency and calm.",
          medium: "Motorized kinetic sculpture, acoustic rain stick, wood, steel, raw hardware, exposed electronics",
          category: "KINETIC SCULPTURE • NOISE • ARDUINO",
          color: "saffron",
          dimensions: "1.8m (height)",
          technical: "Custom low-RPM motor system, handmade rain stick with internal grain cascade, steel and wood framework, coir matting",
          themes: "Tinnitus and White Noise, Acoustic Ritual and Duration, Dadaism and Raw Construction, Meditative Distraction",
          images: [
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Rain+Stick+Installation",
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Rain+Stick+Detail",
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Rain+Stick+Motor"
          ]
        },
        {
          id: "asymmetrica-symmetrical-fictions",
          title: "Symmetrical Fictions",
          description: "A generative composition shaped by real-time weather data, translating environmental conditions into shifting sonic structures.",
          fullDescription: "Symmetrical Fictions is a generative sound work sculpted from temperature, humidity, and precipitation data. These inputs are mapped to frequency modulations, pitch deviations, and rhythmic bursts. The track extends the core of the Symmetrical Fictions project—an exploration of urban landscapes and unseen forces as performative systems. The result is ambient yet unstable, synthetic in texture but grounded in natural rhythms. A sonic architecture built from the invisible patterns that surround us.",
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
          fullDescription: "This ongoing system merges gesture detection, real-time sound design, and generative visuals into a single performance toolkit. Built with MediaPipe and TouchDesigner, it uses body movement to manipulate soundscapes and visuals simultaneously—blurring the lines between code, choreography, and live ritual. First presented at *Fever Dream*—a glitch-poetic installation exploring digital anxiety through spoken word and ambient sound production—the system creates an embodied interface where the performer's gestures directly translate into sonic and visual parameters. The work questions traditional boundaries between audience and performer, technology and body, composition and improvisation.",
          medium: "Gesture interfaces, real-time sound/visual generation, sensor-based interaction, ambient performance systems",
          category: "GESTURE INTERFACES • LIVE A/V • EMBODIED SYSTEMS",
          themes: "Embodied computation, glitch aesthetics, subconscious interaction, ambient sound design, poetic control systems",
          tags: "INTERACTIVE • GESTURE • AUDIOVISUAL • SENSORIAL • REAL-TIME",
          color: "cerulean",
          technical: "MediaPipe, TouchDesigner, Python, real-time audio synthesis, custom control pipelines",
          images: [
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Fever+Dream+Performance",
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Gesture+System+Setup",
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Performance+Poster"
          ]
        }
      ],

      installations: [
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
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+1", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+2", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+3", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+4"
          ],
          urls: {
            pdf: "https://via.placeholder.com/400x300/f5f5f5/666666?text=PDF+Placeholder"
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
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Ritual+Computing+1", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Ritual+Computing+2", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Ritual+Computing+3"
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
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Digital+Sketch+1",
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Digital+Sketch+2",
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Digital+Sketch+3"
          ]
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
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+1", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+2", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+3", 
            "https://via.placeholder.com/800x600/f5f5f5/666666?text=Symmetrical+Fictions+4"
          ],
          urls: {
            pdf: "https://via.placeholder.com/400x300/f5f5f5/666666?text=PDF+Placeholder"
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
          images: ["https://via.placeholder.com/800x600/f5f5f5/666666?text=Nervous+Systems+Exhibition"],
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
          images: ["https://via.placeholder.com/800x600/f5f5f5/666666?text=Fever+Dream+Poster"]
        }
      ]
    },

    contact: {
      about: {
        title: "About",
        description: "I am an experimental artist and researcher working at the intersection of sound, technology, and space. My practice explores how computational systems can become vehicles for meditative experience, cultural memory, and speculative futures. Through installations, performances, and research, I investigate the unstable boundaries between organic and synthetic, rational and intuitive, individual and collective. My work often incorporates elements relating to entropy and noise, (a)symmetry, and healing through technology, reimagined through contemporary digital tools. Currently based between experimental sound activities, creative coding and academic research contexts, I develop projects that challenge techno-positivist narratives while creating space for contemplative engagement with technology.",
        image: "https://via.placeholder.com/400x400/f5f5f5/666666?text=Artist+Portrait",
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