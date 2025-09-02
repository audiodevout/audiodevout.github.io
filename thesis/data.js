/**
 * ATHARVA GUPTA Portfolio - Block-Based Gallery Data
 * Every element of the thesis is a discrete, variable-sized block
 * Blocks are arranged in an efficient grid and can expand for deeper exploration
 */

window.portfolioData = {
  // Site configuration
  config: {
    siteName: "ATHARVA GUPTA - Digital Gallery Portfolio",
    siteDescription: "Interactive digital gallery and thesis installation featuring modular content blocks and performative level controls.",
    author: "Atharva Gupta",
    
    // Level system settings
    levels: {
      entropy: { min: 0, max: 100, default: 30 },
      noise: { min: 0, max: 100, default: 20 },
      occupation: { min: 0, max: 100, default: 40 }
    },
    
    // Animation settings
    particleCount: 50,
    animationSpeed: 1,
    glitchIntensity: 0.3,
    
    // Breakpoints (matching CSS)
    breakpoints: {
      mobile: 480,
      tablet: 768,
      desktop: 1200
    },
    
    // Color palette
    colors: {
      primaryCyan: "#00CFFF",
      secondaryYellow: "#FFD966",
      deepNavy: "#0A0A1A",
      offWhite: "#F8F8F8"
    },
    
    // Block type definitions
    blockTypes: {
      text: { icon: "file-text", priority: 1 },
      works: { icon: "grid", priority: 2 },
      references: { icon: "bookmark", priority: 3 },
      gallery: { icon: "image", priority: 3 },
      sound: { icon: "headphones", priority: 3 },
      process: { icon: "edit-3", priority: 4 },
      tech: { icon: "code", priority: 4 },
      download: { icon: "download", priority: 4 },
      levels: { icon: "sliders", priority: 5 },
      extra: { icon: "star", priority: 5 }
    }
  },

  // Content blocks organized by section
  // Each block is a discrete, addressable piece of content
  blocks: {
    // ENTROPY SECTION BLOCKS
    "entropy-text": {
      id: "entropy-text",
      section: "entropy",
      blockType: "text",
      title: "Entropy: Order and Chaos in Digital Systems",
      summary: "Foundational framework exploring the balance between order and chaos through kinetic sculptures and ambient soundscapes.",
      content: `
        <p>Entropy serves as the foundational framework for understanding the delicate balance between order and chaos in digital systems. Through kinetic sculptures and ambient soundscapes, this body of work explores how controlled randomness can generate meaningful patterns and emergent behaviors.</p>
        
        <p>The concept of entropy in information theory, originally proposed by Claude Shannon, becomes a lens through which we can examine the degradation and transformation of digital signals. Each kinetic sculpture in this series responds to real-time data streams, translating abstract information into physical movement and spatial relationships.</p>
        
        <p>These works challenge the traditional boundaries between digital and physical realms, creating hybrid spaces where data becomes tangible and movement becomes meaningful. The resulting installations invite viewers to contemplate the inherent unpredictability within seemingly ordered systems.</p>
        
        <p>Through the manipulation of feedback loops, sensor networks, and generative algorithms, these pieces demonstrate how entropy can be harnessed as a creative force rather than merely a destructive one. The goal is not to eliminate chaos, but to find beauty and meaning within it.</p>
      `,
      sizeHint: "large",
      levelAffinities: { entropy: 80, noise: 30, occupation: 20 },
      tags: ["theory", "entropy", "kinetic", "digital systems"],
      date: "2024",
      media: []
    },
    
    "entropy-works": {
      id: "entropy-works",
      section: "entropy",
      blockType: "works",
      title: "Entropy Works Index",
      summary: "Interactive registry of kinetic sculptures and system processes exploring chaos theory.",
      content: "Collection of works investigating entropy through physical and digital manifestations.",
      sizeHint: "medium",
      levelAffinities: { entropy: 60, noise: 20, occupation: 30 },
      tags: ["works", "kinetic", "data visualization"],
      works: [
        {
          id: "data-streams",
          title: "Data Streams in Motion",
          year: "2024",
          thumbnail: "assets/images/data-streams-thumb.jpg",
          summary: "Kinetic sculpture translating real-time network traffic into fluid mechanical movements.",
          details: `
            <p>Data Streams in Motion is an interactive kinetic sculpture that visualizes internet traffic through a series of suspended mechanical elements. Using real-time network data from public APIs, the sculpture translates packet flows, bandwidth usage, and connection patterns into graceful mechanical movements.</p>
            
            <p>The installation consists of twelve suspended pendulums, each representing different types of network activity. As data flows through global networks, the pendulums respond with varying speeds, amplitudes, and synchronization patterns, creating an ever-changing choreography that mirrors the invisible digital landscape surrounding us.</p>
            
            <p>The technical implementation combines Arduino microcontrollers with servo motors and WiFi modules to create a responsive system that updates every few seconds. The aesthetic draws inspiration from Alexander Calder's mobile sculptures while incorporating contemporary themes of data surveillance and digital dependency.</p>
          `,
          media: [
            {
              type: "youtube",
              id: "dQw4w9WgXcQ",
              alt: "Data Streams in Motion - Documentation video"
            },
            {
              type: "image",
              url: "assets/images/data-streams-installation.jpg",
              alt: "Gallery view of Data Streams in Motion installation"
            }
          ],
          links: [
            {
              label: "Source Code",
              url: "https://github.com/atharva-gupta/data-streams",
              icon: "github"
            }
          ],
          tags: ["kinetic", "data visualization", "interactive", "arduino"]
        },
        {
          id: "algorithmic-pendulum",
          title: "Algorithmic Pendulum Series",
          year: "2023",
          thumbnail: "assets/images/pendulum-series-thumb.jpg",
          summary: "Collection of autonomous pendulum systems generating unique patterns based on chaos theory.",
          details: `
            <p>The Algorithmic Pendulum Series explores the intersection of deterministic systems and chaotic behavior through a collection of seven custom-built pendulum mechanisms. Each pendulum operates according to different mathematical models, from simple harmonic motion to complex multi-body dynamics.</p>
            
            <p>What makes these pendulums unique is their ability to sense and respond to environmental conditions. Temperature fluctuations, sound levels, air pressure changes, and even electromagnetic interference subtly influence their movement patterns, creating a feedback loop between the physical environment and the mathematical algorithms governing their motion.</p>
          `,
          media: [
            {
              type: "image",
              url: "assets/images/pendulum-series-gallery.jpg",
              alt: "Seven algorithmic pendulums in gallery setting"
            }
          ],
          tags: ["chaos theory", "mathematics", "sensors", "generative"]
        }
      ]
    },
    
    "entropy-gallery": {
      id: "entropy-gallery",
      section: "entropy",
      blockType: "gallery",
      title: "Entropy Gallery",
      summary: "Visual documentation of kinetic installations and system processes.",
      content: "High-resolution images and video documentation from entropy-based works.",
      sizeHint: "medium",
      levelAffinities: { entropy: 50, noise: 10, occupation: 15 },
      tags: ["gallery", "documentation", "images"],
      media: [
        {
          type: "image",
          url: "assets/images/entropy-installation-01.jpg",
          thumbnail: "assets/images/entropy-installation-01-thumb.jpg",
          alt: "Kinetic sculpture installation view",
          caption: "Data Streams in Motion - Gallery installation view"
        },
        {
          type: "image",
          url: "assets/images/entropy-installation-02.jpg",
          thumbnail: "assets/images/entropy-installation-02-thumb.jpg",
          alt: "Pendulum system in motion",
          caption: "Algorithmic Pendulum Series - Motion study"
        },
        {
          type: "image",
          url: "assets/images/process-documentation.jpg",
          thumbnail: "assets/images/process-documentation-thumb.jpg",
          alt: "Technical process documentation",
          caption: "Build process and sensor integration"
        }
      ]
    },
    
    "entropy-sound": {
      id: "entropy-sound",
      section: "entropy",
      blockType: "sound",
      title: "Entropy Sound Archive",
      summary: "Ambient recordings and generative soundscapes from entropy-based installations.",
      content: "Collection of field recordings, system sounds, and ambient compositions generated through entropy processes.",
      sizeHint: "small",
      levelAffinities: { entropy: 70, noise: 60, occupation: 20 },
      tags: ["sound", "ambient", "generative", "field recording"],
      media: [
        {
          type: "audio",
          url: "assets/audio/data-stream-ambient.mp3",
          title: "Data Stream Ambient Mix",
          duration: "12:34",
          description: "Ambient composition generated from network traffic patterns"
        },
        {
          type: "audio",
          url: "assets/audio/pendulum-resonance.mp3",
          title: "Pendulum Resonance Study",
          duration: "8:42",
          description: "Field recording of mechanical pendulum systems"
        }
      ]
    },
    
    "entropy-process": {
      id: "entropy-process",
      section: "entropy",
      blockType: "process",
      title: "Entropy Process Journal",
      summary: "Build logs, iterations, and development process for entropy-based works.",
      content: "Documentation of the creative and technical process behind entropy installations.",
      sizeHint: "small",
      levelAffinities: { entropy: 90, noise: 30, occupation: 60 },
      tags: ["process", "development", "iteration", "documentation"],
      entries: [
        {
          date: "2024-03-15",
          title: "Initial servo motor tests",
          content: "Testing different servo motors for pendulum responsiveness. High-torque servos provide better control but create more noise."
        },
        {
          date: "2024-03-20", 
          title: "Network API integration",
          content: "Successfully integrated real-time network traffic data. Packet flow visualization working but needs smoothing algorithms."
        },
        {
          date: "2024-04-01",
          title: "Gallery installation challenges",
          content: "Power distribution issues in gallery space. Redesigned power system with distributed controllers."
        }
      ]
    },

    // NOISE SECTION BLOCKS
    "noise-text": {
      id: "noise-text",
      section: "noise",
      blockType: "text",
      title: "Noise: Signal, Interference, and Creative Disruption",
      summary: "Exploring noise as both breakdown of communication and source of creative material.",
      content: `
        <p>Noise, in its purest form, represents the breakdown of signal integrity and the emergence of unintended information. This section examines noise not as an unwanted byproduct of communication systems, but as a rich source of creative material and theoretical inquiry.</p>
        
        <p>Building upon the work of theorists like Michel Serres and Douglas Kahn, these experiments explore how noise functions as both interference and revelation. Digital noise, in particular, offers unique insights into the materiality of supposedly immaterial technologies, exposing the physical substrate underlying our digital abstractions.</p>
        
        <p>The projects in this section employ various forms of intentional signal degradation, circuit bending, and algorithmic corruption to create new forms of sonic expression. By amplifying the errors, glitches, and failures inherent in digital systems, these works reveal the aesthetic potential hidden within technological breakdown.</p>
      `,
      sizeHint: "large",
      levelAffinities: { entropy: 40, noise: 90, occupation: 30 },
      tags: ["theory", "noise", "signal processing", "glitch"],
      date: "2024"
    },
    
    "noise-works": {
      id: "noise-works",
      section: "noise",
      blockType: "works",
      title: "Noise Works Index",
      summary: "Sound experiments, circuit-bent instruments, and algorithmic corruption projects.",
      content: "Collection of works exploring noise as creative material and theoretical framework.",
      sizeHint: "medium",
      levelAffinities: { entropy: 30, noise: 80, occupation: 25 },
      tags: ["works", "circuit bending", "experimental sound"],
      works: [
        {
          id: "circuit-bent-radio",
          title: "Circuit-Bent Radio Collective",
          year: "2023",
          thumbnail: "assets/images/circuit-bent-radio-thumb.jpg",
          summary: "Network of modified radio receivers creating collaborative noise compositions.",
          details: `
            <p>The Circuit-Bent Radio Collective transforms discarded radio equipment into a distributed noise-making network. By modifying the internal circuitry of AM/FM radios, shortwave receivers, and police scanners, this project creates an ensemble of instruments that generate sound through electromagnetic interference and signal corruption.</p>
            
            <p>Each modified radio becomes a unique voice in the collective, responding to local electromagnetic conditions, radio frequency pollution, and intentional signal manipulation. The modifications include added contact points, variable resistors, light sensors, and feedback loops that transform these consumer devices into experimental sound generators.</p>
          `,
          media: [
            {
              type: "bandcamp",
              id: "2847362847",
              alt: "Circuit-Bent Radio Collective - Live performance"
            }
          ],
          tags: ["circuit bending", "radio", "collaborative", "electromagnetic"]
        }
      ]
    },

    // OCCUPATION SECTION BLOCKS  
    "occupation-text": {
      id: "occupation-text",
      section: "occupation",
      blockType: "text",
      title: "Occupation: Digital Technologies and Human Practice",
      summary: "Examining how digital technologies shape learning, working, and resistance practices.",
      content: `
        <p>Occupation examines the ways in which digital technologies shape and are shaped by human practices of learning, working, and being. This section documents performance works and educational interventions that explore the political and social dimensions of our relationship with digital systems.</p>
        
        <p>The concept of "occupation" operates on multiple levels: the literal occupation of physical and digital spaces, the professional occupation of working with technology, and the political occupation of resisting dominant technological narratives. These works investigate how bodies, spaces, and technologies intersect in complex networks of power and resistance.</p>
        
        <p>Drawing from critical pedagogy traditions, particularly the work of Paulo Freire and bell hooks, these projects emphasize collaborative learning and knowledge production. They challenge traditional hierarchies between teacher and student, expert and novice, by creating spaces for mutual discovery and shared inquiry.</p>
      `,
      sizeHint: "large",
      levelAffinities: { entropy: 20, noise: 30, occupation: 85 },
      tags: ["theory", "pedagogy", "performance", "digital labor"],
      date: "2024"
    },
    
    "occupation-works": {
      id: "occupation-works", 
      section: "occupation",
      blockType: "works",
      title: "Occupation Works Index",
      summary: "Performance documentation, educational projects, and pedagogical interventions.",
      content: "Collection of works exploring the intersection of technology, labor, and education.",
      sizeHint: "medium",
      levelAffinities: { entropy: 25, noise: 20, occupation: 75 },
      tags: ["works", "performance", "education", "critical pedagogy"],
      works: [
        {
          id: "data-labor-performance",
          title: "Data Labor Performance Series",
          year: "2024",
          thumbnail: "assets/images/data-labor-performance-thumb.jpg",
          summary: "Durational performances making visible hidden labor in AI training and digital infrastructure.",
          details: `
            <p>The Data Labor Performance Series consists of endurance-based performances that physically embody the repetitive, invisible labor required to maintain contemporary digital systems. Each performance focuses on a different aspect of digital labor: data entry, content moderation, image labeling, and algorithm training.</p>
            
            <p>In "Mechanical Turk," performers spend eight hours manually labeling images for machine learning datasets, with all actions projected publicly and wages calculated in real-time. "Content Moderator" involves reviewing and categorizing social media content according to platform guidelines, exposing the psychological toll of this work through physical and emotional responses.</p>
          `,
          media: [
            {
              type: "youtube",
              id: "dQw4w9WgXcQ",
              alt: "Data Labor Performance - Mechanical Turk documentation"
            }
          ],
          tags: ["performance", "labor", "digital economy", "endurance"]
        }
      ]
    },

    // EXTRAS SECTION BLOCKS
    "extras-text": {
      id: "extras-text",
      section: "extras",
      blockType: "text", 
      title: "Archives, Downloads, and Hidden Nodes",
      summary: "Supplementary materials, technical resources, and experimental fragments.",
      content: `
        <p>This section contains the supporting infrastructure of the thesis: downloadable resources, technical documentation, bibliographic materials, and experimental fragments that didn't fit neatly into the main sections but contribute to the overall investigation.</p>
        
        <p>The concept of "extras" reflects the reality that creative research generates many byproducts, failed experiments, and tangential explorations that nonetheless inform the primary work. Rather than hide these materials, this section makes them available for others to discover, learn from, and build upon.</p>
      `,
      sizeHint: "medium",
      levelAffinities: { entropy: 60, noise: 40, occupation: 50 },
      tags: ["archives", "documentation", "resources"],
      date: "2024"
    },
    
    "extras-downloads": {
      id: "extras-downloads",
      section: "extras",
      blockType: "download",
      title: "Downloads & Resources",
      summary: "Thesis documents, source code, schematics, and reproducible materials.",
      content: "Complete archive of materials for reproduction, citation, and further development.",
      sizeHint: "small",
      levelAffinities: { entropy: 30, noise: 30, occupation: 70 },
      tags: ["downloads", "open source", "documentation"],
      downloads: [
        {
          title: "Complete Thesis PDF",
          description: "Full thesis document with citations and appendices",
          url: "#",
          format: "PDF",
          size: "2.3 MB"
        },
        {
          title: "Source Code Archive",
          description: "Arduino code, Max patches, and processing sketches",
          url: "#",
          format: "ZIP",
          size: "15.7 MB"
        },
        {
          title: "Circuit Diagrams",
          description: "Schematics and wiring diagrams for all installations",
          url: "#", 
          format: "PDF",
          size: "8.4 MB"
        }
      ]
    },
    
    "extras-references": {
      id: "extras-references",
      section: "extras",
      blockType: "references",
      title: "References & Bibliography",
      summary: "Comprehensive bibliography and theoretical foundations for the thesis work.",
      content: "Key texts, papers, and sources that inform the theoretical framework of this research.",
      sizeHint: "medium",
      levelAffinities: { entropy: 20, noise: 20, occupation: 80 },
      tags: ["references", "theory", "bibliography"],
      references: [
        {
          title: "The Parasite",
          author: "Michel Serres",
          year: "1982",
          type: "book",
          annotation: "Foundational text on noise theory and communication systems."
        },
        {
          title: "Noise, Water, Meat: A History of Sound in the Arts",
          author: "Douglas Kahn",
          year: "1999",
          type: "book",
          annotation: "Essential reading on sound art and experimental audio practices."
        },
        {
          title: "Pedagogy of the Oppressed",
          author: "Paulo Freire",
          year: "1970",
          type: "book",
          annotation: "Critical pedagogy framework applied to technology education."
        }
      ]
    },
    
    "extras-archives": {
      id: "extras-archives",
      section: "extras",
      blockType: "archive",
      title: "Project Archives",
      summary: "Historical documentation and development archives from past projects.",
      content: "Complete documentation archive including process notes, correspondence, and development materials.",
      sizeHint: "small",
      levelAffinities: { entropy: 70, noise: 40, occupation: 60 },
      tags: ["archive", "documentation", "history"],
      archives: [
        {
          title: "Early Circuit Bending Experiments (2020-2021)",
          description: "Documentation from initial hardware modification experiments",
          items: 45,
          url: "assets/archives/early-circuit-bending.zip"
        },
        {
          title: "Performance Documentation Archive",
          description: "Complete video and photo documentation from all performances",
          items: 127,
          url: "assets/archives/performance-docs.zip"
        }
      ]
    }
  },

  // Section metadata for navigation and organization
  sections: {
    entropy: {
      title: "Entropy",
      subtitle: "Kinetic sculptures, system processes, and ambient recordings",
      description: "Exploring order and chaos in digital systems through physical and computational works.",
      blocks: ["entropy-text", "entropy-works", "entropy-gallery", "entropy-sound", "entropy-process"]
    },
    noise: {
      title: "Noise", 
      subtitle: "Sound experiments, glitch audio, and noise theory reflections",
      description: "Investigating noise as creative material and theoretical framework for understanding technological breakdown.",
      blocks: ["noise-text", "noise-works"]
    },
    occupation: {
      title: "Occupation",
      subtitle: "Performance documentation, educational works, and pedagogy reflections", 
      description: "Examining the intersection of digital technologies with human practices of learning, working, and resistance.",
      blocks: ["occupation-text", "occupation-works"]
    },
    extras: {
      title: "Extras",
      subtitle: "Bibliography, archives, downloadable thesis, and hidden nodes",
      description: "Supporting materials, technical resources, and experimental fragments.",
      blocks: ["extras-text", "extras-downloads", "extras-references", "extras-archives"]
    }
  }
};