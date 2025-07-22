# replit.md

## Overview

This is a full-stack web application for an experimental digital artist named Atharva Gupta (also known as Asymmetrica/AudioDevout). The application serves as a portfolio and artistic showcase featuring interactive elements, audio integration, and experimental visual effects. It's built with a modern tech stack using React for the frontend, Express.js for the backend, and PostgreSQL with Drizzle ORM for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Bundler**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for dynamic theming
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Canvas/Graphics**: HTML5 Canvas for background animations and visual effects

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API design (routes prefixed with `/api`)
- **Session Management**: Prepared for session-based authentication
- **Development**: Hot reload with Vite integration in development mode

### Data Layer
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Currently includes basic user management (users table with username/password)
- **Migrations**: Drizzle Kit for database schema management

## Key Components

### Interactive Elements
- **Custom Cursor**: Dynamic cursor with crosshair effects (desktop only)
- **Background Canvas**: Animated grid with particle system
- **Floating Text**: Dynamic descriptors that respond to mouse movement
- **Glitch Overlay**: Visual transition effects for navigation
- **Audio Player**: Custom audio player component with progress controls

### Visual Features
- **Dynamic Color System**: CSS custom properties that change based on mouse position
- **Responsive Design**: Mobile-first approach with touch-friendly interfaces
- **Dark Theme**: Consistent dark theme with cyan accent colors
- **Typography**: Doto font family for artistic aesthetic

### Audio Integration
- **Custom Audio Hook**: `useAudioPlayer` for managing audio playback state
- **Keyboard Controls**: Escape key to stop all audio playback
- **Progress Tracking**: Visual progress indicators and time formatting

## Data Flow

1. **Client Requests**: React frontend makes API calls through TanStack Query
2. **API Processing**: Express.js routes handle requests with `/api` prefix
3. **Data Operations**: Storage interface abstracts database operations
4. **Response**: JSON responses with appropriate error handling
5. **State Updates**: Client state updates through React Query cache

### Storage Interface
- Abstract storage interface (`IStorage`) allows for multiple implementations
- Current implementation uses in-memory storage (`MemStorage`)
- Designed to be easily replaceable with database-backed storage using Drizzle ORM

## External Dependencies

### UI Components
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating component variants
- **Tailwind Merge**: Intelligent Tailwind class merging

### Audio/Media
- **Date-fns**: Date manipulation and formatting
- **Embla Carousel**: Carousel/slider functionality

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React app to `dist/public`
2. **Backend Build**: ESBuild bundles Express server to `dist/index.js`
3. **Static Assets**: Frontend assets served by Express in production

### Environment Configuration
- **Development**: Hot reload with Vite dev server proxy
- **Production**: Express serves static files and API routes
- **Database**: Environment variable `DATABASE_URL` for database connection

### Scripts
- `dev`: Development server with hot reload
- `build`: Production build for both frontend and backend
- `start`: Production server
- `db:push`: Apply database schema changes

### Database Setup
- Drizzle configuration points to PostgreSQL with connection URL from environment
- Schema defined in `shared/schema.ts` for type sharing between frontend and backend
- Migration files generated in `./migrations` directory

The application is designed to be easily deployable on platforms like Replit, with automatic asset serving and environment detection for development vs production modes.