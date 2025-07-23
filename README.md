# Experimental Systems by Atharva Gupta

An Indo-Futurist interactive portfolio showcasing experimental systems, sound installations, and new media art. Built as a fully static single-page application with procedural mandala generation and transparent glass UI materials.

## Overview

This portfolio blends traditional South Asian cultural motifs with contemporary digital aesthetics, featuring:

- **Procedural Mandala Generation**: Huge, fixed-position mandalas serve as visual anchors on each page
- **Particle System**: Lightweight canvas-based particle animations with mouse interaction
- **Glass UI Materials**: Transparent panels with directional shadows and accent color hints
- **Cursor Trail Effects**: Custom crosshair and trailing circle cursor interactions
- **Fully Static Architecture**: All content loads from `portfolioData.js` as single source of truth

## Architecture

### File Structure
```
/
├── index.html                  # Main static HTML entry point
├── portfolioData.js            # Single source of truth for all content
├── css/
│   └── main.css               # Complete styling with color palette and responsive design
├── js/
│   ├── main.js                # Core logic: parses portfolioData.js and renders DOM
│   ├── mandalaGenerator.js    # Full-screen generative mandala per page
│   ├── particles.js           # Simple floating particle background system
│   └── cursorTrail.js         # Custom crosshair + trailing circle cursor
├── assets/
│   ├── fonts/                 # Local font files (currently using Google Fonts CDN)
│   └── icons/                 # Minimal SVG icons for navigation
└── README.md                  # Documentation and deployment instructions
```

### Design System

**Color Palette**:
- Deep Black Base: `#0A0A0A`
- Off-White Text: `#F3F3F3`
- Accent Colors: Saffron, Cerulean, Neon-Magenta, Electric-Lime

**Typography**:
- Primary: Funnel Display (Google Fonts)
- Monospace: IBM Plex Mono (Google Fonts)

**UI Materials**:
- Transparent glass panels with 70-80% opacity
- Directional drop shadows with accent color hints
- Backdrop blur effects for depth

## Features

### Content Management
- All project data, media URLs, and metadata stored in `portfolioData.js`
- Dynamic content injection without server dependencies
- Offline-capable and GitHub Pages ready

### Visual Effects
- **Mandalas**: Huge (68-85vmin), perfectly centered, fixed-position visual anchors
- **Particles**: 150 animated particles with mouse interaction and connection lines
- **Cursor**: Custom crosshair with trailing circle effect
- **Glass Materials**: Layered transparency with blur and shadow effects

### Page Categories
1. **Sound Installations**: Kinetic sculptures and audio-reactive works
2. **Performance**: Live audiovisual performances and ritual computing
3. **Generative AV**: Algorithmic composition and data sonification
4. **Interactive**: Gesture detection and ambient computing experiments
5. **Drawings**: Digital sketches and visual explorations
6. **Writing**: Critical theory and Indo-Futurist aesthetics
7. **Contact**: Social links and collaboration information

## Deployment

### GitHub Pages
1. Upload all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. Site will be available at `https://username.github.io/repository-name`

### Local Development
1. Clone the repository
2. Serve files using any local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   npx serve .
   
   # PHP
   php -S localhost:8000
   ```
3. Open `http://localhost:8000` in your browser

### Content Updates
- Edit `portfolioData.js` to update project information
- All changes are reflected immediately without rebuild
- Supports external media URLs for audio, video, and images

## Technical Details

### Performance Optimizations
- Lazy loading for heavy visual components
- RequestAnimationFrame for smooth animations
- CSS-based animations with reduced-motion respect
- Lightweight vanilla JavaScript (no frameworks)

### Browser Support
- Modern browsers with ES6+ support
- Canvas 2D API for mandala and particle rendering
- CSS Grid and Flexbox for responsive layouts
- Backdrop-filter for glass effects

### Responsive Design
- Mobile-first approach with CSS media queries
- Collapsible navigation for mobile devices
- Adaptive mandala sizing (vmin units)
- Touch-friendly interactive elements

## Customization

### Adding New Projects
```javascript
// In portfolioData.js
{
  id: 'project-id',
  title: 'Project Title',
  description: 'Brief description...',
  fullDescription: 'Detailed description...',
  medium: 'Technology stack or medium',
  category: 'PROJECT CATEGORY',
  color: 'saffron', // or cerulean, neon-magenta, electric-lime
  // Additional fields as needed
}
```

### Modifying Visual Effects
- **Mandala segments**: Edit `getPageSegments()` in `main.js`
- **Particle count**: Modify `maxParticles` in `particles.js`
- **Color palette**: Update CSS custom properties in `main.css`
- **Glass opacity**: Adjust `--glass-panel` values in CSS

## Indo-Futurist Aesthetic

This portfolio embodies Indo-Futurist principles by:
- Integrating traditional mandala patterns with digital generation
- Using geometric forms inspired by Kolam/Rangoli traditions
- Blending urban cultural motifs with contemporary tech aesthetics
- Creating meditative experiences through fixed visual anchors
- Emphasizing cultural synthesis over mere technological display

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly across devices and browsers
5. Submit a pull request with detailed description

## License

This project is open source under the MIT License. Feel free to use it as inspiration for your own portfolio, but please create your own unique content and visual identity.

---

**Experimental Systems by Atharva Gupta** - Exploring the intersection of traditional cultural knowledge and contemporary digital art practices.