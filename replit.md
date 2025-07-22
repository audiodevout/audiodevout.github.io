# Portfolio Website

## Overview

This is a modern portfolio website built with a React frontend and Express backend, designed to showcase digital art, audio compositions, and experimental media. The application features a cyberpunk aesthetic with dark themes, neon accents, and glitch effects. It's structured as a full-stack application with database integration capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - CSS custom properties for cyberpunk theme variables
  - Component library: shadcn/ui with Radix UI primitives
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Modular component architecture with reusable UI elements

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL support
- **Session Storage**: PostgreSQL-based sessions via connect-pg-simple
- **Build System**: esbuild for server bundling

### Design System
- **Theme**: Cyberpunk aesthetic with black backgrounds (#000) and white text (#fff)
- **Accent Colors**: Dynamic neon colors (default: hsl(180, 100%, 50%))
- **Typography**: Doto font family from Google Fonts
- **Effects**: Glitch animations, particle systems, floating text, custom cursors

## Key Components

### Core Frontend Components
1. **ParticleSystem**: Animated background particles with color-shifting effects
2. **CustomCursor**: Desktop-only custom cursor with crosshair design
3. **FloatingText**: Kinetic text elements that drift across the screen
4. **Navigation**: Fixed navigation with dynamic title cycling
5. **AudioPlayer**: Custom neon-styled audio player with streaming capabilities

### Backend Components
1. **Storage Interface**: Abstracted data layer supporting in-memory and database storage
2. **Route Registration**: Modular API route system
3. **Vite Integration**: Development server integration with HMR support

### UI Library
- Complete shadcn/ui component library
- Custom-styled components for cyberpunk aesthetic
- Accessible design with ARIA labels and keyboard navigation

## Data Flow

### Content Management
- **Portfolio Data**: Centralized configuration in `portfolio_data.js`
- **Dynamic Loading**: Content loaded via React Query for caching and state management
- **Media References**: Placeholder system for easy asset replacement

### Client-Server Communication
- REST API endpoints under `/api` prefix
- Session-based authentication ready for implementation
- PostgreSQL database integration via Drizzle ORM

### Asset Management
- Static assets served from `/assets` directory structure
- Image, audio, and video content with download protection
- Right-click disabled on media elements

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon database driver for PostgreSQL
- **drizzle-orm**: Type-safe SQL ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight routing library

### UI Dependencies
- **@radix-ui/***: Accessible component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant API
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Development server and build tool
- **tsx**: TypeScript execution environment
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Production Build
1. Frontend assets built with Vite to `dist/public`
2. Server code bundled with esbuild to `dist/index.js`
3. Static file serving integrated with Express

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Drizzle migrations managed in `./migrations` directory
- Development/production mode switching via `NODE_ENV`

### Database Management
- Schema definitions in `shared/schema.ts`
- Migration generation via `drizzle-kit push` command
- PostgreSQL dialect with Neon serverless support

The application is designed for easy content management through the centralized data file, with a focus on performance, accessibility, and visual impact. The modular architecture allows for easy extension of features while maintaining the cyberpunk aesthetic throughout the user experience.