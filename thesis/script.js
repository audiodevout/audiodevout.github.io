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

      // Handle initial URL
      this.handleInitialRoute()

      // Render initial view
      this.renderPortfolio()
      this.renderBandcampTracks()
      this.showPortfolio()
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
        this.navigateTo("portfolio", null)
      })
    }

    window.addEventListener("popstate", (e) => {
      if (e.state && e.state.view && e.state.work) {
        this.navigateTo("portfolio", e.state.work, false)
      } else if (e.state && e.state.view) {
        this.navigateTo(e.state.view, null, false)
      } else {
        this.navigateTo("portfolio", null, false)
      }
    })
  }

  setupBandcampSidebar() {
    const bandcampToggle = document.querySelector(".bandcamp-toggle")
    const bandcampSidebar = document.querySelector(".bandcamp-sidebar")

    if (!bandcampToggle || !bandcampSidebar) {
      console.warn("Bandcamp sidebar elements not found")
      return
    }

    // Toggle sidebar
    bandcampToggle.addEventListener("click", () => {
      const isOpen = bandcampSidebar.classList.contains("open")
      const isExpanded = bandcampToggle.getAttribute("aria-expanded") === "true"

      bandcampSidebar.classList.toggle("open")
      bandcampToggle.setAttribute("aria-expanded", !isExpanded)
      document.body.classList.toggle("sidebar-open")

      // Update toggle text
      bandcampToggle.textContent = isOpen ? "Music" : "Close"
    })

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
      if (!bandcampToggle.contains(e.target) && !bandcampSidebar.contains(e.target)) {
        bandcampSidebar.classList.remove("open")
        bandcampToggle.setAttribute("aria-expanded", "false")
        document.body.classList.remove("sidebar-open")
        bandcampToggle.textContent = "Music"
      }
    })

    // Prevent sidebar close when clicking inside sidebar
    bandcampSidebar.addEventListener("click", (e) => {
      e.stopPropagation()
    })
  }

  updateButtonVisibility() {
    const backButton = document.querySelector(".back-button")
    const musicButton = document.querySelector(".bandcamp-toggle")

    if (!backButton || !musicButton) return

    if (this.currentView === "work-detail") {
      musicButton.style.display = "none"
      backButton.style.display = "block"
    } else {
      musicButton.style.display = "block"
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
      this.navigateTo("portfolio", null, false)
    }
  }

  navigateTo(view, work = null, pushState = true) {
    if (work) {
      this.currentView = "work-detail"
      this.currentWork = work
    } else {
      this.currentView = view
      this.currentWork = null
    }

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
      this.renderWorkDetail(work)
      document.getElementById("work-detail").style.display = "block"
      this.announcePageChange(`Viewing work: ${this.getWorkTitle(work)}`)
    } else {
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

    // Create three-column layout: installations, performances, others
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

        // Create column header
        const columnHeader = document.createElement("div")
        columnHeader.className = "category-header"
        columnHeader.innerHTML = `
          <h2 class="category-title">${column.title}</h2>
          <div class="category-count">${column.works.length} ${column.works.length === 1 ? "work" : "works"}</div>
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
              data-src="${displayImage}"
              alt="${work.title}"
              class="work-image lazy-loading"
              loading="lazy"
              data-testid="work-image-${work.id}"
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
        
        ${
          work.bandcampTracks?.length > 0
            ? `
          <div class="work-actions" data-testid="work-actions-${work.id}">
            ${work.bandcampTracks
              .map(
                (track, index) => `
              <button class="play-bandcamp-btn" data-url="${track.url}" data-embed-id="${track.trackId}" data-testid="play-btn-${track.trackId || index}" aria-label="Listen to ${track.title}">
                ▶ ${track.title}
              </button>
            `,
              )
              .join("")}
          </div>
        `
            : ""
        }
      </div>
    `

    // Make card clickable
    card.addEventListener("click", (e) => {
      // Don't navigate if clicking on action buttons
      if (!e.target.closest(".work-actions")) {
        this.navigateTo("portfolio", work.id)
      }
    })

    // Handle Bandcamp buttons
    const bandcampBtns = card.querySelectorAll(".play-bandcamp-btn")
    bandcampBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation()
        window.open(btn.dataset.url, "_blank", "noopener,noreferrer")
      })
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
    const hasBandcamp = work.bandcampTracks?.length > 0

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
                data-src="${image}"
                alt="${work.title} - Image ${index + 1}"
                class="gallery-image lazy-loading"
                loading="lazy"
                data-testid="gallery-image-${index}"
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
            <h3>Technical</h3>
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

      ${
        hasBandcamp
          ? `
        <div class="work-audio" data-testid="work-audio">
          <h3>Audio</h3>
          <div class="bandcamp-tracks">
            ${work.bandcampTracks
              .map(
                (track, index) => `
              <div class="bandcamp-embed" data-testid="bandcamp-embed-${track.trackId || index}">
                <iframe
                  style="border: 0; width: 100%; height: 120px;"
                  src="https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=large/bgcol=ffffff/linkcol=333333/tracklist=false/artwork=small/transparent=true/"
                  seamless
                  title="${track.title} by Asymmetrica"
                  data-testid="bandcamp-iframe-${track.trackId || index}"
                >
                  <a href="${track.url}" target="_blank" rel="noopener noreferrer">
                    ${track.title} by Asymmetrica
                  </a>
                </iframe>
                <a href="${track.url}" target="_blank" rel="noopener noreferrer" class="bandcamp-link" data-testid="bandcamp-link-${track.trackId || index}">
                  ▶ ${track.title} (Bandcamp)
                </a>
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
        work.urls
          ? `
        <div class="work-links" data-testid="work-links">
          <h3>Links</h3>
          ${Object.entries(work.urls)
            .map(
              ([type, url]) => `
            <a href="${url}" target="_blank" rel="noopener noreferrer" class="external-link" data-testid="external-link-${type}">
              ${type.toUpperCase()}
            </a>
          `,
            )
            .join("")}
        </div>
      `
          : ""
      }
    `

    // Setup lazy loading for new images
    this.setupLazyImages()
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

  findWork(workId) {
    const allWorks = [
      ...(this.data.projects.soundInstallations || []),
      ...(this.data.projects.performance || []),
      ...(this.data.projects.installations || []),
      ...(this.data.projects.drawings || []),
      ...(this.data.projects.writing || []),
    ]

    return allWorks.find((work) => work.id === workId)
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
}

// Initialize the portfolio app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new PortfolioApp()
})
