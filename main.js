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

  if (document.body.classList.contains("main-page")) {
    const data = window.portfolioData

    // ============================================
    // GALLERY GRID - All project images
    // ============================================
    const populateGallery = () => {
      const galleryGrid = document.getElementById("gallery-grid")
      if (!galleryGrid) return

      const fragment = document.createDocumentFragment()
      const allProjects = []

      // Collect all projects with images
      const categories = ["installations", "performance", "drawings"]
      categories.forEach((category) => {
        if (data.projects[category]) {
          data.projects[category].forEach((project) => {
            if (project.images && project.images.length > 0) {
              allProjects.push({
                ...project,
                categoryName: category,
              })
            }
          })
        }
      })

      // Create gallery items
      allProjects.forEach((project) => {
        const item = document.createElement("div")
        item.className = "gallery-item"

        const link = document.createElement("a")
        link.href = createProjectUrl(project.id)

        const img = document.createElement("img")
        img.src = project.images[0]
        img.alt = project.title
        img.loading = "lazy"

        const info = document.createElement("div")
        info.className = "gallery-item-info"

        const title = document.createElement("h4")
        title.className = "gallery-item-title"
        title.textContent = project.title

        const category = document.createElement("p")
        category.className = "gallery-item-category"
        category.textContent = project.categoryName.charAt(0).toUpperCase() + project.categoryName.slice(1)

        info.appendChild(title)
        info.appendChild(category)
        link.appendChild(img)
        link.appendChild(info)
        item.appendChild(link)
        fragment.appendChild(item)
      })

      galleryGrid.appendChild(fragment)
    }

    const populateAbout = () => {
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

    const createProjectLink = (project) => {
      const li = document.createElement("li")
      const link = document.createElement("a")
      link.href = createProjectUrl(project.id)
      link.textContent = project.title
      li.appendChild(link)
      return li
    }

    const populateWork = () => {
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

    const populateExhibitions = () => {
      const exhibitionsContainer = document.getElementById("exhibitions-list")
      if (!exhibitionsContainer) return

      const separator = "&nbsp;&nbsp;•&nbsp;&nbsp;"
      const fragment = document.createDocumentFragment()

      data.exhibitions.forEach((exhibition) => {
        const item = document.createElement("div")
        item.className = "exhibition-item"

        let line = exhibition.id
          ? `<a href="project.html?id=${exhibition.id}">${exhibition.title}</a>`
          : exhibition.title

        line += `${separator}${exhibition.venue}${separator}${exhibition.location}${separator}${exhibition.date}`

        item.innerHTML = `<p>${line}</p>`
        fragment.appendChild(item)
      })

      exhibitionsContainer.appendChild(fragment)
    }

    const populateCV = () => {
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
              ${job.responsibilities.map((resp) => `<li>${resp}</li>`).join("")}
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

    const populateContact = () => {
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

    // Initialize Main Page
    populateGallery()
    populateAbout()
    populateWork()
    populateExhibitions()
    populateCV()
    populateContact()
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
      if (descriptionContainer) {
        const description = document.createElement("p")
        description.textContent = project.fullDescription || project.description
        descriptionContainer.appendChild(description)
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

      const mediaContainer = document.getElementById("project-media")
      if (mediaContainer) {
        let totalMediaItems = 0
        const fragment = document.createDocumentFragment()

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
                fragment.appendChild(iframe)
                totalMediaItems++
              }
            } else {
              const video = document.createElement("video")
              video.src = videoUrl
              video.controls = true
              video.preload = "metadata"
              fragment.appendChild(video)
              totalMediaItems++
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
            fragment.appendChild(iframe)
            totalMediaItems++
          })
        }

        if (project.images?.length > 0) {
          project.images.forEach((image) => {
            const img = document.createElement("img")
            img.src = image
            img.alt = project.title
            img.loading = "lazy"
            fragment.appendChild(img)
            totalMediaItems++
          })
        }

        mediaContainer.appendChild(fragment)

        // Gallery navigation
        if (totalMediaItems > 2) {
          const navContainer = document.createElement("div")
          navContainer.className = "gallery-nav"

          const prevButton = document.createElement("button")
          prevButton.textContent = "← Previous"
          prevButton.id = "gallery-prev"

          const counter = document.createElement("span")
          counter.className = "gallery-counter"
          counter.id = "gallery-counter"
          counter.textContent = `1-2 of ${totalMediaItems}`

          const nextButton = document.createElement("button")
          nextButton.textContent = "Next →"
          nextButton.id = "gallery-next"

          navContainer.appendChild(prevButton)
          navContainer.appendChild(counter)
          navContainer.appendChild(nextButton)

          const wrapper = document.getElementById("media-gallery-wrapper")
          if (wrapper) {
            wrapper.appendChild(navContainer)

            let currentPosition = 0
            const itemWidth = CONFIG.gallery.itemWidth + CONFIG.gallery.gap
            const itemsPerView = CONFIG.gallery.itemsPerView

            const updateButtons = () => {
              prevButton.disabled = currentPosition === 0
              nextButton.disabled = currentPosition >= totalMediaItems - itemsPerView

              const startItem = currentPosition + 1
              const endItem = Math.min(currentPosition + itemsPerView, totalMediaItems)
              counter.textContent = `${startItem}-${endItem} of ${totalMediaItems}`
            }

            prevButton.addEventListener("click", () => {
              if (currentPosition > 0) {
                currentPosition -= itemsPerView
                if (currentPosition < 0) currentPosition = 0
                mediaContainer.scrollLeft = currentPosition * itemWidth
                updateButtons()
              }
            })

            nextButton.addEventListener("click", () => {
              if (currentPosition < totalMediaItems - itemsPerView) {
                currentPosition += itemsPerView
                mediaContainer.scrollLeft = currentPosition * itemWidth
                updateButtons()
              }
            })

            updateButtons()
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
        const li = document.createElement("li")
        const link = document.createElement("a")
        link.href = createProjectUrl(project.id)
        link.textContent = project.title
        li.appendChild(link)
        fragment.appendChild(li)
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
