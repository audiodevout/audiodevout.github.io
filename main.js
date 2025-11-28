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
    landing: {
      transitionDelay: 4000,
      particleCount: 40,
      gridSize: 20,
      noiseResolution: 200,
      frameRate: 20,
    },
    gallery: {
      itemWidth: 600,
      gap: 24,
      itemsPerView: 2,
    },
    colors: {
      color1: [255, 255, 255],
      color2: [200, 200, 200],
      color3: [150, 150, 150],
      color4: [100, 100, 100],
      color5: [50, 50, 50],
    },
  }

  // ============================================
  // LANDING PAGE - p5.js Animation
  // ============================================

  if (document.body.classList.contains("landing-page")) {
    const landingState = {
      gridSize: null,
      cols: null,
      rows: null,
      noiseResolution: null,
      flowField: [],
      particles: [],
    }

    const colorPalette = [
      CONFIG.colors.color1,
      0.2,
      CONFIG.colors.color2,
      0.1,
      CONFIG.colors.color3,
      0.3,
      CONFIG.colors.color4,
      0.1,
      CONFIG.colors.color5,
      0.3,
    ]

    const p5 = {
      createCanvas: (...args) => window.createCanvas?.(...args),
      frameRate: (...args) => window.frameRate?.(...args),
      background: (...args) => window.background?.(...args),
      noise: (...args) => window.noise?.(...args),
      random: (...args) => window.random?.(...args),
      createVector: (...args) => window.createVector?.(...args),
      resizeCanvas: (...args) => window.resizeCanvas?.(...args),
      fill: (...args) => window.fill?.(...args),
      noStroke: (...args) => window.noStroke?.(...args),
      stroke: (...args) => window.stroke?.(...args),
      strokeWeight: (...args) => window.strokeWeight?.(...args),
      ellipse: (...args) => window.ellipse?.(...args),
      rect: (...args) => window.rect?.(...args),
      line: (...args) => window.line?.(...args),
      push: (...args) => window.push?.(...args),
      pop: (...args) => window.pop?.(...args),
      translate: (...args) => window.translate?.(...args),
      rotate: (...args) => window.rotate?.(...args),
      radians: (...args) => window.radians?.(...args),
      map: (...args) => window.map?.(...args),
      constrain: (...args) => window.constrain?.(...args),
      rectMode: (...args) => window.rectMode?.(...args),
      get TWO_PI() {
        return window.TWO_PI
      },
      get CENTER() {
        return window.CENTER
      },
      get CORNER() {
        return window.CORNER
      },
      Vector: window.p5?.Vector,
    }

    class Particle {
      constructor(position) {
        this.pos = position
        this.vel = p5.createVector(0, 0)
        this.acc = p5.createVector(0, 0)
        this.radius = p5.random(10, 30)
        this.color = weightedValue(colorPalette)
        this.path = []
        this.maxLength = weightedValue([20, 0.5, 60, 0.5])
        this.finished = false
      }

      update(flowField) {
        const x = p5.constrain(Math.floor(this.pos.x / landingState.gridSize), 0, landingState.rows - 1)
        const y = p5.constrain(Math.floor(this.pos.y / landingState.gridSize), 0, landingState.cols - 1)
        this.acc.add(flowField[x][y])
        this.acc.mult(8)
        this.vel.add(this.acc)
        this.vel.normalize()
        this.vel.mult(5)
        this.pos.add(this.vel)
        this.acc.mult(0)
      }

      display() {
        const pathCoverage = p5.map(this.path.length, 0, this.maxLength, 0, 1)
        if (pathCoverage <= 0.1 || pathCoverage > 0.8) {
          this.color = weightedValue(colorPalette)
        } else {
          this.color = [180, 180, 180]
        }

        if (this.path.length > this.maxLength) {
          this.finished = true
        }

        p5.push()
        p5.rectMode(p5.CENTER)
        p5.translate(this.pos.x, this.pos.y)
        p5.fill(this.color.concat([60]))
        p5.noStroke()
        p5.rotate(this.vel.heading())
        for (let i = 0; i < 50; i++) {
          p5.rotate(p5.radians(p5.random(-2, 2)))
          p5.rect(0, 0, -this.vel.mag() - 2, this.radius)
        }
        p5.rectMode(p5.CORNER)
        p5.pop()
        this.path.push(this.pos.copy())
      }

      tooClose(v) {
        return this.path.some((d) => d.dist(v) < this.radius * 2)
      }
    }

    function weightedValue(array) {
      const randomNumber = p5.random(0, 1)
      let weightSum = 0
      let value
      for (let i = 0; i < array.length; i += 2) {
        value = array[i]
        weightSum += array[i + 1]
        if (randomNumber < weightSum) break
      }
      return value
    }

    function drawGrid() {
      const { rows, cols, gridSize, flowField } = landingState
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const v = flowField[y][x]
          p5.push()
          p5.translate(x * gridSize, y * gridSize)
          p5.fill(20)
          p5.noStroke()
          p5.rect(1, 1, gridSize - 2, gridSize - 2)
          p5.translate(gridSize / 2, gridSize / 2)
          p5.stroke(80)
          p5.strokeWeight(1)
          p5.line(0, 0, (v.x * gridSize) / 2, (v.y * gridSize) / 2)
          p5.pop()
        }
      }
    }

    window.setup = () => {
      const canvas = p5.createCanvas(window.innerWidth, window.innerHeight)
      canvas.parent(document.body)
      canvas.style("position", "fixed")
      canvas.style("top", "0")
      canvas.style("left", "0")
      canvas.style("z-index", "0")
      p5.frameRate(CONFIG.landing.frameRate)
      p5.background(0)

      landingState.gridSize = CONFIG.landing.gridSize
      landingState.noiseResolution = CONFIG.landing.noiseResolution
      landingState.cols = Math.floor(window.innerWidth / landingState.gridSize)
      landingState.rows = Math.floor(window.innerHeight / landingState.gridSize)

      for (let y = 0; y < landingState.rows; y++) {
        landingState.flowField[y] = []
        for (let x = 0; x < landingState.cols; x++) {
          const angle = p5.noise(x / landingState.noiseResolution, y / landingState.noiseResolution) * p5.TWO_PI * 4
          const v = p5.Vector.fromAngle(angle)
          landingState.flowField[y][x] = v
        }
      }

      for (let i = 0; i < CONFIG.landing.particleCount; i++) {
        landingState.particles[i] = new Particle(
          p5.createVector(p5.random(window.innerWidth), p5.random(window.innerHeight)),
        )
      }

      drawGrid()
    }

    window.windowResized = () => {
      p5.resizeCanvas(window.innerWidth, window.innerHeight)
      p5.background(0)
    }

    window.mousePressed = () => {
      landingState.particles.length = 0
      for (let i = 0; i < 20; i++) {
        landingState.particles[i] = new Particle(
          p5.createVector(p5.random(window.innerWidth), p5.random(window.innerHeight)),
        )
      }
    }

    window.draw = () => {
      p5.fill(0, 5)
      p5.noStroke()
      p5.ellipse(p5.random(window.innerWidth), p5.random(window.innerHeight), p5.random(200, 600), p5.random(200, 600))

      for (let i = 0; i < landingState.particles.length; i++) {
        const particle = landingState.particles[i]
        if (particle.finished) continue

        particle.update(landingState.flowField)
        if (landingState.particles.some((p) => p !== particle && p.tooClose(particle.pos))) {
          particle.finished = true
          for (let j = 0; j < 10; j++) {
            const position = p5.createVector(p5.random(window.innerWidth), p5.random(window.innerHeight))
            if (!landingState.particles.some((p) => p.tooClose(position))) {
              landingState.particles.push(new Particle(position))
              break
            }
          }
        } else {
          particle.display()
        }
      }
    }

    // Transition to main page
    setTimeout(() => {
      const overlay = document.querySelector(".landing-overlay")
      if (overlay) {
        overlay.classList.add("fade-out")
      }
      setTimeout(() => {
        window.location.href = "main.html"
      }, 1000)
    }, CONFIG.landing.transitionDelay)
  }

  // ============================================
  // MAIN PAGE
  // ============================================

  if (document.body.classList.contains("main-page")) {
    const data = window.portfolioData

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
            iframe.style.height = "120px"
            iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/`
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
          <a href="main.html">← Back to Portfolio</a>
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
