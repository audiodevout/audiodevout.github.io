// ===================================================================
// PORTFOLIO DATA
// Centralized content source for Atharva Gupta's portfolio site
// ===================================================================

const portfolioData = {
    // Site configuration
    site: {
        title: "Experimental Systems by Atharva Gupta",
        titles: ["EXPERIMENTAL SYSTEMS BY ATHARVA GUPTA"], // Single title
        description: "Digital artist exploring surveillance, kinetic sound, and generative media through critical making practices.",
        url: "https://atharva-gupta.github.io",
        author: "Atharva Gupta",
        keywords: ["experimental art", "surveillance art", "kinetic sound", "generative music", "media art", "digital art", "cyberpunk"]
    },

    // Floating background text
    floatingText: [
        'Thinker', 'Student', 'Maker', 'Observer', 'Reader', 'Listener', 'Cook', 'Friend', 'Human', 'Son',
        'Philosopher', 'Sociologist', 'Scientist', 'Generalist', 'Anti-Specialist', 'AIUser', 'Critic', 'Researcher', 'Smoker', 'Overanalyser',
        'Dreamer', 'Technologist', 'Wanderer', 'Glitcher', 'Cyborg', 'Outsider', 'Alien', 'Futurist', 'Tinkerer', 'Assembler',
        'Mutator', 'Decoder', 'Dissident', 'Collector', 'Noiser', 'Deconstructor', 'Drifter', 'Skeptic', 'Witness', 'Seeker',
        'Sketcher', 'Painter', 'Sculptor', 'Explorer', 'Experiencer', 'Feeler', 'Imaginer', 'Reflector', 'Intuiter', 'Responder',
        'Navigator', 'Mapper', 'Composer', 'Harmonizer', 'Synthesizer', 'Amplifier', 'Filterer', 'Modulator', 'Echoer', 'Translator'
    ],

    audio: [
        {
            id: 'stranded-deep-fast',
            title: 'stranded deep but fast',
            description: 'by asymmetrica',
            type: 'bandcamp',
            embedUrl: 'https://bandcamp.com/EmbeddedPlayer/track=2743015108/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/',
            bandcampUrl: 'https://asymmetrica.bandcamp.com/track/stranded-deep-but-fast',
            year: '2024',
            tags: ['asymmetrica', 'electronic'],
            featured: true
        },
        {
            id: 'stranded-deep',
            title: 'stranded deep',
            description: 'by asymmetrica',
            type: 'bandcamp',
            embedUrl: 'https://bandcamp.com/EmbeddedPlayer/track=2338898025/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/',
            bandcampUrl: 'https://asymmetrica.bandcamp.com/track/stranded-deep',
            year: '2024',
            tags: ['asymmetrica', 'electronic'],
            featured: true
        },
        {
            id: 'tiptoe',
            title: 'tiptoe',
            description: 'by asymmetrica',
            type: 'bandcamp',
            embedUrl: 'https://bandcamp.com/EmbeddedPlayer/track=1726285270/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/',
            bandcampUrl: 'https://asymmetrica.bandcamp.com/track/tiptoe',
            year: '2024',
            tags: ['asymmetrica', 'electronic'],
            featured: true
        },
        {
            id: 'not-as-i-remember',
            title: 'not as i remember it',
            description: 'by asymmetrica',
            type: 'bandcamp',
            embedUrl: 'https://bandcamp.com/EmbeddedPlayer/track=750668778/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/',
            bandcampUrl: 'https://asymmetrica.bandcamp.com/track/not-as-i-remember-it',
            year: '2024',
            tags: ['asymmetrica', 'electronic'],
            featured: false
        },
        {
            id: 'stretching',
            title: 'stretching',
            description: 'by asymmetrica',
            type: 'bandcamp',
            embedUrl: 'https://bandcamp.com/EmbeddedPlayer/track=2000021307/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/',
            bandcampUrl: 'https://asymmetrica.bandcamp.com/track/stretching',
            year: '2024',
            tags: ['asymmetrica', 'electronic'],
            featured: false
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

    videos: [
        {
            id: 'video-1',
            title: 'Noise Sculpting in TouchDesigner - Part 3 (Tutorial)',
            description: 'Advanced noise sculpting techniques in TouchDesigner',
            type: 'youtube',
            embedId: 'Mu1TpRVujuY',
            videoId: 'Mu1TpRVujuY',
            embedUrl: 'https://www.youtube.com/embed/Mu1TpRVujuY',
            year: '2024',
            duration: '15:30',
            tags: ['tutorial', 'touchdesigner', 'noise'],
            featured: true
        },
        {
            id: 'video-2',
            title: 'Noise Sculpting in TouchDesigner with ParticlesGPU - Part 5 (Tutorial)',
            description: 'GPU particle systems for noise sculpting',
            type: 'youtube',
            embedId: 'kcZH2zcHANc',
            videoId: 'kcZH2zcHANc',
            embedUrl: 'https://www.youtube.com/embed/kcZH2zcHANc',
            year: '2024',
            duration: '18:45',
            tags: ['tutorial', 'touchdesigner', 'particles'],
            featured: true
        },
        {
            id: 'video-3',
            title: 'Basic UV Mapping and Noise Sculpting in Touchdesigner (Tutorial)',
            description: 'Fundamentals of UV mapping with noise techniques',
            type: 'youtube',
            embedId: '4rm5dcoQHBc',
            videoId: '4rm5dcoQHBc',
            embedUrl: 'https://www.youtube.com/embed/4rm5dcoQHBc',
            year: '2024',
            duration: '12:20',
            tags: ['tutorial', 'touchdesigner', 'uv mapping'],
            featured: true
        },
        {
            id: 'video-4',
            title: 'Noise Sculpting in TouchDesigner - Part 2 (Tutorial)',
            description: 'Intermediate noise sculpting techniques',
            type: 'youtube',
            embedId: 'p9TwiixKvXQ',
            videoId: 'p9TwiixKvXQ',
            embedUrl: 'https://www.youtube.com/embed/p9TwiixKvXQ',
            year: '2024',
            duration: '14:15',
            tags: ['tutorial', 'touchdesigner', 'noise'],
            featured: false
        },
        {
            id: 'video-5',
            title: 'Interactive Instrument - Instancing to MIDI in TouchDesigner (Tutorial)',
            description: 'Building interactive MIDI instruments with TouchDesigner',
            type: 'youtube',
            embedId: 's8ea30HlTHE',
            videoId: 's8ea30HlTHE',
            embedUrl: 'https://www.youtube.com/embed/s8ea30HlTHE',
            year: '2023',
            duration: '16:30',
            tags: ['tutorial', 'touchdesigner', 'midi'],
            featured: false
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
                label: "Instagram (Asymmetrica)",
                handle: "@asymmetrica_",
                url: "https://www.instagram.com/asymmetrica_/"
            },
            {
                platform: "Instagram",
                label: "Instagram (AudioDevout)",
                handle: "@audiodevout",
                url: "https://www.instagram.com/audiodevout/"
            },
            {
                platform: "YouTube",
                label: "YouTube",
                handle: "@audiodevout",
                url: "https://www.youtube.com/@audiodevout"
            },
            {
                platform: "Bandcamp",
                label: "Bandcamp", 
                handle: "asymmetrica",
                url: "https://asymmetrica.bandcamp.com/"
            },
            {
                platform: "Patreon",
                label: "Patreon",
                handle: "audiodevout",
                url: "https://www.patreon.com/audiodevout"
            },
            {
                platform: "LinkedIn",
                label: "LinkedIn",
                handle: "Atharva Gupta",
                url: "https://www.linkedin.com/in/atharva--gupta/"
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