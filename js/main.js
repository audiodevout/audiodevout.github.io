/**
 * main.js - Cyberpunk Portfolio Application (Redesigned)
 *
 * ARCHITECTURE:
 * - Monolithic app class with modular systems
 * - Grid-based layout management
 * - Enhanced video embedding support
 * - Performance-optimized rendering
 * - Minimalist interaction patterns
 */

;(() => {
  // Performance configuration based on device capabilities
  const APP_CONFIG = {
    mobile: {
      particleCount: 60,
      mandalaLayers: 2,
      animationQuality: "medium",
      enableBloom: false,
      enableCursor: false,
      debounceDelay: 200,
      lazyLoadThreshold: 100,
    },
    tablet: {
      particleCount: 100,
      mandalaLayers: 3,
      animationQuality: "high",
      enableBloom: true,
      enableCursor: true,
      debounceDelay: 150,
      lazyLoadThreshold: 200,
    },
    desktop: {
      particleCount: 150,
      mandalaLayers: 4,
      animationQuality: "high",
      enableBloom: true,
      enableCursor: true,
      debounceDelay: 100,
      lazyLoadThreshold: 300,
    },
  }

  // Page-specific mandala segments for visual variety
  const PAGE_SEGMENTS = {
    home: 8,
    "sound-installations": 6,
    performance: 10,
    installations: 12,
    drawings: 7,
    writing: 9,
    "about-contact": 16,
  }

  class CyberpunkPortfolioApp {
    constructor() {
      try {
        // Initialize core properties
        this.deviceProfile = this.detectDeviceProfile()
        this.config = APP_CONFIG[this.deviceProfile]
        this.currentPage = "home"
        this.isInitialized = false
        this.isDestroyed = false

        // System components
        this.mandalaGenerator = null
        this.particleSystem = null
        this.cursorTrail = null

        // Data and DOM management
        this.data = this.validatePortfolioData()
        this.elements = {}
        this.eventListeners = []

        // Performance tracking
        this.performanceStats = {
          initTime: Date.now(),
          renderCount: 0,
          lastRenderTime: 0,
        }

        console.log(`CyberpunkPortfolioApp initializing with ${this.deviceProfile} profile`)
        this.init()
      } catch (error) {
        console.error("CyberpunkPortfolioApp constructor error:", error)
        this.showErrorFallback()
      }
    }

    detectDeviceProfile() {
      try {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
        if (prefersReducedMotion) return "mobile"

        // Device capability detection
        const deviceMemory = navigator.deviceMemory || 4
        const hardwareConcurrency = navigator.hardwareConcurrency || 4
        const connectionSpeed = navigator.connection?.effectiveType || "4g"

        if (isMobile || deviceMemory < 4 || hardwareConcurrency < 4 || ["slow-2g", "2g"].includes(connectionSpeed)) {
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

    validatePortfolioData() {
      try {
        const data = window.portfolioData
        if (!data || typeof data !== "object") {
          throw new Error("Portfolio data not found or invalid")
        }

        if (!data.projects || typeof data.projects !== "object") {
          throw new Error("Projects data missing or invalid")
        }

        if (!data.contact || typeof data.contact !== "object") {
          throw new Error("Contact data missing or invalid")
        }

        console.log("Portfolio data validated successfully")
        return data
      } catch (error) {
        console.error("Portfolio data validation failed:", error)
        return this.getDefaultData()
      }
    }

    getDefaultData() {
      return {
        projects: {
          soundInstallations: [],
          performance: [],
          installations: [],
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
        // Cache DOM elements
        this.cacheElements()

        // Hide loading state
        this.hideLoadingState()

        // Setup core systems
        await this.setupBackgroundSystems()
        this.setupNavigation()
        this.setupImageOverlay()
        this.setupModal()
        this.setupScrollTracking()

        // Handle URL routing
        this.setupRouteHandling()

        // Render initial page
        this.renderCurrentPage()

        // Mark as initialized
        this.isInitialized = true

        const initTime = Date.now() - this.performanceStats.initTime
        console.log(`CyberpunkPortfolioApp initialized in ${initTime}ms`)
      } catch (error) {
        console.error("Failed to initialize CyberpunkPortfolioApp:", error)
        this.showErrorFallback()
      }
    }

    cacheElements() {
      const elementIds = [
        "mainContent",
        "mandalaCanvas",
        "particleCanvas",
        "projectModal",
        "modalBody",
        "modalClose",
        "navLinks",
        "mobileMenuToggle",
        "loadingState",
        "imageOverlay",
        "overlayImage",
        "closeOverlay",
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

      // Validate critical elements
      const criticalElements = ["mainContent"]
      for (const elementKey of criticalElements) {
        if (!this.elements[elementKey]) {
          throw new Error(`Required DOM element #${elementKey} not found`)
        }
      }
    }

    hideLoadingState() {
      if (this.elements.loadingState) {
        this.elements.loadingState.style.display = "none"
      }
    }

    async setupBackgroundSystems() {
      const setupPromises = []

      try {
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
        if (this.config.enableCursor && window.CursorTrail) {
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

        await Promise.all(setupPromises)
        this.setupResizeHandler()
        this.setupVisibilityHandler()
      } catch (error) {
        console.error("Error initializing background systems:", error)
      }
    }

    setupResizeHandler() {
      let resizeTimeout
      const resizeHandler = () => {
        clearTimeout(resizeTimeout)
        resizeTimeout = setTimeout(() => {
          if (this.isInitialized && !this.isDestroyed) {
            try {
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

    setupVisibilityHandler() {
      const visibilityHandler = () => {
        try {
          if (document.hidden) {
            this.mandalaGenerator?.stopAnimation()
            this.particleSystem?.stop()
          } else {
            if (this.isInitialized && !this.isDestroyed) {
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

            // Close mobile menu
            this.closeMobileMenu()
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
        const mobileToggle = document.getElementById("mobileMenuToggle")
        if (mobileToggle) {
          const toggleHandler = () => {
            const navLinks = this.elements.navLinks
            const isActive = navLinks.classList.contains("active")

            navLinks.classList.toggle("active")
            mobileToggle.classList.toggle("active")
            mobileToggle.setAttribute("aria-expanded", !isActive)
          }

          mobileToggle.addEventListener("click", toggleHandler)
          this.eventListeners.push({ element: mobileToggle, event: "click", handler: toggleHandler })
        }

        // Handle browser navigation
        const popstateHandler = (e) => {
          const page = e.state?.page || this.getPageFromHash()
          this.navigateToPage(page, false)
        }

        window.addEventListener("popstate", popstateHandler)
        this.eventListeners.push({ element: window, event: "popstate", handler: popstateHandler })
      } catch (error) {
        console.error("Navigation setup error:", error)
      }
    }

    closeMobileMenu() {
      const navLinks = this.elements.navLinks
      const mobileToggle = document.getElementById("mobileMenuToggle")

      if (navLinks) navLinks.classList.remove("active")
      if (mobileToggle) {
        mobileToggle.classList.remove("active")
        mobileToggle.setAttribute("aria-expanded", "false")
      }
    }

    setupRouteHandling() {
      // Handle initial page load
      const initialPage = this.getPageFromHash()
      if (initialPage !== "home") {
        this.navigateToPage(initialPage, false)
      }
    }

    getPageFromHash() {
      const hash = window.location.hash.substring(1)
      const validPages = [
        "home",
        "sound-installations",
        "performance",
        "installations",
        "drawings",
        "writing",
        "about-contact",
      ]

      // Handle legacy routes
      if (hash === "generative-av" || hash === "interactive") {
        return "installations"
      }

      return validPages.includes(hash) ? hash : "home"
    }

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
        const scrollProgress = Math.min(scrollTop / Math.max(docHeight, 1), 1)

        if (this.mandalaGenerator) {
          this.mandalaGenerator.setScrollProgress(scrollProgress)
        }
      } catch (error) {
        console.warn("Scroll progress update error:", error)
      }
    }

    setupImageOverlay() {
      try {
        // Click any image inside .project-images
        document.body.addEventListener("click", (e) => {
          const img = e.target.closest(".project-images img")
          if (img && this.elements.imageOverlay && this.elements.overlayImage) {
            this.elements.overlayImage.src = img.src
            this.elements.imageOverlay.style.display = "flex"
            document.body.style.overflow = "hidden"
          }
        })

        // Close button
        if (this.elements.closeOverlay) {
          const closeHandler = () => {
            if (this.elements.imageOverlay) {
              this.elements.imageOverlay.style.display = "none"
              document.body.style.overflow = ""
            }
          }

          this.elements.closeOverlay.addEventListener("click", closeHandler)
          this.eventListeners.push({ element: this.elements.closeOverlay, event: "click", handler: closeHandler })
        }

        // Escape key to close
        const keydownHandler = (e) => {
          if (e.key === "Escape" && this.elements.imageOverlay && this.elements.imageOverlay.style.display === "flex") {
            this.elements.imageOverlay.style.display = "none"
            document.body.style.overflow = ""
          }
        }

        document.addEventListener("keydown", keydownHandler)
        this.eventListeners.push({ element: document, event: "keydown", handler: keydownHandler })
      } catch (error) {
        console.error("Error setting up image overlay:", error)
      }
    }

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

        // Update mandala canvas class
        if (this.elements.mandalaCanvas) {
          this.elements.mandalaCanvas.className = `mandala-canvas ${page}`
        }

        // Update mandala segments
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

        // Performance tracking
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

    renderCurrentPage() {
      if (!this.elements.mainContent || this.isDestroyed) return

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
          case "installations":
            html = this.renderInstallationsPage()
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

        this.elements.mainContent.innerHTML = html
        this.bindProjectCardEvents()
      } catch (error) {
        console.error("Error rendering page:", error)
        this.elements.mainContent.innerHTML = this.renderErrorPage()
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
              <h2 class="page-title" style="color: var(--electric-lime);">SOUND INSTALLATIONS</h2>
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
              <h2 class="page-title" style="color: var(--cyber-blue);">PERFORMANCE</h2>
            </div>
            
            <div class="project-grid">
              ${projects.map((project) => this.renderProjectCard(project)).join("")}
            </div>
          </div>
        </section>
      `
    }

    renderInstallationsPage() {
      const projects = this.data.projects.installations || []

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--neon-magenta);">INSTALLATIONS</h2>
              <p style="color: var(--light-gray); margin-top: var(--space-4); font-size: var(--text-md);">
                Generative and interactive works exploring computational creativity
              </p>
            </div>
            
            <div class="project-grid">
              ${
                projects.length > 0
                  ? projects.map((project) => this.renderProjectCard(project)).join("")
                  : `
                  <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-8); background: var(--charcoal); border: var(--border-thin);">
                    <p style="color: var(--light-gray); font-size: var(--text-md);">
                      No installation projects available at the moment.
                    </p>
                  </div>
                `
              }
            </div>
          </div>
        </section>
      `
    }

    renderDrawingsPage() {
      const projects = this.data.projects.drawings || []

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--warning-orange);">DRAWINGS / SKETCH</h2>
            </div>
            
            <div class="project-grid">
              ${
                projects.length > 0
                  ? projects.map((project) => this.renderProjectCard(project)).join("")
                  : `<div style="grid-column: 1 / -1; text-align: center; padding: var(--space-8); background: var(--charcoal); border: var(--border-thin);">
                  <p style="color: var(--light-gray);">No drawings available.</p>
                </div>`
              }
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
              <h2 class="page-title" style="color: var(--cyber-blue);">WRITING / THEORY</h2>
            </div>
            
            <div class="project-grid">
              ${projects.map((project) => this.renderProjectCard(project)).join("")}
            </div>
          </div>
        </section>
      `
    }

    renderContactPage() {
      const contact = this.data.contact || {
        about: {
          title: "About",
          description: "Loading...",
          image: null,
          credentials: [],
        },
        social: [],
        description: "Contact information loading...",
      }

      return `
        <section class="page-section active">
          <div class="page-content">
            <div class="page-header">
              <h2 class="page-title" style="color: var(--electric-lime);">ABOUT & CONTACT</h2>
            </div>
            
            <!-- About Section -->
            <div class="about-section" style="margin-bottom: var(--space-12);">
              <div class="about-content">
                
                <!-- About Text -->
                <div class="about-text">
                  <h3>${contact.about?.title || "About"}</h3>
                  
                  <div>
                    ${
                      contact.about?.description
                        ?.split("\n\n")
                        .map((paragraph) => `<p>${paragraph}</p>`)
                        .join("") || "Loading about content..."
                    }
                  </div>
                  
                  ${
                    contact.about?.credentials && contact.about.credentials.length > 0
                      ? `
                    <div class="credentials">
                      <h4>PRACTICE AREAS</h4>
                      <div>
                        ${contact.about.credentials.map((credential) => `<span>${credential}</span>`).join("")}
                      </div>
                    </div>
                  `
                      : ""
                  }
                </div>
                
                <!-- Portrait Image -->
                ${
                  contact.about?.image
                    ? `
                  <div class="portrait-container">
                    <img 
                      src="${contact.about.image}" 
                      alt="Atharva Gupta"
                      loading="lazy"
                      onerror="this.parentElement.innerHTML='<div style=\\'padding: var(--space-6); text-align: center; color: var(--light-gray);\\'>Portrait image not available</div>'"
                    />
                  </div>
                `
                    : `
                  <div class="portrait-container" style="
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    color: var(--light-gray);
                    font-family: var(--font-mono);
                    font-size: var(--text-sm);
                    text-align: center;
                  ">
                    📷<br>Portrait Image<br>Coming Soon
                  </div>
                `
                }
              </div>
            </div>
            
            <!-- Contact Section -->
            <div class="contact-section">
              <h3 style="color: var(--cyber-blue); font-size: var(--text-xl); margin-bottom: var(--space-8); text-align: center; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">
                CONNECT & COLLABORATE
              </h3>
              
              <div class="social-grid">
                ${contact.social.map((platform) => this.renderSocialLink(platform)).join("")}
              </div>
              
              <div style="margin-top: var(--space-8); padding: var(--space-6); text-align: center; max-width: 600px; margin-left: auto; margin-right: auto; background: var(--charcoal); border: var(--border-thin);">
                <p style="font-size: var(--text-md); line-height: 1.6; color: var(--pale-gray);">
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
              <h2 class="page-title" style="color: var(--warning-orange);">ERROR</h2>
            </div>
            
            <div style="padding: var(--space-8); text-align: center; max-width: 600px; margin: 0 auto; background: var(--charcoal); border: var(--border-thin);">
              <p style="font-size: var(--text-md); line-height: 1.6; color: var(--pale-gray);">
                Sorry, there was an error loading this page. Please try refreshing the browser.
              </p>
            </div>
          </div>
        </section>
      `
    }

    renderProjectCard(project) {
      if (!project) return ""

      const hasBandcampTracks =
        project.bandcampTracks && Array.isArray(project.bandcampTracks) && project.bandcampTracks.length > 0
      const hasImages = project.images && Array.isArray(project.images) && project.images.length > 0
      const hasVideos = project.videos && Array.isArray(project.videos) && project.videos.length > 0
      const hasAudioFile = project.audioFile && typeof project.audioFile === "string"

      return `
        <div class="project-card ${project.color || "electric-lime"} fragment" 
             data-project-id="${project.id || ""}"
             role="button"
             tabindex="0"
             aria-label="View details for ${project.title || "Untitled Project"}">
          
          <h3 class="project-title">${project.title || "Untitled Project"}</h3>
          <div class="project-category">${project.category || "Uncategorized"}</div>
          
          ${
            project.tags && Array.isArray(project.tags) && project.tags.length > 0
              ? `
            <div class="project-tags">
              ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
            </div>
          `
              : ""
          }
          
          <p class="project-description">${project.description || "No description available."}</p>
          
          ${project.medium ? `<div style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--mid-gray); margin-top: var(--space-3);">${project.medium}</div>` : ""}
          
          ${hasImages ? this.renderProjectImages(project.images, true) : ""}
          ${hasVideos ? this.renderProjectVideos(project.videos, true) : ""}
          ${hasAudioFile ? this.renderProjectAudio(project.audioFile, project.title) : ""}
          
          ${
            hasBandcampTracks
              ? `
            <div class="project-media-section">
              <h4>AUDIO TRACKS</h4>
              <div style="display: grid; gap: var(--space-2);">
                ${project.bandcampTracks
                  .slice(0, 2)
                  .map(
                    (track) => `
                  <div style="background: var(--deep-black); border: var(--border-thin); overflow: hidden;">
                    <iframe 
                      style="border: 0; width: 100%; height: 42px;" 
                      src="https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=small/bgcol=000000/linkcol=ffffff/transparent=true/" 
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
                  project.bandcampTracks.length > 2
                    ? `
                  <div style="text-align: center; margin-top: var(--space-2);">
                    <span style="font-size: var(--text-xs); color: var(--mid-gray); font-family: var(--font-mono);">
                      +${project.bandcampTracks.length - 2} more tracks in details
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
          
          <div class="fragment-diagonal"></div>
        </div>
      `
    }

    renderProjectImages(images, isPreview = false) {
      if (!images || !Array.isArray(images) || images.length === 0) return ""

      const imagesToShow = isPreview ? images.slice(0, 2) : images

      return `
        <div class="project-media-section">
          <h4>${isPreview ? "PREVIEW IMAGES" : "IMAGES"}</h4>
          <div class="project-images">
            ${imagesToShow
              .map(
                (imagePath, index) => `
              <div class="project-image-container">
                <img 
                  src="${imagePath}" 
                  alt="Project image ${index + 1}"
                  loading="lazy"
                  onerror="this.parentElement.innerHTML='<div style=\\'display: flex; align-items: center; justify-content: center; height: 100%; color: var(--mid-gray); font-family: var(--font-mono); font-size: var(--text-xs);\\'>Image not found</div>'"
                />
              </div>
            `,
              )
              .join("")}
          </div>
          ${
            isPreview && images.length > 2
              ? `
            <div style="text-align: center; margin-top: var(--space-2);">
              <span style="font-size: var(--text-xs); color: var(--mid-gray); font-family: var(--font-mono);">
                +${images.length - 2} more images in details
              </span>
            </div>
          `
              : ""
          }
        </div>
      `
    }

    renderProjectVideos(videos, isPreview = false) {
      if (!videos || !Array.isArray(videos) || videos.length === 0) return ""

      const videosToShow = isPreview ? videos.slice(0, 1) : videos

      return `
        <div class="project-media-section">
          <h4>${isPreview ? "PREVIEW VIDEO" : "VIDEOS"}</h4>
          <div class="project-videos">
            ${videosToShow
              .map((videoPath, index) => {
                // Check if it's a YouTube URL
                const youtubeMatch = videoPath.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)

                if (youtubeMatch) {
                  const videoId = youtubeMatch[1]
                  return `
                      <div class="video-wrapper">
                        <iframe 
                          src="https://www.youtube.com/embed/${videoId}" 
                          title="YouTube video player"
                          frameborder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowfullscreen
                          referrerpolicy="strict-origin-when-cross-origin">
                        </iframe>
                      </div>
                    `
                } else {
                  // Regular video file
                  return `
                      <div class="project-video-container">
                        <video 
                          controls 
                          preload="metadata"
                          poster="${videoPath.replace(/\.[^/.]+$/, "")}_poster.jpg"
                        >
                          <source src="${videoPath}" type="video/mp4">
                          <p style="padding: var(--space-3); color: var(--mid-gray); font-family: var(--font-mono); font-size: var(--text-sm);">
                            Your browser doesn't support video playback. 
                            <a href="${videoPath}" target="_blank" style="color: var(--electric-lime);">Download video</a>
                          </p>
                        </video>
                      </div>
                    `
                }
              })
              .join("")}
          </div>
          ${
            isPreview && videos.length > 1
              ? `
            <div style="text-align: center; margin-top: var(--space-2);">
              <span style="font-size: var(--text-xs); color: var(--mid-gray); font-family: var(--font-mono);">
                +${videos.length - 1} more videos in details
              </span>
            </div>
          `
              : ""
          }
        </div>
      `
    }

    renderProjectAudio(audioFile, title = "Audio") {
      if (!audioFile || typeof audioFile !== "string") return ""

      return `
        <div class="project-media-section">
          <h4>AUDIO</h4>
          <div class="project-audio">
            <audio 
              controls 
              preload="metadata"
            >
              <source src="${audioFile}" type="audio/mpeg">
              <source src="${audioFile}" type="audio/wav">
              <source src="${audioFile}" type="audio/ogg">
              <p style="color: var(--mid-gray); font-family: var(--font-mono); font-size: var(--text-sm);">
                Your browser doesn't support audio playback. 
                <a href="${audioFile}" target="_blank" style="color: var(--electric-lime);">Download audio</a>
              </p>
            </audio>
          </div>
        </div>
      `
    }

    renderSocialLink(platform) {
      if (!platform) return ""

      return `
        <a href="${platform.url || "#"}" 
           target="_blank" 
           rel="noopener noreferrer" 
           class="social-link"
           aria-label="Visit ${platform.name || "Social Platform"}">
          <div class="social-icon">
            ${this.getSocialIcon(platform.icon)}
          </div>
          <div class="social-name">${(platform.name || "SOCIAL").toUpperCase()}</div>
        </a>
      `
    }

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
        icons[type] || '<div style="width: 100%; height: 100%; background: currentColor;" aria-hidden="true"></div>'
      )
    }

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

        // Focus management
        this.elements.modalClose?.focus()

        // Prevent body scroll
        document.body.style.overflow = "hidden"
      } catch (error) {
        console.error("Error opening project modal:", error)
      }
    }

    renderModalContent(project) {
      const hasBandcampTracks =
        project.bandcampTracks && Array.isArray(project.bandcampTracks) && project.bandcampTracks.length > 0
      const hasImages = project.images && Array.isArray(project.images) && project.images.length > 0
      const hasVideos = project.videos && Array.isArray(project.videos) && project.videos.length > 0
      const hasAudioFile = project.audioFile && typeof project.audioFile === "string"

      return `
        <h2 style="color: var(--${project.color || "electric-lime"}); margin-bottom: var(--space-4); font-size: var(--text-2xl); font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.05em;">
          ${project.title || "Untitled Project"}
        </h2>
        <div style="color: var(--${project.color || "electric-lime"}); margin-bottom: var(--space-6); font-size: var(--text-sm); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.1em;">
          ${project.category || "Uncategorized"}
        </div>
        
        ${
          project.tags && Array.isArray(project.tags) && project.tags.length > 0
            ? `
          <div class="project-tags" style="margin-bottom: var(--space-6);">
            ${project.tags.map((tag) => `<span class="project-tag">${tag}</span>`).join("")}
          </div>
        `
            : ""
        }
        
        ${
          project.fullDescription
            ? `
          <p style="font-size: var(--text-md); line-height: 1.6; margin-bottom: var(--space-6); color: var(--pale-gray);">
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
          <div style="margin-bottom: var(--space-6);">
            <h4 style="color: var(--off-white); margin-bottom: var(--space-4); font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase; letter-spacing: 0.1em;">Audio Tracks</h4>
            <div style="display: grid; gap: var(--space-2); max-height: 300px; overflow-y: auto; padding: var(--space-3); background: var(--deep-black); border: var(--border-thin);">
              ${project.bandcampTracks
                .map(
                  (track) => `
                <div style="background: var(--charcoal); border: var(--border-thin); overflow: hidden;">
                  <iframe 
                    style="border: 0; width: 100%; height: 42px;" 
                    src="https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=small/bgcol=000000/linkcol=ffffff/transparent=true/" 
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
            <div style="margin-bottom: var(--space-4);">
              <h4 style="color: var(--off-white); margin-bottom: var(--space-2); font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase;">Medium</h4>
              <p style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--light-gray);">${project.medium}</p>
            </div>
          `
            : ""
        }

        ${
          project.technical
            ? `
            <div style="margin-bottom: var(--space-4);">
              <h4 style="color: var(--off-white); margin-bottom: var(--space-2); font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase;">Technical Details</h4>
              <p style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--light-gray);">${project.technical}</p>
            </div>
          `
            : ""
        }

        ${
          project.themes
            ? `
            <div style="margin-bottom: var(--space-4);">
              <h4 style="color: var(--off-white); margin-bottom: var(--space-2); font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase;">Themes</h4>
              <p style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--light-gray);">${project.themes}</p>
            </div>
          `
            : ""
        }

        ${
          project.dimensions
            ? `
            <div style="margin-bottom: var(--space-4);">
              <h4 style="color: var(--off-white); margin-bottom: var(--space-2); font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase;">Dimensions</h4>
              <p style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--light-gray);">${project.dimensions}</p>
            </div>
          `
            : ""
        }

        ${
          project.status
            ? `
            <div style="margin-bottom: var(--space-4);">
              <h4 style="color: var(--off-white); margin-bottom: var(--space-2); font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase;">Status</h4>
              <p style="font-family: var(--font-mono); font-size: var(--text-sm); color: var(--${project.color || "electric-lime"});">${project.status}</p>
            </div>
          `
            : ""
        }

        ${project.urls ? this.renderProjectLinks(project) : ""}

      `
    }

    renderProjectLinks(project) {
      try {
        const validUrls = Object.entries(project.urls).filter(([key, url]) => url)
        if (validUrls.length === 0) return ""

        return `
          <div style="margin-top: var(--space-6);">
            <h4 style="color: var(--off-white); margin-bottom: var(--space-4); font-family: var(--font-mono); font-size: var(--text-sm); text-transform: uppercase;">Links</h4>
            <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
              ${validUrls
                .map(
                  ([key, url]) => `
                <a href="${url}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   style="color: var(--${project.color || "electric-lime"}); 
                          text-decoration: none; 
                          padding: var(--space-2) var(--space-3); 
                          border: var(--border-thin); 
                          border-color: var(--${project.color || "electric-lime"}); 
                          background: var(--deep-black);
                          transition: var(--transition-snap);
                          display: inline-block;
                          font-family: var(--font-mono);
                          font-size: var(--text-xs);
                          text-transform: uppercase;
                          letter-spacing: 0.05em;"
                   onmouseover="this.style.background = 'var(--${project.color || "electric-lime"})'; this.style.color = 'var(--pure-black)';"
                   onmouseout="this.style.background = 'var(--deep-black)'; this.style.color = 'var(--${project.color || "electric-lime"})';"
                   onfocus="this.style.background = 'var(--${project.color || "electric-lime"})'; this.style.color = 'var(--pure-black)';"
                   onblur="this.style.background = 'var(--deep-black)'; this.style.color = 'var(--${project.color || "electric-lime"})';">
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

    setupModal() {
      if (!this.elements.projectModal || !this.elements.modalClose) return

      try {
        const closeModal = () => {
          this.elements.projectModal.classList.remove("active")
          document.body.style.overflow = ""
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

    showErrorFallback() {
      if (this.elements.mainContent) {
        this.elements.mainContent.innerHTML = this.renderErrorPage()
      }
      this.hideLoadingState()
    }

    getPerformanceStats() {
      return {
        ...this.performanceStats,
        deviceProfile: this.deviceProfile,
        config: this.config,
        currentPage: this.currentPage,
        isInitialized: this.isInitialized,
        systemStats: {
          mandala: this.mandalaGenerator?.getPerformanceStats?.() || null,
          particles: this.particleSystem?.getPerformanceStats?.() || null,
          cursor: this.cursorTrail?.getState?.() || null,
        },
      }
    }

    destroy() {
      console.log("Destroying CyberpunkPortfolioApp...")

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
      this.mandalaGenerator = null
      this.particleSystem = null
      this.cursorTrail = null
      this.elements = {}
      this.data = null
      this.isInitialized = false

      console.log("CyberpunkPortfolioApp destroyed")
    }
  }

  // Initialize app when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    try {
      window.portfolioApp = new CyberpunkPortfolioApp()
    } catch (error) {
      console.error("Failed to initialize cyberpunk portfolio app:", error)

      // Show basic fallback
      const mainContent = document.getElementById("mainContent")
      const loadingState = document.getElementById("loadingState")

      if (loadingState) {
        loadingState.style.display = "none"
      }

      if (mainContent) {
        mainContent.innerHTML = `
          <div style="padding: var(--space-12) var(--space-4); text-align: center; max-width: 800px; margin: 0 auto;">
            <h1 style="color: var(--electric-lime); margin-bottom: var(--space-6); font-family: var(--font-display); text-transform: uppercase;">Portfolio Unavailable</h1>
            <p style="font-size: var(--text-md); color: var(--pale-gray); margin-bottom: var(--space-4);">
              Sorry, there was an error loading the portfolio. Please refresh the page or try again later.
            </p>
            <p style="font-size: var(--text-sm); color: var(--mid-gray); font-family: var(--font-mono);">
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
