
/**
 * ATHARVA GUPTA Portfolio - Block-Based Gallery Data
 * Complete data structure with canonical blocks for each section
 */

window.portfolioData = {
  // Site configuration
  config: {
    siteName: "ATHARVA GUPTA - Digital Gallery Portfolio",
    siteDescription: "Interactive digital gallery and thesis installation featuring modular content blocks and performative level controls.",
    author: "Atharva Gupta",

    // Block type definitions
    blockTypes: {
      text: { icon: "file-text", priority: 1 },
      works: { icon: "grid", priority: 2 },
      references: { icon: "bookmark", priority: 3 },
      gallery: { icon: "image", priority: 3 },
      sound: { icon: "headphones", priority: 3 },
      process: { icon: "edit-3", priority: 4 },
      tech: { icon: "code", priority: 4 },
      performance: { icon: "play", priority: 4 },
      download: { icon: "download", priority: 4 },
      levels: { icon: "sliders", priority: 5 },
      extras: { icon: "star", priority: 5 }
    }
  },

  // All content blocks with complete field structure
  blocks: {
    // ===== ENTROPY SECTION BLOCKS =====
    
    // Text Block (Core Writing) - Always largest/most prominent
    "entropy-text": {
      id: "entropy-text",
      section: "entropy",
      blockType: "text",
      title: "Entropy: Order and Chaos in Digital Systems",
      summary: "Foundational framework exploring the balance between order and chaos through kinetic sculptures and ambient soundscapes.",
      content: `
        <p>Entropy serves as the foundational framework for understanding the delicate balance between order and chaos in digital systems. Through kinetic sculptures and ambient soundscapes, this body of work explores how controlled randomness can generate meaningful patterns and emergent behaviors.</p>

        <p>The concept of entropy in information theory, originally proposed by Claude Shannon, becomes a lens through which we can examine the degradation and transformation of digital signals. Each kinetic sculpture in this series responds to real-time data streams, translating abstract information into physical movement and spatial relationships.</p>

        <blockquote>
          <p>"The goal is not to eliminate chaos, but to find beauty and meaning within it."</p>
        </blockquote>

        <p>These works challenge the traditional boundaries between digital and physical realms, creating hybrid spaces where data becomes tangible and movement becomes meaningful. The resulting installations invite viewers to contemplate the inherent unpredictability within seemingly ordered systems.</p>

        <p>Through the manipulation of feedback loops, sensor networks, and generative algorithms, these pieces demonstrate how entropy can be harnessed as a creative force rather than merely a destructive one.</p>
      `,
      sizeHint: "large",
      levelAffinities: { entropy: 90, noise: 30, occupation: 20 },
      tags: ["theory", "entropy", "kinetic", "digital systems"],
      date: "2025",
      credits: "",
      download: false
    },

    // Works Block (Project Index)
    "entropy-works": {
      id: "entropy-works",
      section: "entropy",
      blockType: "works",
      title: "Entropy Projects Index",
      summary: "Registry of kinetic installations and entropy-based works.",
      content: `
        <div class="works-registry">
          <div class="work-card" data-work="data-streams">
            <h4>Data Streams in Motion</h4>
            <p>Kinetic sculpture translating real-time network traffic into fluid mechanical movements.</p>
          </div>
          <div class="work-card" data-work="algorithmic-pendulums">
            <h4>Algorithmic Pendulum Series</h4>
            <p>Twelve suspended pendulums responding to global network data patterns.</p>
          </div>
          <div class="work-card" data-work="entropy-field">
            <h4>Entropy Field Recording</h4>
            <p>Interactive installation capturing and visualizing environmental data fluctuations.</p>
          </div>
        </div>
      `,
      sizeHint: "medium",
      levelAffinities: { entropy: 80, noise: 20, occupation: 30 },
      tags: ["projects", "kinetic", "data visualization", "interactive"],
      date: "2025",
      credits: "",
      download: false
    },

    // References Block (Bibliography)
    "entropy-references": {
      id: "entropy-references",
      section: "entropy",
      blockType: "references",
      title: "Entropy References & Sources",
      summary: "Bibliography and theoretical foundations for entropy investigations.",
      content: `
        <div class="references-list">
          <div class="reference-item" data-ref="shannon">
            <h5>Claude Shannon - A Mathematical Theory of Communication</h5>
            <p>Foundational text on information theory and signal entropy.</p>
            <span class="ref-annotation">Key concept: entropy as measure of information uncertainty</span>
          </div>
          <div class="reference-item" data-ref="calder">
            <h5>Alexander Calder - Kinetic Sculptures</h5>
            <p>Aesthetic inspiration for mechanical movement and balance.</p>
            <span class="ref-annotation">Influence on pendulum design and spatial relationships</span>
          </div>
          <div class="reference-item" data-ref="weiner">
            <h5>Norbert Wiener - Cybernetics</h5>
            <p>Control and communication theory in biological and mechanical systems.</p>
            <span class="ref-annotation">Framework for feedback loops and responsive systems</span>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 70, noise: 20, occupation: 60 },
      tags: ["bibliography", "theory", "sources"],
      date: "2025",
      credits: "",
      download: false
    },

    // Gallery Block (Images & Stills)
    "entropy-gallery": {
      id: "entropy-gallery",
      section: "entropy",
      blockType: "gallery",
      title: "Entropy Visual Archive",
      summary: "Documentation of kinetic installations and system processes.",
      content: "High-resolution images and video documentation from entropy-based works.",
      media: [
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=1",
          thumbnail: "https://picsum.photos/300/200?random=1",
          alt: "Data Streams installation view",
          caption: "Data Streams in Motion - Gallery installation",
          credits: "Photo: Studio Documentation"
        },
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=2", 
          thumbnail: "https://picsum.photos/300/200?random=2",
          alt: "Pendulum system detail",
          caption: "Algorithmic Pendulum Series - Mechanical detail",
          credits: "Photo: Technical Documentation"
        },
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=3",
          thumbnail: "https://picsum.photos/300/200?random=3",
          alt: "System diagram",
          caption: "Network data flow visualization",
          credits: "Diagram: Technical Schematic"
        }
      ],
      sizeHint: "medium",
      levelAffinities: { entropy: 60, noise: 10, occupation: 15 },
      tags: ["gallery", "documentation", "images"],
      date: "2025",
      credits: "",
      download: false
    },

    // Sound Archive Block
    "entropy-sound": {
      id: "entropy-sound",
      section: "entropy", 
      blockType: "sound",
      title: "Entropy Sound Archive",
      summary: "Ambient recordings and generative soundscapes from entropy-based installations.",
      content: "Collection of field recordings, system sounds, and ambient compositions generated through entropy processes.",
      media: [
        {
          type: "audio",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          title: "Data Stream Ambient Mix",
          duration: "12:34",
          description: "Ambient composition generated from network traffic patterns",
          downloadUrl: "#"
        },
        {
          type: "audio",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          title: "Pendulum Resonance Field",
          duration: "8:17",
          description: "Field recording of mechanical pendulum harmonics",
          downloadUrl: "#"
        }
      ],
      sizeHint: "small",
      levelAffinities: { entropy: 70, noise: 60, occupation: 20 },
      tags: ["sound", "ambient", "generative", "field recording"],
      date: "2025",
      credits: "",
      download: false
    },

    // Process / Journal Block
    "entropy-process": {
      id: "entropy-process",
      section: "entropy",
      blockType: "process", 
      title: "Entropy Build Process & Journal",
      summary: "Development journal and technical notes from entropy installations.",
      content: `
        <div class="process-entries">
          <div class="process-entry" data-date="2025-03-15">
            <h4>March 15, 2025</h4>
            <p><strong>Initial servo motor tests</strong></p>
            <p>Testing different servo motors for pendulum responsiveness. High-torque servos provide better control but create more noise. Need to balance precision with acoustic considerations.</p>
          </div>
          <div class="process-entry" data-date="2025-03-20">
            <h4>March 20, 2025</h4>
            <p><strong>Network API integration</strong></p>
            <p>Successfully integrated real-time network traffic data. Packet flow visualization working but needs smoothing algorithms to prevent erratic movements.</p>
          </div>
          <div class="process-entry" data-date="2025-04-01">
            <h4>April 1, 2025</h4>
            <p><strong>Gallery installation challenges</strong></p>
            <p>Power distribution issues in gallery space. Redesigned power system with distributed controllers. Installation now more modular and resilient.</p>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 90, noise: 30, occupation: 60 },
      tags: ["process", "development", "iteration", "documentation"],
      date: "2025",
      credits: "",
      download: false
    },

    // Technical / Schematics Block
    "entropy-tech": {
      id: "entropy-tech",
      section: "entropy",
      blockType: "tech",
      title: "Technical Schematics & Code",
      summary: "Build diagrams, wiring schematics, and source code for entropy installations.",
      content: `
        <div class="tech-resources">
          <div class="tech-item">
            <h5>Arduino Control System</h5>
            <p>Microcontroller code for servo control and network data processing.</p>
            <a href="#" class="code-link">View Source Code</a>
          </div>
          <div class="tech-item">
            <h5>Mechanical Assembly Diagrams</h5>
            <p>Detailed drawings for pendulum mounting and motor placement.</p>
            <a href="#" class="schematic-link">Download PDF</a>
          </div>
          <div class="tech-item">
            <h5>Network Data Processing</h5>
            <p>Python scripts for API integration and data smoothing algorithms.</p>
            <a href="#" class="code-link">View Repository</a>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 85, noise: 40, occupation: 70 },
      tags: ["technical", "code", "schematics", "arduino"],
      date: "2025",
      credits: "",
      download: false
    },

    // ===== NOISE SECTION BLOCKS =====
    
    // Text Block (Core Writing)
    "noise-text": {
      id: "noise-text",
      section: "noise",
      blockType: "text",
      title: "Noise: Signal, Interference, and Creative Disruption",
      summary: "Exploring noise as both breakdown of communication and source of creative material.",
      content: `
        <p>Noise, in its purest form, represents the breakdown of signal integrity and the emergence of unintended information. This section examines noise not as an unwanted byproduct of communication systems, but as a rich source of creative material and theoretical inquiry.</p>

        <p>Building upon the work of theorists like Michel Serres and Douglas Kahn, these experiments explore how noise functions as both interference and revelation. Digital noise, in particular, offers unique insights into the materiality of supposedly immaterial technologies, exposing the physical substrate underlying our digital abstractions.</p>

        <blockquote>
          <p>"Noise is the primary datum of the world. It is the background from which all signals emerge."</p>
          <cite>— Michel Serres</cite>
        </blockquote>

        <p>The projects in this section employ various forms of intentional signal degradation, circuit bending, and algorithmic corruption to create new forms of sonic expression. By amplifying the errors, glitches, and failures inherent in digital systems, these works reveal the aesthetic potential hidden within technological breakdown.</p>
      `,
      sizeHint: "large",
      levelAffinities: { entropy: 40, noise: 95, occupation: 30 },
      tags: ["theory", "noise", "signal processing", "glitch"],
      date: "2025",
      credits: "",
      download: false
    },

    // Works Block
    "noise-works": {
      id: "noise-works",
      section: "noise",
      blockType: "works",
      title: "Noise Projects Index",
      summary: "Registry of sound experiments and signal processing works.",
      content: `
        <div class="works-registry">
          <div class="work-card" data-work="circuit-bent">
            <h4>Circuit Bent Instruments</h4>
            <p>Modified electronic devices creating unexpected sonic textures through deliberate malfunction.</p>
          </div>
          <div class="work-card" data-work="data-corruption">
            <h4>Data Corruption Studies</h4>
            <p>Systematic exploration of digital audio degradation and bit manipulation.</p>
          </div>
          <div class="work-card" data-work="feedback-systems">
            <h4>Feedback Loop Compositions</h4>
            <p>Self-generating audio systems using microphone and speaker feedback as compositional material.</p>
          </div>
        </div>
      `,
      sizeHint: "medium",
      levelAffinities: { entropy: 60, noise: 85, occupation: 40 },
      tags: ["projects", "sound art", "electronics", "experimental"],
      date: "2025",
      credits: "",
      download: false
    },

    // References Block
    "noise-references": {
      id: "noise-references",
      section: "noise",
      blockType: "references",
      title: "Noise Theory & Sources",
      summary: "Theoretical foundations and artistic precedents for noise investigations.",
      content: `
        <div class="references-list">
          <div class="reference-item" data-ref="serres">
            <h5>Michel Serres - The Parasite</h5>
            <p>Foundational theory on noise as constitutive element of communication.</p>
            <span class="ref-annotation">Key insight: noise as productive interference, not mere distraction</span>
          </div>
          <div class="reference-item" data-ref="kahn">
            <h5>Douglas Kahn - Noise, Water, Meat</h5>
            <p>Historical analysis of sound art and experimental music practices.</p>
            <span class="ref-annotation">Framework for understanding noise as aesthetic material</span>
          </div>
          <div class="reference-item" data-ref="ghazala">
            <h5>Reed Ghazala - Circuit Bending</h5>
            <p>Practical and theoretical foundation for electronic circuit modification.</p>
            <span class="ref-annotation">Methodology for creative hardware hacking and sound generation</span>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 30, noise: 80, occupation: 50 },
      tags: ["bibliography", "theory", "sound art"],
      date: "2025",
      credits: "",
      download: false
    },

    // Gallery Block
    "noise-gallery": {
      id: "noise-gallery",
      section: "noise",
      blockType: "gallery",
      title: "Noise Visual Documentation",
      summary: "Images of circuit bent instruments and sound art installations.",
      content: "Visual documentation of noise-based works and experimental sound setups.",
      media: [
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=4",
          thumbnail: "https://picsum.photos/300/200?random=4",
          alt: "Circuit bent instruments",
          caption: "Collection of modified electronic instruments",
          credits: "Photo: Workshop Documentation"
        },
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=5",
          thumbnail: "https://picsum.photos/300/200?random=5",
          alt: "Feedback setup",
          caption: "Microphone and speaker feedback system configuration",
          credits: "Photo: Performance Setup"
        }
      ],
      sizeHint: "medium",
      levelAffinities: { entropy: 40, noise: 70, occupation: 25 },
      tags: ["documentation", "circuit bending", "photography"],
      date: "2025",
      credits: "",
      download: false
    },

    // Sound Archive Block
    "noise-sound": {
      id: "noise-sound",
      section: "noise",
      blockType: "sound",
      title: "Noise Audio Archive",
      summary: "Collection of glitched recordings and corrupted digital artifacts.",
      content: "Sonic experiments in digital corruption, data moshing, and algorithmic noise generation.",
      media: [
        {
          type: "audio",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          title: "Data Corruption Study #1",
          duration: "8:17",
          description: "Systematic bit-crushing and sample rate manipulation",
          downloadUrl: "#"
        },
        {
          type: "audio",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          title: "Circuit Bent Speak & Spell",
          duration: "5:23",
          description: "Modified toy electronics creating unexpected vocal textures",
          downloadUrl: "#"
        }
      ],
      sizeHint: "small",
      levelAffinities: { entropy: 50, noise: 95, occupation: 25 },
      tags: ["glitch", "digital corruption", "experimental"],
      date: "2025", 
      credits: "",
      download: false
    },

    // Process Block
    "noise-process": {
      id: "noise-process",
      section: "noise",
      blockType: "process",
      title: "Noise Experimentation Journal",
      summary: "Development notes and failed experiments in sound corruption.",
      content: `
        <div class="process-entries">
          <div class="process-entry" data-date="2025-02-10">
            <h4>February 10, 2025</h4>
            <p><strong>First circuit bending attempts</strong></p>
            <p>Started with cheap Casio keyboard. Initial modifications too aggressive - completely destroyed sound output. Need more surgical approach to component bridging.</p>
          </div>
          <div class="process-entry" data-date="2025-02-25">
            <h4>February 25, 2025</h4>
            <p><strong>Digital corruption breakthrough</strong></p>
            <p>Discovered effective bit-crushing algorithm that preserves musical content while adding textural complexity. Sweet spot around 8-bit depth with strategic sample rate reduction.</p>
          </div>
          <div class="process-entry" data-date="2025-03-15">
            <h4>March 15, 2025</h4>
            <p><strong>Feedback system refinement</strong></p>
            <p>Built variable delay feedback loop with manual control. Creates sustained tones that evolve unpredictably. Documenting optimal mic/speaker distances for different acoustic spaces.</p>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 70, noise: 90, occupation: 40 },
      tags: ["process", "experimentation", "sound"],
      date: "2025",
      credits: "",
      download: false
    },

    // Technical Block
    "noise-tech": {
      id: "noise-tech",
      section: "noise",
      blockType: "tech",
      title: "Signal Processing Tools & Code",
      summary: "Custom software and hardware for real-time audio manipulation.",
      content: `
        <div class="tech-resources">
          <div class="tech-item">
            <h5>Max/MSP Corruption Patches</h5>
            <p>Real-time audio processing tools for live performance and studio work.</p>
            <a href="#" class="code-link">Download Patches</a>
          </div>
          <div class="tech-item">
            <h5>Pure Data Externals</h5>
            <p>Custom objects for non-linear filtering and spectral manipulation.</p>
            <a href="#" class="code-link">Source Code</a>
          </div>
          <div class="tech-item">
            <h5>Arduino Audio Processors</h5>
            <p>Hardware-based signal corruption using microcontroller ADC/DAC.</p>
            <a href="#" class="schematic-link">Circuit Diagrams</a>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 60, noise: 85, occupation: 60 },
      tags: ["max/msp", "pure data", "dsp", "tools"],
      date: "2025",
      credits: "",
      download: false
    },

    // ===== OCCUPATION SECTION BLOCKS =====
    
    // Text Block (Core Writing)
    "occupation-text": {
      id: "occupation-text",
      section: "occupation",
      blockType: "text",
      title: "Occupation: Digital Technologies and Human Practice",
      summary: "Examining how digital technologies shape learning, working, and resistance practices.",
      content: `
        <p>Occupation examines the ways in which digital technologies shape and are shaped by human practices of learning, working, and being. This section documents performance works and educational interventions that explore the political and social dimensions of our relationship with digital systems.</p>
        
        <p>The concept of "occupation" operates on multiple levels: the literal occupation of physical and digital spaces, the professional occupation of working with technology, and the political occupation of resisting dominant technological narratives. These works investigate how bodies, spaces, and technologies intersect in complex networks of power and resistance.</p>
        
        <blockquote>
          <p>"The most potent weapon in the hands of the oppressor is the mind of the oppressed."</p>
          <cite>— Steve Biko</cite>
        </blockquote>
        
        <p>Drawing from critical pedagogy traditions, particularly the work of Paulo Freire and bell hooks, these projects emphasize collaborative learning and knowledge production. They challenge traditional hierarchies between teacher and student, expert and novice, by creating spaces for mutual discovery and shared inquiry.</p>
      `,
      sizeHint: "large",
      levelAffinities: { entropy: 30, noise: 40, occupation: 90 },
      tags: ["pedagogy", "performance", "institutional critique", "education"],
      date: "2025",
      credits: "",
      download: false
    },

    // Works Block
    "occupation-works": {
      id: "occupation-works",
      section: "occupation",
      blockType: "works",
      title: "Occupation Projects Index",
      summary: "Registry of pedagogical interventions and performance works.",
      content: `
        <div class="works-registry">
          <div class="work-card" data-work="collaborative-learning">
            <h4>Collaborative Learning Experiments</h4>
            <p>Performance and pedagogical interventions in educational spaces.</p>
          </div>
          <div class="work-card" data-work="institutional-critique">
            <h4>Institutional Critique Performances</h4>
            <p>Site-specific works examining power structures in academic institutions.</p>
          </div>
          <div class="work-card" data-work="digital-literacy">
            <h4>Critical Digital Literacy Workshops</h4>
            <p>Educational programs examining technology's social and political implications.</p>
          </div>
        </div>
      `,
      sizeHint: "medium",
      levelAffinities: { entropy: 40, noise: 35, occupation: 90 },
      tags: ["projects", "pedagogy", "performance", "workshops"],
      date: "2025",
      credits: "",
      download: false
    },

    // References Block
    "occupation-references": {
      id: "occupation-references",
      section: "occupation",
      blockType: "references",
      title: "Critical Pedagogy Sources",
      summary: "Theoretical foundations for educational and political interventions.",
      content: `
        <div class="references-list">
          <div class="reference-item" data-ref="freire">
            <h5>Paulo Freire - Pedagogy of the Oppressed</h5>
            <p>Foundational text on critical pedagogy and liberating education practices.</p>
            <span class="ref-annotation">Framework for challenging traditional teacher-student hierarchies</span>
          </div>
          <div class="reference-item" data-ref="hooks">
            <h5>bell hooks - Teaching to Transgress</h5>
            <p>Intersectional approach to transformative pedagogy and classroom dynamics.</p>
            <span class="ref-annotation">Methods for creating inclusive and empowering learning environments</span>
          </div>
          <div class="reference-item" data-ref="fraser">
            <h5>Andrea Fraser - Museum Highlights</h5>
            <p>Institutional critique methodology and performance in cultural spaces.</p>
            <span class="ref-annotation">Strategies for revealing hidden power structures through artistic intervention</span>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 20, noise: 30, occupation: 85 },
      tags: ["bibliography", "critical pedagogy", "institutional critique"],
      date: "2025",
      credits: "",
      download: false
    },

    // Gallery Block
    "occupation-gallery": {
      id: "occupation-gallery", 
      section: "occupation",
      blockType: "gallery",
      title: "Performance & Workshop Documentation",
      summary: "Visual archive of pedagogical interventions and institutional critiques.",
      content: "Photographic and video documentation of performance works in educational settings.",
      media: [
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=6",
          thumbnail: "https://picsum.photos/300/200?random=6",
          alt: "Collaborative workshop session",
          caption: "Participants in collaborative learning experiment",
          credits: "Photo: Workshop Documentation"
        },
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=7",
          thumbnail: "https://picsum.photos/300/200?random=7",
          alt: "Performance in classroom setting",
          caption: "Institutional critique performance, 2025",
          credits: "Photo: Performance Documentation"
        },
        {
          type: "image",
          url: "https://picsum.photos/800/600?random=8",
          thumbnail: "https://picsum.photos/300/200?random=8", 
          alt: "Digital literacy workshop",
          caption: "Critical digital literacy workshop session",
          credits: "Photo: Educational Program"
        }
      ],
      sizeHint: "medium",
      levelAffinities: { entropy: 25, noise: 20, occupation: 80 },
      tags: ["documentation", "performance", "photography", "workshops"],
      date: "2025",
      credits: "",
      download: false
    },

    // Sound Archive Block
    "occupation-sound": {
      id: "occupation-sound",
      section: "occupation",
      blockType: "sound",
      title: "Performance Audio Archive",
      summary: "Audio documentation from workshops and performance interventions.",
      content: "Field recordings and audio documentation from educational and performance works.",
      media: [
        {
          type: "audio",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          title: "Collaborative Learning Session",
          duration: "15:42",
          description: "Audio documentation of group discussion and knowledge sharing",
          downloadUrl: "#"
        },
        {
          type: "audio",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          title: "Institutional Critique Performance",
          duration: "22:15",
          description: "Live performance audio with audience interaction",
          downloadUrl: "#"
        }
      ],
      sizeHint: "small",
      levelAffinities: { entropy: 30, noise: 40, occupation: 75 },
      tags: ["performance", "audio", "workshops", "documentation"],
      date: "2025",
      credits: "",
      download: false
    },

    // Process Block
    "occupation-process": {
      id: "occupation-process",
      section: "occupation",
      blockType: "process",
      title: "Pedagogical Reflections & Journal",
      summary: "Notes and observations from experimental teaching practices.",
      content: `
        <div class="process-entries">
          <div class="process-entry" data-date="2025-02-10">
            <h4>February 10, 2025</h4>
            <p><strong>First collaborative session</strong></p>
            <p>Participants initially resistant to non-hierarchical structure. Traditional student/teacher roles deeply ingrained. Need to develop more gradual transition methods that don't immediately destabilize learning environment.</p>
          </div>
          <div class="process-entry" data-date="2025-02-25">
            <h4>February 25, 2025</h4>
            <p><strong>Power dynamics observation</strong></p>
            <p>Interesting emergence of natural leadership patterns when formal authority removed. Some participants thrive, others retreat. How to support all learning styles while maintaining democratic principles?</p>
          </div>
          <div class="process-entry" data-date="2025-03-15">
            <h4>March 15, 2025</h4>
            <p><strong>Institutional resistance</strong></p>
            <p>Administration concerned about "unstructured" approach. Need to better communicate pedagogical theory behind methods. Frame as research rather than criticism to reduce defensive responses.</p>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 45, noise: 30, occupation: 95 },
      tags: ["reflection", "pedagogy", "research", "notes"],
      date: "2025",
      credits: "",
      download: false
    },

    // Performance / Education Block
    "occupation-performance": {
      id: "occupation-performance",
      section: "occupation",
      blockType: "performance",
      title: "Educational Performance Works",
      summary: "Live interventions combining performance art with pedagogical practice.",
      content: `
        <div class="performance-works">
          <div class="performance-item">
            <h5>The Lecture as Performance</h5>
            <p>Deconstructing traditional lecture format through durational performance and audience participation.</p>
            <span class="performance-duration">Duration: 90 minutes</span>
          </div>
          <div class="performance-item">
            <h5>Institutional Role Play</h5>
            <p>Interactive performance examining power dynamics through role reversal and improvisation.</p>
            <span class="performance-duration">Duration: 2 hours</span>
          </div>
          <div class="performance-item">
            <h5>Digital Detox Workshop</h5>
            <p>Guided exercise in technological disconnection and analog skill building.</p>
            <span class="performance-duration">Duration: 3 hours</span>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 50, noise: 45, occupation: 85 },
      tags: ["performance", "education", "intervention", "participation"],
      date: "2025",
      credits: "",
      download: false
    },

    // Technical Block
    "occupation-tech": {
      id: "occupation-tech",
      section: "occupation",
      blockType: "tech",
      title: "Educational Technology Tools",
      summary: "Custom software and methodologies for collaborative learning environments.",
      content: `
        <div class="tech-resources">
          <div class="tech-item">
            <h5>Collaborative Documentation Platform</h5>
            <p>Web-based tool for shared note-taking and knowledge building during workshops.</p>
            <a href="#" class="code-link">View Demo</a>
          </div>
          <div class="tech-item">
            <h5>Performance Score Generator</h5>
            <p>Algorithm for creating structured improvisations and educational interventions.</p>
            <a href="#" class="code-link">Source Code</a>
          </div>
          <div class="tech-item">
            <h5>Workshop Assessment Rubrics</h5>
            <p>Alternative evaluation methods for non-traditional learning experiences.</p>
            <a href="#" class="resource-link">Download Templates</a>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 40, noise: 30, occupation: 80 },
      tags: ["educational technology", "collaboration", "tools"],
      date: "2025",
      credits: "",
      download: false
    },

    // Downloads & Reproducibility Block
    "occupation-download": {
      id: "occupation-download",
      section: "occupation",
      blockType: "download",
      title: "Educational Resources & Downloads",
      summary: "Downloadable materials for reproducing pedagogical experiments.",
      content: `
        <div class="download-resources">
          <div class="download-item">
            <h5>Workshop Facilitation Guide</h5>
            <p>Complete methodology for running collaborative learning sessions.</p>
            <a href="#" class="download-link">Download PDF (2.1 MB)</a>
          </div>
          <div class="download-item">
            <h5>Performance Score Collection</h5>
            <p>Structured improvisation scores for educational interventions.</p>
            <a href="#" class="download-link">Download ZIP (1.5 MB)</a>
          </div>
          <div class="download-item">
            <h5>Critical Digital Literacy Curriculum</h5>
            <p>Complete course materials for examining technology's social impact.</p>
            <a href="#" class="download-link">Download Package (8.7 MB)</a>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 30, noise: 25, occupation: 90 },
      tags: ["downloads", "curriculum", "methodology", "reproduction"],
      date: "2025",
      credits: "",
      download: true,
      downloadUrl: "#",
      downloadSize: "12.3 MB"
    },

    // ===== EXTRAS SECTION BLOCKS =====
    
    // Metrics & Levels Block (Artistic UI Element)
    "extras-levels": {
      id: "extras-levels",
      section: "extras",
      blockType: "levels",
      title: "System Levels & Metrics",
      summary: "Interactive controls for adjusting site behavior and visual parameters.",
      content: `
        <div class="levels-interface">
          <div class="level-control">
            <label for="entropy-level">Entropy Level</label>
            <input type="range" id="entropy-level" min="0" max="100" value="30">
            <span class="level-value">30%</span>
          </div>
          <div class="level-control">
            <label for="noise-level">Noise Level</label>
            <input type="range" id="noise-level" min="0" max="100" value="20">
            <span class="level-value">20%</span>
          </div>
          <div class="level-control">
            <label for="occupation-level">Occupation Level</label>
            <input type="range" id="occupation-level" min="0" max="100" value="40">
            <span class="level-value">40%</span>
          </div>
        </div>
        <p class="levels-description">Adjust these levels to modify which content blocks are emphasized and how the site's visual effects behave.</p>
      `,
      sizeHint: "medium",
      levelAffinities: { entropy: 80, noise: 80, occupation: 80 },
      tags: ["interface", "controls", "interactive", "system"],
      date: "2025",
      credits: "",
      download: false
    },

    // Extras & Easter Eggs Block
    "extras-easter": {
      id: "extras-easter",
      section: "extras",
      blockType: "extras",
      title: "Hidden Nodes & Easter Eggs",
      summary: "Playful interactive elements and archival outtakes.",
      content: `
        <div class="easter-eggs">
          <div class="easter-item">
            <h5>Chance Generator</h5>
            <p>Click to reveal a random connection between projects across sections.</p>
            <button class="chance-btn">Generate Connection</button>
          </div>
          <div class="easter-item">
            <h5>Archive Outtakes</h5>
            <p>Failed experiments and discarded iterations from the development process.</p>
            <button class="outtakes-btn">View Outtakes</button>
          </div>
          <div class="easter-item">
            <h5>System Information</h5>
            <p>Technical details about this portfolio's construction and data structure.</p>
            <button class="system-btn">Show System Info</button>
          </div>
        </div>
      `,
      sizeHint: "small",
      levelAffinities: { entropy: 60, noise: 70, occupation: 50 },
      tags: ["interactive", "easter eggs", "playful", "archive"],
      date: "2025",
      credits: "",
      download: false
    },

    // Complete Thesis Download
    "extras-thesis": {
      id: "extras-thesis",
      section: "extras",
      blockType: "download",
      title: "Complete Thesis Document",
      summary: "Full academic thesis document available for download.",
      content: `
        <p>The complete thesis document brings together theoretical framework, practical experiments, and critical analysis across all three areas of investigation: Entropy, Noise, and Occupation.</p>

        <p>This comprehensive document includes detailed methodology, extensive bibliography, and high-resolution documentation of all works discussed in this digital portfolio.</p>

        <div class="download-info">
          <p><strong>Format:</strong> PDF</p>
          <p><strong>Size:</strong> 15.2 MB</p>
          <p><strong>Pages:</strong> 120</p>
          <p><strong>Last Updated:</strong> May 2025</p>
        </div>
      `,
      sizeHint: "medium",
      levelAffinities: { entropy: 60, noise: 60, occupation: 60 },
      tags: ["thesis", "download", "academic", "documentation"],
      date: "2025",
      credits: "",
      download: true,
      downloadUrl: "#",
      downloadSize: "15.2 MB"
    }
  }
};
