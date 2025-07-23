# Portfolio Website - Experimental Systems by Atharva Gupta

## Overview

This is a fully static Indo-Futurist portfolio website built as a vanilla JavaScript single-page application with a clean, minimal folder structure. All content is rendered client-side from portfolioData.js as the single source of truth. The site showcases experimental systems, sound installations, and new media art with procedural mandala generation, transparent glass UI materials, and particle effects. All data—including media URLs, text, and metadata—is loaded once at runtime and dynamically injected into the DOM, ensuring maximum performance, offline capability, and straightforward deployment on GitHub Pages.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Static Site Architecture
- **Framework**: Vanilla JavaScript ES6+ (no build tools required)
- **Routing**: Hash-based client-side routing with History API
- **Content Management**: portfolioData.js as single source of truth
- **Styling**: Pure CSS with custom properties and modular structure
- **Visual Effects**: Canvas 2D API for mandala and particle rendering
- **Deployment**: Static hosting ready (GitHub Pages, Netlify, etc.)

### Design System
- **Typography**: Funnel Display (primary) and IBM Plex Mono (monospace) fonts
- **Color Palette**: High-contrast scheme with deep black base (#0A0A0A) and bright off-white text (#F3F3F3) with vivid accent colors (saffron, cerulean, neon-magenta, electric-lime)
- **Aesthetic**: Indo-Futurist glitch with geometric patterns, scroll-responsive mandalas, and enhanced particle effects with blur and glow
- **Responsive**: Mobile-first design with fixed navigation

## Key Components

### Core Application Structure
- **App.tsx**: Main application wrapper with routing and providers
- **Navigation.tsx**: Fixed top navigation with responsive mobile menu
- **ParticleCanvas.tsx**: Animated background particle system
- **MandalaGenerator.tsx**: Huge, fixed-position mandala generation serving as central visual anchors on each page, perfectly centered and immersive

### Page Components
- **Home.tsx**: Landing page with tri-phase title animation
- **SoundInstallations.tsx**: Gallery for kinetic sound sculptures and installations
- **Performance.tsx**: Live audiovisual performance documentation
- **GenerativeAV.tsx**: Generative art and TouchDesigner projects
- **Interactive.tsx**: Interactive installations and gesture recognition systems
- **Drawings.tsx**: Digital sketches and visual explorations
- **Writing.tsx**: Theory and critical writing on new media
- **Contact.tsx**: Social links with glowing icon animations

### File Structure
```
/ (root)
├── index.html                  # Main static HTML entry point
├── portfolioData.js            # Single source of truth for all content
├── css/
│   └── main.css               # Complete styling with detailed parameter comments
├── js/
│   ├── main.js                # Core logic with setup, rendering, and event sections
│   ├── mandalaGenerator.js    # Full-screen generative mandala with formula-based complexity
│   ├── particles.js           # Lightweight particle system with sine-wave motion
│   └── cursorTrail.js         # Custom crosshair + trailing circle cursor
├── assets/
│   ├── fonts/                 # Directory for self-hosted fonts (currently using CDN)
│   └── icons/                 # Minimal SVG icons for navigation
└── README.md                  # Documentation and deployment instructions
```

## Data Flow

1. **Content Loading**: All project data flows from `portfolioData.js` into vanilla JavaScript DOM manipulation
2. **Navigation**: Hash-based routing with History API for clean URLs and browser back/forward support
3. **Scroll Interactions**: Native scroll event listeners drive dynamic visual effects and mandala evolution
4. **Fixed Visual Anchors**: Huge mandalas (68-85vmin) remain perfectly centered and fixed during scroll, creating meditative focal points layered beneath content
5. **Canvas Rendering**: Procedural mandala generation and particle systems using Canvas 2D API
6. **Modal System**: Project details displayed in overlay modals with escape-key handling
7. **Responsive Design**: CSS media queries and flexible grid layouts ensure mobile compatibility

## External Dependencies

### Fonts Only
- Google Fonts (Funnel Display, IBM Plex Mono)

### Zero Build Dependencies
- Pure vanilla JavaScript ES6+
- Native CSS custom properties and modern features
- Canvas 2D API for visual effects
- No bundlers, compilers, or framework dependencies

### Browser APIs Used
- Canvas 2D API for mandala and particle rendering
- History API for clean routing
- Intersection Observer for scroll tracking
- RequestAnimationFrame for smooth animations

## Deployment Strategy

### Development Environment
- Any local HTTP server (Python, Node.js, PHP built-in servers)
- No build process required - direct file serving
- Live editing with immediate browser refresh

### Production Deployment
1. **Upload files** to any static hosting service
2. **No build step** required - files work as-is
3. **Instant deployment** on GitHub Pages, Netlify, Vercel
4. **Content updates** via simple portfolioData.js edits

### Hosting Options
- **GitHub Pages**: Upload to repository, enable Pages
- **Netlify**: Drag-and-drop folder deployment
- **Vercel**: Static site deployment
- **Any CDN**: Direct file upload

### Performance Optimizations
- No framework overhead - pure vanilla JavaScript
- RequestAnimationFrame for smooth Canvas animations
- CSS-based transitions with reduced-motion respect
- Efficient DOM manipulation with minimal reflows
- Lightweight particle system (150 particles max)
- Single-file content loading eliminates network requests

### Recent Major Changes (January 2025)
- **Complete Architecture Restructure**: Converted from React SPA to vanilla JavaScript static site
- **Minimal Directory Structure**: Reorganized to exact specification with css/, js/, assets/ folders
- **Enhanced Documentation**: All files include detailed parameter comments and editable settings
- **Code Optimization**: Eliminated redundancies, added memory management, optimized performance
- **Single CSS File**: Consolidated all styling into css/main.css with clear parameter sections
- **Formula-Based Mandalas**: Implemented mathematical complexity formulas as specified
- **Developer Experience**: Clear file headers with purpose, parameters, and structure documentation

The portfolio now follows the exact clean structure guidelines with optimal developer experience, zero build dependencies, and immediate deployment capability.