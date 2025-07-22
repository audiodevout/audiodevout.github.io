// Portfolio Data Configuration
// Replace placeholder values with your actual content
// Follow the file structure guidelines in instructions.txt

export const portfolioData = {
  // Dynamic title cycling (shown in navigation logo)
  titles: [
    'Atharva Gupta',
    'asymmetrica', 
    'audiodevout'
  ],

  // Floating background text elements
  floatingText: [
    'digital_experimentalism',
    'sound_design',
    'visual_programming', 
    'interactive_media',
    'computational_art',
    'generative_systems',
    'audio_processing',
    'glitch_aesthetics',
    'cybernetic_poetry',
    'data_visualization',
    'electronic_music',
    'creative_coding',
    'media_archaeology',
    'posthuman_aesthetics'
  ],

  // Audio section
  audio: [
    {
      title: 'Sample Audio Track',
      description: 'Replace with your audio track description. This is a placeholder.',
      duration: '4:23',
      year: '2024', 
      file: '/assets/audio/sample-track.mp3' // Place audio files in public/assets/audio/
    }
    // Add more audio tracks here
    // {
    //   title: 'Another Track',
    //   description: 'Another track description',
    //   duration: '3:45',
    //   year: '2024',
    //   file: '/assets/audio/another-track.mp3'
    // }
  ],

  // Images section  
  images: [
    {
      title: 'Sample Image',
      description: 'Replace with your image description. This is a placeholder.',
      file: '/assets/images/sample-image.jpg', // Place images in public/assets/images/
      alt: 'Sample artwork description for accessibility'
    }
    // Add more images here
    // {
    //   title: 'Another Artwork',
    //   description: 'Another artwork description', 
    //   file: '/assets/images/another-image.jpg',
    //   alt: 'Another artwork description'
    // }
  ],

  // Videos section
  videos: [
    {
      title: 'Sample Video',
      description: 'Replace with your video description. This is a placeholder.',
      embedUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID' // Replace with actual YouTube embed URL
    }
    // Add more videos here
    // {
    //   title: 'Another Video',
    //   description: 'Another video description',
    //   embedUrl: 'https://www.youtube.com/embed/ANOTHER_VIDEO_ID'
    // }
  ],

  // Texts section
  texts: [
    {
      title: 'Sample Text',
      excerpt: 'Replace with your text excerpt. This is a placeholder for written works, essays, or artist statements.',
      date: 'January 2024',
      fullText: 'Full text content would go here...' // Optional: for expanded view
    }
    // Add more texts here
  ],

  // Downloads section
  downloads: [
    {
      title: 'Sample Document',
      description: 'Replace with your document description. This is a placeholder.',
      format: 'PDF',
      size: '2.5 MB',
      file: '/assets/documents/sample-document.pdf' // Place documents in public/assets/documents/
    }
    // Add more downloads here
  ],

  // About section
  about: {
    biography: [
      'Replace this with your first biography paragraph. This is placeholder content.',
      'Replace this with your second biography paragraph. Add as many paragraphs as needed.'
    ],
    education: 'Replace with your education information. This is placeholder content.',
    exhibitions: [
      'Replace with exhibition 1 - Year, Venue, Location',
      'Replace with exhibition 2 - Year, Venue, Location', 
      'Replace with exhibition 3 - Year, Venue, Location'
    ],
    statement: 'Replace with your artist statement. This is placeholder content that should reflect your artistic practice and philosophy.'
  },

  // Contact section
  contact: {
    formspreeUrl: 'https://formspree.io/f/YOUR_FORM_ID', // Replace with your Formspree form ID
    links: [
      {
        icon: 'fas fa-envelope',
        label: 'your.email@example.com', // Replace with your email
        url: 'mailto:your.email@example.com'
      },
      {
        icon: 'fab fa-instagram', 
        label: 'Instagram',
        url: 'https://instagram.com/yourusername' // Replace with your Instagram
      },
      {
        icon: 'fab fa-github',
        label: 'GitHub', 
        url: 'https://github.com/yourusername' // Replace with your GitHub
      },
      {
        icon: 'fab fa-linkedin',
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/yourusername' // Replace with your LinkedIn
      }
    ]
  },

  // Thesis section
  thesis: {
    title: 'Replace with your thesis title',
    abstract: 'Replace with your thesis abstract. This should be a comprehensive summary of your research, methodology, and findings.',
    institution: 'Replace with your institution name',
    year: '2024', // Replace with your graduation year
    advisor: 'Replace with your advisor name',
    pdfUrl: '/assets/documents/thesis.pdf' // Place thesis PDF in public/assets/documents/
  }
};
