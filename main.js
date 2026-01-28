// Main JavaScript for Portfolio Website
;(() => {
  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }

  const createProjectUrl = (projectId) => {
    return `project.html?id=${projectId}`
  }

  // ============================================
  // CONFIGURATION VARIABLES
  // ============================================

  const CONFIG = {
    gallery: {
      itemWidth: 600,
      gap: 0,
      itemsPerView: 2,
    },
  }

  // ============================================
  // SHARED RENDERERS (used across pages)
  // ============================================

  const populateCV = (data) => {
    const workExperience = document.getElementById("work-experience")
    if (workExperience) {
      const fragment = document.createDocumentFragment()
      data.contact.cv.workExperience.forEach((job) => {
        const item = document.createElement("div")
        item.innerHTML = `
            <h4>${job.title}</h4>
            <p>${job.company}</p>
            <p>${job.location} • ${job.period}</p>
            <ul>
              ${(job.responsibilities || []).map((resp) => `<li>${resp}</li>`).join("")}
            </ul>
          `
        fragment.appendChild(item)
      })
      workExperience.appendChild(fragment)
    }

    const education = document.getElementById("education")
    if (education) {
      const fragment = document.createDocumentFragment()
      data.contact.cv.education.forEach((edu) => {
        const item = document.createElement("div")
        item.innerHTML = `
            <h4>${edu.degree}</h4>
            <p>${edu.institution}</p>
            <p>${edu.location} • ${edu.period}</p>
          `
        fragment.appendChild(item)
      })
      education.appendChild(fragment)
    }

    const skills = document.getElementById("skills")
    if (skills) {
      const fragment = document.createDocumentFragment()

      const generalSkills = document.createElement("div")
      generalSkills.innerHTML = `
          <h4>General Skills</h4>
          <p>${data.contact.cv.skills.general.join(", ")}</p>
        `
      fragment.appendChild(generalSkills)

      const technologies = document.createElement("div")
      technologies.innerHTML = `
          <h4>Technologies</h4>
          <p>${data.contact.cv.skills.technologies.join(", ")}</p>
        `
      fragment.appendChild(technologies)

      const interests = document.createElement("div")
      interests.innerHTML = `
          <h4>Interests</h4>
          <p>${data.contact.cv.skills.interests.join(", ")}</p>
        `
      fragment.appendChild(interests)

      skills.appendChild(fragment)
    }
  }

  const populateAbout = (data) => {
    const aboutImage = document.getElementById("about-image")
    const aboutDescription = document.getElementById("about-description")
    const aboutCredentials = document.getElementById("about-credentials")

    if (aboutImage) {
      aboutImage.src = data.contact.about.image
      aboutImage.alt = data.contact.about.title
    }
    if (aboutDescription) {
      aboutDescription.textContent = data.contact.about.description
    }
    if (aboutCredentials) {
      const fragment = document.createDocumentFragment()
      data.contact.about.credentials.forEach((credential) => {
        const li = document.createElement("li")
        li.textContent = credential
        fragment.appendChild(li)
      })
      aboutCredentials.appendChild(fragment)
    }
  }

  const populateContact = (data) => {
    const contactDescription = document.getElementById("contact-description")
    const socialLinks = document.getElementById("social-links")

    if (contactDescription) {
      contactDescription.textContent = data.contact.description
    }

    if (socialLinks) {
      const fragment = document.createDocumentFragment()
      data.contact.social.forEach((social, index) => {
        const link = document.createElement("a")
        link.href = social.url
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        link.textContent = social.name
        fragment.appendChild(link)

        if (index < data.contact.social.length - 1) {
          fragment.appendChild(document.createTextNode(" • "))
        }
      })
      socialLinks.appendChild(fragment)
    }
  }

  const populateExhibitions = (data) => {
    const exhibitionsContainer = document.getElementById("exhibitions-list")
    if (!exhibitionsContainer) return

    const fragment = document.createDocumentFragment()

    data.exhibitions.forEach((exhibition) => {
      const item = document.createElement("div")
      item.className = "exhibition-item"

      const title = document.createElement(exhibition.id ? "a" : "div")
      title.className = "exhibition-title"
      if (exhibition.id) title.href = `project.html?id=${exhibition.id}`
      title.textContent = exhibition.title

      const meta = document.createElement("div")
      meta.className = "exhibition-meta"

      const parts = [
        exhibition.venue,
        exhibition.location,
        exhibition.date,
      ].filter(Boolean)

      // meta line: "Venue • City, Country • Month YYYY"
      meta.textContent = parts.join(" • ")

      item.appendChild(title)
      item.appendChild(meta)
      fragment.appendChild(item)
    })

    exhibitionsContainer.appendChild(fragment)
  }

  // ============================================
  // MOBILE NAVIGATION TOGGLE
  // ============================================

  const navToggle = document.getElementById("nav-toggle")
  const mainNav = document.getElementById("main-nav")

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", () => {
      mainNav.classList.toggle("open")
      navToggle.classList.toggle("active")
    })

    // Close nav when clicking a link
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open")
        navToggle.classList.remove("active")
      })
    })
  }

  // ============================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================

  const updateActiveNav = () => {
    const sections = document.querySelectorAll("section[id]")
    const navLinks = document.querySelectorAll("nav a[href^='#']")
    
    let currentSection = ""
    
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute("id")
      }
    })

    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active")
      }
    })
  }

  window.addEventListener("scroll", updateActiveNav)
  updateActiveNav()

  // ============================================
  // MAIN PAGE
  // ============================================

  const createProjectLink = (project) => {
    const li = document.createElement("li")
    const link = document.createElement("a")
    link.href = createProjectUrl(project.id)
    link.textContent = project.title
    li.appendChild(link)
    return li
  }

  const populateWorkList = (data) => {
    const installationsList = document.getElementById("installations-list")
    if (installationsList) {
      const fragment = document.createDocumentFragment()
      data.projects.installations.forEach((project) => {
        fragment.appendChild(createProjectLink(project))
      })
      installationsList.appendChild(fragment)
    }

    const soundList = document.getElementById("sound-list")
    if (soundList) {
      const audioCollectionLi = document.createElement("li")
      const audioCollectionLink = document.createElement("a")
      audioCollectionLink.href = "asymmetrica-audio.html"
      audioCollectionLink.textContent = "Asymmetrica Audio Collection"
      audioCollectionLi.appendChild(audioCollectionLink)
      soundList.appendChild(audioCollectionLi)
    }

    const performanceList = document.getElementById("performance-list")
    if (performanceList) {
      const fragment = document.createDocumentFragment()
      data.projects.performance.forEach((project) => {
        fragment.appendChild(createProjectLink(project))
      })
      performanceList.appendChild(fragment)
    }

    const drawingsList = document.getElementById("drawings-list")
    if (drawingsList) {
      const fragment = document.createDocumentFragment()
      const nonAudiodevoutDrawings = data.projects.drawings.filter(
        (project) => !project.id.startsWith("audiodevout-"),
      )

      nonAudiodevoutDrawings.forEach((project) => {
        fragment.appendChild(createProjectLink(project))
      })

      const tutorialsLi = document.createElement("li")
      const tutorialsLink = document.createElement("a")
      tutorialsLink.href = "touchdesigner-tutorials.html"
      tutorialsLink.textContent = "TouchDesigner Tutorials"
      tutorialsLi.appendChild(tutorialsLink)
      fragment.appendChild(tutorialsLi)

      drawingsList.appendChild(fragment)
    }

    const writingList = document.getElementById("writing-list")
    if (writingList) {
      const fragment = document.createDocumentFragment()
      data.projects.writing.forEach((project) => {
        fragment.appendChild(createProjectLink(project))
      })
      writingList.appendChild(fragment)
    }
  }

  if (document.body.classList.contains("main-page")) {
    const data = window.portfolioData

    // ============================================
    // GALLERY GRID - All project images
    // ============================================
    const populateGallery = () => {
      const galleryGrid = document.getElementById("gallery-grid")
      if (!galleryGrid) return

      const fragment = document.createDocumentFragment()
      const allMediaItems = []
      const seenMedia = new Set()
      const perProjectCount = new Map()

      const getLimit = (project) => {
        const n = project?.num_images_maingallery
        return typeof n === "number" && n > 0 ? n : 4
      }

      const getYoutubeId = (url) => {
        if (!url) return ""
        if (url.includes("youtube.com")) {
          const qs = url.split("?")[1] || ""
          const params = new URLSearchParams(qs)
          return params.get("v") || ""
        }
        if (url.includes("youtu.be/")) {
          return url.split("/").pop().split("?")[0]
        }
        return ""
      }

      const pushProjectMedia = (project, categoryName) => {
        // per-entry option: default YES (show everything)
        if (project.showInGallery === false) return

        const includeAll = project.galleryAllMedia !== false // default YES

        const images = Array.isArray(project.images) ? project.images : []
        const videos = Array.isArray(project.videos) ? project.videos : []

        const toAdd = []

        if (includeAll) {
          images.forEach((src) =>
            toAdd.push({ kind: "image", src }),
          )
          videos.forEach((src) =>
            toAdd.push({ kind: "video", src }),
          )
        } else {
          // fallback/opt-out mode: only first image if present, else first video
          if (images[0]) toAdd.push({ kind: "image", src: images[0] })
          else if (videos[0]) toAdd.push({ kind: "video", src: videos[0] })
        }

        const limit = getLimit(project)
        const pid = project.id || project.title || categoryName

        toAdd.forEach((m) => {
          const already = perProjectCount.get(pid) || 0
          if (already >= limit) return
          if (seenMedia.has(m.src)) return
          seenMedia.add(m.src)
          perProjectCount.set(pid, already + 1)

          allMediaItems.push({
            project,
            categoryName,
            media: m,
          })
        })
      }

      // Collect media across *all* project categories
      Object.entries(data.projects || {}).forEach(([categoryName, projects]) => {
        if (!Array.isArray(projects)) return
        projects.forEach((project) => pushProjectMedia(project, categoryName))
      })

      // Also include exhibitions entries that have media
      if (Array.isArray(data.exhibitions)) {
        data.exhibitions.forEach((exhibition) => pushProjectMedia(exhibition, "exhibitions"))
      }

      // Create gallery items (one tile per image/video)
      allMediaItems.forEach(({ project, categoryName, media }) => {
        const item = document.createElement("div")
        item.className = "gallery-item"

        const link = document.createElement("a")
        link.href = createProjectUrl(project.id)

        let thumbEl = null

        if (media.kind === "image") {
          const img = document.createElement("img")
          img.src = media.src
          img.alt = project.title
          img.loading = "lazy"
          thumbEl = img
        } else {
          const videoUrl = media.src
          if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
            const videoId = getYoutubeId(videoUrl)
            const img = document.createElement("img")
            img.src = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ""
            img.alt = `${project.title} (video)`
            img.loading = "lazy"
            thumbEl = img
          } else {
            const video = document.createElement("video")
            video.src = videoUrl
            video.muted = true
            video.playsInline = true
            // Performance: don't autoplay videos in the grid
            video.preload = "none"
            thumbEl = video
          }
        }

        const info = document.createElement("div")
        info.className = "gallery-item-info"

        const title = document.createElement("h4")
        title.className = "gallery-item-title"
        title.textContent = project.title

        const category = document.createElement("p")
        category.className = "gallery-item-category"
        category.textContent =
          categoryName.charAt(0).toUpperCase() + categoryName.slice(1) + (media.kind === "video" ? " • Video" : "")

        info.appendChild(title)
        info.appendChild(category)
        if (thumbEl) link.appendChild(thumbEl)
        link.appendChild(info)
        item.appendChild(link)
        fragment.appendChild(item)
      })

      galleryGrid.appendChild(fragment)
    }

    // Initialize Main Page
    populateGallery()
  }

  // ============================================
  // WORKS PAGE
  // ============================================

  if (document.body.classList.contains("works-page")) {
    const data = window.portfolioData
    if (data) populateWorkList(data)
  }

  // ============================================
  // EXHIBITIONS PAGE
  // ============================================

  if (document.body.classList.contains("exhibitions-page")) {
    const data = window.portfolioData
    if (data) populateExhibitions(data)
  }

  // ============================================
  // CV PAGE
  // ============================================

  if (document.body.classList.contains("cv-page")) {
    const data = window.portfolioData
    if (data) populateCV(data)
  }

  // ============================================
  // ABOUT PAGE
  // ============================================

  if (document.body.classList.contains("about-page")) {
    const data = window.portfolioData
    if (data) populateAbout(data)
  }

  // ============================================
  // CONTACT PAGE
  // ============================================

  if (document.body.classList.contains("contact-page")) {
    const data = window.portfolioData
    if (data) populateContact(data)
  }

  // ============================================
  // PROJECT DETAIL PAGE
  // ============================================

  if (document.body.classList.contains("project-page")) {
    const projectId = getUrlParameter("id")
    const data = window.portfolioData

    let project = null
    let foundCategory = null

    // Search through all project categories
    for (const [category, projects] of Object.entries(data.projects)) {
      const found = projects.find((p) => p.id === projectId)
      if (found) {
        project = found
        foundCategory = category
        break
      }
    }

    // If not found in projects, search exhibitions
    if (!project && data.exhibitions) {
      const found = data.exhibitions.find((e) => e.id === projectId)
      if (found) {
        project = found
        foundCategory = "exhibitions"
      }
    }

    if (project) {
      document.title = `${project.title} - Atharva Gupta`

      const titleEl = document.getElementById("project-title")
      if (titleEl) titleEl.textContent = project.title

      const categoryEl = document.getElementById("project-category")
      if (categoryEl) {
        const categoryName = (project.category || foundCategory || "").toLowerCase()
        categoryEl.textContent = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
      }

      const descriptionContainer = document.getElementById("project-description")
      const rawText = (project.fullDescription || project.description || "").trim()
      if (descriptionContainer) {
        if (rawText) {
          const description = document.createElement("p")
          description.textContent = rawText
          descriptionContainer.appendChild(description)
        }
      }

      const metaContainer = document.getElementById("project-meta")
      if (metaContainer) {
        const metaFields = [
          { label: "Medium", value: project.medium },
          { label: "Themes", value: project.themes },
          { label: "Technical", value: project.technical },
          { label: "Technology", value: project.technology },
          { label: "Dimensions", value: project.dimensions },
        ]

        const fragment = document.createDocumentFragment()
        metaFields.forEach((field) => {
          if (field.value) {
            const metaItem = document.createElement("p")
            metaItem.innerHTML = `<strong>${field.label}:</strong> ${field.value}`
            fragment.appendChild(metaItem)
          }
        })
        metaContainer.appendChild(fragment)
      }

      const linksContainer = document.getElementById("project-links")
      if (linksContainer && project.urls) {
        const fragment = document.createDocumentFragment()
        Object.entries(project.urls).forEach(([label, url]) => {
          const link = document.createElement("a")
          link.href = url
          link.target = "_blank"
          link.rel = "noopener noreferrer"
          link.textContent = label.toUpperCase()
          fragment.appendChild(link)
          fragment.appendChild(document.createTextNode("  "))
        })
        linksContainer.appendChild(fragment)
      }

      // Layout rule:
      // - text + media → media on right (default via CSS)
      // - media-only → center media
      const hasMeta =
        Boolean(project.medium) ||
        Boolean(project.themes) ||
        Boolean(project.technical) ||
        Boolean(project.technology) ||
        Boolean(project.dimensions)
      const hasLinks = Boolean(project.urls && Object.keys(project.urls).length > 0)
      const mediaCount = (project.images?.length || 0) + (project.videos?.length || 0) + (project.bandcampTracks?.length || 0)
      const isMediaOnly = !rawText && !hasMeta && !hasLinks && mediaCount > 0
      document.body.classList.toggle("project-media-only", isMediaOnly)

      const mediaContainer = document.getElementById("project-media")
      if (mediaContainer) {
        const fragment = document.createDocumentFragment()

        const ensureLightbox = () => {
          if (document.getElementById("media-lightbox")) return

          const overlay = document.createElement("div")
          overlay.id = "media-lightbox"
          overlay.className = "media-lightbox"
          overlay.setAttribute("aria-hidden", "true")

          overlay.innerHTML = `
            <div class="media-lightbox-inner" role="dialog" aria-modal="true" aria-label="Image preview">
              <button class="media-lightbox-close" type="button" aria-label="Close">Close</button>
              <img class="media-lightbox-img" alt="">
            </div>
          `

          overlay.addEventListener("click", (e) => {
            if (e.target === overlay) overlay.classList.remove("open")
          })
          overlay.querySelector(".media-lightbox-close")?.addEventListener("click", () => {
            overlay.classList.remove("open")
          })

          document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") overlay.classList.remove("open")
          })

          document.body.appendChild(overlay)
        }

        const openLightbox = (src, alt) => {
          ensureLightbox()
          const overlay = document.getElementById("media-lightbox")
          const img = overlay?.querySelector(".media-lightbox-img")
          if (overlay && img) {
            img.src = src
            img.alt = alt || ""
            overlay.classList.add("open")
          }
        }

        // Videos
        if (project.videos?.length > 0) {
          project.videos.forEach((videoUrl) => {
            if (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be")) {
              let videoId = ""
              if (videoUrl.includes("youtube.com")) {
                const urlParams = new URLSearchParams(videoUrl.split("?")[1])
                videoId = urlParams.get("v")
              } else {
                videoId = videoUrl.split("/").pop().split("?")[0]
              }

              if (videoId) {
                const iframe = document.createElement("iframe")
                iframe.src = `https://www.youtube.com/embed/${videoId}`
                iframe.frameBorder = "0"
                iframe.allow =
                  "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                iframe.allowFullscreen = true
                iframe.loading = "lazy"
                const wrap = document.createElement("div")
                wrap.className = "project-media-item"
                wrap.appendChild(iframe)
                fragment.appendChild(wrap)
              }
            } else {
              const video = document.createElement("video")
              video.src = videoUrl
              video.controls = true
              video.preload = "metadata"
              const wrap = document.createElement("div")
              wrap.className = "project-media-item"
              wrap.appendChild(video)
              fragment.appendChild(wrap)
            }
          })
        }

        // Bandcamp tracks
        if (project.bandcampTracks?.length > 0) {
          project.bandcampTracks.forEach((track) => {
            const iframe = document.createElement("iframe")
            iframe.style.border = "0"
            iframe.style.width = "100%"
            iframe.style.height = "480px"
            iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=large/transparent=false/`
            iframe.seamless = true
            iframe.loading = "lazy"
            const wrap = document.createElement("div")
            wrap.className = "project-media-item"
            wrap.appendChild(iframe)
            fragment.appendChild(wrap)
          })
        }

        if (project.images?.length > 0) {
          project.images.forEach((image) => {
            const btn = document.createElement("button")
            btn.type = "button"
            btn.className = "project-media-image"
            btn.setAttribute("aria-label", "Open image")

            const img = document.createElement("img")
            img.src = image
            img.alt = project.title
            img.loading = "lazy"

            btn.appendChild(img)
            btn.addEventListener("click", () => openLightbox(image, project.title))

            const wrap = document.createElement("div")
            wrap.className = "project-media-item"
            wrap.appendChild(btn)
            fragment.appendChild(wrap)
          })
        }

        mediaContainer.appendChild(fragment)

        // Carousel controls (scroll-snap based)
        const items = Array.from(mediaContainer.querySelectorAll(".project-media-item"))
        if (items.length > 1) {
          const wrapper = document.getElementById("media-gallery-wrapper")
          if (wrapper) {
            const controls = document.createElement("div")
            controls.className = "project-media-controls"

            const nav = document.createElement("div")
            nav.className = "gallery-nav"

            const prevButton = document.createElement("button")
            prevButton.type = "button"
            prevButton.textContent = "← Previous"

            const nextButton = document.createElement("button")
            nextButton.type = "button"
            nextButton.textContent = "Next →"

            nav.appendChild(prevButton)
            nav.appendChild(nextButton)

            const counter = document.createElement("span")
            counter.className = "gallery-counter"

            controls.appendChild(nav)
            controls.appendChild(counter)
            wrapper.appendChild(controls)

            let currentIndex = 0

            const scrollToIndex = (idx) => {
              currentIndex = Math.max(0, Math.min(idx, items.length - 1))
              items[currentIndex].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })
              updateUI()
            }

            const updateUI = () => {
              prevButton.disabled = currentIndex === 0
              nextButton.disabled = currentIndex === items.length - 1
              counter.textContent = `${currentIndex + 1} / ${items.length}`
            }

            // Update currentIndex on manual scroll
            const updateFromScroll = () => {
              const left = mediaContainer.scrollLeft
              let best = 0
              let bestDist = Infinity
              items.forEach((el, idx) => {
                const dist = Math.abs(el.offsetLeft - left)
                if (dist < bestDist) {
                  bestDist = dist
                  best = idx
                }
              })
              if (best !== currentIndex) {
                currentIndex = best
                updateUI()
              }
            }

            let scrollTimer = null
            mediaContainer.addEventListener("scroll", () => {
              if (scrollTimer) clearTimeout(scrollTimer)
              scrollTimer = setTimeout(updateFromScroll, 80)
            })

            prevButton.addEventListener("click", () => scrollToIndex(currentIndex - 1))
            nextButton.addEventListener("click", () => scrollToIndex(currentIndex + 1))

            updateUI()
          }
        }
      }
    } else {
      const article = document.querySelector("article")
      if (article) {
        article.innerHTML = `
          <h1>Project Not Found</h1>
          <p>The project you're looking for doesn't exist.</p>
          <a href="index.html">← Back to Portfolio</a>
        `
      }
    }
  }

  // ============================================
  // TOUCHDESIGNER TUTORIALS PAGE
  // ============================================

  if (document.body.classList.contains("tutorials-page")) {
    const data = window.portfolioData
    const tutorialsList = document.getElementById("tutorials-list")

    if (tutorialsList) {
      const fragment = document.createDocumentFragment()
      const audiodevoutProjects = data.projects.drawings.filter((project) => project.id.startsWith("audiodevout-"))

      audiodevoutProjects.forEach((project) => {
        const li = document.createElement("li")
        const link = document.createElement("a")
        link.href = createProjectUrl(project.id)
        link.textContent = project.title
        li.appendChild(link)
        fragment.appendChild(li)
      })

      tutorialsList.appendChild(fragment)
    }
  }

  // ============================================
  // ASYMMETRICA AUDIO COLLECTION PAGE
  // ============================================

  if (document.body.classList.contains("audio-collection-page")) {
    const data = window.portfolioData
    const audioCollectionList = document.getElementById("audio-collection-list")

    if (audioCollectionList) {
      const fragment = document.createDocumentFragment()
      const asymmetricaProjects = data.projects.soundInstallations.filter((project) =>
        project.id.startsWith("asymmetrica-"),
      )

      asymmetricaProjects.forEach((project) => {
        const card = document.createElement("div")
        card.className = "asymmetrica-item"

        const title = document.createElement("h4")
        title.textContent = project.title

        const desc = document.createElement("p")
        desc.textContent = project.description || ""

        const link = document.createElement("a")
        link.href = createProjectUrl(project.id)
        link.textContent = "Open project →"

        card.appendChild(title)
        if (project.description) card.appendChild(desc)

        // Bandcamp embeds (single-track minimal player; correct size + play button visible)
        if (project.bandcampTracks?.length > 0) {
          project.bandcampTracks.forEach((track) => {
            const iframe = document.createElement("iframe")
            iframe.style.border = "0"
            iframe.style.width = "100%"
            iframe.style.height = "120px"
            iframe.loading = "lazy"
            iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=large/bgcol=000000/linkcol=ffffff/transparent=true/`
            iframe.setAttribute("seamless", "true")
            card.appendChild(iframe)
          })
        }

        card.appendChild(link)
        fragment.appendChild(card)
      })

      audioCollectionList.appendChild(fragment)
    }
  }

  // ============================================
  // SMOOTH SCROLL
  // ============================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})()
