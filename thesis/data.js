
/**
 * Portfolio Data Structure
 * Clean, minimal data for white cube gallery presentation
 */

// Transform the new data structure to match the expected format
function transformPortfolioData() {
  const newData = {
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
          id: "gesture-performance-system",
          title: "Gesture-Controlled Performance System",
          description:
            "A modular gesture-driven audiovisual system where the body becomes the instrument—generating sound, visuals, and presence in real time.",
          fullDescription:
            "This ongoing system merges gesture detection, real-time sound design, and generative visuals into a single performance toolkit. Built with MediaPipe and TouchDesigner, it uses body movement to manipulate soundscapes and visuals simultaneously—blurring the lines between code, choreography, and live ritual. First presented at *Fever Dream*—a glitch-poetic installation exploring digital anxiety through spoken word and ambient sound production—the system has evolved into a modular, expressive platform for live A/V performance. The gestures control everything from glitchy textures and drone tones to cinematic pulses and dynamic projections, all shaped by an ambient, meditative coding process rooted in presence and flow. It is not just a tool, but a responsive ecosystem—sensorial, poetic, and embodied.",
          medium: "Gesture interfaces, real-time sound/visual generation, sensor-based interaction, ambient performance systems",
          category: "GESTURE INTERFACES • LIVE A/V • EMBODIED SYSTEMS",
          themes: "Embodied computation, glitch aesthetics, subconscious interaction, ambient sound design, poetic control systems",
          color: "cerulean",
          technical: "MediaPipe, TouchDesigner, Python, real-time audio synthesis, custom control pipelines",
          images: [
            "./assets/images/fever-dream-performance.jpg",
            "./assets/images/fever-dream-performance-1.jpg",
            "./assets/images/fever-dream-poster.jpg"
          ]
        },
        {
          id: "symmetrical-fictions",
          title: "Symmetrical Fictions: On the Ir/Rationality of Symmetry, and the Aesthetics of Reclamation v1",
          description: "A video installation and research project that reimagines satellite imagery as symmetrical, speculative geographies exploring planetary memory and unconscious visual structure.",
          fullDescription: "Symmetrical Fictions is a video installation and research project that challenges the boundaries between rationality and fiction, technology and unconscious structure, by recomposing satellite imagery into speculative, symmetrical geographies. Drawing from satellite datasets, the installation mirrors and tiles planetary surfaces creating impossible yet eerily coherent landscapes.",
          medium: "Video installation, satellite imagery recomposition, speculative cartography",
          category: "INSTALLATION & RESEARCH",
          color: "cerulean",
          themes: "Symmetry, planetary imagination, entropy, surveillance subversion, poetic cartography",
          images: ["./assets/images/39.jpg", "./assets/images/72.jpg", "./assets/images/73.jpg", "./assets/images/6.jpg"],
          urls: {
            pdf: "./assets/documents/symmetrical-fictions-paper.pdf",
          },
        }
      ],
      performance: [],
      generativeAV: [],
      interactive: [],
      drawings: [
        {
          id: "ritual-computing-solo-sessions",
          title: "Ritual Computing and Coding Sessions",
          description: "Solo sessions of meditative coding and sketching in TouchDesigner—private rituals of thought, structure, and experimentation.",
          fullDescription: "These sessions are personal, introspective rituals where code becomes a tool for artistic inquiry and self-reflection. They are not participatory performances but private explorations—into the aesthetics of computation, the poetics of systems, and the possibilities of AI as a creative collaborator. Through repeated practice, I engage with code as both medium and method, researching form, structure, and the intersection of technology with artistic process.",
          medium: "Code sketching, procedural visuals, AI collaboration",
          category: "SOLO • RESEARCH-BASED",
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
          color: "cerulean",
          documentation: "Archived drawings from early digital sessions",
          images: [
            "./assets/images/old drawing (1).jpg",
            "./assets/images/old drawing (2).jpg",
            "./assets/images/old drawing (3).jpg",
            "./assets/images/old drawing (4).jpg",
            "./assets/images/old drawing (6).jpg"
          ],
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
          id: "nervous-systems-kel30",
          title: "Nervous Systems",
          description: "A group exhibition by first-year MADTech students at KEL-30.",
          fullDescription:
            "Presented on July 24th, this exhibition showcased experimental and interdisciplinary works by the first-year MADTech students, exploring themes of connectivity, embodiment, and emergent systems within new media and contemporary art.",
          medium: "Installation, performance, new media",
          category: "EXHIBITION",
          color: "electric-blue",
          themes: "Connectivity, embodiment, emergent systems, interdisciplinary collaboration",
          images: ["./assets/images/nervous-system-1.jpg"],
          urls: {}
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
          images: [
            "./assets/images/fever-dream-poster.jpg"
          ],          
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
        Currently based between experimental sound activities, creative coding and academic research contexts, I develop projects that challenge techno-positivist 
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
  };

  return newData;
}

// Convert projects structure to works format for the existing rendering system
function createWorksFromProjects(projects) {
  const works = [];
  
  // Combine all project categories into a single works array
  Object.values(projects).forEach(category => {
    if (Array.isArray(category)) {
      category.forEach(project => {
        const work = {
          id: project.id,
          title: project.title,
          type: project.category || project.medium,
          year: project.year || "2024",
          media: project.medium,
          description: project.description,
          fullDescription: project.fullDescription,
          images: project.images ? project.images.map(src => ({
            src: src,
            alt: `${project.title} - artwork image`,
            caption: project.title
          })) : [],
          audio: project.bandcampTracks ? project.bandcampTracks.map(track => ({
            title: track.title,
            duration: "Variable",
            description: track.url
          })) : [],
          video: project.videos ? project.videos.map(video => ({
            title: project.title,
            duration: "Variable", 
            description: video
          })) : []
        };
        works.push(work);
      });
    }
  });
  
  return works;
}

// Initialize the portfolio data
const portfolioData = transformPortfolioData();

window.portfolioData = {
  // Site configuration
  config: {
    siteName: "Atharva Gupta",
    author: "Atharva Gupta",
    description: "Experimental artist and researcher working at the intersection of sound, technology, and space"
  },

  // Works collection - converted from projects structure
  works: createWorksFromProjects(portfolioData.projects),

  // Thesis sections
  thesis: {
    title: "Digital Materiality and Performative Systems",
    subtitle: "A Practice-Based Investigation into Contemporary Art and Technology",
    year: "2025",
    abstract: "This thesis examines the intersection of digital technology and physical materiality through a practice-based approach, investigating how contemporary artists navigate the boundaries between virtual and physical realms through kinetic sculpture, sound art, and performance.",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        content: `
          <p>The relationship between digital technology and physical materiality has become increasingly complex in contemporary art practice. This research investigates how artists working at the intersection of technology and materiality create new forms of embodied experience and meaning-making.</p>
          
          <p>Through a practice-based methodology, this thesis examines three key areas of investigation: entropy and system processes, noise and signal disruption, and spatial occupation and pedagogy. Each area represents a different approach to understanding how digital systems can be made tangible and experiential.</p>
          
          <p>The research question driving this investigation is: How can practice-based research in digital art reveal new understandings of materiality, presence, and embodiment in technological systems?</p>
        `
      },
      {
        id: "entropy",
        title: "Entropy: Order and Chaos in Digital Systems",
        content: `
          <p>Entropy serves as the foundational framework for understanding the delicate balance between order and chaos in digital systems. Through kinetic sculptures and ambient soundscapes, this body of work explores how controlled randomness can generate meaningful patterns and emergent behaviors.</p>

          <p>The concept of entropy in information theory, originally proposed by Claude Shannon, becomes a lens through which we can examine the degradation and transformation of digital signals. Each kinetic sculpture in this series responds to real-time data streams, translating abstract information into physical movement and spatial relationships.</p>

          <blockquote>
            <p>"The goal is not to eliminate chaos, but to find beauty and meaning within it."</p>
          </blockquote>

          <p>These works challenge the traditional boundaries between digital and physical realms, creating hybrid spaces where data becomes tangible and movement becomes meaningful. The resulting installations invite viewers to contemplate the inherent unpredictability within seemingly ordered systems.</p>

          <p>Through the manipulation of feedback loops, sensor networks, and generative algorithms, these pieces demonstrate how entropy can be harnessed as a creative force rather than merely a destructive one.</p>
        `
      },
      {
        id: "noise",
        title: "Noise: Signal, Interference, and Creative Disruption",
        content: `
          <p>Noise, in its purest form, represents the breakdown of signal integrity and the emergence of unintended information. This section examines noise not as an unwanted byproduct of communication systems, but as a rich source of creative material and theoretical inquiry.</p>

          <p>Drawing from the work of theorists like Paul Virilio and Friedrich Kittler, this research explores how digital noise reveals the underlying material conditions of technological systems. When digital signals degrade, glitch, or fail, they expose the physical substrate that supports all digital communication.</p>

          <p>The installations in this series use real-time audio processing to create feedback loops that generate complex, evolving soundscapes. By amplifying and processing the inherent noise within electronic systems, these works make audible the usually invisible processes of digital computation and signal transmission.</p>

          <p>This approach to noise as creative material suggests new ways of understanding the relationship between intention and accident, control and chaos, in digital media systems.</p>
        `
      },
      {
        id: "occupation",
        title: "Occupation: Space, Presence, and Pedagogy",
        content: `
          <p>The concept of occupation in this research refers to how bodies, both human and technological, claim and transform space through their presence and activity. This section examines the pedagogical dimensions of artistic practice and how performance can serve as a form of institutional critique.</p>

          <p>Through a series of performance works and educational interventions, this research investigates how artistic practice can challenge conventional understandings of learning, teaching, and knowledge production. These works often take place in institutional settings—galleries, classrooms, public spaces—and examine how different bodies are welcomed or excluded from these environments.</p>

          <p>The performative aspects of this work draw from traditions of institutional critique while engaging with contemporary questions about access, representation, and the democratization of knowledge. Each intervention is designed to create new possibilities for engagement and participation.</p>

          <p>By documenting and reflecting on these pedagogical experiments, this research contributes to ongoing conversations about the role of art in education and the potential for artistic practice to model alternative forms of social organization.</p>
        `
      },
      {
        id: "conclusion",
        title: "Conclusion",
        content: `
          <p>This practice-based research has demonstrated that working at the intersection of digital technology and physical materiality opens up new possibilities for understanding embodiment, presence, and meaning-making in contemporary art.</p>

          <p>Through the three areas of investigation—entropy, noise, and occupation—this research has shown how digital systems can be made tangible and experiential through artistic intervention. Each approach reveals different aspects of how technology shapes and is shaped by human experience.</p>

          <p>The works produced through this research contribute to a growing body of practice-based knowledge about digital materiality while opening up new questions for future investigation. As technology continues to evolve, the need for critical artistic engagement with these systems becomes ever more urgent.</p>

          <p>This research suggests that practice-based methodologies are particularly well-suited to investigating questions about technology and materiality, as they allow for experiential and embodied ways of knowing that complement more traditional forms of academic inquiry.</p>
        `
      }
    ],
    references: [
      {
        author: "Shannon, Claude",
        title: "A Mathematical Theory of Communication",
        year: "1948",
        description: "Foundational text on information theory and signal entropy"
      },
      {
        author: "Calder, Alexander",
        title: "Kinetic Sculptures",
        year: "1930s-1970s",
        description: "Aesthetic inspiration for mechanical movement and balance"
      },
      {
        author: "Wiener, Norbert",
        title: "Cybernetics: Or Control and Communication in the Animal and the Machine",
        year: "1948",
        description: "Framework for feedback loops and responsive systems"
      },
      {
        author: "Virilio, Paul",
        title: "The Accident of Art",
        year: "2005",
        description: "Theoretical framework for understanding technological accidents"
      },
      {
        author: "Kittler, Friedrich",
        title: "Gramophone, Film, Typewriter",
        year: "1999",
        description: "Material analysis of media technologies"
      }
    ]
  },

  // About information
  about: portfolioData.contact.about ? {
    bio: portfolioData.contact.about.description,
    education: [
      {
        degree: "MADTech Program",
        institution: "Minerva Academy",
        year: "2025"
      }
    ],
    exhibitions: [
      {
        title: "Nervous Systems",
        venue: "KEL-30",
        year: "2024",
        type: "Group Exhibition"
      },
      {
        title: "Fever Dream",
        venue: "Minerva Academy",
        year: "2024",
        type: "Performance"
      }
    ],
    contact: {
      email: "contact@example.com",
      website: "https://atharvagupta.github.io"
    }
  } : {
    bio: `
      <p>Atharva Gupta is an experimental artist and researcher working at the intersection of sound, technology, and space. Their practice explores how computational systems can become vehicles for meditative experience, cultural memory, and speculative futures.</p>
      
      <p>Working at the boundaries between art, technology, and pedagogy, Gupta creates installations and performances that invite audiences to consider the material conditions of digital systems and their impact on human experience.</p>
      
      <p>Their current research focuses on entropy, noise, and spatial occupation as frameworks for understanding the relationship between digital and physical realms in contemporary art practice.</p>
    `,
    education: [
      {
        degree: "MADTech Program",
        institution: "Minerva Academy",
        year: "2025"
      }
    ],
    exhibitions: [
      {
        title: "Nervous Systems",
        venue: "KEL-30",
        year: "2024",
        type: "Group Exhibition"
      }
    ],
    contact: {
      email: "contact@example.com",
      website: "https://atharvagupta.github.io"
    }
  }
};
