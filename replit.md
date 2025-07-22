# Atharva Gupta Portfolio Site

## Overview

This is a static portfolio website for artist and researcher Atharva Gupta, built for deployment on GitHub Pages. The site showcases experimental art projects including kinetic sound sculptures, audiovisual installations, and research work at the intersections of sound, movement, technology, and critical media practice. The site features a cyberpunk aesthetic with dark themes, neon accents, and animated elements.

## User Preferences

Preferred communication style: Simple, everyday language.

## Running the Project

To start the portfolio website:
```bash
node server.js
```
or
```bash
./start.sh
```

The server will run on port 8000 and serve the complete portfolio website with all interactive features.

## System Architecture

### Frontend Architecture
- **Static Site Architecture**: Pure HTML/CSS/JavaScript with no server-side dependencies
- **Single Page Application (SPA)**: Client-side routing and dynamic content loading
- **Component-Based Design**: Modular JavaScript classes for different UI components
- **Responsive Design**: Mobile-first approach with touch device detection

### Data Management
- **Centralized Data Source**: All content loaded from `portfolio_data.js` file
- **Dynamic Content Loading**: Text, navigation, media paths, and metadata all sourced dynamically
- **Client-Side Rendering**: Content generated and rendered in the browser
- **Caching Strategy**: Page content cached in memory for performance

### Styling Architecture
- **CSS-Only Styling**: Complete separation of presentation from JavaScript logic
- **CSS Custom Properties**: Extensive use of CSS variables for theming
- **Component-Specific Stylesheets**: Modular CSS files for different components
- **Animation System**: CSS-based animations with JavaScript coordination

## Key Components

### Core Systems
1. **Application Controller** (`app.js`): Main initialization and system coordination
2. **Router System** (`router.js`): Client-side navigation and URL handling
3. **Page Generator** (`page-generator.js`): Dynamic content rendering
4. **Navigation System** (`navigation.js`): Menu handling and page transitions

### Media Components
1. **Audio Player** (`audio-player.js`): Custom neon-themed audio streaming (no downloads)
2. **Lightbox Gallery** (`lightbox.js`): Image gallery with zoom functionality
3. **Video Embeds**: YouTube-style embeds with custom descriptions

### Interactive Elements
1. **Custom Cursor** (`cursor.js`): Cyberpunk crosshair cursor for desktop
2. **Background Canvas** (`canvas-background.js`): Animated particle effects
3. **Glitch Effects** (`glitch.css`): Text animations and transitions
4. **Dynamic Title**: Rotating site titles between "Atharva Gupta", "asymmetrica", "audiodevout"

### Utility Systems
1. **Utils Library** (`utils.js`): Common helper functions and DOM utilities
2. **Markdown Parser** (`markdown.js`): Simple markdown to HTML conversion
3. **Performance Monitoring**: Built-in performance tracking
4. **Error Handling**: Centralized error logging and user feedback

## Data Flow

### Content Loading Process
1. **Initial Load**: App loads `portfolio_data.js` containing all site content
2. **Route Handling**: Router determines current page from URL
3. **Page Generation**: PageGenerator creates HTML from data templates
4. **Component Initialization**: Individual components (audio players, galleries) initialize
5. **Animation Start**: Background effects and interactive elements activate

### Navigation Flow
1. **User Interaction**: Click on navigation link or browser back/forward
2. **Route Processing**: Router matches URL pattern to handler
3. **Transition Effect**: Glitch overlay shows during page change
4. **Content Update**: New page content rendered dynamically
5. **Component Cleanup**: Previous page components cleaned up
6. **State Update**: Navigation state and browser history updated

## External Dependencies

### CDN Resources
- **Google Fonts**: Doto monospace font family
- **Font Awesome**: Icon library for UI elements
- **No Framework Dependencies**: Vanilla JavaScript implementation

### Media Content
- **Audio Streaming**: Direct file serving (no download options)
- **Image Assets**: Local image files served statically
- **Video Content**: YouTube embeds for video content

## Deployment Strategy

### GitHub Pages Optimization
- **Static File Structure**: All content served as static files
- **Relative Paths**: All links relative to repository root
- **404 Handling**: Custom 404.html for broken routes
- **Asset Management**: All media assets accessible via static paths
- **No Server Dependencies**: Complete client-side functionality

### Performance Considerations
- **Lazy Loading**: Content loaded on demand
- **Caching**: Browser caching for static assets
- **Mobile Optimization**: Reduced particle counts and simplified animations
- **Accessibility**: Screen reader support and keyboard navigation
- **Touch Device Support**: Adaptive behavior for touch interfaces

### Security Measures
- **Content Protection**: Right-click disabled on images
- **No Download Options**: Audio/video streaming only
- **XSS Prevention**: Input sanitization for dynamic content
- **HTTPS Enforcement**: Secure delivery via GitHub Pages