// ===================================================================
// PORTFOLIO DATA - CENTRALIZED CONTENT MANAGEMENT
// ===================================================================

// This file contains all the content data that drives the dynamic generation
// of the portfolio website. Edit this file to update projects, audio, images, etc.

const portfolioData = {
    // ===================================================================
    // SITE CONFIGURATION
    // ===================================================================
    siteConfig: {
        title: "Atharva Gupta - Experimental Systems",
        subtitle: "Digital artist exploring the edges between control and collapse",
        email: "contact@atharva.in", // Replace with actual email
        description: "I make experimental systems that combine sound, light, code, and kinetic structures. My work explores the edges between control and collapse—between what is designed and what breaks, flickers, loops, or hums out of place.",
        
        social: {
            instagram: "https://instagram.com/asymmetrica_",
            youtube: "https://youtube.com/@audiodevout",
            bandcamp: "https://asymmetrica.bandcamp.com",
            linkedin: "https://linkedin.com/in/atharva-gupta"
        },
        
        // Dynamic descriptors for floating text
        descriptors: [
            "Thinker", "Student", "Maker", "Observer", "Reader", "Listener", "Cook", "Friend", "Human", "Son",
            "Philosopher", "Sociologist", "Scientist", "Generalist", "Anti-Specialist", "AIUser", "Critic", "Researcher", "Smoker", "Overanalyser",
            "Dreamer", "Technologist", "Wanderer", "Glitcher", "Cyborg", "Outsider", "Alien", "Futurist", "Tinkerer", "Assembler",
            "Mutator", "Decoder", "Dissident", "Collector", "Noiser", "Deconstructor", "Drifter", "Skeptic", "Witness", "Seeker",
            "Sketcher", "Painter", "Sculptor", "Explorer", "Experiencer", "Feeler", "Imaginer", "Reflector", "Intuiter", "Responder",
            "Navigator", "Mapper", "Composer", "Harmonizer", "Synthesizer", "Amplifier", "Filterer", "Modulator", "Echoer", "Translator"
        ]
    },

    // ===================================================================
    // MAIN NAVIGATION
    // ===================================================================
    navigation: [
        { title: "Home", path: "/" },
        { title: "About", path: "/about" },
        { title: "Projects", path: "/projects" },
        { title: "Audio", path: "/audio" },
        { title: "Contact", path: "/contact" }
    ],

    // ===================================================================
    // PROJECT DATA
    // ===================================================================
    projects: [
        {
            id: "gantry-experiments",
            title: "Gantry Experiments",
            subtitle: "Kinetic sound installations with motorized movement",
            description: "A series of explorations using motorized gantry systems to create dynamic spatial sound environments. These works investigate mechanical precision and organic improvisation in sound generation.",
            year: "2024",
            status: "ongoing",
            medium: ["installation", "kinetic", "sound"],
            tags: ["TouchDesigner", "Arduino", "motors", "spatial audio"],
            featuredImage: "images/gantry-experiments/featured.jpg",
            
            // Associated content IDs
            text: ["gantry-writeup"],
            audio: ["gantry-ambient", "gantry-rhythmic"],
            images: ["gantry-gallery"],
            
            links: {
                documentation: "https://github.com/user/gantry-experiments",
                video: "https://vimeo.com/123456789"
            }
        },
        
        {
            id: "surveillance-poetics",
            title: "Surveillance Poetics",
            subtitle: "Critical investigations of machine vision and privacy",
            description: "An ongoing research project examining the aesthetic and political dimensions of surveillance technologies through experimental audiovisual installations.",
            year: "2023-2024",
            status: "research",
            medium: ["installation", "video", "research"],
            tags: ["computer vision", "privacy", "AI", "critique"],
            featuredImage: "images/surveillance-poetics/featured.jpg",
            
            text: ["surveillance-essay"],
            audio: ["surveillance-ambient"],
            images: ["surveillance-gallery"],
            
            links: {
                publication: "https://example.com/paper",
                exhibition: "https://gallery.example.com"
            }
        },
        
        {
            id: "generative-compositions",
            title: "Generative Compositions",
            subtitle: "Algorithmic approaches to musical composition",
            description: "A collection of generative music systems exploring the intersection of human creativity and algorithmic processes. Created using custom software and modular synthesis.",
            year: "2022-2024",
            status: "ongoing",
            medium: ["audio", "software", "performance"],
            tags: ["generative", "Max/MSP", "modular synthesis", "algorithms"],
            featuredImage: "images/generative-compositions/featured.jpg",
            
            text: ["generative-process"],
            audio: ["generative-01", "generative-02", "generative-03"],
            images: ["generative-gallery"],
            
            links: {
                bandcamp: "https://asymmetrica.bandcamp.com/album/generative",
                code: "https://github.com/user/generative-music"
            }
        }
    ],

    // ===================================================================
    // AUDIO PROJECTS
    // ===================================================================
    audioProjects: [
        {
            id: "gantry-ambient",
            title: "Gantry Ambient Test 01",
            description: "Ambient soundscape generated by motorized gantry system with contact microphones",
            file: "audio/gantry-ambient-01.mp3",
            duration: 420, // in seconds
            year: "2024",
            tags: ["ambient", "kinetic", "field recording"],
            waveformData: null // Could be generated client-side
        },
        
        {
            id: "gantry-rhythmic",
            title: "Gantry Rhythmic Patterns",
            description: "Rhythmic exploration using stepper motor timing as compositional element",
            file: "audio/gantry-rhythmic-01.mp3",
            duration: 280,
            year: "2024",
            tags: ["rhythm", "mechanical", "polyrhythm"]
        },
        
        {
            id: "surveillance-ambient",
            title: "Data Stream Sonification",
            description: "Sonification of network traffic and surveillance data flows",
            file: "audio/surveillance-ambient.mp3",
            duration: 360,
            year: "2023",
            tags: ["data sonification", "ambient", "surveillance"]
        },
        
        {
            id: "generative-01",
            title: "Generative Study #1: Cellular Growth",
            description: "Musical composition generated using cellular automata algorithms",
            file: "audio/generative-study-01.mp3",
            duration: 480,
            year: "2023",
            tags: ["generative", "algorithmic", "cellular automata"]
        },
        
        {
            id: "generative-02",
            title: "Generative Study #2: Markov Chains",
            description: "Melodic patterns derived from Markov chain analysis of field recordings",
            file: "audio/generative-study-02.mp3",
            duration: 320,
            year: "2023",
            tags: ["generative", "markov chains", "field recording"]
        },
        
        {
            id: "generative-03",
            title: "Generative Study #3: L-Systems",
            description: "Rhythmic structures based on L-system growth patterns",
            file: "audio/generative-study-03.mp3",
            duration: 400,
            year: "2024",
            tags: ["generative", "L-systems", "rhythm"]
        }
    ],

    // ===================================================================
    // IMAGE GALLERIES
    // ===================================================================
    imageGalleries: [
        {
            id: "gantry-gallery",
            title: "Gantry Experiments Documentation",
            description: "Process documentation and installation views",
            images: [
                {
                    file: "images/gantry-experiments/gantry-01.jpg",
                    title: "Gantry System Overview",
                    description: "Full view of the motorized gantry system with suspended sound objects",
                    alt: "Motorized gantry system with metal frame and suspended objects"
                },
                {
                    file: "images/gantry-experiments/gantry-02.jpg",
                    title: "Motor Detail",
                    description: "Close-up of stepper motor and pulley system",
                    alt: "Detailed view of stepper motor and mechanical components"
                },
                {
                    file: "images/gantry-experiments/gantry-03.jpg",
                    title: "Contact Microphones",
                    description: "Contact microphones attached to resonant objects",
                    alt: "Small contact microphones attached to metal objects"
                },
                {
                    file: "images/gantry-experiments/gantry-04.jpg",
                    title: "Installation View",
                    description: "Gallery installation with visitor interaction",
                    alt: "Gallery space with gantry installation and visitor observing"
                }
            ]
        },
        
        {
            id: "surveillance-gallery",
            title: "Surveillance Poetics Visual Research",
            description: "Visual documentation of surveillance research and installations",
            images: [
                {
                    file: "images/surveillance-poetics/surveillance-01.jpg",
                    title: "Camera Network Diagram",
                    description: "Mapping of surveillance cameras in urban environment",
                    alt: "Diagram showing interconnected surveillance camera network"
                },
                {
                    file: "images/surveillance-poetics/surveillance-02.jpg",
                    title: "Computer Vision Analysis",
                    description: "Real-time computer vision processing of public spaces",
                    alt: "Screen showing computer vision analysis with tracking overlays"
                },
                {
                    file: "images/surveillance-poetics/surveillance-03.jpg",
                    title: "Data Visualization",
                    description: "Visualization of privacy data flows and tracking patterns",
                    alt: "Abstract data visualization with flowing lines and nodes"
                }
            ]
        },
        
        {
            id: "generative-gallery",
            title: "Generative Music Systems",
            description: "Visual documentation of generative composition processes",
            images: [
                {
                    file: "images/generative-compositions/generative-01.jpg",
                    title: "Max/MSP Patch",
                    description: "Complex Max/MSP patch for algorithmic composition",
                    alt: "Screenshot of Max/MSP visual programming environment"
                },
                {
                    file: "images/generative-compositions/generative-02.jpg",
                    title: "Modular Synthesis Setup",
                    description: "Eurorack modular synthesizer used for generative music",
                    alt: "Modular synthesizer with many cables and knobs"
                },
                {
                    file: "images/generative-compositions/generative-03.jpg",
                    title: "Algorithm Visualization",
                    description: "Visual representation of cellular automata music generation",
                    alt: "Grid pattern showing cellular automata evolution over time"
                },
                {
                    file: "images/generative-compositions/generative-04.jpg",
                    title: "Performance Setup",
                    description: "Live performance with generative music systems",
                    alt: "Artist performing with laptop and modular synthesizer on stage"
                }
            ]
        }
    ],

    // ===================================================================
    // TEXT CONTENT (Markdown files or direct content)
    // ===================================================================
    textProjects: [
        {
            id: "about-main",
            title: "About Atharva Gupta",
            category: "about",
            featured: true,
            file: "text/about.md", // Will load from markdown file
            content: null // Or direct markdown content if not using files
        },
        
        {
            id: "gantry-writeup",
            title: "Gantry Experiments: Process Documentation",
            category: "project-writeup",
            file: "text/gantry-experiments.md"
        },
        
        {
            id: "surveillance-essay",
            title: "The Aesthetic Politics of Machine Vision",
            category: "essay",
            file: "text/surveillance-essay.md"
        },
        
        {
            id: "generative-process",
            title: "Algorithmic Composition: Process and Philosophy",
            category: "process",
            file: "text/generative-process.md"
        },
        
        {
            id: "artist-statement",
            title: "Artist Statement",
            category: "about",
            featured: false,
            content: `# Artist Statement

I am drawn to the spaces where systems break down, where the designed meets the uncontrolled. My practice explores experimental systems that combine sound, light, code, and kinetic structures—investigating the edges between what is planned and what emerges spontaneously.

Working primarily with installation, kinetic sculpture, and generative media, I create works that question our relationship with technology and surveillance. These pieces often incorporate machine learning, computer vision, and algorithmic composition as both subject matter and creative tools.

My current research at the Frank Mohr Institute focuses on the politics and poetics of machine sensing—how devices see, hear, and interpret the world around us, and what this means for human agency and privacy.

Each work is an experiment in finding beauty within systems of control, and agency within structures of constraint.`
        }
    ],

    // ===================================================================
    // COLLECTIONS/CATEGORIES
    // ===================================================================
    collections: {
        featured: ["gantry-experiments", "surveillance-poetics"],
        research: ["surveillance-poetics"],
        installations: ["gantry-experiments", "surveillance-poetics"],
        audio: ["generative-compositions"],
        ongoing: ["gantry-experiments", "generative-compositions"]
    },

    // ===================================================================
    // METADATA
    // ===================================================================
    metadata: {
        lastUpdated: "2024-01-15",
        version: "1.0",
        
        // For SEO and social sharing
        openGraph: {
            image: "images/og-image.jpg",
            type: "website",
            locale: "en_US"
        },
        
        // Analytics and tracking
        analytics: {
            gtag: null, // Add Google Analytics ID if needed
            plausible: null // Add Plausible domain if needed
        }
    }
};

// ===================================================================
// HELPER FUNCTIONS FOR DATA ACCESS
// ===================================================================

// Get project by ID
portfolioData.getProject = function(id) {
    return this.projects.find(project => project.id === id);
};

// Get audio by ID
portfolioData.getAudio = function(id) {
    return this.audioProjects.find(audio => audio.id === id);
};

// Get text content by ID
portfolioData.getText = function(id) {
    return this.textProjects.find(text => text.id === id);
};

// Get image gallery by ID
portfolioData.getGallery = function(id) {
    return this.imageGalleries.find(gallery => gallery.id === id);
};

// Get projects by medium/tag
portfolioData.getProjectsByMedium = function(medium) {
    return this.projects.filter(project => 
        project.medium && project.medium.includes(medium)
    );
};

// Get featured projects
portfolioData.getFeaturedProjects = function() {
    return this.projects.filter(project => 
        this.collections.featured.includes(project.id)
    );
};

// Get ongoing projects
portfolioData.getOngoingProjects = function() {
    return this.projects.filter(project => 
        project.status === 'ongoing' || this.collections.ongoing.includes(project.id)
    );
};

// Search function
portfolioData.search = function(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    // Search projects
    this.projects.forEach(project => {
        const searchableText = [
            project.title,
            project.subtitle,
            project.description,
            ...(project.tags || [])
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(searchTerm)) {
            results.push({
                type: 'project',
                item: project,
                url: `/project/${project.id}`
            });
        }
    });
    
    // Search audio
    this.audioProjects.forEach(audio => {
        const searchableText = [
            audio.title,
            audio.description,
            ...(audio.tags || [])
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(searchTerm)) {
            results.push({
                type: 'audio',
                item: audio,
                url: '/audio'
            });
        }
    });
    
    return results;
};

// Validation function to check data integrity
portfolioData.validate = function() {
    const errors = [];
    
    // Check that all referenced IDs exist
    this.projects.forEach(project => {
        // Check text references
        if (project.text) {
            project.text.forEach(textId => {
                if (!this.getText(textId)) {
                    errors.push(`Project ${project.id} references missing text: ${textId}`);
                }
            });
        }
        
        // Check audio references
        if (project.audio) {
            project.audio.forEach(audioId => {
                if (!this.getAudio(audioId)) {
                    errors.push(`Project ${project.id} references missing audio: ${audioId}`);
                }
            });
        }
        
        // Check image gallery references
        if (project.images) {
            project.images.forEach(galleryId => {
                if (!this.getGallery(galleryId)) {
                    errors.push(`Project ${project.id} references missing gallery: ${galleryId}`);
                }
            });
        }
    });
    
    return errors;
};

// Make data available globally
if (typeof window !== 'undefined') {
    window.portfolioData = portfolioData;
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = portfolioData;
}