/* main.js - Core Portfolio Application Logic (FIXED)
 *
 * PURPOSE: Parses portfolioData.js and dynamically renders all page content
 * FIXES: Added support for images, videos, audio files, and better media handling
 */

// FIXED: Wrapped entire application in error handling
;(() => {
  // FIXED: Performance settings with better device detection
  const APP_CONFIG = {
    mobile: {
      particleCount: 30,
      mandalaLayers: 2,
      galaxyEnabled: false,
      animationQuality: "low",
      enableBloom: false,
      enableCursor: false,
      debounceDelay: 300,
      lazyLoadThreshold: 100,
    },
    tablet: {
      particleCount: 80,
      mandalaLayers: 3,
      galaxyEnabled: false,
      animationQuality: "medium",
      enableBloom: true,
      enableCursor: true,
      debounceDelay: 200,
      lazyLoadThreshold: 200,
    },
    desktop: {
      particleCount: 120,
      mandalaLayers: 4,
      galaxyEnabled: false,
      animationQuality: "high",
      enableBloom: true,
      enableCursor: true,
      debounceDelay: 100,
      lazyLoadThreshold: 300,
    },
  }

  // FIXED: Page segments mapping
  const PAGE_SEGMENTS = {
    home: 8,
    "sound-installations": 6,
    performance: 10,
    "generative-av": 12,
    interactive: 8,
    drawings: 7,
    writing: 9,
    "about-contact": 16,
  }

  class PortfolioApp {
    constructor() {
      try {
        // FIXED: Better device detection
        this.deviceProfile = this.detectDeviceProfile()
        this.config = APP_CONFIG[this.deviceProfile]

        // Application state
        this.currentPage = "home"
        this.scrollProgress = 0
        this.isInitialized = false
        this.isDestroyed = false

        // System components
        this.mandalaGenerator = null
        this.particleSystem = null
        this.cursorTrail = null
        this.galaxyBackground = null

        // FIXED: Data validation
        this.data = this.validatePortfolioData()
        this.elements = {}
        this.eventListeners = []

        // Performance monitoring
        this.performanceStats = {
          initTime: Date.now(),
          renderCount: 0,
          lastRenderTime: 0,
        }

        console.log(`PortfolioApp initializing with ${this.deviceProfile} profile:`, this.config)

        this.init()
      } catch (error) {
        console.error("PortfolioApp constructor error:", error)
        this.showErrorFallback()
      }
    }

    // FIXED: Improved device detection
    detectDeviceProfile() {
      try {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReducedMotion) {
          return "mobile"
        }

        // Check device capabilities
        const deviceMemory = navigator.deviceMemory || 4
        const hardwareConcurrency = navigator.hardwareConcurrency || 4
        const connectionSpeed = navigator.connection?.effectiveType || "4g"

        if (
          isMobile ||
          deviceMemory < 4 ||
          hardwareConcurrency < 4 ||
          connectionSpeed === "slow-2g" ||
          connectionSpeed === "2g"
        ) {
          return "mobile"
        } else if (isTablet || deviceMemory < 8 || connectionSpeed === "3g") {
          return "tablet"
        } else {
          return "desktop"
        }
      } catch (error) {
        console.warn("Device detection error, defaulting to mobile:", error)
        return "mobile"
      }
    }

    // FIXED: Data validation with fallbacks
    validatePortfolioData() {
      try {
        const data = window.portfolioData
        if (!data || typeof data !== "object") {
          throw new Error("Portfolio data not found or invalid")
        }

        // Validate required structure
        if (!data.projects || typeof data.projects !== "object") {
          throw new Error("Projects data missing or invalid")
        }

        if (!data.contact || typeof data.contact !== "object") {
          throw new Error("Contact data missing or invalid")
        }

        return data
      } catch (error) {
        console.error("Portfolio data validation failed:", error)
        return this.getDefaultData()
      }
    }

    // FIXED: Comprehensive fallback data
    getDefaultData() {
      return {
        projects: {
          soundInstallations: [],
          performance: [],
          generativeAV: [],
          interactive: [],
          drawings: [],
          writing: [],
        },
        pageContent: {
          home: {
            title: "Experimental Systems",
            subtitle: "Portfolio temporarily unavailable. Please refresh the page.",
            description: "Loading content...",
          },
        },
        contact: {
          social: [],
          description: "Contact information loading...",
        },
      }
    }

    async init() {
      try {
        // Cache DOM elements first
        this.cacheElements()

        // Hide loading state
        this.hideLoadingState()

        // Setup systems in order of importance
        await this.setupBackgroundSystems()
        this.setupNavigation()
        this.setupScrollTracking()
        this.setupModal()

        // Render initial page
        this.renderCurrentPage()

        // Mark as initialized
        this.isInitialized = true

        // Log performance stats
        const initTime = Date.now() - this.performanceStats.initTime
        console.log(`PortfolioApp initialized in ${initTime}ms`)
      } catch (error) {
        console.error("Failed to initialize PortfolioApp:", error)
        this.showErrorFallback()
      }
    }

    // FIXED: Better element caching with validation
    cacheElements() {
      const elementIds = [
        "mainContent",
        "mandalaCanvas",
        "particleCanvas",
        "galaxyCanvas",
        "projectModal",
        "modalBody",
        "modalClose",
        "navLinks",
        "mobileMenuToggle",
        "cursorCrosshair",
        "cursorTrail",
        "loadingState",
      ]

      this.elements = {}

      elementIds.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          this.elements[id] = element
        } else {
          console.warn(`Element not found: ${id}`)
        }
      })

      // Validate critical elements exist
      const criticalElements = ["mainContent", "mandalaCanvas", "particleCanvas", "galaxyCanvas"]
      for (const elementKey of criticalElements) {
        if (!this.elements[elementKey]) {
          throw new Error(`Required DOM element #${elementKey} not found`)
        }
      }
    }

    // FIXED: Hide loading state
    hideLoadingState() {
      if (this.elements.loadingState) {
        this.elements.loadingState.style.display = "none"
      }
    }

    // FIXED: Improved background systems setup with error handling
    async setupBackgroundSystems() {
      const setupPromises = []

      try {
        // Initialize galaxy background (first, as deepest layer)
        if (this.config.galaxyEnabled && this.elements.galaxyCanvas && window.GalaxyBackground) {
          setupPromises.push(
            new Promise((resolve) => {
              try {
                this.galaxyBackground = new window.GalaxyBackground(this.elements.galaxyCanvas)
                this.galaxyBackground.start()
                console.log("Galaxy background initialized")
                resolve()
              } catch (error) {
                console.warn("Galaxy background failed to initialize:", error)
                resolve()
              }
            }),
          )
        }

        // Initialize particle system
        if (this.elements.particleCanvas && window.ParticleSystem) {
          setupPromises.push(
            new Promise((resolve) => {
              try {
                this.particleSystem = new window.ParticleSystem(this.elements.particleCanvas, {
                  maxParticles: this.config.particleCount,
                  enableConnections: this.deviceProfile !== "mobile",
                  animationQuality: this.config.animationQuality,
                })
                this.particleSystem.start()
                console.log("Particle system initialized")
                resolve()
              } catch (error) {
                console.warn("Particle system failed to initialize:", error)
                resolve()
              }
            }),
          )
        }

        // Initialize mandala generator
        if (this.elements.mandalaCanvas && window.MandalaGenerator) {
          setupPromises.push(
            new Promise((resolve) => {
              try {
                this.mandalaGenerator = new window.MandalaGenerator(this.elements.mandalaCanvas)
                this.mandalaGenerator.startAnimation()
                console.log("Mandala generator initialized")
                resolve()
              } catch (error) {
                console.warn("Mandala generator failed to initialize:", error)
                resolve()
              }
            }),
          )
        }

        // Initialize cursor trail (desktop only)
        if (
          this.config.enableCursor &&
          this.elements.cursorCrosshair &&
          this.elements.cursorTrail &&
          window.CursorTrail
        ) {
          setupPromises.push(
            new Promise((resolve) => {
              try {
                this.cursorTrail = new window.CursorTrail()
                console.log("Cursor trail initialized")
                resolve()
              } catch (error) {
                console.warn("Cursor trail failed to initialize:", error)
                resolve()
              }
            }),
          )
        }

        // Wait for all systems to initialize
        await Promise.all(setupPromises)

        // Setup resize handler with debouncing
        this.setupResizeHandler()

        // Setup visibility change handler for performance
        this.setupVisibilityHandler()
      } catch (error) {
        console.error("Error initializing background systems:", error)
        // Continue without background effects if they fail
      }
    }

    // FIXED: Improved resize handler
    setupResizeHandler() {
      let resizeTimeout
      const resizeHandler = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          if (this.isInitialized && !this.isDestroyed) {
            try {
              this.galaxyBackground?.updateSize()
              this.mandalaGenerator?.updateSize()
              this.particleSystem?.updateSize()
              this.renderCurrentPage()
            } catch (error) {
              console.warn("Resize handler error:", error)
            }
          }
        }, this.config.debounceDelay)
      }

      window.addEventListener("resize", resizeHandler, { passive: true })
      this.eventListeners.push({ element: window, event: "resize", handler: resizeHandler })
    }

    // FIXED: Improved visibility handler
    setupVisibilityHandler() {
      const visibilityHandler = () => {
        try {
          if (document.hidden) {
            // Pause animations when page is hidden
            this.galaxyBackground?.stop()
            this.mandalaGenerator?.stopAnimation()
            this.particleSystem?.stop()
          } else {
            // Resume animations when page is visible
            if (this.isInitialized && !this.isDestroyed) {
              this.galaxyBackground?.start()
              this.mandalaGenerator?.startAnimation()
              this.particleSystem?.start()
            }
          }
        } catch (error) {
          console.warn("Visibility handler error:", error)
        }
      }

      document.addEventListener("visibilitychange", visibilityHandler)
      this.eventListeners.push({ element: document, event: "visibilitychange", handler: visibilityHandler })
    }

    // FIXED: Improved navigation setup
    setupNavigation() {
      try {
        const navLinks = document.querySelectorAll(".nav-link")

        navLinks.forEach((link) => {
          const clickHandler = (e) => {
            e.preventDefault()
            const page = link.dataset.page

            if (page && page !== this.currentPage) {
              this.navigateToPage(page)
            }

            // Close mobile menu if open
            this.elements.navLinks?.classList.remove("active")

            // Update mobile toggle state
            if (this.elements.mobileToggle) {
              this.elements.mobileToggle.classList.remove("active")
              this.elements.mobileToggle.setAttribute("aria-expanded", "false")
            }
          }

          const keydownHandler = (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              clickHandler(e)
            }
          }

          link.addEventListener("click", clickHandler)
          link.addEventListener("keydown", keydownHandler)

          this.eventListeners.push({ element: link, event: "click", handler: clickHandler })
          this.eventListeners.push({ element: link, event: "keydown", handler: keydownHandler })
        })

        // Mobile menu toggle
        if (this.elements.mobileToggle) {
          const toggleHandler = () => {
            const isActive = this.elements.navLinks.classList.contains("active")

            this.elements.navLinks.classList.toggle("active")
            this.elements.mobileToggle.classList.toggle("active")
            this.elements.mobileToggle.setAttribute("aria-expanded", !isActive)
          }

          this.elements.mobileToggle.addEventListener("click", toggleHandler)
          this.eventListeners.push({ element: this.elements.mobileToggle, event: "click", handler: toggleHandler })
        }

        // Handle browser back/forward
        const popstateHandler = (e) => {
          const page = e.state?.page || "home"
          this.navigateToPage(page, false)
        }

        window.addEventListener("popstate", popstateHandler)
        this.eventListeners.push({ element: window, event: "popstate", handler: popstateHandler })
      } catch (error) {
        console.error("Navigation setup error:", error)
      }
    }

    // FIXED: Improved scroll tracking
    setupScrollTracking() {
      let scrollTimeout
      let isScrolling = false

      const scrollHandler = () => {
        if (!isScrolling) {
          requestAnimationFrame(() => {
            this.updateScrollProgress()
            isScrolling = false
          })
          isScrolling = true
        }

        clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
          // Scroll ended
        }, 150)
      }

      window.addEventListener("scroll", scrollHandler, { passive: true })
      this.eventListeners.push({ element: window, event: "scroll", handler: scrollHandler })
    }

    updateScrollProgress() {
      try {
        const scrollTop = window.pageYOffset
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        this.scrollProgress = Math.min(scrollTop / Math.max(docHeight, 1), 1)

        // Update mandala based on scroll
        if (this.mandalaGenerator) {
          this.mandalaGenerator.setScrollProgress(this.scrollProgress)
        }
      } catch (error) {
        console.warn("Scroll progress update error:", error)
      }
    }

    // FIXED: Improved navigation
    navigateToPage(page, updateHistory = true) {
      if (page === this.currentPage || !this.isInitialized || this.isDestroyed) return

      try {
        const startTime = Date.now()

        // Update navigation state
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.toggle("active", link.dataset.page === page)
        })

        // Update page
        this.currentPage = page
        this.renderCurrentPage()

        // Update mandala canvas class for page-specific styling
        if (this.elements.mandalaCanvas) {
          this.elements.mandalaCanvas.className = `mandala-canvas ${page}`
        }

        // Update mandala segments based on page
        if (this.mandalaGenerator) {
          const pageSegments = PAGE_SEGMENTS[page] || 8
          this.mandalaGenerator.setSegments(pageSegments)
        }

        // Update browser history
        if (updateHistory) {
          history.pushState({ page }, "", `#${page}`)
        }

        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" })

        // Log performance
        const renderTime = Date.now() - startTime
        this.performanceStats.renderCount++
        this.performanceStats.lastRenderTime = renderTime

        if (renderTime > 100) {
          console.warn(`Slow page render: ${page} took ${renderTime}ms`)
        }
      } catch (error) {
        console.error("Navigation error:", error)
      }
    }

    // FIXED: Improved page rendering
    renderCurrentPage() {
      if (!this.elements.mainContent || this.isDestroyed) return

      const mainContent = this.elements.mainContent

      try {
        let html = ""

        switch (this.currentPage) {
          case "home":
            html = this.renderHomePage()
            break
          case "sound-installations":
            html = this.renderSoundInstallationsPage()
            break
          case "performance":
            html = this.renderPerformancePage()
            break
          case "generative-av":
            html = this.renderGenerativeAVPage()
            break
          case "interactive":
            html = this.renderInteractivePage()
            break
          case "drawings":
            html = this.renderDrawingsPage()
            break
          case "writing":
            html = this.renderWritingPage()
            break
          case "about-contact":
            html = this.renderContactPage()
            break
          default:
            html = this.renderHomePage()
        }

        mainContent.innerHTML = html

        // Bind project card events after rendering
        this.bindProjectCardEvents()
      } catch (error) {
        console.error("Error rendering page:", error)
        mainContent.innerHTML = this.renderErrorPage()
      }
    }

    renderHomePage() {
      return `
        <section class="page-section active">
          <div class="home-container">
            <h1 class="tri-phase-title">
              <span class="title-line">EXPERIMENTAL</span>
              <span class="title-line">SYSTEMS</span>
              <span class="title-line">BY</span>
              <span class="title-line">ATHARVA GUPTA</span>
            </h1>
          </div>
        </section>
      `
    }

    renderSoundInstallationsPage() {
      const projects = this.data.projects.soundInstallations || []

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--saffron);">SOUND INSTALLATIONS</h2>
            </div>
            
            <div class="project-grid">
              ${projects.map((project) => this.renderProjectCard(project)).join("")}
            </div>
          </div>
        </section>
      `
    }

    renderPerformancePage() {
      const projects = this.data.projects.performance || []

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--cerulean);">PERFORMANCE</h2>
            </div>
            
            <div class="project-grid">
              ${projects.map((project) => this.renderProjectCard(project)).join("")}
            </div>
          </div>
        </section>
      `
    }

    renderGenerativeAVPage() {
      const projects = this.data.projects.generativeAV || []

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--neon-magenta);">GENERATIVE AUDIOVISUAL</h2>
            </div>
            
            <div class="project-grid">
              ${projects.map((project) => this.renderProjectCard(project)).join("")}
            </div>
          </div>
        </section>
      `
    }

    renderInteractivePage() {
      const projects = this.data.projects.interactive || []

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--electric-lime);">INTERACTIVE INSTALLATIONS</h2>
            </div>
            
            <div class="project-grid">
              ${projects.map((project) => this.renderProjectCard(project)).join("")}
            </div>
          </div>
        </section>
      `
    }

    renderDrawingsPage() {
      const projects = this.data.projects.drawings || []
      const project = projects[0]

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--saffron);">DRAWINGS / SKETCH</h2>
            </div>
            
            <div class="project-grid">
              ${project ? this.renderProjectCard(project) : "<p>No drawings available.</p>"}
            </div>
          </div>
        </section>
      `
    }

    renderWritingPage() {
      const projects = this.data.projects.writing || []

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--cerulean);">WRITING / THEORY</h2>
            </div>
            
            <div class="project-grid">
              ${projects.map((project) => this.renderProjectCard(project)).join("")}
            </div>
          </div>
        </section>
      `
    }

    // REPLACE the renderContactPage() function in js/main.js with this:
renderContactPage() {
  const contact = this.data.contact || { 
    about: { 
      title: "About", 
      description: "Loading...", 
      image: null,
      credentials: []
    }, 
    social: [], 
    description: "Contact information loading..." 
  }

  return `
    <section class="page-section active">
      <div class="page-content">
        <div class="page-header">
          <h2 class="page-title" style="color: var(--electric-lime);">ABOUT & CONTACT</h2>
        </div>
        
        <!-- About Section -->
        <div class="about-section" style="margin-bottom: var(--spacing-xxl);">
          <div class="about-content" style="display: grid; gap: var(--spacing-xl); grid-template-columns: 1fr; align-items: start;">
            
            <!-- About Text -->
            <div class="about-text glass-panel" style="padding: var(--spacing-xl);">
              <h3 style="color: var(--saffron); font-size: var(--text-2xl); margin-bottom: var(--spacing-lg); font-weight: 600;">
                ${contact.about?.title || "About"}
              </h3>
              
              <div style="font-size: var(--text-lg); line-height: 1.8; opacity: 0.9; margin-bottom: var(--spacing-lg);">
                ${contact.about?.description?.split('\n\n').map(paragraph => 
                  `<p style="margin-bottom: var(--spacing-md);">${paragraph}</p>`
                ).join('') || "Loading about content..."}
              </div>
              
              ${contact.about?.credentials && contact.about.credentials.length > 0 ? `
                <div class="credentials" style="margin-top: var(--spacing-lg);">
                  <h4 style="color: var(--cerulean); font-size: var(--text-lg); margin-bottom: var(--spacing-md); font-family: var(--font-mono); letter-spacing: 0.05em;">
                    PRACTICE AREAS
                  </h4>
                  <div style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                    ${contact.about.credentials.map(credential => `
                      <span style="
                        background: var(--glass-accent); 
                        border: 1px solid var(--glass-border); 
                        padding: var(--spacing-xs) var(--spacing-sm); 
                        border-radius: var(--spacing-lg); 
                        font-family: var(--font-mono); 
                        font-size: var(--text-sm); 
                        color: var(--off-white);
                        opacity: 0.9;
                      ">
                        ${credential}
                      </span>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
            </div>
            
            <!-- Portrait Image -->
            ${contact.about?.image ? `
              <div class="about-image glass-panel-light" style="padding: var(--spacing-md); text-align: center;">
                <div class="portrait-container" style="
                  position: relative; 
                  max-width: 400px; 
                  margin: 0 auto;
                  aspect-ratio: 4/5;
                  overflow: hidden;
                  border-radius: var(--spacing-lg);
                  background: var(--glass-panel-light);
                ">
                  <img 
                    src="${contact.about.image}" 
                    alt="Atharva Gupta"
                    style="
                      width: 100%; 
                      height: 100%; 
                      object-fit: cover; 
                      transition: transform 0.3s ease;
                      filter: grayscale(20%) contrast(1.1);
                    "
                    loading="lazy"
                    onerror="this.parentElement.innerHTML='<div class=\\'media-error\\'>Portrait image not available<br><small>${contact.about.image}</small></div>'"
                    onmouseover="this.style.transform = 'scale(1.02)'"
                    onmouseout="this.style.transform = 'scale(1)'"
                  />
                </div>
              </div>
            ` : `
              <div class="about-image-placeholder glass-panel-light" style="
                padding: var(--spacing-xl); 
                text-align: center;
                aspect-ratio: 4/5;
                display: flex;
                align-items: center;
                justify-content: center;
                max-width: 400px;
                margin: 0 auto;
                border-radius: var(--spacing-lg);
                border: 2px dashed var(--glass-border);
              ">
                <div style="color: var(--pale-gray); font-family: var(--font-mono); font-size: var(--text-sm);">
                  📷<br>Portrait Image<br>Coming Soon
                </div>
              </div>
            `}
          </div>
        </div>
        
        <!-- Contact Section -->
        <div class="contact-section">
          <h3 style="color: var(--cerulean); font-size: var(--text-2xl); margin-bottom: var(--spacing-xl); text-align: center; font-weight: 600;">
            CONNECT & COLLABORATE
          </h3>
          
          <div class="social-grid">
            ${contact.social.map((platform) => this.renderSocialLink(platform)).join("")}
          </div>
          
          <div class="glass-panel" style="margin-top: var(--spacing-xl); padding: var(--spacing-xl); text-align: center; max-width: 600px; margin-left: auto; margin-right: auto;">
            <p style="font-size: var(--text-lg); line-height: 1.8; opacity: 0.9;">
              ${contact.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  `
}

    renderErrorPage() {
      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--saffron);">ERROR</h2>
            </div>
            
            <div class="glass-panel" style="padding: 3rem; text-align: center; max-width: 600px; margin: 0 auto;">
              <p style="font-size: 1.1rem; line-height: 1.8; opacity: 0.9;">
                Sorry, there was an error loading this page. Please try refreshing the browser.
              </p>
            </div>
          </div>
        </section>
      `
    }

    // FIXED: Enhanced project card rendering with full media support
    renderProjectCard(project) {
      if (!project) return ""

      const hasBandcampTracks =
        project.bandcampTracks && Array.isArray(project.bandcampTracks) && project.bandcampTracks.length > 0

      const hasImages = project.images && Array.isArray(project.images) && project.images.length > 0
      const hasVideos = project.videos && Array.isArray(project.videos) && project.videos.length > 0
      const hasAudioFile = project.audioFile && typeof project.audioFile === "string"

      return `
        <div class="project-card ${project.color || "saffron"}" 
             data-project-id="${project.id || ""}"
             role="button"
             tabindex="0"
             aria-label="View details for ${project.title || "Untitled Project"}">
          <h3 class="project-title">${project.title || "Untitled Project"}</h3>
          <div class="project-category mono" style="color: var(--${project.color || "saffron"});">
            ${project.category || "Uncategorized"}
          </div>
          <p class="project-description">${project.description || "No description available."}</p>
          ${project.medium ? `<div class="mono" style="font-size: 0.8rem; opacity: 0.7; margin-top: 1rem;">${project.medium}</div>` : ""}
          
          ${hasImages ? this.renderProjectImages(project.images, true) : ""}
          ${hasVideos ? this.renderProjectVideos(project.videos, true) : ""}
          ${hasAudioFile ? this.renderProjectAudio(project.audioFile, project.title) : ""}
          
          ${
            hasBandcampTracks
              ? `
            <div class="bandcamp-embeds" style="margin-top: var(--spacing-lg);">
              <h4 style="color: var(--off-white); font-size: var(--text-sm); margin-bottom: var(--spacing-md); font-family: var(--font-mono); letter-spacing: var(--tracking-wide);">AUDIO TRACKS</h4>
              <div class="bandcamp-tracks">
                ${project.bandcampTracks
                  .slice(0, 3)
                  .map(
                    (track) => `
                  <div class="bandcamp-track" style="margin-bottom: var(--spacing-sm);">
                    <iframe 
                      style="border: 0; width: 100%; height: 42px; border-radius: var(--radius-base); overflow: hidden;" 
                      src="https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=small/bgcol=333333/linkcol=ffffff/transparent=true/" 
                      seamless
                      loading="lazy"
                      title="Play ${track.title} by asymmetrica">
                      <a href="${track.url}" target="_blank" rel="noopener noreferrer">${track.title} by asymmetrica</a>
                    </iframe>
                  </div>
                `,
                  )
                  .join("")}
                ${
                  project.bandcampTracks.length > 3
                    ? `
                  <div style="text-align: center; margin-top: var(--spacing-sm);">
                    <span style="font-size: var(--text-xs); opacity: 0.7; font-family: var(--font-mono);">
                      +${project.bandcampTracks.length - 3} more tracks in details
                    </span>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          `
              : ""
          }
        </div>
      `
    }

    // FIXED: New method to render project images
    renderProjectImages(images, isPreview = false) {
      if (!images || !Array.isArray(images) || images.length === 0) return ""

      const imagesToShow = isPreview ? images.slice(0, 2) : images

      return `
        <div class="project-media-section" style="margin-top: var(--spacing-lg);">
          <h4 style="color: var(--off-white); font-size: var(--text-sm); margin-bottom: var(--spacing-md); font-family: var(--font-mono); letter-spacing: var(--tracking-wide);">
            ${isPreview ? "PREVIEW IMAGES" : "IMAGES"}
          </h4>
          <div class="project-images" style="display: grid; gap: var(--spacing-sm); grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
            ${imagesToShow
              .map(
                (imagePath, index) => `
              <div class="project-image-container" style="position: relative; overflow: hidden; border-radius: 1rem; aspect-ratio: 4/3; background: var(--glass-panel-light);">
                <img 
                  src="${imagePath}" 
                  alt="Project image ${index + 1}"
                  style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease;"
                  loading="lazy"
                  onerror="this.parentElement.innerHTML='<div style=\\'display: flex; align-items: center; justify-content: center; height: 100%; color: var(--pale-gray); font-family: var(--font-mono); font-size: var(--text-xs);\\'>Image not found</div>'"
                  onmouseover="this.style.transform = 'scale(1.05)'"
                  onmouseout="this.style.transform = 'scale(1)'"
                />
              </div>
            `,
              )
              .join("")}
          </div>
          ${
            isPreview && images.length > 2
              ? `
            <div style="text-align: center; margin-top: var(--spacing-sm);">
              <span style="font-size: var(--text-xs); opacity: 0.7; font-family: var(--font-mono);">
                +${images.length - 2} more images in details
              </span>
            </div>
          `
              : ""
          }
        </div>
      `
    }

    // FIXED: New method to render project videos
    renderProjectVideos(videos, isPreview = false) {
      if (!videos || !Array.isArray(videos) || videos.length === 0) return ""

      const videosToShow = isPreview ? videos.slice(0, 1) : videos

      return `
        <div class="project-media-section" style="margin-top: var(--spacing-lg);">
          <h4 style="color: var(--off-white); font-size: var(--text-sm); margin-bottom: var(--spacing-md); font-family: var(--font-mono); letter-spacing: var(--tracking-wide);">
            ${isPreview ? "PREVIEW VIDEO" : "VIDEOS"}
          </h4>
          <div class="project-videos" style="display: grid; gap: var(--spacing-sm);">
            ${videosToShow
              .map(
                (videoPath, index) => `
              <div class="project-video-container" style="position: relative; overflow: hidden; border-radius: 1rem; background: var(--glass-panel-light);">
                <video 
                  controls 
                  preload="metadata"
                  style="width: 100%; height: auto; border-radius: 1rem;"
                  poster="${videoPath.replace(/\.[^/.]+$/, "")}_poster.jpg"
                >
                  <source src="${videoPath}" type="video/mp4">
                  <p style="padding: var(--spacing-md); color: var(--pale-gray); font-family: var(--font-mono); font-size: var(--text-sm);">
                    Your browser doesn't support video playback. 
                    <a href="${videoPath}" target="_blank" style="color: var(--saffron);">Download video</a>
                  </p>
                </video>
              </div>
            `,
              )
              .join("")}
          </div>
          ${
            isPreview && videos.length > 1
              ? `
            <div style="text-align: center; margin-top: var(--spacing-sm);">
              <span style="font-size: var(--text-xs); opacity: 0.7; font-family: var(--font-mono);">
                +${videos.length - 1} more videos in details
              </span>
            </div>
          `
              : ""
          }
        </div>
      `
    }

    // FIXED: New method to render project audio
    renderProjectAudio(audioFile, title = "Audio") {
      if (!audioFile || typeof audioFile !== "string") return ""

      return `
        <div class="project-media-section" style="margin-top: var(--spacing-lg);">
          <h4 style="color: var(--off-white); font-size: var(--text-sm); margin-bottom: var(--spacing-md); font-family: var(--font-mono); letter-spacing: var(--tracking-wide);">
            AUDIO
          </h4>
          <div class="project-audio" style="background: var(--glass-panel-light); border-radius: 1rem; padding: var(--spacing-md);">
            <audio 
              controls 
              preload="metadata"
              style="width: 100%; height: 40px;"
            >
              <source src="${audioFile}" type="audio/mpeg">
              <source src="${audioFile}" type="audio/wav">
              <source src="${audioFile}" type="audio/ogg">
              <p style="color: var(--pale-gray); font-family: var(--font-mono); font-size: var(--text-sm);">
                Your browser doesn't support audio playback. 
                <a href="${audioFile}" target="_blank" style="color: var(--saffron);">Download audio</a>
              </p>
            </audio>
          </div>
        </div>
      `
    }

    // FIXED: Improved social link rendering
    renderSocialLink(platform) {
      if (!platform) return ""

      return `
        <a href="${platform.url || "#"}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="social-link"
           aria-label="Visit ${platform.name || "Social Platform"}">
          <div class="social-icon" style="color: var(--${platform.color || "cerulean"});">
            ${this.getSocialIcon(platform.icon)}
          </div>
          <div class="social-name">${(platform.name || "SOCIAL").toUpperCase()}</div>
        </a>
      `
    }

    // FIXED: Complete social icon set
    getSocialIcon(type) {
      const icons = {
        youtube:
          '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>',
        instagram:
          '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.029 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.073-1.689-.073-4.948 0-3.204.013-3.668.072-4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
        bandcamp:
          '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M0 12.36l5.14-8.72h13.72L24 12.36l-5.14 8.72H5.14L0 12.36z"/></svg>',
        patreon:
          '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M0 .48v23.04h4.22V.48zm15.385 0c-4.764 0-8.641 3.88-8.641 8.65 0 4.755 3.877 8.623 8.641 8.623 4.75 0 8.615-3.868 8.615-8.623C24 4.36 20.136.48 15.385.48z"/></svg>',
        linkedin:
          '<svg fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
      }
      return (
        icons[type] ||
        '<div style="width: 100%; height: 100%; background: currentColor; border-radius: 4px;" aria-hidden="true"></div>'
      )
    }

    // FIXED: Improved event binding
    bindProjectCardEvents() {
      try {
        const projectCards = document.querySelectorAll(".project-card")

        projectCards.forEach((card) => {
          const clickHandler = (e) => {
            // Don't trigger modal if clicking on media elements
            if (
              e.target.tagName === "IFRAME" ||
              e.target.tagName === "VIDEO" ||
              e.target.tagName === "AUDIO" ||
              e.target.tagName === "IMG" ||
              e.target.closest("iframe") ||
              e.target.closest("video") ||
              e.target.closest("audio") ||
              e.target.closest("img")
            ) {
              return
            }

            const projectId = card.dataset.projectId
            if (projectId) {
              this.openProjectModal(projectId)
            }
          }

          const keydownHandler = (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              clickHandler(e)
            }
          }

          card.addEventListener("click", clickHandler)
          card.addEventListener("keydown", keydownHandler)

          this.eventListeners.push({ element: card, event: "click", handler: clickHandler })
          this.eventListeners.push({ element: card, event: "keydown", handler: keydownHandler })
        })
      } catch (error) {
        console.error("Error binding project card events:", error)
      }
    }

    // FIXED: Improved modal functionality
    openProjectModal(projectId) {
      if (!projectId || !this.elements.projectModal || !this.elements.modalBody) return

      try {
        // Find project data
        let project = null
        for (const category of Object.values(this.data.projects)) {
          if (Array.isArray(category)) {
            project = category.find((p) => p.id === projectId)
            if (project) break
          }
        }

        if (!project) {
          console.warn(`Project not found: ${projectId}`)
          return
        }

        // Render modal content
        this.elements.modalBody.innerHTML = this.renderModalContent(project)

        // Show modal
        this.elements.projectModal.classList.add("active")

        // Focus management for accessibility
        this.elements.modalClose?.focus()

        // Prevent body scroll
        document.body.style.overflow = "hidden"
      } catch (error) {
        console.error("Error opening project modal:", error)
      }
    }

    // FIXED: Enhanced modal content rendering with full media support
    renderModalContent(project) {
      const hasBandcampTracks =
        project.bandcampTracks && Array.isArray(project.bandcampTracks) && project.bandcampTracks.length > 0

      const hasImages = project.images && Array.isArray(project.images) && project.images.length > 0
      const hasVideos = project.videos && Array.isArray(project.videos) && project.videos.length > 0
      const hasAudioFile = project.audioFile && typeof project.audioFile === "string"

      return `
        <h2 style="color: var(--${project.color || "saffron"}); margin-bottom: 1rem; font-size: 2rem;">
          ${project.title || "Untitled Project"}
        </h2>
        <div class="mono" style="color: var(--${project.color || "saffron"}); margin-bottom: 2rem; font-size: 0.9rem; letter-spacing: 0.1em;">
          ${project.category || "Uncategorized"}
        </div>
        
        ${
          project.fullDescription
            ? `
          <p style="font-size: 1.1rem; line-height: 1.8; margin-bottom: 2rem; opacity: 0.9;">
            ${project.fullDescription}
          </p>
        `
            : ""
        }
        
        ${hasImages ? this.renderProjectImages(project.images, false) : ""}
        ${hasVideos ? this.renderProjectVideos(project.videos, false) : ""}
        ${hasAudioFile ? this.renderProjectAudio(project.audioFile, project.title) : ""}
        
        ${
          hasBandcampTracks
            ? `
          <div style="margin-bottom: 2rem;">
            <h4 style="color: var(--off-white); margin-bottom: 1rem;">Audio Tracks</h4>
            <div class="bandcamp-modal-tracks" style="display: grid; gap: var(--spacing-sm); max-height: 300px; overflow-y: auto; padding: var(--spacing-sm); background: var(--glass-panel-light); border-radius: 1rem; border: 1px solid var(--glass-border);">
              ${project.bandcampTracks
                .map(
                  (track) => `
                <div class="bandcamp-track-modal">
                  <iframe 
                    style="border: 0; width: 100%; height: 42px; border-radius: var(--radius-base); margin-bottom: var(--spacing-xs);" 
                    src="https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=small/bgcol=333333/linkcol=ffffff/transparent=true/" 
                    seamless
                    loading="lazy"
                    title="Play ${track.title} by asymmetrica">
                    <a href="${track.url}" target="_blank" rel="noopener noreferrer">${track.title} by asymmetrica</a>
                  </iframe>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }
        
        ${
          project.medium
            ? `
          <div style="margin-bottom: 2rem;">
            <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Medium</h4>
            <p class="mono" style="font-size: 0.9rem; opacity: 0.8;">${project.medium}</p>
          </div>
        `
            : ""
        }
        
        ${
          project.technical
            ? `
          <div style="margin-bottom: 2rem;">
            <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Technical Details</h4>
            <p class="mono" style="font-size: 0.9rem; opacity: 0.8;">${project.technical}</p>
          </div>
        `
            : ""
        }
        
        ${
          project.themes
            ? `
          <div style="margin-bottom: 2rem;">
            <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Themes</h4>
            <p style="font-size: 0.95rem; opacity: 0.8;">${project.themes}</p>
          </div>
        `
            : ""
        }
        
        ${
          project.dimensions
            ? `
          <div style="margin-bottom: 2rem;">
            <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Dimensions</h4>
            <p class="mono" style="font-size: 0.9rem; opacity: 0.8;">${project.dimensions}</p>
          </div>
        `
            : ""
        }
        
        ${
          project.status
            ? `
          <div style="margin-bottom: 2rem;">
            <h4 style="color: var(--off-white); margin-bottom: 0.5rem;">Status</h4>
            <p style="font-size: 0.95rem; opacity: 0.8; color: var(--${project.color || "saffron"});">${project.status}</p>
          </div>
        `
            : ""
        }
        
        ${project.urls ? this.renderProjectLinks(project) : ""}
      `
    }

    // FIXED: Improved project links rendering
    renderProjectLinks(project) {
      try {
        const validUrls = Object.entries(project.urls).filter(([key, url]) => url)

        if (validUrls.length === 0) return ""

        return `
          <div style="margin-top: 2rem;">
            <h4 style="color: var(--off-white); margin-bottom: 1rem;">Links</h4>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
              ${validUrls
                .map(
                  ([key, url]) => `
                <a href="${url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="project-link"
                   style="color: var(--${project.color || "saffron"}); 
                          text-decoration: none; 
                          padding: 0.5rem 1rem; 
                          border: 1px solid var(--${project.color || "saffron"}); 
                          border-radius: 0.5rem; 
                          transition: all 0.3s ease;
                          display: inline-block;"
                   onmouseover="this.style.background = 'var(--${project.color || "saffron"})'; this.style.color = 'var(--deep-black)';"
                   onmouseout="this.style.background = 'transparent'; this.style.color = 'var(--${project.color || "saffron"})';"
                   onfocus="this.style.background = 'var(--${project.color || "saffron"})'; this.style.color = 'var(--deep-black)';"
                   onblur="this.style.background = 'transparent'; this.style.color = 'var(--${project.color || "saffron"})';">
                  ${key.toUpperCase()}
                </a>
              `,
                )
                .join("")}
            </div>
          </div>
        `
      } catch (error) {
        console.error("Error rendering project links:", error)
        return ""
      }
    }

    // FIXED: Improved modal setup
    setupModal() {
      if (!this.elements.projectModal || !this.elements.modalClose) return

      try {
        const closeModal = () => {
          this.elements.projectModal.classList.remove("active")
          document.body.style.overflow = "" // Restore body scroll
        }

        // Close button handler
        const closeHandler = () => closeModal()
        this.elements.modalClose.addEventListener("click", closeHandler)
        this.eventListeners.push({ element: this.elements.modalClose, event: "click", handler: closeHandler })

        // Click outside to close
        const modalClickHandler = (e) => {
          if (e.target === this.elements.projectModal) {
            closeModal()
          }
        }
        this.elements.projectModal.addEventListener("click", modalClickHandler)
        this.eventListeners.push({ element: this.elements.projectModal, event: "click", handler: modalClickHandler })

        // Escape key to close
        const keydownHandler = (e) => {
          if (e.key === "Escape" && this.elements.projectModal.classList.contains("active")) {
            closeModal()
          }
        }
        document.addEventListener("keydown", keydownHandler)
        this.eventListeners.push({ element: document, event: "keydown", handler: keydownHandler })
      } catch (error) {
        console.error("Modal setup error:", error)
      }
    }

    // FIXED: Error fallback
    showErrorFallback() {
      if (this.elements.mainContent) {
        this.elements.mainContent.innerHTML = this.renderErrorPage()
      }

      // Hide loading state
      this.hideLoadingState()
    }

    // FIXED: Performance stats
    getPerformanceStats() {
      return {
        ...this.performanceStats,
        deviceProfile: this.deviceProfile,
        config: this.config,
        currentPage: this.currentPage,
        isInitialized: this.isInitialized,
        systemStats: {
          galaxy: this.galaxyBackground?.getPerformanceStats?.() || null,
          mandala: this.mandalaGenerator?.getPerformanceStats?.() || null,
          particles: this.particleSystem?.getPerformanceStats?.() || null,
          cursor: this.cursorTrail?.getState?.() || null,
        },
      }
    }

    // FIXED: Proper cleanup
    destroy() {
      console.log("Destroying PortfolioApp...")

      this.isDestroyed = true

      // Clean up event listeners
      this.eventListeners.forEach(({ element, event, handler }) => {
        try {
          element.removeEventListener(event, handler)
        } catch (error) {
          console.warn("Error removing event listener:", error)
        }
      })
      this.eventListeners = []

      // Stop animations and destroy systems
      try {
        this.galaxyBackground?.destroy()
        this.mandalaGenerator?.stopAnimation()
        this.mandalaGenerator?.destroy()
        this.particleSystem?.destroy()
        this.cursorTrail?.destroy()
      } catch (error) {
        console.warn("Error destroying animation systems:", error)
      }

      // Restore body scroll
      document.body.style.overflow = ""

      // Clear references
      this.galaxyBackground = null
      this.mandalaGenerator = null
      this.particleSystem = null
      this.cursorTrail = null
      this.elements = {}
      this.data = null
      this.isInitialized = false

      console.log("PortfolioApp destroyed")
    }
  }

  // FIXED: Initialize app when DOM is loaded with proper error handling
  document.addEventListener("DOMContentLoaded", () => {
    try {
      window.portfolioApp = new PortfolioApp()
    } catch (error) {
      console.error("Failed to initialize portfolio app:", error)

      // Show basic fallback
      const mainContent = document.getElementById("mainContent")
      const loadingState = document.getElementById("loadingState")

      if (loadingState) {
        loadingState.style.display = "none"
      }

      if (mainContent) {
        mainContent.innerHTML = `
          <div style="padding: 4rem 2rem; text-align: center; max-width: 800px; margin: 0 auto;">
            <h1 style="color: var(--saffron); margin-bottom: 2rem;">Portfolio Unavailable</h1>
            <p style="font-size: 1.2rem; opacity: 0.9;">
              Sorry, there was an error loading the portfolio. Please refresh the page or try again later.
            </p>
            <p style="font-size: 1rem; opacity: 0.7; margin-top: 1rem;">
              Error: ${error.message}
            </p>
          </div>
        `
      }
    }
  })

  // Handle page unload
  window.addEventListener("beforeunload", () => {
    if (window.portfolioApp) {
      window.portfolioApp.destroy()
    }
  })
})()
s