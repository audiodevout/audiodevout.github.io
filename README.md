# Atharva Gupta - Portfolio Site

A static HTML/CSS/JS portfolio website for experimental digital artist Atharva Gupta, featuring a cyberpunk aesthetic with neon effects, custom cursor, and download prevention measures.

## Features

- **Static HTML/CSS/JS** - Ready for GitHub Pages deployment
- **Cyberpunk Aesthetic** - Neon effects, glitch transitions, custom cursor
- **Fully Responsive** - Mobile-first design with touch-friendly interfaces
- **Accessibility Ready** - WCAG compliant with screen reader support
- **Download Prevention** - Right-click disabled, keyboard shortcuts blocked
- **Doto Font Integration** - Custom typography for artistic appeal
- **Modular Architecture** - Clean separation of CSS and JS modules

## Project Structure

```
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main stylesheet with cyberpunk theme
│   ├── glitch.css         # Glitch and neon effects
│   ├── cursor.css         # Custom cursor system
│   └── audio-player.css   # Audio player styling
├── js/
│   ├── app.js            # Main application initialization
│   ├── navigation.js     # Hash-based routing with glitch transitions
│   ├── cursor.js         # Custom cursor with crosshair effects
│   ├── utils.js          # Utility functions and helpers
│   └── canvas-background.js # Animated background with particles
├── data/
│   └── portfolio-data.js # Centralized content data
├── audio/                # Audio files directory
├── images/               # Image files directory
├── text/                 # Text content directory
└── README.md            # This file
```

## Technical Implementation

### CSS Architecture
- **CSS Variables** - Centralized theming with cyberpunk color palette
- **Modular Stylesheets** - Specialized files for different effects
- **Responsive Design** - Mobile-first approach with breakpoints
- **Accessibility** - Focus states, reduced motion support, screen reader classes

### JavaScript Systems
- **Navigation System** - Hash-based routing with smooth transitions
- **Cursor System** - Custom crosshair cursor with axis markers (desktop only)
- **Canvas Background** - Animated particle grid with mouse interaction
- **Audio Players** - Custom players with no download capability
- **Content Management** - Dynamic content loading from centralized data

### Design Features
- **Neon Color Scheme** - Cyan/blue cyberpunk palette
- **Glitch Effects** - Text animations and transition overlays
- **Dynamic Colors** - Mouse position affects color variables
- **Floating Text** - Kinetic descriptors responding to movement
- **Grid Animation** - Subtle background particle effects

## Content Structure

All content is managed through the centralized `data/portfolio-data.js` file:

- **Site Configuration** - Title, description, contact info
- **Audio Works** - Experimental sound compositions (stream-only)
- **Image Galleries** - Installation and process documentation
- **Video Works** - Performance and documentation videos
- **Text Works** - Artist statements and critical essays
- **Thesis Information** - Academic research presentation

## Deployment

This site is designed for static hosting on GitHub Pages:

1. Upload all files to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to root directory
4. Site will be available at `username.github.io/repository-name`

### GitHub Pages Configuration
- No build process required - pure static files
- All assets served directly from repository
- CDN delivery for fonts and icons
- Download prevention measures included

## Browser Compatibility

- **Modern Browsers** - Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Support** - iOS Safari, Android Chrome
- **Progressive Enhancement** - Core functionality works without JavaScript
- **Touch Devices** - Custom cursor disabled, standard interactions enabled

## Accessibility Features

- **WCAG 2.1 AA Compliant** - Proper heading structure, alt text, labels
- **Screen Reader Support** - Live regions, semantic HTML, skip links
- **Keyboard Navigation** - Full site navigation without mouse
- **Reduced Motion** - Respects user motion preferences
- **Focus Management** - Visible focus indicators throughout
- **Color Contrast** - High contrast neon theme meets standards

## Security & Protection

- **Right-Click Disabled** - Context menu prevention
- **Keyboard Shortcuts Blocked** - Save, view source, dev tools disabled
- **Image Protection** - Drag prevention, selection blocking
- **Console Warnings** - Deterrent messages for unauthorized access
- **No Download Links** - All media is stream/view only

## Performance Optimizations

- **Lazy Loading** - Images load on viewport intersection
- **Asset Preloading** - Critical resources loaded first
- **Debounced Events** - Smooth scrolling and resize handling
- **Canvas Optimization** - Efficient particle system rendering
- **CSS Animations** - Hardware accelerated transforms

## Customization

### Adding Content
Edit `data/portfolio-data.js` to add new works:
- Audio works with streaming URLs
- Image galleries with descriptions
- Text content with markdown support
- Video embeds from external platforms

### Styling Changes
Modify CSS variables in `css/style.css`:
- Color scheme adjustments
- Typography changes
- Layout modifications
- Animation timing

### JavaScript Behavior
Individual systems can be customized:
- Cursor effects in `js/cursor.js`
- Navigation transitions in `js/navigation.js`
- Background animations in `js/canvas-background.js`

## Artist Information

**Atharva Gupta** (also known as Asymmetrica/AudioDevout)
- Experimental digital artist and researcher
- Frank Mohr Institute - MADTech Program
- Focus: Surveillance aesthetics, kinetic sound, generative systems
- Location: Groningen, Netherlands

## License

Content and code © 2024 Atharva Gupta. All rights reserved.
Website structure may be adapted with attribution.