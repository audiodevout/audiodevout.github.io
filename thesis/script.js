/**
 * script.js - Dynamic content rendering and navigation
 * Pure vanilla JavaScript with lazy loading, accessibility, and Bandcamp integration
 */

class PortfolioApp {
  constructor() {
    this.data = null
    this.currentView = "portfolio"
    this.currentWork = null
    this.audioPlayer = null
    this.intersectionObserver = null
    this.modalState = null
    this.sidebarState = false
    this.scrollPosition = 0

    this.init()
  }

  async init() {
    try {
      // Wait for data to be available
      await this.waitForData()

      // Initialize components
      this.setupNavigation()
      this.setupBandcampSidebar()
      this.setupIntersectionObserver()
      this.setupKeyboardNavigation()
      this.setupAccessibility()

      this.restoreState()

      // Handle initial URL
      this.handleInitialRoute()

      if (!this.stateRestored) {
        this.renderPortfolio()
        this.showPortfolio()
      }

      this.renderBandcampTracks()
      this.hideLoading()
      this.updateButtonVisibility()
    } catch (error) {
      console.error("Failed to initialize portfolio app:", error)
      this.showError("Failed to load portfolio. Please refresh the page.")
    }
  }

  async waitForData() {
    return new Promise((resolve, reject) => {
      const checkData = () => {
        if (window.portfolioData) {
          this.data = window.portfolioData
          resolve()
        } else {
          setTimeout(checkData, 100)
        }
      }

      checkData()

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!this.data) {
          reject(new Error("Data loading timeout"))
        }
      }, 5000)
    })
  }

  setupNavigation() {
    const navToggle = document.querySelector(".nav-toggle")
    const navMenu = document.querySelector(".nav-menu")
    const navLinks = document.querySelectorAll(".nav-link")
    const backButton = document.querySelector(".back-button")
    const musicButton = document.querySelector(".bandcamp-toggle")

    // Toggle navigation menu
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true"
      navToggle.setAttribute("aria-expanded", !isExpanded)
      navMenu.classList.toggle("nav-menu--open")
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navToggle.setAttribute("aria-expanded", "false")
        navMenu.classList.remove("nav-menu--open")
      }
    })

    // Navigation links
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const target = link.getAttribute("href").substring(1)
        this.navigateTo(target)

        // Close mobile menu
        navToggle.setAttribute("aria-expanded", "false")
        navMenu.classList.remove("nav-menu--open")
      })
    })

    // Back button
    if (backButton) {
      backButton.addEventListener("click", (e) => {
        e.preventDefault()
        this.navigateTo("portfolio", null) // Always go back to main portfolio
      })
    }

    // Handle browser back/forward
    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.view && e.state.work) {
        // Navigate to work detail
        this.navigateTo("portfolio", e.state.work, false)
      } else if (e.state && e.state.view) {
        // Navigate to section
        this.navigateTo(e.state.view, null, false)
      } else {
        // Fallback to portfolio
        this.navigateTo("portfolio", null, false)
      }
    })
  }

  setupBandcampSidebar() {
    const musicButton = document.querySelector(".bandcamp-toggle")
    const sidebar = document.querySelector(".bandcamp-sidebar")
    const closeButton = document.querySelector(".sidebar-close")

    if (musicButton && sidebar) {
      musicButton.addEventListener("click", () => {
        sidebar.classList.toggle("open")
        this.sidebarState = sidebar.classList.contains("open")
        this.saveState()
      })

      if (closeButton) {
        closeButton.addEventListener("click", () => {
          sidebar.classList.remove("open")
          this.sidebarState = false
          this.saveState()
        })
      }
    }
  }

  updateButtonVisibility() {
    const backButton = document.querySelector(".back-button")
    const musicButton = document.querySelector(".bandcamp-toggle")

    if (!backButton || !musicButton) return

    if (this.currentView === "work-detail") {
      // Inside a work detail - show back, hide music
      musicButton.style.display = "none"
      backButton.style.display = "inline-block"
    } else {
      // On main pages - show music, hide back
      musicButton.style.display = "inline-block"
      backButton.style.display = "none"
    }
  }

  renderBandcampTracks() {
    const container = document.querySelector(".bandcamp-tracks")
    if (!container) {
      console.warn("Bandcamp tracks container not found")
      return
    }

    // Get all Bandcamp tracks
    const tracks = this.data.getAllBandcampTracks()

    if (tracks.length === 0) {
      container.innerHTML = '<p class="track-project">No tracks available</p>'
      return
    }

    container.innerHTML = tracks
      .map(
        (track) => `
      <div class="bandcamp-track" data-track-id="${track.trackId}">
        <div class="track-title">${track.title}</div>
        <div class="track-project">from ${track.projectTitle}</div>
        <button class="track-play-btn" 
                data-url="${track.url}" 
                data-track-id="${track.trackId}"
                aria-label="Listen to ${track.title}">
          ▶ Listen on Bandcamp
        </button>
      </div>
    `,
      )
      .join("")

    // Add event listeners to play buttons
    container.querySelectorAll(".track-play-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const url = btn.dataset.url
        if (url) {
          window.open(url, "_blank", "noopener,noreferrer")
        }
      })
    })
  }

  setupIntersectionObserver() {
    // Lazy loading for images
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target
            if (img.dataset.src) {
              img.src = img.dataset.src
              img.classList.remove("lazy-loading")
              img.classList.add("lazy-loaded")
              img.removeAttribute("data-src")
              this.intersectionObserver.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      },
    )
  }

  setupKeyboardNavigation() {
    // Enhanced keyboard navigation
    document.addEventListener("keydown", (e) => {
      // Escape key closes menu or goes back
      if (e.key === "Escape") {
        const navMenu = document.querySelector(".nav-menu")
        const navToggle = document.querySelector(".nav-toggle")

        if (navMenu.classList.contains("nav-menu--open")) {
          navToggle.setAttribute("aria-expanded", "false")
          navMenu.classList.remove("nav-menu--open")
          navToggle.focus()
        } else if (this.currentView === "work-detail") {
          this.navigateTo("portfolio")
        }
      }

      // Arrow keys for menu navigation
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        const navMenu = document.querySelector(".nav-menu")
        if (navMenu.classList.contains("nav-menu--open")) {
          e.preventDefault()
          const links = navMenu.querySelectorAll(".nav-link")
          const currentIndex = Array.from(links).findIndex((link) => link === document.activeElement)

          let nextIndex
          if (e.key === "ArrowDown") {
            nextIndex = currentIndex < links.length - 1 ? currentIndex + 1 : 0
          } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : links.length - 1
          }

          links[nextIndex].focus()
        }
      }
    })
  }

  setupAccessibility() {
    // Announce page changes to screen readers
    this.announcer = document.createElement("div")
    this.announcer.setAttribute("aria-live", "polite")
    this.announcer.setAttribute("aria-atomic", "true")
    this.announcer.className = "sr-only"
    document.body.appendChild(this.announcer)
  }

  announcePageChange(message) {
    this.announcer.textContent = message
  }

  handleInitialRoute() {
    const hash = window.location.hash.substring(1)
    if (hash) {
      const parts = hash.split("/")
      if (parts.length === 2 && parts[0] === "work") {
        // Show work detail
        this.navigateTo("portfolio", parts[1], false)
      } else {
        // Show section
        this.navigateTo(parts[0] || "portfolio", null, false)
      }
    } else {
      const storedView = sessionStorage.getItem("portfolioCurrentView")
      const storedWork = sessionStorage.getItem("portfolioCurrentWork")

      if (storedView && storedWork) {
        this.navigateTo(storedView, storedWork, false)
      } else if (storedView && storedView !== "work-detail") {
        this.navigateTo(storedView, null, false)
      } else {
        this.navigateTo("portfolio", null, false)
      }
    }
  }

  navigateTo(view, work = null, pushState = true) {
    this.scrollPosition = window.pageYOffset

    // Determine the actual view to display
    if (work) {
      this.currentView = "work-detail"
      this.currentWork = work
    } else {
      this.currentView = view
      this.currentWork = null
    }

    this.saveState()

    // Update URL
    if (pushState) {
      const url = work ? `#work/${work}` : `#${view}`
      const title = work
        ? `${this.getWorkTitle(work)} - Atharva Gupta Portfolio`
        : `${view.charAt(0).toUpperCase() + view.slice(1)} - Atharva Gupta Portfolio`

      history.pushState({ view: this.currentView, work: this.currentWork }, title, url)
      document.title = title
    }

    // Hide all sections
    document.querySelectorAll("main > section").forEach((section) => {
      section.style.display = "none"
    })

    // Show target section and render content
    if (work) {
      // Show work detail
      this.renderWorkDetail(work)
      document.getElementById("work-detail").style.display = "block"
      this.announcePageChange(`Viewing work: ${this.getWorkTitle(work)}`)
    } else {
      // Show requested section
      switch (view) {
        case "portfolio":
          this.renderPortfolio()
          document.getElementById("portfolio").style.display = "block"
          break
        case "thesis":
          this.renderThesis()
          document.getElementById("thesis").style.display = "block"
          break
        case "about":
          this.renderAbout()
          document.getElementById("about").style.display = "block"
          break
        case "cv":
          this.renderCV()
          document.getElementById("cv").style.display = "block"
          break
      }
    }

    // Scroll to top and update button visibility
    window.scrollTo({ top: 0, behavior: "smooth" })
    this.updateButtonVisibility()
  }

  renderPortfolio() {
    const container = document.querySelector(".works-grid")
    container.innerHTML = ""

    const columns = [
      {
        title: "Installations",
        works: [...(this.data.projects.soundInstallations || []), ...(this.data.projects.installations || [])],
      },
      {
        title: "Performances",
        works: this.data.projects.performance || [],
      },
      {
        title: "Exhibitions",
        works: this.data.cv.exhibitions || [],
      },
      {
        title: "Others",
        works: [
          ...(this.data.projects.others || []),
          ...(this.data.projects.drawings || []),
          ...(this.data.projects.writing || []),
        ],
      },
    ]

    columns.forEach((column, index) => {
      if (column.works.length > 0) {
        // Create column container
        const columnDiv = document.createElement("div")
        columnDiv.className = "works-column"

        const columnHeader = document.createElement("div")
        columnHeader.className = "category-header"
        columnHeader.innerHTML = `
          <h2 class="category-title">${column.title}</h2>
        `
        columnDiv.appendChild(columnHeader)

        // Create column grid
        const columnGrid = document.createElement("div")
        columnGrid.className = "category-grid"

        column.works.forEach((work) => {
          const workElement = this.createWorkCard(work)
          columnGrid.appendChild(workElement)
        })

        columnDiv.appendChild(columnGrid)
        container.appendChild(columnDiv)
      }
    })

    // Setup lazy loading for newly created images
    this.setupLazyImages()
  }

  createWorkCard(work) {
    const card = document.createElement("article")
    card.className = "work-card"
    card.setAttribute("data-color", work.color || "default")
    card.setAttribute("data-testid", `work-card-${work.id}`)

    const hasMedia = work.images?.length > 0 || work.videos?.length > 0
    const primaryImage = work.images?.[0]
    const coverArt = work.bandcampTracks?.[0]?.coverArt
    const displayImage = primaryImage || coverArt

    card.innerHTML = `
      ${
        hasMedia || coverArt
          ? `
        <div class="work-media" data-testid="work-media-${work.id}">
          ${
            displayImage
              ? `
            <img 
              src="${displayImage}"
              data-src="${displayImage}"
              alt="${work.title}"
              class="work-image lazy-loading clickable-image"
              loading="lazy"
              data-testid="work-image-${work.id}"
              data-modal-title="${work.title}"
              data-modal-description="${work.description || work.fullDescription || ""}"
              data-modal-category="${work.category || work.medium}"
              data-modal-themes="${work.themes || ""}"
              data-modal-technical="${work.technical || ""}"
              data-modal-technology="${work.technology || ""}"
            >
          `
              : ""
          }
        </div>
      `
          : ""
      }
      
      <div class="work-info">
        <h3 class="work-title" data-testid="work-title-${work.id}">${work.title}</h3>
        <p class="work-category" data-testid="work-category-${work.id}">${work.category || work.medium}</p>
        <p class="work-description" data-testid="work-description-${work.id}">${work.description}</p>
      </div>
    `

    // Make card clickable
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("clickable-image") && e.target.dataset.modalTitle) {
        e.preventDefault()
        e.stopPropagation()
        const imageSrc = e.target.src || e.target.dataset.src
        this.openModal(
          imageSrc,
          e.target.dataset.modalTitle,
          e.target.dataset.modalDescription,
          e.target.dataset.modalCategory,
          e.target.dataset.modalThemes,
          e.target.dataset.modalTechnical,
          e.target.dataset.modalTechnology,
        )
        return
      }

      // Don't navigate if clicking on action buttons
      if (!e.target.closest(".work-actions")) {
        this.navigateTo("portfolio", work.id)
      }
    })

    return card
  }

  renderWorkDetail(workId) {
    const work = this.findWork(workId)
    if (!work) {
      this.showError("Work not found")
      return
    }

    const container = document.querySelector(".work-content")
    const hasImages = work.images?.length > 0
    const hasVideos = work.videos?.length > 0

    container.innerHTML = `
      <header class="work-header">
        <h1 id="work-title" class="work-detail-title" data-testid="work-detail-title">${work.title}</h1>
        <div class="work-meta" data-testid="work-meta">
          <span class="work-category">${work.category || work.medium}</span>
          ${work.dimensions ? `<span class="work-dimensions">${work.dimensions}</span>` : ""}
        </div>
      </header>

      ${
        hasImages
          ? `
        <div class="work-gallery" role="region" aria-label="Work images" data-testid="work-gallery">
          ${work.images
            .map(
              (image, index) => `
            <figure class="gallery-item">
              <img 
                src="${image}"
                data-src="${image}"
                alt="${work.title} - Image ${index + 1}"
                class="gallery-image lazy-loading clickable-image"
                loading="lazy"
                data-testid="gallery-image-${index}"
                data-modal-title="${work.title}"
                data-modal-description="${work.fullDescription || work.description}"
                data-modal-category="${work.category || work.medium}"
                data-modal-themes="${work.themes || ""}"
                data-modal-technical="${work.technical || ""}"
                data-modal-technology="${work.technology || ""}"
              >
            </figure>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        hasVideos
          ? `
        <div class="work-videos" role="region" aria-label="Work videos" data-testid="work-videos">
          ${work.videos
            .map(
              (video, index) => `
            <div class="video-container">
              ${
                video.includes("youtube.com") || video.includes("youtu.be")
                  ? `
                <iframe 
                  src="${this.getYouTubeEmbedUrl(video)}"
                  frameborder="0"
                  allowfullscreen
                  aria-label="Video: ${work.title}"
                  data-testid="video-${index}"
                ></iframe>
              `
                  : `
                <video controls preload="metadata" aria-label="Video: ${work.title}" data-testid="video-${index}">
                  <source src="${video}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              `
              }
            </div>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }

      <div class="work-text" data-testid="work-text">
        <div class="work-description-full">
          ${this.formatTextContent(work.fullDescription || work.description)}
        </div>

        ${
          work.themes
            ? `
          <div class="work-themes" data-testid="work-themes">
            <h3>Themes</h3>
            <p>${work.themes}</p>
          </div>
        `
            : ""
        }

        ${
          work.technical
            ? `
          <div class="work-technical" data-testid="work-technical">
            <h3>Technical Details</h3>
            <p>${work.technical}</p>
          </div>
        `
            : ""
        }

        ${
          work.technology
            ? `
          <div class="work-technology" data-testid="work-technology">
            <h3>Technology</h3>
            <p>${work.technology}</p>
          </div>
        `
            : ""
        }
      </div>
    `

    // Setup lazy loading for new images
    this.setupLazyImages()
    this.setupImageModals()
  }

  setupImageModals() {
    // Create modal if it doesn't exist
    if (!document.querySelector(".modal")) {
      const modal = document.createElement("div")
      modal.className = "modal"
      modal.innerHTML = `
        <button class="modal-close" aria-label="Close modal">×</button>
        <div class="modal-content">
          <div class="modal-info">
            <h2 class="modal-title"></h2>
            <div class="modal-meta"></div>
            <div class="modal-description"></div>
            <div class="modal-full-description"></div>
            <div class="modal-themes"></div>
            <div class="modal-technical"></div>
            <div class="modal-technology"></div>
            <div class="modal-tags"></div>
          </div>
          <div class="modal-image-container">
            <img class="modal-image" alt="">
          </div>
        </div>
      `
      document.body.appendChild(modal)

      // Close modal functionality
      const closeBtn = modal.querySelector(".modal-close")
      closeBtn.addEventListener("click", () => this.closeModal())

      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal()
      })

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") this.closeModal()
      })
    }

    // Add click listeners to images
    document.querySelectorAll(".clickable-image").forEach((img) => {
      img.addEventListener("click", (e) => {
        e.preventDefault()
        e.stopPropagation()
        const imageSrc = img.src || img.dataset.src
        this.openModal(
          imageSrc,
          img.dataset.modalTitle,
          img.dataset.modalDescription,
          img.dataset.modalCategory,
          img.dataset.modalThemes,
          img.dataset.modalTechnical,
          img.dataset.modalTechnology,
        )
      })
    })
  }

  openModal(imageSrc, title, description, category, themes, technical, technology) {
    const modal = document.querySelector(".modal")
    const modalImage = modal.querySelector(".modal-image")
    const modalTitle = modal.querySelector(".modal-title")
    const modalMeta = modal.querySelector(".modal-meta")
    const modalDescription = modal.querySelector(".modal-description")
    const modalFullDescription = modal.querySelector(".modal-full-description")
    const modalThemes = modal.querySelector(".modal-themes")
    const modalTechnical = modal.querySelector(".modal-technical")
    const modalTechnology = modal.querySelector(".modal-technology")

    modalImage.src = imageSrc
    modalTitle.textContent = title
    modalMeta.textContent = category

    // Handle description vs full description
    if (description && description.length > 200) {
      modalDescription.style.display = "none"
      modalFullDescription.innerHTML = this.formatTextContent(description)
      modalFullDescription.style.display = "block"
    } else {
      modalDescription.textContent = description
      modalDescription.style.display = "block"
      modalFullDescription.style.display = "none"
    }

    // Handle additional content sections
    if (themes) {
      modalThemes.innerHTML = `<h4>Themes</h4><p>${themes}</p>`
      modalThemes.style.display = "block"
    } else {
      modalThemes.style.display = "none"
    }

    if (technical) {
      modalTechnical.innerHTML = `<h4>Technical Details</h4><p>${technical}</p>`
      modalTechnical.style.display = "block"
    } else {
      modalTechnical.style.display = "none"
    }

    if (technology) {
      modalTechnology.innerHTML = `<h4>Technology</h4><p>${technology}</p>`
      modalTechnology.style.display = "block"
    } else {
      modalTechnology.style.display = "none"
    }

    modal.classList.add("open")
    document.body.style.overflow = "hidden"

    this.modalState = {
      imageSrc,
      title,
      description,
      category,
      themes,
      technical,
      technology,
    }
    this.saveState()
  }

  closeModal() {
    const modal = document.querySelector(".modal")
    modal.classList.remove("open")
    document.body.style.overflow = ""

    this.modalState = null
    this.saveState()
  }

  saveState() {
    try {
      sessionStorage.setItem("portfolioCurrentView", this.currentView)
      sessionStorage.setItem("portfolioCurrentWork", this.currentWork || "")
      sessionStorage.setItem("portfolioModalState", JSON.stringify(this.modalState))
      sessionStorage.setItem("portfolioSidebarState", this.sidebarState.toString())
      sessionStorage.setItem("portfolioScrollPosition", this.scrollPosition.toString())
    } catch (error) {
      console.warn("Failed to save state:", error)
    }
  }

  restoreState() {
    try {
      // Restore sidebar state
      const savedSidebarState = sessionStorage.getItem("portfolioSidebarState")
      if (savedSidebarState === "true") {
        this.sidebarState = true
        const sidebar = document.querySelector(".bandcamp-sidebar")
        if (sidebar) {
          sidebar.classList.add("open")
        }
      }

      // Restore modal state
      const savedModalState = sessionStorage.getItem("portfolioModalState")
      if (savedModalState && savedModalState !== "null") {
        const modalState = JSON.parse(savedModalState)
        if (modalState) {
          // Delay modal restoration to ensure DOM is ready
          setTimeout(() => {
            this.openModal(
              modalState.imageSrc,
              modalState.title,
              modalState.description,
              modalState.category,
              modalState.themes,
              modalState.technical,
              modalState.technology,
            )
          }, 100)
        }
      }

      // Restore scroll position
      const savedScrollPosition = sessionStorage.getItem("portfolioScrollPosition")
      if (savedScrollPosition) {
        setTimeout(() => {
          window.scrollTo(0, Number.parseInt(savedScrollPosition))
        }, 200)
      }

      this.stateRestored = true
    } catch (error) {
      console.warn("Failed to restore state:", error)
    }
  }

  renderThesis() {
    const container = document.querySelector(".thesis-content")
    const thesis = this.data.thesis || {
      title: "Research in Progress",
      abstract: "Thesis content will be updated as research develops.",
      sections: [],
    }

    container.innerHTML = `
      <header class="thesis-header">
        <h1 data-testid="thesis-subtitle">${thesis.title}</h1>
      </header>

      <section class="thesis-abstract">
        <h2 data-testid="abstract-heading">Abstract</h2>
        <div class="thesis-text" data-testid="thesis-abstract-content">
          ${this.formatTextContent(thesis.abstract)}
        </div>
      </section>

      <div class="thesis-sections" data-testid="thesis-sections">
        ${thesis.sections
          .map(
            (section, index) => `
          <section class="thesis-section">
            <h2 data-testid="section-heading-${index}">${section.title}</h2>
            <div class="thesis-text" data-testid="section-content-${index}">
              ${this.formatTextContent(section.content)}
            </div>
          </section>
        `,
          )
          .join("")}
      </div>
    `
  }

  renderAbout() {
    const container = document.querySelector(".about-content")
    const about = this.data.contact.about
    const social = this.data.contact.social

    container.innerHTML = `
      <div class="about-profile" data-testid="about-profile">
        <div class="profile-image">
          <img src="${about.image}" alt="Atharva Gupta" class="about-image" data-testid="about-image">
        </div>
        <div class="profile-info">
          <h2 data-testid="about-name">Atharva Gupta</h2>
          <div class="about-text" data-testid="about-description">
            ${this.formatTextContent(about.description)}
          </div>
        </div>
      </div>

      <div class="about-credentials" data-testid="about-credentials">
        <h3>Practice Areas</h3>
        <ul>
          ${about.credentials.map((cred, index) => `<li data-testid="credential-${index}">${cred}</li>`).join("")}
        </ul>
      </div>

      <div class="about-contact" data-testid="about-contact">
        <h3>Connect</h3>
        <p data-testid="contact-description">${this.data.contact.description}</p>
        
        <div class="social-links" data-testid="social-links">
          ${social
            .map(
              (link, index) => `
            <a 
              href="${link.url}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="social-link" 
              data-color="${link.color || "default"}"
              data-testid="social-link-${link.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}"
            >
              ${link.name}
            </a>
          `,
            )
            .join("")}
        </div>
      </div>
    `
  }

  renderCV() {
    const container = document.querySelector(".cv-content")
    const cv = this.data.cv

    container.innerHTML = `
      <div class="cv-header" data-testid="cv-header">
        <div class="cv-basic-info">
          <h2 data-testid="cv-name">${cv.name}</h2>
          <p class="cv-tagline" data-testid="cv-tagline">${cv.tagline}</p>
          <div class="cv-contact" data-testid="cv-contact">
            <p>${cv.email}</p>
            <p>${cv.phone}</p>
            <p>${cv.location}</p>
          </div>
        </div>
      </div>

      <div class="cv-section-block" data-testid="cv-experience">
        <h3 class="cv-section-title">Work Experience</h3>
        <div class="cv-items">
          ${cv.experience
            .map(
              (exp, index) => `
            <div class="cv-item" data-testid="cv-experience-${index}">
              <div class="cv-item-header">
                <h4 class="cv-item-title" data-testid="cv-exp-title-${index}">${exp.title}</h4>
                <span class="cv-item-period" data-testid="cv-exp-period-${index}">${exp.period}</span>
              </div>
              <p class="cv-item-org" data-testid="cv-exp-org-${index}">
                ${exp.organization} • ${exp.location}
              </p>
              <p class="cv-item-desc" data-testid="cv-exp-desc-${index}">
                ${exp.description}
              </p>
              ${
                exp.achievements
                  ? `
                <ul class="cv-achievements" data-testid="cv-exp-achievements-${index}">
                  ${exp.achievements
                    .map(
                      (achievement, achIndex) => `
                    <li data-testid="cv-exp-achievement-${index}-${achIndex}">
                      ${achievement}
                    </li>
                  `,
                    )
                    .join("")}
                </ul>
              `
                  : ""
              }
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="cv-section-block" data-testid="cv-education">
        <h3 class="cv-section-title">Education</h3>
        <div class="cv-items">
          ${cv.education
            .map(
              (edu, index) => `
            <div class="cv-item" data-testid="cv-education-${index}">
              <div class="cv-item-header">
                <h4 class="cv-item-title" data-testid="cv-edu-degree-${index}">${edu.degree}</h4>
                <span class="cv-item-period" data-testid="cv-edu-period-${index}">${edu.period}</span>
              </div>
              <p class="cv-item-desc" data-testid="cv-edu-desc-${index}">${edu.description}</p>
              <p class="cv-item-org" data-testid="cv-edu-inst-${index}">
                ${edu.institution} • ${edu.location}
              </p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="cv-section-block" data-testid="cv-skills">
        <h3 class="cv-section-title">Skills & Technologies</h3>
        <div class="cv-skills">
          ${Object.entries(cv.skills)
            .map(
              ([category, skills], index) => `
            <div class="cv-skill-category" data-testid="cv-skill-category-${index}">
              <h4 data-testid="cv-skill-category-title-${index}">${category}</h4>
              <p class="cv-skill-list" data-testid="cv-skill-category-content-${index}">
                ${skills.join(", ")}
              </p>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>

      <div class="cv-section-block cv-languages" data-testid="cv-languages">
        <h3 class="cv-section-title">Languages</h3>
        <p>
          ${cv.languages
            .map(
              (lang, index) => `
            <span data-testid="cv-language-${index}">
              ${lang.language} (${lang.proficiency})${index < cv.languages.length - 1 ? ", " : ""}
            </span>
          `,
            )
            .join("")}
        </p>
      </div>

      <div class="cv-section-block cv-interests" data-testid="cv-interests">
        <h3 class="cv-section-title">Interests</h3>
        <p>${cv.interests.join(", ")}</p>
      </div>
    `
  }

  setupLazyImages() {
    const lazyImages = document.querySelectorAll("img[data-src]")
    lazyImages.forEach((img) => {
      this.intersectionObserver.observe(img)
    })
  }

  formatTextContent(text) {
    if (!text) return ""

    return text
      .split("\n")
      .map((paragraph) => (paragraph.trim() ? `<p>${paragraph.trim()}</p>` : ""))
      .filter((p) => p)
      .join("")
  }

  getYouTubeEmbedUrl(url) {
    const videoId = this.extractYouTubeVideoId(url)
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url
  }

  extractYouTubeVideoId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[7].length === 11 ? match[7] : false
  }

  getWorkTitle(workId) {
    const work = this.findWork(workId)
    return work ? work.title : "Unknown Work"
  }

  showPortfolio() {
    document.getElementById("portfolio").style.display = "block"
  }

  hideLoading() {
    const loading = document.querySelector(".loading")
    if (loading) {
      loading.style.display = "none"
    }
  }

  showError(message) {
    const loading = document.querySelector(".loading")
    if (loading) {
      loading.innerHTML = `<span class="error-text">${message}</span>`
    }
  }

  findWork(workId) {
    const allWorks = [
      ...(this.data.projects.soundInstallations || []),
      ...(this.data.projects.performance || []),
      ...(this.data.projects.installations || []),
      ...(this.data.projects.drawings || []),
      ...(this.data.projects.writing || []),
      ...(this.data.cv.exhibitions || []),
    ]

    return allWorks.find((work) => work.id === workId)
  }
}

// Initialize the portfolio app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp()
})
