/**
 * portfolioData.js - Single Source of Truth
 * 
 * PURPOSE: Centralized content management for the Indo-Futurist portfolio
 * 
 * STRUCTURE:
 * - projects: Organized by category (soundInstallations, performance, etc.)
 * - pageContent: Static text content for each page
 * - socialLinks: Contact information and external links
 * 
 * EDITING GUIDELINES:
 * - All project media URLs, descriptions, and metadata go here
 * - Use fallback values for missing media (audioFile: null, images: [])
 * - Keep color values consistent: 'saffron', 'cerulean', 'neon-magenta', 'electric-lime'
 * - Add alt text for all images for accessibility
 */

// Validate portfolioData exists and provide fallbacks
const portfolioData = {
  projects: {
    soundInstallations: [
      {
        id: 'rain-reminders',
        title: 'Rain Reminders',
        description: 'A kinetic sound installation featuring a 1.8-meter-tall rotating rain stick mounted on a vertical wooden and steel structure.',
        fullDescription: 'The piece explores the contrast between organic acoustic textures and industrial mechanical aesthetics, meditative distraction, and tinnitus awareness. It incorporates motorized rotation, subtle sound generation, and a tactile physical presence.',
        medium: 'Physical sound sculpture, motorized kinetic installation, acoustic rain stick, wood and steel, electronics (motors)',
        category: 'PHYSICAL SCULPTURE',
        color: 'saffron',
        icon: 'star',
        dimensions: '1.8m (height) × 0.5m (diameter)',
        technical: 'Motorized rotation system, custom electronics, organic acoustic elements',
        audioFile: null,
        images: []
      },
      {
        id: 'fever-dream',
        title: 'Fever Dream',
        description: 'An audio-reactive poetic installation that externalizes fears and subconscious anxieties, blending glitch electronics with spoken word fragments.',
        fullDescription: 'It interrogates the abstraction of problem-solving and emotional complexity through sound and text, creating an immersive environment for digital anxiety exploration.',
        medium: 'Sound art, interactive audio installation, poetry, glitch electronics',
        category: 'INTERACTIVE AUDIO',
        color: 'neon-magenta',
        icon: 'circle',
        themes: 'Subconscious processing, emotional complexity, digital anxiety, glitch aesthetics',
        technology: 'Real-time audio processing, responsive text generation, ambient computing',
        audioFile: null,
        images: []
      },
      {
        id: 'untitled-rain-stick',
        title: 'Untitled Rain Stick Installation',
        description: 'An experimental sound sculpture featuring motorized kinetic elements and organic-industrial aesthetics.',
        fullDescription: 'Engaging themes of meditative sound, environmental texture, and physical presence through ongoing experimentation with kinetic sound.',
        medium: 'Physical installation, motorized sculpture, sound art',
        category: 'ONGOING PROJECT',
        color: 'cerulean',
        icon: 'hexagon',
        status: 'In development',
        audioFile: null,
        images: []
      }
    ],
    
    performance: [
      {
        id: 'live-av-performances',
        title: 'Live AudioVisual Performances',
        description: 'Real-time manipulation of sound and visuals through gestural interfaces, exploring the liminal space between performer and machine.',
        medium: 'TouchDesigner, gesture control, live electronics',
        category: 'TOUCHDESIGNER • GESTURE CONTROL',
        color: 'cerulean',
        documentation: 'Video archives and recordings coming soon',
        videos: []
      },
      {
        id: 'ritual-computing',
        title: 'Ritual Computing Sessions',
        description: 'Collaborative experiences where audience and performer co-create digital mantras through shared interfaces and collective sound-making.',
        medium: 'Participatory performance, experimental interfaces',
        category: 'PARTICIPATORY • EXPERIMENTAL',
        color: 'electric-lime',
        documentation: 'Live performance documentation',
        videos: []
      }
    ],
    
    generativeAV: [
      {
        id: 'symmetrical-fictions',
        title: 'Symmetrical Fictions',
        description: 'An audiovisual project capturing gameplay footage from Cities: Skylines, focusing on the journey of a garbage truck through urban infrastructure.',
        fullDescription: 'The visual data drives generative music and sound design, exploring themes of urban entropy, flow, and data as narrative.',
        medium: 'Generative music, data sonification, video game aesthetics',
        category: 'DATA SONIFICATION',
        color: 'neon-magenta',
        urls: {
          soundcloud: null,
          video: null
        }
      },
      {
        id: 'galaxy-simulation',
        title: 'Galaxy Simulation',
        description: 'Procedural generation of cosmic structures translated into immersive soundscapes and visual environments.',
        fullDescription: 'Using algorithmic approaches to simulate galactic formation while creating corresponding audio-visual experiences that mirror the complexity and beauty of cosmic evolution.',
        medium: 'Algorithmic composition, procedural generation, space simulation',
        category: 'ALGORITHMIC COMPOSITION',
        color: 'electric-lime',
        urls: {
          demo: null,
          github: null
        }
      },
      {
        id: 'audiodevout-channel',
        title: 'AudioDevout Channel',
        description: 'A curated collection of experimental music and sound art showcasing both original compositions and collaborative works.',
        fullDescription: 'The channel serves as a platform for sharing experimental approaches to sound design, generative music, and collaborative audio-visual projects.',
        medium: 'Digital music curation, experimental audio',
        category: 'MUSIC CURATION',
        color: 'cerulean',
        urls: {
          youtube: 'https://www.youtube.com/@audiodevout',
          bandcamp: 'https://audiodevout.bandcamp.com'
        }
      }
    ],
    
    interactive: [
      {
        id: 'gesture-detection',
        title: 'Gesture Detection Interface',
        description: 'Real-time hand tracking system for controlling digital audio and visual parameters through physical movement.',
        fullDescription: 'Using computer vision and machine learning to create intuitive gestural interfaces that bridge physical expression with digital sound manipulation.',
        medium: 'Computer vision, real-time audio processing, gesture recognition',
        category: 'INTERFACE DESIGN',
        color: 'electric-lime',
        technical: 'MediaPipe, real-time audio synthesis, Python, Max/MSP integration',
        images: []
      },
      {
        id: 'ambient-computing',
        title: 'Ambient Computing Experiments',
        description: 'Exploring subtle, pervasive computing environments that respond to presence and environmental conditions.',
        fullDescription: 'Developing systems that exist at the periphery of attention, creating ambient soundscapes and visual responses based on environmental data and human presence.',
        medium: 'Environmental sensors, ambient audio, responsive computing',
        category: 'ENVIRONMENTAL COMPUTING',
        color: 'saffron',
        technical: 'Arduino, environmental sensors, ambient sound processing',
        images: []
      }
    ],
    
    drawings: [
      {
        id: 'digital-sketches',
        title: 'Digital Sketches + Visual Explorations',
        description: 'A collection of digital drawings exploring geometric patterns, urban textures, and algorithmic aesthetics.',
        fullDescription: 'These sketches serve as visual research for larger projects, exploring the intersection of traditional South Asian geometric patterns with contemporary digital aesthetics. They range from quick gestural studies to more developed compositions that inform installation and performance work.',
        medium: 'Digital drawing, algorithmic pattern generation, mixed media',
        category: 'VISUAL RESEARCH',
        color: 'saffron',
        themes: 'Geometric abstraction, urban textures, cultural pattern synthesis',
        tools: 'Procreate, TouchDesigner, generative algorithms',
        images: []
      }
    ],
    
    writing: [
      {
        id: 'new-media-aesthetics',
        title: 'New Media Aesthetics & Digital Culture',
        description: 'Critical writing on the intersection of technology, culture, and artistic practice in contemporary new media art.',
        fullDescription: 'Exploring themes of digital culture, technological mediation, and the aesthetic implications of computational systems on contemporary art practice.',
        medium: 'Critical theory, cultural analysis, new media criticism',
        category: 'CRITICAL THEORY',
        color: 'cerulean',
        themes: 'Digital culture, technological aesthetics, computational art theory',
        publications: []
      },
      {
        id: 'indo-futurism',
        title: 'Indo-Futurist Aesthetics',
        description: 'Theoretical exploration of how traditional South Asian cultural elements can inform and enhance contemporary digital art practices.',
        fullDescription: 'Investigating the potential for creating new aesthetic languages that bridge traditional cultural knowledge systems with emerging technological capabilities.',
        medium: 'Cultural theory, aesthetic philosophy, speculative design',
        category: 'SPECULATIVE THEORY',
        color: 'neon-magenta',
        themes: 'Cultural futurism, aesthetic synthesis, technological decolonization',
        publications: []
      }
    ]
  },
  
  contact: {
    social: [
      {
        name: 'YouTube AudioDevout',
        url: 'https://www.youtube.com/@audiodevout',
        icon: 'youtube',
        color: 'cerulean'
      },
      {
        name: 'Instagram Asymmetrica',
        url: 'https://www.instagram.com/asymmetrica_/',
        icon: 'instagram',
        color: 'neon-magenta'
      },
      {
        name: 'Instagram AudioDevout',
        url: 'https://www.instagram.com/audiodevout/',
        icon: 'instagram',
        color: 'electric-lime'
      },
      {
        name: 'Bandcamp Asymmetrica',
        url: 'https://asymmetrica.bandcamp.com/',
        icon: 'bandcamp',
        color: 'saffron'
      },
      {
        name: 'Patreon AudioDevout',
        url: 'https://www.patreon.com/audiodevout',
        icon: 'patreon',
        color: 'electric-lime'
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/atharva--gupta/',
        icon: 'linkedin',
        color: 'cerulean'
      }
    ],
    description: 'Explore experimental systems through sound, computation, and cultural synthesis. Connect for collaborations, commissions, or critical discourse on new media aesthetics.'
  }
};

// Make data available globally
window.portfolioData = portfolioData;