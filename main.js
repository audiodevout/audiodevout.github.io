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

  // Compute a lightweight thumbnail path for gallery images.
  // Convention:
  //  - Original: ./assets/images/foo.jpg
  //  - Thumb:    ./assets/images/thumbs/foo.jpg  (25% scale, generated offline)
  //
  // If the thumb is missing, we fall back to the original at runtime.
  const getThumbnailSrc = (src) => {
    if (!src || typeof src !== "string") return src
    // Only rewrite local image paths that live in ./assets/images
    if (!src.startsWith("./assets/images/")) return src
    const withoutPrefix = src.replace("./assets/images/", "")
    return `./assets/images/thumbs/${withoutPrefix}`
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
      const block = document.createElement("article")
      block.className = "exhibition-block"

      const title = document.createElement("h3")
      title.className = "exhibition-block-title"
      title.textContent = exhibition.title

      const meta = document.createElement("p")
      meta.className = "exhibition-block-meta"
      const parts = [
        exhibition.venue,
        exhibition.location,
        exhibition.date,
        exhibition.role,
      ].filter(Boolean)
      meta.textContent = parts.join(" • ")

      block.appendChild(title)
      block.appendChild(meta)

      if (exhibition.description) {
        const desc = document.createElement("div")
        desc.className = "exhibition-block-description"
        const p = document.createElement("p")
        p.textContent = exhibition.description
        desc.appendChild(p)
        block.appendChild(desc)
      }

      const images = Array.isArray(exhibition.images) ? exhibition.images : []
      const videos = Array.isArray(exhibition.videos) ? exhibition.videos : []

      if (images.length > 0 || videos.length > 0) {
        const gallery = document.createElement("div")
        gallery.className = "exhibition-block-gallery work-gallery-grid"

        images.forEach((src) => {
          const item = document.createElement("div")
          item.className = "gallery-item"
          const wrap = document.createElement("div")
          wrap.className = "gallery-item-inner"
          const img = document.createElement("img")
          img.src = src
          img.alt = exhibition.title
          img.loading = "lazy"
          wrap.appendChild(img)
          item.appendChild(wrap)
          gallery.appendChild(item)
        })

        videos.forEach((url) => {
          const item = document.createElement("div")
          item.className = "gallery-item"
          const wrap = document.createElement("div")
          wrap.className = "gallery-item-inner"
          if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = getYoutubeId(url)
            if (videoId) {
              const img = document.createElement("img")
              img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              img.alt = `${exhibition.title} (video)`
              img.loading = "lazy"
              wrap.appendChild(img)
            }
          } else {
            const video = document.createElement("video")
            video.src = url
            video.muted = true
            video.playsInline = true
            video.preload = "metadata"
            wrap.appendChild(video)
          }
          item.appendChild(wrap)
          gallery.appendChild(item)
        })

        block.appendChild(gallery)
      }

      if (exhibition.urls && Object.keys(exhibition.urls).length > 0) {
        const links = document.createElement("div")
        links.className = "exhibition-block-links"
        Object.entries(exhibition.urls).forEach(([label, href]) => {
          const a = document.createElement("a")
          a.href = href
          a.target = "_blank"
          a.rel = "noopener noreferrer"
          a.textContent = label
          links.appendChild(a)
        })
        block.appendChild(links)
      }

      fragment.appendChild(block)
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

  // Dropdown nav groups (for Media section)
  const navGroupToggles = document.querySelectorAll(".nav-group-toggle")
  navGroupToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const group = btn.closest(".nav-group")
      if (!group) return
      group.classList.toggle("open")
    })
  })

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
      tutorialsLink.href = "audiodevout.html"
      tutorialsLink.textContent = "Audiodevout (TouchDesigner)"
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

          // Separate audiodevout (YouTube) from visual explorations in index gallery
          const displayCategory =
            categoryName === "drawings" && project.id && project.id.startsWith("audiodevout-")
              ? "audiodevout"
              : categoryName

          allMediaItems.push({
            project,
            categoryName: displayCategory,
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

      // Group items by category
      const groupedByCategory = new Map()
      allMediaItems.forEach((item) => {
        const cat = item.categoryName
        if (!groupedByCategory.has(cat)) {
          groupedByCategory.set(cat, [])
        }
        groupedByCategory.get(cat).push(item)
      })

      // Define category order for display (audiodevout separate from drawings)
      const categoryOrder = [
        "performance",
        "installations",
        "drawings",
        "audiodevout",
        "soundInstallations",
        "writing",
        "exhibitions",
      ]

      // Get all categories, ordered: first the predefined order, then any others
      const orderedCategories = []
      categoryOrder.forEach((cat) => {
        if (groupedByCategory.has(cat) && groupedByCategory.get(cat).length > 0) {
          orderedCategories.push(cat)
        }
      })
      // Add any remaining categories not in the predefined order
      groupedByCategory.forEach((items, cat) => {
        if (!categoryOrder.includes(cat) && items.length > 0) {
          orderedCategories.push(cat)
        }
      })

      // Create gallery items grouped by category with separators
      let isFirstCategory = true
      orderedCategories.forEach((categoryName) => {
        const categoryItems = groupedByCategory.get(categoryName)

        // Add separator before category (except first)
        if (!isFirstCategory) {
          const separator = document.createElement("div")
          separator.className = "gallery-section-separator"
          separator.setAttribute("aria-hidden", "true")
          fragment.appendChild(separator)
        }
        isFirstCategory = false

        // Add all items from this category
        categoryItems.forEach(({ project, media }) => {
          const item = document.createElement("div")
          item.className = "gallery-item"

          const link = document.createElement("a")
          link.href = createProjectUrl(project.id)

          let thumbEl = null

          if (media.kind === "image") {
            const img = document.createElement("img")

            const thumbSrc = getThumbnailSrc(media.src)
            // Try loading the smaller thumbnail first; if it fails, fall back to the full-res image.
            img.src = thumbSrc || media.src
            img.alt = project.title
            img.loading = "lazy"
            img.decoding = "async"
            img.referrerPolicy = "no-referrer"
            img.onerror = () => {
              if (img.src !== media.src) {
                img.src = media.src
              }
            }

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

          let label = ""
          if (project.category) {
            label = project.category
          } else if (categoryName === "soundInstallations") {
            label = "Asymmetrica Audio Collection"
          } else if (categoryName === "audiodevout") {
            label = "Audiodevout / TouchDesigner"
          } else {
            label = categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
          }

          category.textContent = label

          info.appendChild(title)
          info.appendChild(category)
          if (thumbEl) link.appendChild(thumbEl)
          link.appendChild(info)
          item.appendChild(link)
          fragment.appendChild(item)
        })
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
  // INSTALLATIONS / PERFORMANCE / VISUAL / ARCHIVE PAGES
  // ============================================

  const populateSimpleListPage = (projects, containerId) => {
    const container = document.getElementById(containerId)
    if (!container || !projects || !projects.length) return

    const fragment = document.createDocumentFragment()
    projects.forEach((project) => {
      fragment.appendChild(createProjectLink(project))
    })
    container.appendChild(fragment)
  }

  const populateInstallationsPage = (data) => {
    const container = document.getElementById("installations-list")
    if (!container) return

    const fragment = document.createDocumentFragment()

    data.projects.installations.forEach((project) => {
      const block = document.createElement("article")
      block.className = "installation-block"

      const title = document.createElement("h3")
      title.className = "installation-block-title"
      title.textContent = project.title

      const meta = document.createElement("p")
      meta.className = "installation-block-meta"
      const parts = [project.category, project.dimensions].filter(Boolean)
      meta.textContent = parts.join(" • ")

      block.appendChild(title)
      if (parts.length > 0) block.appendChild(meta)

      if (project.fullDescription || project.description) {
        const desc = document.createElement("div")
        desc.className = "installation-block-description"
        const p = document.createElement("p")
        p.textContent = (project.fullDescription || project.description || "").trim()
        desc.appendChild(p)
        block.appendChild(desc)
      }

      const images = Array.isArray(project.images) ? project.images : []
      const videos = Array.isArray(project.videos) ? project.videos : []

      if (images.length > 0 || videos.length > 0) {
        const gallery = document.createElement("div")
        gallery.className = "installation-block-gallery work-gallery-grid"

        images.forEach((src) => {
          const item = document.createElement("div")
          item.className = "gallery-item"
          const wrap = document.createElement("div")
          wrap.className = "gallery-item-inner"
          const img = document.createElement("img")
          img.src = src
          img.alt = project.title
          img.loading = "lazy"
          img.decoding = "async"
          wrap.appendChild(img)
          item.appendChild(wrap)
          gallery.appendChild(item)
        })

        videos.forEach((url) => {
          const item = document.createElement("div")
          item.className = "gallery-item"
          const wrap = document.createElement("div")
          wrap.className = "gallery-item-inner"
          if (url.includes("youtube.com") || url.includes("youtu.be")) {
            const videoId = getYoutubeId(url)
            if (videoId) {
              const img = document.createElement("img")
              img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              img.alt = `${project.title} (video)`
              img.loading = "lazy"
              wrap.appendChild(img)
            }
          } else {
            const video = document.createElement("video")
            video.src = url
            video.muted = true
            video.playsInline = true
            video.preload = "metadata"
            wrap.appendChild(video)
          }
          item.appendChild(wrap)
          gallery.appendChild(item)
        })

        block.appendChild(gallery)
      }

      if (project.urls && Object.keys(project.urls).length > 0) {
        const links = document.createElement("div")
        links.className = "installation-block-links"
        Object.entries(project.urls).forEach(([label, href]) => {
          const a = document.createElement("a")
          a.href = href
          a.target = "_blank"
          a.rel = "noopener noreferrer"
          a.textContent = label
          links.appendChild(a)
        })
        block.appendChild(links)
      }

      fragment.appendChild(block)
    })

    container.appendChild(fragment)
  }

  if (document.body.classList.contains("installations-page")) {
    const data = window.portfolioData
    if (data) populateInstallationsPage(data)
  }

  if (document.body.classList.contains("performance-page")) {
    const data = window.portfolioData
    if (data) populateSimpleListPage(data.projects.performance, "performance-page-list")
  }

  const populateVisualGallery = (data) => {
    const gallery = document.getElementById("visual-gallery")
    if (!gallery) return

    const fragment = document.createDocumentFragment()
    const projects = data.projects.drawings.filter((project) => !project.id.startsWith("audiodevout-"))

    projects.forEach((project) => {
      const images = Array.isArray(project.images) ? project.images : []
      if (!images[0]) return

      const item = document.createElement("div")
      item.className = "gallery-item"

      const link = document.createElement("a")
      link.href = createProjectUrl(project.id)

      const img = document.createElement("img")
      const thumbSrc = getThumbnailSrc(images[0])
      img.src = thumbSrc || images[0]
      img.alt = project.title
      img.loading = "lazy"
      img.decoding = "async"
      img.referrerPolicy = "no-referrer"
      img.onerror = () => {
        if (img.src !== images[0]) img.src = images[0]
      }

      const info = document.createElement("div")
      info.className = "gallery-item-info"

      const title = document.createElement("h4")
      title.className = "gallery-item-title"
      title.textContent = project.title

      const category = document.createElement("p")
      category.className = "gallery-item-category"
      category.textContent = project.category || "Visual Exploration"

      info.appendChild(title)
      info.appendChild(category)
      link.appendChild(img)
      link.appendChild(info)
      item.appendChild(link)
      fragment.appendChild(item)
    })

    gallery.appendChild(fragment)
  }

  if (document.body.classList.contains("visual-page")) {
    const data = window.portfolioData
    if (data) populateVisualGallery(data)
  }

  if (document.body.classList.contains("archive-page")) {
    const data = window.portfolioData
    if (data) populateSimpleListPage(data.projects.writing, "archive-page-list")
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
  // ABOUT / CONTACT PAGE
  // ============================================

  if (document.body.classList.contains("about-page")) {
    const data = window.portfolioData
    if (data) {
      // About text, contact block, and inline CV on the same page
      populateAbout(data)
      populateContact(data)
      populateCV(data)
    }
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

        // Bandcamp tracks (artwork + play controls visible)
        if (project.bandcampTracks?.length > 0) {
          project.bandcampTracks.forEach((track) => {
            const iframe = document.createElement("iframe")
            iframe.className = "project-bandcamp-embed"
            iframe.style.border = "0"
            iframe.style.width = "100%"
            iframe.style.height = "472px"
            iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=large/transparent=false/`
            iframe.setAttribute("seamless", "true")
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
    const tutorialsGrid = document.getElementById("tutorials-grid")

    if (tutorialsGrid) {
      const fragment = document.createDocumentFragment()
      const audiodevoutProjects = data.projects.drawings.filter((project) => project.id.startsWith("audiodevout-"))

      audiodevoutProjects.forEach((project) => {
        const primaryVideo = Array.isArray(project.videos) && project.videos.length > 0 ? project.videos[0] : null
        if (!primaryVideo) return

        const item = document.createElement("div")
        item.className = "gallery-item"

        const link = document.createElement("a")
        link.href = createProjectUrl(project.id)

        const videoId = getYoutubeId(primaryVideo)
        if (videoId) {
          const img = document.createElement("img")
          img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          img.alt = project.title
          img.loading = "lazy"
          link.appendChild(img)
        }

        const info = document.createElement("div")
        info.className = "gallery-item-info"

        const title = document.createElement("h4")
        title.className = "gallery-item-title"
        title.textContent = project.title

        const category = document.createElement("p")
        category.className = "gallery-item-category"
        category.textContent = "Audiodevout / TouchDesigner"

        info.appendChild(title)
        info.appendChild(category)
        link.appendChild(info)
        item.appendChild(link)
        fragment.appendChild(item)
      })

      tutorialsGrid.appendChild(fragment)
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
        const item = document.createElement("div")
        item.className = "gallery-item gallery-item-bandcamp"

        const link = document.createElement("a")
        link.href = createProjectUrl(project.id)
        link.className = "gallery-item-bandcamp-link"

        const info = document.createElement("div")
        info.className = "gallery-item-info"

        const title = document.createElement("h4")
        title.className = "gallery-item-title"
        title.textContent = project.title

        const category = document.createElement("p")
        category.className = "gallery-item-category"
        category.textContent = "Asymmetrica Audio Collection"

        info.appendChild(title)
        if (project.description) {
          const desc = document.createElement("span")
          desc.textContent = ` • ${project.description}`
          category.appendChild(desc)
        }
        info.appendChild(category)

        link.appendChild(info)

        if (project.bandcampTracks && project.bandcampTracks.length > 0) {
          const track = project.bandcampTracks[0]
          const iframe = document.createElement("iframe")
          iframe.className = "gallery-bandcamp-embed"
          iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=large/transparent=false/`
          iframe.style.border = "0"
          iframe.loading = "lazy"
          iframe.setAttribute("seamless", "true")
          link.insertBefore(iframe, info)
        }

        item.appendChild(link)
        fragment.appendChild(item)
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
