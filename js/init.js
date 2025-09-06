/**
 * init.js - Portfolio Initialization Script
 *
 * PURPOSE: Initialize the portfolio with proper media handling and error recovery
 */

;(() => {
  // Enhanced initialization with media preloading
  document.addEventListener("DOMContentLoaded", async () => {
    try {
      console.log("Initializing portfolio application...")

      // Check if required utilities are loaded
      if (!window.MediaUtils || !window.DeviceDetector) {
        throw new Error("Required utilities not loaded")
      }

      // Initialize media utilities
      const mediaUtils = new window.MediaUtils() // Fixed undeclared variable
      const deviceDetector = new window.DeviceDetector() // Fixed undeclared variable

      console.log("Device profile:", deviceDetector.getProfile())
      console.log("Device capabilities:", deviceDetector.getCapabilities())
      console.log("Supported media formats:", mediaUtils.getSupportedFormats())

      // Preload critical media if on desktop
      if (deviceDetector.getProfile() === "desktop" && window.portfolioData) {
        const criticalMedia = []

        // Collect first image from each project for preloading
        Object.values(window.portfolioData.projects).forEach((category) => {
          if (Array.isArray(category)) {
            category.forEach((project) => {
              if (project.images && project.images[0]) {
                criticalMedia.push(project.images[0])
              }
            })
          }
        })

        if (criticalMedia.length > 0) {
          console.log(`Preloading ${criticalMedia.length} critical media files...`)
          mediaUtils.preloadMedia(criticalMedia.slice(0, 5)) // Limit to first 5
        }
      }

      // Initialize main portfolio app
      window.portfolioApp = new window.PortfolioApp() // Fixed undeclared variable

      // Log media statistics
      const mediaStats = mediaUtils.getMediaStats(window.portfolioData)
      console.log("Portfolio media statistics:", mediaStats)

      // Setup performance monitoring
      if (window.PerformanceMonitor) {
        window.performanceMonitor = new window.PerformanceMonitor("Portfolio") // Fixed undeclared variable

        // Log performance stats every 10 seconds in development
        if (mediaUtils.config.isDevelopment) {
          setInterval(() => {
            console.log("Performance stats:", window.performanceMonitor.getStats())
          }, 10000)
        }
      }
    } catch (error) {
      console.error("Failed to initialize portfolio app:", error)
      showFallbackContent(error)
    }
  })

  // Enhanced fallback content with better error reporting
  function showFallbackContent(error) {
    const mainContent = document.getElementById("mainContent")
    const loadingState = document.getElementById("loadingState")

    if (loadingState) {
      loadingState.style.display = "none"
    }

    if (mainContent) {
      mainContent.innerHTML = `
        <div class="glass-panel" style="padding: var(--space-xxl); text-align: center; max-width: 800px; margin: var(--space-xxl) auto;">
          <h1 style="color: var(--color-saffron); margin-bottom: var(--space-lg); font-size: var(--text-4xl);">
            Portfolio Temporarily Unavailable
          </h1>
          <p style="font-size: var(--text-lg); opacity: 0.9; margin-bottom: var(--space-md);">
            Sorry, there was an error loading the portfolio. This might be due to:
          </p>
          <ul style="text-align: left; max-width: 500px; margin: 0 auto var(--space-lg); opacity: 0.8;">
            <li style="margin-bottom: var(--space-xs);">Missing media files or incorrect paths</li>
            <li style="margin-bottom: var(--space-xs);">Network connectivity issues</li>
            <li style="margin-bottom: var(--space-xs);">Browser compatibility problems</li>
            <li style="margin-bottom: var(--space-xs);">JavaScript execution errors</li>
          </ul>
          <p style="font-size: var(--text-base); opacity: 0.7; margin-bottom: var(--space-lg);">
            <strong>Error:</strong> ${error.message}
          </p>
          <button 
            onclick="window.location.reload()" 
            style="
              background: var(--color-saffron); 
              color: var(--color-deep-black); 
              border: none; 
              padding: var(--space-sm) var(--space-lg); 
              border-radius: var(--radius-base); 
              font-family: var(--font-display); 
              font-weight: var(--font-semibold);
              cursor: pointer;
              transition: var(--transition);
            "
            onmouseover="this.style.background='var(--color-cerulean)'"
            onmouseout="this.style.background='var(--color-saffron)'"
          >
            Refresh Page
          </button>
        </div>
      `
    }
  }

  // Handle page unload cleanup
  window.addEventListener("beforeunload", () => {
    if (window.portfolioApp) {
      window.portfolioApp.destroy()
    }
  })

  // Handle visibility changes for performance
  document.addEventListener("visibilitychange", () => {
    if (window.portfolioApp) {
      if (document.hidden) {
        // Pause non-critical animations when page is hidden
        console.log("Page hidden, pausing animations")
      } else {
        // Resume animations when page is visible
        console.log("Page visible, resuming animations")
      }
    }
  })
})()
</merged_code>
