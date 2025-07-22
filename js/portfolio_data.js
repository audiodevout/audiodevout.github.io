// ===================================================================
// PORTFOLIO DATA
// Centralized content source for Atharva Gupta's portfolio site
// ===================================================================

const portfolioData = {
    // Site configuration
    site: {
        title: "Atharva Gupta",
        titles: ["ATHARVA GUPTA", "asymmetrica", "audiodevout"], // Rotating titles
        description: "Digital artist exploring surveillance, kinetic sound, and generative media through critical making practices.",
        url: "https://atharva-gupta.github.io",
        author: "Atharva Gupta",
        keywords: ["experimental art", "surveillance art", "kinetic sound", "generative music", "media art", "digital art", "cyberpunk"]
    },

    // Floating background text
    floatingText: [
        "experimental systems",
        "kinetic sound",
        "digital entropy",
        "glitch protocols", 
        "audio experiments",
        "generative compositions",
        "critical making",
        "system failures",
        "noise patterns",
        "temporal distortions",
        "surveillance aesthetics",
        "machine listening",
        "computational creativity",
        "techno-social critique",
        "algorithmic composition"
    ],

    // Audio works
    audio: [
        {
            id: "surveil_structures_01",
            title: "Surveillance Structures 01",
            description: "Generative composition exploring the sonic dimensions of surveillance technology. Field recordings from CCTV systems processed through machine listening algorithms.",
            file: "./audio/surveil_structures_01.mp3",
            artwork: "./images/audio/surveil_structures_01.jpg",
            duration: "7:42",
            year: "2024",
            featured: true,
            tags: ["surveillance", "generative", "field recording", "machine learning"]
        },
        {
            id: "kinetic_drift",
            title: "Kinetic Drift",
            description: "Interactive sound installation responding to movement patterns. Accelerometer data from kinetic sculptures drives real-time audio synthesis.",
            file: "./audio/kinetic_drift.mp3", 
            artwork: "./images/audio/kinetic_drift.jpg",
            duration: "12:15",
            year: "2024",
            featured: true,
            tags: ["kinetic", "interactive", "sensors", "real-time"]
        },
        {
            id: "error_resonance",
            title: "Error Resonance",
            description: "Algorithmic composition using glitch aesthetics. System errors and digital artifacts become musical material through custom TouchDesigner instruments.",
            file: "./audio/error_resonance.mp3",
            artwork: "./images/audio/error_resonance.jpg", 
            duration: "9:33",
            year: "2023",
            featured: false,
            tags: ["glitch", "algorithmic", "TouchDesigner", "digital artifacts"]
        },
        {
            id: "listening_machines",
            title: "Listening Machines",
            description: "Exploration of machine listening and AI audio processing. Human speech processed through various ML models to reveal algorithmic biases.",
            file: "./audio/listening_machines.mp3",
            artwork: "./images/audio/listening_machines.jpg",
            duration: "6:18", 
            year: "2023",
            featured: false,
            tags: ["AI", "speech processing", "bias", "machine learning"]
        },
        {
            id: "temporal_feedback",
            title: "Temporal Feedback Loops",
            description: "Time-based audio work using delay networks and recursive processing. Explores concepts of memory and temporal perception in digital systems.",
            file: "./audio/temporal_feedback.mp3",
            artwork: "./images/audio/temporal_feedback.jpg",
            duration: "11:07",
            year: "2023",
            featured: true,
            tags: ["delay", "feedback", "temporal", "memory"]
        }
    ],

    // Visual works
    images: [
        {
            id: "surveillance_grid",
            title: "Surveillance Grid Installation",
            description: "Interactive installation mapping CCTV camera locations in urban spaces. Real-time data visualization of surveillance infrastructure.",
            src: "./images/gallery/surveillance_grid_full.jpg",
            thumb: "./images/gallery/surveillance_grid_thumb.jpg",
            year: "2024",
            medium: "Interactive Installation",
            dimensions: "4m x 3m x 2.5m",
            featured: true,
            tags: ["surveillance", "data visualization", "urban", "interactive"]
        },
        {
            id: "kinetic_sculpture_01",
            title: "Kinetic Sound Sculpture #1",
            description: "Motorized sculpture with embedded sensors and speakers. Movement patterns generate real-time audio composition.",
            src: "./images/gallery/kinetic_sculpture_01_full.jpg", 
            thumb: "./images/gallery/kinetic_sculpture_01_thumb.jpg",
            year: "2024",
            medium: "Kinetic Sculpture",
            dimensions: "1.2m x 0.8m x 1.5m",
            featured: true,
            tags: ["kinetic", "sculpture", "sensors", "audio"]
        },
        {
            id: "glitch_portraits",
            title: "Glitch Portrait Series",
            description: "Digital portraits processed through custom glitch algorithms. Explores themes of identity in digital surveillance systems.",
            src: "./images/gallery/glitch_portraits_full.jpg",
            thumb: "./images/gallery/glitch_portraits_thumb.jpg", 
            year: "2023",
            medium: "Digital Art",
            dimensions: "1920 x 1080 pixels",
            featured: false,
            tags: ["glitch", "portraits", "identity", "digital"]
        },
        {
            id: "touchdesigner_lab",
            title: "TouchDesigner Lab Setup",
            description: "Documentation of experimental TouchDesigner setup for real-time audiovisual performance. Multiple cameras and sensors feed live data.",
            src: "./images/gallery/touchdesigner_lab_full.jpg",
            thumb: "./images/gallery/touchdesigner_lab_thumb.jpg",
            year: "2024", 
            medium: "Performance Setup",
            dimensions: "Variable",
            featured: true,
            tags: ["TouchDesigner", "performance", "real-time", "audiovisual"]
        },
        {
            id: "error_aesthetics",
            title: "Error Aesthetics Documentation", 
            description: "Process documentation showing intentional system failures and glitch generation techniques used in various projects.",
            src: "./images/gallery/error_aesthetics_full.jpg",
            thumb: "./images/gallery/error_aesthetics_thumb.jpg",
            year: "2023",
            medium: "Process Documentation", 
            dimensions: "Various",
            featured: false,
            tags: ["process", "documentation", "errors", "glitch"]
        }
    ],

    // Video works
    videos: [
        {
            id: "surveillance_performance",
            title: "Surveillance Performance Documentation", 
            description: "Live performance using surveillance cameras as instruments. Real-time video processing creates audiovisual feedback systems.",
            embedId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
            duration: "15:32",
            year: "2024",
            venue: "Groningen Museum",
            tags: ["performance", "surveillance", "live", "audiovisual"]
        },
        {
            id: "kinetic_process",
            title: "Kinetic Sculpture Process",
            description: "Time-lapse documentation of kinetic sculpture construction and calibration. Shows integration of motors, sensors, and audio systems.",
            embedId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
            duration: "8:45", 
            year: "2024",
            venue: "Studio Documentation",
            tags: ["process", "kinetic", "sculpture", "documentation"]
        },
        {
            id: "touchdesigner_workshop",
            title: "TouchDesigner Workshop: Machine Listening",
            description: "Educational workshop on implementing machine listening algorithms in TouchDesigner for artistic applications.",
            embedId: "dQw4w9WgXcQ", // Replace with actual YouTube video ID
            duration: "32:17",
            year: "2023",
            venue: "University of Groningen",
            tags: ["workshop", "education", "TouchDesigner", "machine learning"]
        }
    ],

    // Written works
    texts: [
        {
            id: "critical_making_thesis",
            title: "Critical Making in Sound Art: Technology, Surveillance, and Aesthetic Practice",
            description: "Master's thesis exploring critical making methodologies in contemporary sound art, with focus on surveillance technologies and their aesthetic implications.",
            content: `This thesis examines the intersection of critical making, sound art, and surveillance technology, proposing new methodologies for artistic practice that engage critically with contemporary technological systems.

            ## Introduction

            The proliferation of surveillance technologies in contemporary society presents both challenges and opportunities for artistic practice. This research investigates how critical making methodologies can inform sound art practices that engage meaningfully with surveillance infrastructure.

            ## Chapter 1: Theoretical Framework

            Critical making, as defined by Matt Ratto, provides a framework for engaging with technology through hands-on creation that maintains critical distance from technological determinism. In the context of sound art, this approach enables artists to investigate the sonic dimensions of surveillance while creating alternative technological configurations.

            ## Chapter 2: Surveillance Aesthetics

            Contemporary surveillance systems generate vast amounts of data that can be understood as material for artistic investigation. From CCTV audio feeds to algorithmic listening systems, surveillance infrastructure contains inherent aesthetic properties that can be revealed through critical making practices.

            ## Chapter 3: Case Studies

            This chapter examines three key projects that demonstrate critical making approaches to surveillance sound art:

            1. **Surveillance Structures**: A series of generative compositions using field recordings from surveillance systems
            2. **Listening Machines**: An investigation of machine listening algorithms and their biases
            3. **Kinetic Surveillance**: Interactive installations that make visible the spatial and temporal dimensions of surveillance networks

            ## Conclusion

            Critical making provides a valuable framework for sound artists engaging with surveillance technology. By maintaining critical distance while developing technical expertise, artists can create works that both reveal and resist the pervasive nature of contemporary surveillance systems.`,
            year: "2024",
            pages: 87,
            published: false,
            featured: true,
            tags: ["critical making", "sound art", "surveillance", "thesis", "research"],
            downloadUrl: "./downloads/critical_making_thesis.pdf"
        },
        {
            id: "glitch_aesthetics_paper",
            title: "Glitch Aesthetics and Temporal Perception in Digital Sound Art",
            description: "Conference paper examining how glitch aesthetics in digital sound art reveal temporal structures and challenge linear perception of time.",
            content: `Glitch aesthetics in digital sound art offer unique insights into temporal perception and the material properties of digital media. This paper examines how intentional system failures create new temporal experiences for listeners.

            ## Abstract

            This paper investigates the use of glitch aesthetics in contemporary digital sound art, with particular attention to how these techniques reveal and manipulate temporal perception. Through analysis of selected works and practical experimentation, I argue that glitch aesthetics provide a critical lens for understanding the temporal dimensions of digital media.

            ## Methodology

            The research combines theoretical analysis with practical experimentation using custom software tools developed in TouchDesigner and Max/MSP. Case studies include works by Kim Cascone, Oval, and original compositions created as part of this research.

            ## Findings

            Glitch aesthetics reveal the temporal infrastructure of digital systems, making audible the computational processes that are typically hidden from users. These techniques create non-linear temporal experiences that challenge conventional notions of musical time and progression.`,
            year: "2023",
            pages: 12,
            published: true,
            featured: false,
            tags: ["glitch", "temporal perception", "digital art", "aesthetics", "conference paper"],
            downloadUrl: "./downloads/glitch_aesthetics_paper.pdf"
        },
        {
            id: "machine_listening_essay",
            title: "Machine Listening and Algorithmic Bias in Audio AI",
            description: "Critical essay examining bias in machine listening systems and their implications for artistic practice and social justice.",
            content: `Machine listening systems increasingly mediate our relationship with sound and music, but these systems carry inherent biases that reflect their training data and algorithmic design. This essay examines these biases and their implications for artistic practice.

            ## Introduction

            As artificial intelligence systems become more prevalent in audio processing and music generation, it becomes crucial to examine the biases embedded within these systems. Machine listening—the automated analysis and interpretation of audio signals—represents a particularly significant area for investigation.

            ## Bias in Training Data

            Most machine listening systems are trained on datasets that reflect existing cultural and social biases. Western musical traditions are overrepresented, while non-Western musical forms are marginalized or misclassified. This bias perpetuates existing power structures in musical and cultural representation.

            ## Implications for Artistic Practice

            Artists using machine listening systems must grapple with these inherent biases. Some choose to work against the systems, revealing their limitations, while others attempt to retrain systems with more diverse datasets. Both approaches offer valuable insights into the nature of algorithmic bias.`,
            year: "2023",
            pages: 8,
            published: true,
            featured: true,
            tags: ["machine learning", "bias", "AI", "critical theory", "social justice"],
            downloadUrl: "./downloads/machine_listening_essay.pdf"
        }
    ],

    // Downloads
    downloads: [
        {
            id: "cv_academic",
            title: "Academic CV",
            description: "Current academic curriculum vitae including education, exhibitions, performances, and publications.",
            file: "./downloads/atharva_gupta_cv_academic.pdf",
            filename: "Atharva_Gupta_CV_Academic.pdf",
            type: "PDF",
            size: "245 KB",
            category: "CV & Bio",
            lastUpdated: "January 2025"
        },
        {
            id: "artist_statement",
            title: "Artist Statement",
            description: "Current artist statement describing research interests, methodologies, and creative practice.",
            file: "./downloads/atharva_gupta_artist_statement.pdf", 
            filename: "Atharva_Gupta_Artist_Statement.pdf",
            type: "PDF",
            size: "156 KB",
            category: "CV & Bio",
            lastUpdated: "January 2025"
        },
        {
            id: "technical_portfolio",
            title: "Technical Portfolio",
            description: "Documentation of technical projects including code samples, system diagrams, and implementation details.",
            file: "./downloads/atharva_gupta_technical_portfolio.pdf",
            filename: "Atharva_Gupta_Technical_Portfolio.pdf", 
            type: "PDF",
            size: "2.1 MB",
            category: "Technical",
            lastUpdated: "December 2024"
        },
        {
            id: "press_kit",
            title: "Press Kit",
            description: "High-resolution images, biographical text, and press materials for exhibitions and performances.",
            file: "./downloads/atharva_gupta_press_kit.zip",
            filename: "Atharva_Gupta_Press_Kit.zip",
            type: "ZIP", 
            size: "12.3 MB",
            category: "Press",
            lastUpdated: "November 2024"
        },
        {
            id: "touchdesigner_tools",
            title: "TouchDesigner Tools Collection",
            description: "Custom TouchDesigner components and tools for audio analysis, kinetic control, and surveillance data processing.",
            file: "./downloads/touchdesigner_tools_collection.zip",
            filename: "TouchDesigner_Tools_Collection.zip",
            type: "ZIP",
            size: "5.7 MB", 
            category: "Technical",
            lastUpdated: "January 2025"
        }
    ],

    // About information
    about: {
        bio: "Atharva Gupta is a digital artist and researcher based in Groningen, Netherlands, working at the intersections of sound, movement, technology, and critical media practice. Their work explores surveillance technologies, kinetic systems, and machine listening through critical making methodologies. Currently pursuing research at the University of Groningen, they investigate how experimental sound art can reveal and resist the pervasive nature of contemporary surveillance infrastructure.",
        
        statement: "My practice centers on experimental systems that combine sound, light, code, and kinetic structures. I'm interested in the edges between control and collapse—between what is designed and what breaks, flickers, loops, or hums out of place. Through critical making approaches, I investigate surveillance technologies not as fixed systems but as material for artistic inquiry. My work asks: How can we listen to the infrastructure of control? How do machines listen to us? What forms of resistance emerge when we turn surveillance systems against themselves?",
        
        education: [
            {
                degree: "MA Media Arts",
                institution: "University of Groningen",
                location: "Groningen, Netherlands", 
                year: "2024",
                status: "In Progress"
            },
            {
                degree: "BA Digital Arts",
                institution: "Previous Institution",
                location: "Location",
                year: "2022",
                status: "Completed"
            }
        ],
        
        exhibitions: [
            {
                title: "Surveillance Structures",
                type: "Solo Exhibition",
                venue: "Groningen Museum",
                location: "Groningen, Netherlands",
                year: "2024"
            },
            {
                title: "Critical Making Collective",
                type: "Group Exhibition", 
                venue: "TENT Rotterdam",
                location: "Rotterdam, Netherlands",
                year: "2023"
            },
            {
                title: "Machine Listening Workshop",
                type: "Performance/Workshop",
                venue: "Sonic Acts",
                location: "Amsterdam, Netherlands", 
                year: "2023"
            }
        ],
        
        tools: [
            "TouchDesigner",
            "Max/MSP",
            "Pure Data", 
            "Python",
            "Arduino/Raspberry Pi",
            "Ableton Live",
            "Reaper",
            "OpenCV",
            "TensorFlow",
            "JavaScript/Web Audio",
            "3D Printing",
            "Electronics Prototyping"
        ]
    },

    // Contact information
    contact: {
        location: "Groningen, Netherlands",
        formspreeUrl: "https://formspree.io/f/your-formspree-id", // Replace with actual Formspree endpoint
        socials: [
            {
                platform: "Instagram",
                label: "Instagram",
                handle: "@asymmetrica_sound",
                url: "https://instagram.com/asymmetrica_sound"
            },
            {
                platform: "SoundCloud", 
                label: "SoundCloud",
                handle: "asymmetrica",
                url: "https://soundcloud.com/asymmetrica"
            },
            {
                platform: "Bandcamp",
                label: "Bandcamp", 
                handle: "asymmetrica",
                url: "https://asymmetrica.bandcamp.com"
            },
            {
                platform: "GitHub",
                label: "GitHub",
                handle: "atharva-gupta",
                url: "https://github.com/atharva-gupta"
            },
            {
                platform: "Academia",
                label: "Academia.edu",
                handle: "Atharva Gupta",
                url: "https://university.academia.edu/AtharvaGupta"
            }
        ]
    },

    // Thesis information
    thesis: {
        title: "Critical Making in Sound Art: Technology, Surveillance, and Aesthetic Practice",
        abstract: "This thesis examines the intersection of critical making, sound art, and surveillance technology, proposing new methodologies for artistic practice that engage critically with contemporary technological systems. Through theoretical analysis and practical experimentation, the research investigates how sound artists can use critical making approaches to reveal and resist the pervasive nature of surveillance infrastructure. The work combines hands-on technical development with critical theory, resulting in new tools and techniques for artistic investigation of surveillance technologies.",
        institution: "University of Groningen",
        year: "2024",
        pages: 87,
        supervisor: "Dr. Example Supervisor",
        keywords: ["critical making", "sound art", "surveillance", "technology", "aesthetic practice", "resistance", "digital media"],
        file: "./downloads/critical_making_thesis.pdf"
    },

    // Utility methods
    getAudioById: function(id) {
        return this.audio.find(item => item.id === id);
    },
    
    getImageById: function(id) {
        return this.images.find(item => item.id === id);
    },
    
    getVideoById: function(id) {
        return this.videos.find(item => item.id === id);
    },
    
    getTextById: function(id) {
        return this.texts.find(item => item.id === id);
    },
    
    getDownloadById: function(id) {
        return this.downloads.find(item => item.id === id);
    },
    
    getFeaturedContent: function() {
        return {
            audio: this.audio.filter(item => item.featured),
            images: this.images.filter(item => item.featured), 
            texts: this.texts.filter(item => item.featured)
        };
    },
    
    searchContent: function(query) {
        const results = [];
        const searchTerms = query.toLowerCase().split(' ');
        
        // Search audio
        this.audio.forEach(item => {
            const searchText = `${item.title} ${item.description} ${item.tags?.join(' ') || ''}`.toLowerCase();
            if (searchTerms.some(term => searchText.includes(term))) {
                results.push({ type: 'audio', item });
            }
        });
        
        // Search images
        this.images.forEach(item => {
            const searchText = `${item.title} ${item.description} ${item.tags?.join(' ') || ''}`.toLowerCase();
            if (searchTerms.some(term => searchText.includes(term))) {
                results.push({ type: 'image', item });
            }
        });
        
        // Search texts
        this.texts.forEach(item => {
            const searchText = `${item.title} ${item.description} ${item.content} ${item.tags?.join(' ') || ''}`.toLowerCase();
            if (searchTerms.some(term => searchText.includes(term))) {
                results.push({ type: 'text', item });
            }
        });
        
        return results;
    }
};

// Make globally available
window.portfolioData = portfolioData;

// Emit data loaded event
document.addEventListener('DOMContentLoaded', () => {
    if (typeof appEvents !== 'undefined') {
        appEvents.emit('dataLoaded', portfolioData);
    }
});