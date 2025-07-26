/* config.js - Centralized Configuration and Design Tokens
 *
 * PURPOSE: Single source of truth for all design tokens, performance settings,
 * and configuration values used across the application
 */

// DESIGN TOKENS - Centralized design system values
const DESIGN_TOKENS = {
  // Color Palette - Indo-Futurist Theme
  colors: {
    // Base colors
    deepBlack: "#0a0a0a",
    offWhite: "#f3f3f3",
    paleGray: "#d9d9d9", // hsl(0, 0%, 85%)

    // Accent colors
    saffron: "#ff954a", // hsl(18, 100%, 62%)
    cerulean: "#0095ff", // hsl(205, 100%, 52%)
    neonMagenta: "#ff4796", // hsl(325, 100%, 59%)
    electricLime: "#adff47", // hsl(83, 100%, 62%)

    // Glass materials (with opacity)
    glass: {
      panel: "rgba(10, 10, 10, 0.85)",
      panelLight: "rgba(10, 10, 10, 0.7)",
      overlay: "rgba(10, 10, 10, 0.9)",
      border: "rgba(243, 243, 243, 0.15)",
      accent: "rgba(243, 243, 243, 0.08)",
    },

    // Shadow colors
    shadows: {
      saffron: "rgba(255, 149, 71, 0.2)",
      cerulean: "rgba(0, 149, 255, 0.2)",
      magenta: "rgba(255, 71, 172, 0.2)",
      lime: "rgba(173, 255, 71, 0.2)",
      neutral: "rgba(0, 0, 0, 0.4)",
    },

    // Galaxy colors
    galaxy: {
      stars: ["#ffffff", "#f0f8ff", "#e6e6fa", "#dda0dd", "#add8e6", "#87ceeb"],
      nebulas: [
        "rgba(138, 43, 226, 0.2)", // Deep purple
        "rgba(72, 61, 139, 0.2)", // Dark slate blue
        "rgba(25, 25, 112, 0.2)", // Midnight blue
        "rgba(75, 0, 130, 0.2)", // Indigo
        "rgba(106, 90, 205, 0.2)", // Slate blue
      ],
      dust: [
        "rgba(255, 255, 255, 0.3)",
        "rgba(173, 216, 230, 0.2)",
        "rgba(221, 160, 221, 0.2)",
        "rgba(230, 230, 250, 0.2)",
      ],
    },
  },

  // Typography Scale
  typography: {
    fontFamilies: {
      display: '"Funnel Display", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"IBM Plex Mono", "SF Mono", Monaco, monospace',
    },

    // Fluid typography scale
    fontSizes: {
      xs: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)", // 12-14px
      sm: "clamp(0.875rem, 0.8rem + 0.375vw, 1rem)", // 14-16px
      base: "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)", // 16-18px
      lg: "clamp(1.125rem, 1rem + 0.625vw, 1.25rem)", // 18-20px
      xl: "clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)", // 20-24px
      "2xl": "clamp(1.5rem, 1.3rem + 1vw, 1.875rem)", // 24-30px
      "3xl": "clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)", // 30-36px
      "4xl": "clamp(2.25rem, 1.9rem + 1.75vw, 3rem)", // 36-48px
      "5xl": "clamp(3rem, 2.5rem + 2.5vw, 4rem)", // 48-64px
    },

    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    lineHeights: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.6,
      relaxed: 1.8,
    },

    letterSpacing: {
      tight: "-0.02em",
      normal: "0",
      wide: "0.05em",
      wider: "0.1em",
    },
  },

  // Spacing Scale (based on 8px grid)
  spacing: {
    xs: "0.5rem", // 8px
    sm: "1rem", // 16px
    md: "1.5rem", // 24px
    lg: "2rem", // 32px
    xl: "3rem", // 48px
    xxl: "4rem", // 64px
    "3xl": "6rem", // 96px
    "4xl": "8rem", // 128px
  },

  // Border Radius Scale
  borderRadius: {
    none: "0",
    sm: "0.25rem", // 4px
    base: "0.5rem", // 8px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    full: "9999px",
  },

  // Shadow Scale
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    base: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
    md: "0 4px 6px rgba(0, 0, 0, 0.07), 0 2px 4px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)",
    glow: {
      saffron: "0 4px 16px rgba(255, 149, 71, 0.3)",
      cerulean: "0 4px 16px rgba(0, 149, 255, 0.3)",
      magenta: "0 4px 16px rgba(255, 71, 172, 0.3)",
      lime: "0 4px 16px rgba(173, 255, 71, 0.3)",
    },
  },

  // Z-Index Scale
  zIndex: {
    galaxy: 0,
    background: 1,
    mandala: 2,
    content: 10,
    navigation: 1000,
    modal: 2000,
    cursor: 9998,
  },

  // Animation Durations
  durations: {
    fast: "150ms",
    base: "300ms",
    slow: "500ms",
    slower: "750ms",
    slowest: "1000ms",
  },

  // Easing Functions
  easings: {
    linear: "linear",
    ease: "ease",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  },

  // Breakpoints
  breakpoints: {
    sm: "375px", // Small mobile
    md: "768px", // Tablet
    lg: "1024px", // Desktop
    xl: "1440px", // Large desktop
  },

  // Touch targets
  touchTarget: "44px",
}

// PERFORMANCE CONFIGURATION
const PERFORMANCE_CONFIG = {
  // Device-specific performance profiles
  profiles: {
    mobile: {
      maxParticles: 50,
      maxStars: 200,
      maxNebulas: 3,
      maxDustParticles: 50,
      mandalaLayers: 2,
      updateFrequency: 30,
      renderQuality: "low",
      enableBloom: false,
      enableParallax: false,
      enableConnections: false,
      useWebGL: false,
    },
    tablet: {
      maxParticles: 100,
      maxStars: 400,
      maxNebulas: 5,
      maxDustParticles: 100,
      mandalaLayers: 3,
      updateFrequency: 45,
      renderQuality: "medium",
      enableBloom: true,
      enableParallax: true,
      enableConnections: true,
      useWebGL: true,
    },
    desktop: {
      maxParticles: 150,
      maxStars: 800,
      maxNebulas: 8,
      maxDustParticles: 200,
      mandalaLayers: 4,
      updateFrequency: 60,
      renderQuality: "high",
      enableBloom: true,
      enableParallax: true,
      enableConnections: true,
      useWebGL: true,
    },
  },

  // Animation thresholds
  thresholds: {
    lowFPS: 30,
    targetFPS: 60,
    maxFrameTime: 33, // 33ms = 30fps
    adaptiveQualityEnabled: true,
  },

  // Memory limits
  memory: {
    maxVertexBufferSize: 1024 * 1024, // 1MB
    maxTextureSize: 2048,
    particlePoolSize: 1000,
  },
}

// ANIMATION CONFIGURATION
const ANIMATION_CONFIG = {
  // Global animation settings
  global: {
    masterSpeed: 1.0, // Global speed multiplier
    pauseOnHidden: true,
    respectReducedMotion: true,
  },

  // Particle system settings
  particles: {
    sizeRange: { min: 0.5, max: 2.5 },
    speedRange: { min: 0.2, max: 0.8 },
    lifeRange: { min: 800, max: 1200 },
    connectionDistance: 200,
    mouseInfluence: 100,
    velocityDamping: 0.99,
    mouseForceStrength: 0.01,
  },

  // Galaxy settings
  galaxy: {
    starSizeRange: { min: 0.5, max: 3.0 },
    starOpacityRange: { min: 0.3, max: 1.0 },
    starTwinkleSpeed: 0.02,
    starDriftSpeed: { min: 0.1, max: 0.5 },
    nebulaSize: { min: 80, max: 200 },
    nebulaOpacity: { min: 0.1, max: 0.3 },
    nebulaPulseSpeed: 0.005,
    dustSize: { min: 0.2, max: 1.0 },
    dustOpacity: { min: 0.1, max: 0.4 },
    dustDriftSpeed: { min: 0.05, max: 0.2 },
    globalRotationSpeed: 0.0001,
    orbitVariation: 0.3,
    pulsationIntensity: 0.2,
    driftRandomness: 0.1,
  },

  // Mandala settings
  mandala: {
    morphCycleMinutes: 30,
    smoothTransitions: true,
    transitionOverlap: 0.1,
    baseSegments: { mobile: 8, tablet: 12, desktop: 16 },
    maxLayers: { mobile: 2, tablet: 3, desktop: 4 },
    radiusScale: 0.35,
    layerSpacing: 0.25,
    centerSize: 6,
    rotationSpeed: 0.0005,
    pulseSpeed: 0.001,
    breathingIntensity: 0.03,
    bloomIntensity: 15,
    bloomOpacity: 0.6,
  },

  // Cursor effects
  cursor: {
    crosshairSize: 20,
    trailSize: 40,
    trailDelay: 50,
    interactiveScaling: 1.2,
    fadeSpeed: 0.3,
  },
}

// UI COMPONENT CONFIGURATION
const UI_CONFIG = {
  // Navigation
  navigation: {
    height: "44px",
    mobileBreakpoint: "768px",
    animationDuration: "300ms",
    backdropBlur: "12px",
  },

  // Modal
  modal: {
    maxWidth: { mobile: "90vw", desktop: "800px" },
    maxHeight: "90vh",
    backdropBlur: "8px",
    animationDuration: "300ms",
    padding: { mobile: "1.5rem", desktop: "3rem" },
  },

  // Cards
  cards: {
    borderRadius: "1rem",
    padding: { mobile: "1.5rem", desktop: "2rem" },
    hoverTransform: "translateY(-4px)",
    animationDuration: "300ms",
  },

  // Glass effects
  glass: {
    backdropBlur: { low: "6px", medium: "8px", high: "12px" },
    borderOpacity: 0.15,
    backgroundOpacity: { light: 0.7, medium: 0.85, heavy: 0.9 },
  },
}

// PAGE-SPECIFIC CONFIGURATION
const PAGE_CONFIG = {
  // Mandala segments per page
  mandalaSegments: {
    home: 8,
    "sound-installations": 6,
    installations: 10,
    interactive: 8,
    drawings: 12,
    writing: 9,
    contact: 16,
  },

  // Page-specific colors
  pageColors: {
    home: "saffron",
    "sound-installations": "saffron",
    performance: "cerulean",
    installations: "neonMagenta",
    drawings: "saffron",
    writing: "cerulean",
    contact: "electricLime",
  },

  // Transition settings
  transitions: {
    duration: "500ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    stagger: "100ms",
  },
}

// Export configuration objects
if (typeof window !== "undefined") {
  window.DESIGN_TOKENS = DESIGN_TOKENS
  window.PERFORMANCE_CONFIG = PERFORMANCE_CONFIG
  window.ANIMATION_CONFIG = ANIMATION_CONFIG
  window.UI_CONFIG = UI_CONFIG
  window.PAGE_CONFIG = PAGE_CONFIG
}
