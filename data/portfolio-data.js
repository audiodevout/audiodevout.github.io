// ===================================================================
// PORTFOLIO DATA - STATIC SITE CONTENT
// ===================================================================

const portfolioData = {
    // Site configuration
    siteConfig: {
        title: "Atharva Gupta",
        subtitle: "Experimental Systems",
        description: "I make experimental systems that combine sound, light, code, and kinetic structures. My work explores the edges between control and collapse—between what is designed and what breaks, flickers, loops, or hums out of place.",
        email: "atharva152@gmail.com",
        social: {
            instagram: "https://instagram.com/asymmetrica_",
            youtube: "https://youtube.com/@audiodevout",
            bandcamp: "https://asymmetrica.bandcamp.com",
            linkedin: "https://linkedin.com/in/atharva-gupta"
        }
    },

    // Floating descriptors for kinetic text
    descriptors: [
        "Thinker", "Student", "Maker", "Observer", "Reader", "Listener", "Cook", "Friend", "Human", "Son",
        "Philosopher", "Sociologist", "Scientist", "Generalist", "Anti-Specialist", "AIUser", "Critic", "Researcher", "Smoker", "Overanalyser",
        "Dreamer", "Technologist", "Wanderer", "Glitcher", "Cyborg", "Outsider", "Alien", "Futurist", "Tinkerer", "Assembler",
        "Mutator", "Decoder", "Dissident", "Collector", "Noiser", "Deconstructor", "Drifter", "Skeptic", "Witness", "Seeker",
        "Sketcher", "Painter", "Sculptor", "Explorer", "Experiencer", "Feeler", "Imaginer", "Reflector", "Intuiter", "Responder",
        "Navigator", "Mapper", "Composer", "Harmonizer", "Synthesizer", "Amplifier", "Filterer", "Modulator", "Echoer", "Translator"
    ],

    // Audio works - stream only, no downloads
  audioWorks: [
    {
        id: "stranded-deep",
        title: "Stranded Deep",
        description: "Immersive soundscape exploring isolation and natural decay, blending field recordings with experimental textures.",
        file: "audio/stranded-deep.mp3",
        duration: 420,
        year: "2024",
        tags: ["ambient", "field recording", "experimental", "soundscape"],
        featured: true
    },
    {
        id: "not-as-i-remember-it",
        title: "Not As I Remember It",
        description: "Fragmented sonic memory sequences merging glitch and found sounds to question perception and recollection.",
        file: "audio/not-as-i-remember-it.mp3",
        duration: 380,
        year: "2023",
        tags: ["glitch", "memory", "experimental", "sound art"],
        featured: true
    },
    {
        id: "fever-dream-audio",
        title: "Fever Dream (Audio Excerpt)",
        description: "Audio excerpt from the *Fever Dream* performance piece, an exploration of abstract fears through layered sound and voice.",
        file: "audio/fever-dream.mp3",
        duration: 300,
        year: "2024",
        tags: ["performance", "experimental", "sound art", "voice"],
        featured: false
    },
    {
        id: "touchdesigner-exports-01",
        title: "TouchDesigner Generative Sound #1",
        description: "Generative audio compositions created in TouchDesigner, blending algorithmic processes with live manipulation.",
        file: "audio/touchdesigner-gen-01.mp3",
        duration: 360,
        year: "2024",
        tags: ["generative", "algorithmic", "touchdesigner", "experimental"],
        featured: false
    }
],

imageGalleries: [
    {
        id: "rain-reminders-installation",
        title: "Rain Reminders Installation",
        description: "Visual documentation of the kinetic rain stick sculpture, exploring meditative sound and industrial materials.",
        images: [
            {
                id: "rain-reminders-01",
                src: "images/rain-reminders/installation-overview.jpg",
                thumb: "images/rain-reminders/thumbs/installation-overview.jpg",
                title: "Rain Reminders Installation Overview",
                description: "Full view of the 1.8-meter kinetic rain stick installation in gallery space.",
                alt: "Tall wooden and metal rain stick sculpture with motorized rotation"
            },
            {
                id: "rain-reminders-02",
                src: "images/rain-reminders/rain-stick-detail.jpg",
                thumb: "images/rain-reminders/thumbs/rain-stick-detail.jpg",
                title: "Rain Stick Detail",
                description: "Close-up of the rain stick and motor mechanism showing texture and materials.",
                alt: "Close-up of rain stick surface with visible black duct tape seal"
            },
            {
                id: "rain-reminders-03",
                src: "images/rain-reminders/installation-motor.jpg",
                thumb: "images/rain-reminders/thumbs/installation-motor.jpg",
                title: "Motorized Mechanism",
                description: "Motor assembly driving the rotation of the rain stick.",
                alt: "Metal motorized mechanism with cables and pulley system"
            }
        ],
        featured: true
    },
    {
        id: "fever-dream-performance",
        title: "Fever Dream Performance",
        description: "Photographic series capturing the live performance and spatial sound installation of *Fever Dream*.",
        images: [
            {
                id: "fever-dream-01",
                src: "images/fever-dream/performance-01.jpg",
                thumb: "images/fever-dream/thumbs/performance-01.jpg",
                title: "Fever Dream Live 1",
                description: "Live performance with layered soundscapes and abstract projections.",
                alt: "Artist performing with audio equipment and projection mapping"
            },
            {
                id: "fever-dream-02",
                src: "images/fever-dream/performance-02.jpg",
                thumb: "images/fever-dream/thumbs/performance-02.jpg",
                title: "Fever Dream Live 2",
                description: "Close-up of audio-reactive installation elements.",
                alt: "Sound equipment with LED lights reacting to audio"
            }
        ],
        featured: false
    },
    {
        id: "touchdesigner-visuals",
        title: "TouchDesigner Visuals",
        description: "Screenshots and exports from generative and interactive visuals created in TouchDesigner.",
        images: [
            {
                id: "td-vis-01",
                src: "images/touchdesigner/visual-01.jpg",
                thumb: "images/touchdesigner/thumbs/visual-01.jpg",
                title: "Modular Multiplication Circle",
                description: "Generative circle visualization demonstrating polyrhythmic relationships.",
                alt: "Circular pattern with interconnected lines and dots"
            },
            {
                id: "td-vis-02",
                src: "images/touchdesigner/visual-02.jpg",
                thumb: "images/touchdesigner/thumbs/visual-02.jpg",
                title: "Gesture Detection Interface",
                description: "User interface for real-time gesture detection using MediaPipe.",
                alt: "Screen showing hand tracking outlines over video feed"
            }
        ],
        featured: false
    }
],

videoWorks: [
    {
        id: "rain-reminders-video",
        title: "Rain Reminders Video",
        description: "Video documentation of the kinetic rain stick installation in action, capturing sound and motion.",
        embedUrl: "https://www.youtube.com/embed/your_actual_rain_reminders_video_id",
        thumbnail: "images/videos/rain-reminders-thumb.jpg",
        duration: "6:15",
        year: "2025",
        tags: ["kinetic", "installation", "sound", "sculpture"],
        featured: true
    },
    {
        id: "fever-dream-performance-video",
        title: "Fever Dream Performance",
        description: "Full-length performance video of the *Fever Dream* live audiovisual installation.",
        embedUrl: "https://www.youtube.com/embed/your_actual_fever_dream_video_id",
        thumbnail: "images/videos/fever-dream-thumb.jpg",
        duration: "12:00",
        year: "2024",
        tags: ["performance", "audiovisual", "live", "experimental"],
        featured: true
    },
    {
        id: "touchdesigner-exports",
        title: "TouchDesigner Visual Exports",
        description: "Compilation of generative visual experiments and interface demos made with TouchDesigner.",
        embedUrl: "https://www.youtube.com/embed/your_actual_touchdesigner_video_id",
        thumbnail: "images/videos/touchdesigner-thumb.jpg",
        duration: "8:00",
        year: "2024",
        tags: ["generative", "visuals", "touchdesigner", "experimental"],
        featured: false
    }
],

textWorks: [
    {
        id: "about-practice",
        title: "About My Practice",
        description: "Artist statement reflecting on experimental sound installations, kinetic sculptures, and critical technology.",
        file: "text/about-practice.md",
        category: "statement",
        featured: true
    },
    {
        id: "rain-reminders-process",
        title: "Rain Reminders: Process Documentation",
        description: "Detailed notes on the design, construction, and conceptual development of the kinetic rain stick installation.",
        file: "text/rain-reminders-process.md",
        category: "documentation",
        featured: true
    },
    {
        id: "fever-dream-essay",
        title: "Fever Dream: Conceptual Essay",
        description: "Exploration of abstraction, fear, and sound as material in the *Fever Dream* performance work.",
        file: "text/fever-dream-essay.md",
        category: "essay",
        featured: true
    },
    {
        id: "touchdesigner-reflections",
        title: "TouchDesigner and Generative Media",
        description: "Reflections on the use of TouchDesigner as a tool for interactive and generative audiovisual art.",
        file: "text/touchdesigner-reflections.md",
        category: "essay",
        featured: false
    }
],

    // // Thesis information
    // thesis: {
    //     title: "Sensing Machines: An Investigation of Surveillance Aesthetics in Contemporary Media Art",
    //     abstract: "This thesis examines how contemporary media artists engage with surveillance technologies to create critical artworks that challenge dominant narratives about privacy, control, and technological agency. Through analysis of installations, performances, and experimental systems, I argue that artistic practice provides a unique lens for understanding the aesthetic and political dimensions of machine sensing. The research draws on media archaeology, surveillance studies, and practice-based research methodologies to develop a framework for critical making in the context of ubiquitous monitoring technologies.",
    //     pdfUrl: "thesis/atharva-gupta-thesis-2024.pdf", // View only, no download
    //     institution: "Frank Mohr Institute",
    //     year: "2024",
    //     advisor: "Dr. Example Advisor",
    //     keywords: ["surveillance", "media art", "machine vision", "critical making", "experimental systems"]
    // },

    // Contact information
    contact: {
        email: "atharva152@gmail.com",
        location: "Groningen, Netherlands",
        institution: "Frank Mohr Institute - MADTech Program",
        availability: "Available for collaborations and exhibitions",
        interests: [
            "Experimental sound and kinetic installations",
            "Critical investigations of technology",
            "Generative and algorithmic creation",
            "Media arts",
            "Collaborative interdisciplinary projects"
        ]
    }
};

// Utility functions for data access
portfolioData.getFeaturedAudio = function() {
    return this.audioWorks.filter(work => work.featured);
};

portfolioData.getFeaturedImages = function() {
    return this.imageGalleries.filter(gallery => gallery.featured);
};

portfolioData.getFeaturedTexts = function() {
    return this.textWorks.filter(work => work.featured);
};

portfolioData.getFeaturedVideos = function() {
    return this.videoWorks.filter(work => work.featured);
};

portfolioData.searchContent = function(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    // Search audio
    this.audioWorks.forEach(work => {
        const searchText = [work.title, work.description, ...work.tags].join(' ').toLowerCase();
        if (searchText.includes(searchTerm)) {
            results.push({ type: 'audio', data: work });
        }
    });
    
    // Search images
    this.imageGalleries.forEach(gallery => {
        const searchText = [gallery.title, gallery.description].join(' ').toLowerCase();
        if (searchText.includes(searchTerm)) {
            results.push({ type: 'images', data: gallery });
        }
    });
    
    // Search videos
    this.videoWorks.forEach(work => {
        const searchText = [work.title, work.description, ...work.tags].join(' ').toLowerCase();
        if (searchText.includes(searchTerm)) {
            results.push({ type: 'videos', data: work });
        }
    });
    
    // Search texts
    this.textWorks.forEach(work => {
        const searchText = [work.title, work.description, work.category].join(' ').toLowerCase();
        if (searchText.includes(searchTerm)) {
            results.push({ type: 'texts', data: work });
        }
    });
    
    return results;
};

// Format duration from seconds to mm:ss
portfolioData.formatDuration = function(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Validate data integrity
portfolioData.validate = function() {
    const errors = [];
    
    // Check for required fields
    if (!this.siteConfig.title) errors.push('Missing site title');
    if (!this.siteConfig.email) errors.push('Missing contact email');
    
    // Check audio files
    this.audioWorks.forEach((work, index) => {
        if (!work.id) errors.push(`Audio work ${index} missing ID`);
        if (!work.file) errors.push(`Audio work ${work.id || index} missing file`);
        if (!work.title) errors.push(`Audio work ${work.id || index} missing title`);
    });
    
    // Check image galleries
    this.imageGalleries.forEach((gallery, index) => {
        if (!gallery.id) errors.push(`Image gallery ${index} missing ID`);
        if (!gallery.images || gallery.images.length === 0) {
            errors.push(`Image gallery ${gallery.id || index} has no images`);
        }
    });
    
    return errors;
};

// Make data available globally
window.portfolioData = portfolioData;
