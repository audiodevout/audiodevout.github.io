// Main JavaScript for Portfolio Website

// Utility Functions
const getUrlParameter = (name) => {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get(name)
}

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
}

// ============================================
// CONFIGURATION VARIABLES
// Modify these values to customize behavior
// ============================================

const CONFIG = {
  // Landing page animation settings
  landing: {
    transitionDelay: 4000, // milliseconds before auto-transition to main page
    particleCount: 40, // number of particles in the animation
    gridSize: 20, // size of the flow field grid
    noiseResolution: 200, // resolution of Perlin noise
    frameRate: 20, // animation frame rate
  },

  // Gallery settings
  gallery: {
    itemWidth: 600, // width of each gallery item in pixels
    gap: 24, // gap between gallery items in pixels
    itemsPerView: 2, // number of items visible at once
  },

  // Color palette for landing animation (monochrome)
  colors: {
    color1: [255, 255, 255], // white
    color2: [200, 200, 200], // light gray
    color3: [150, 150, 150], // medium gray
    color4: [100, 100, 100], // dark gray
    color5: [50, 50, 50], // very dark gray
  },
}

// ============================================
// END CONFIGURATION
// ============================================

// Canvas Animation for Landing Page using p5.js
if (document.body.classList.contains("landing-page")) {
  let gridSize, cols, rows
  let noiseResolution
  const flowField = []
  const particles = []

  // Use configured color palette
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

  function setup() {
    const canvas = window.createCanvas(window.innerWidth, window.innerHeight)
    canvas.parent(document.body)
    canvas.style("position", "fixed")
    canvas.style("top", "0")
    canvas.style("left", "0")
    canvas.style("z-index", "0")
    window.frameRate(CONFIG.landing.frameRate)
    window.background(0)

    gridSize = CONFIG.landing.gridSize
    noiseResolution = CONFIG.landing.noiseResolution
    cols = Math.floor(window.innerWidth / gridSize)
    rows = Math.floor(window.innerHeight / gridSize)

    for (let y = 0; y < rows; y++) {
      flowField[y] = []
      for (let x = 0; x < cols; x++) {
        const angle = window.noise(x / noiseResolution, y / noiseResolution) * window.TWO_PI * 4
        const v = window.p5.Vector.fromAngle(angle)
        flowField[y][x] = v
      }
    }

    for (let i = 0; i < CONFIG.landing.particleCount; i++) {
      particles[i] = new Particle(
        window.createVector(window.random(window.innerWidth), window.random(window.innerHeight)),
      )
    }

    drawGrid()
  }

  function windowResized() {
    window.resizeCanvas(window.innerWidth, window.innerHeight)
    window.background(0)
  }

  function mousePressed() {
    particles.length = 0
    for (let i = 0; i < 20; i++) {
      particles[i] = new Particle(
        window.createVector(window.random(window.innerWidth), window.random(window.innerHeight)),
      )
    }
  }

  function draw() {
    window.fill(0, 5)
    window.noStroke()
    window.ellipse(
      window.random(window.innerWidth),
      window.random(window.innerHeight),
      window.random(200, 600),
      window.random(200, 600),
    )

    for (let i = 0; i < particles.length; i++) {
      if (particles[i].finished) {
        continue
      }

      particles[i].update(flowField)
      if (particles.some((p) => p != particles[i] && p.tooClose(particles[i].pos))) {
        particles[i].finished = true
        for (let j = 0; j < 10; j++) {
          const position = window.createVector(window.random(window.innerWidth), window.random(window.innerHeight))
          if (!particles.some((p) => p.tooClose(position))) {
            const p = new Particle(position)
            particles.push(p)
            break
          }
        }
      } else {
        particles[i].display()
      }
    }
  }

  function drawGrid() {
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const v = flowField[y][x]
        window.push()
        window.translate(x * gridSize, y * gridSize)
        window.fill(20)
        window.noStroke()
        window.rect(1, 1, gridSize - 2, gridSize - 2)
        window.translate(gridSize / 2, gridSize / 2)
        window.stroke(80)
        window.strokeWeight(1)
        window.line(0, 0, (v.x * gridSize) / 2, (v.y * gridSize) / 2)
        window.pop()
      }
    }
  }

  class Particle {
    constructor(position) {
      this.pos = position
      this.vel = window.createVector(0, 0)
      this.acc = window.createVector(0, 0)
      this.radius = window.random(10, 30)
      this.color = weightedValue(colorPalette)
      this.path = []
      this.maxLength = weightedValue([20, 0.5, 60, 0.5])
    }

    update(flowField) {
      const x = window.constrain(Math.floor(this.pos.x / gridSize), 0, rows - 1)
      const y = window.constrain(Math.floor(this.pos.y / gridSize), 0, cols - 1)
      this.acc.add(flowField[x][y])
      this.acc.mult(8)
      this.vel.add(this.acc)
      this.vel.normalize()
      this.vel.mult(5)
      this.pos.add(this.vel)
      this.acc.mult(0)
    }

    display() {
      const pathCoverage = window.map(this.path.length, 0, this.maxLength, 0, 1)
      if (pathCoverage <= 0.1 || pathCoverage > 0.8) {
        this.color = weightedValue(colorPalette)
      } else {
        this.color = [180, 180, 180] // center gray
      }

      if (this.path.length > this.maxLength) {
        this.finished = true
      }

      window.push()
      window.rectMode(window.CENTER)
      window.translate(this.pos.x, this.pos.y)
      window.fill(this.color.concat([60]))
      window.noStroke()
      window.rotate(this.vel.heading())
      for (let i = 0; i < 50; i++) {
        window.rotate(window.radians(window.random(-2, 2)))
        window.rect(0, 0, -this.vel.mag() - 2, this.radius)
      }
      window.rectMode(window.CORNER)
      window.pop()
      this.path.push(this.pos.copy())
    }

    tooClose(v) {
      return this.path.some((d) => d.dist(v) < this.radius * 2)
    }
  }

  function weightedValue(array) {
    let randomNumber = window.random(0, 1),
      weightSum = 0,
      value
    for (let i = 0; i < array.length; i += 2) {
      value = array[i]
      weightSum += array[i + 1]
      if (randomNumber < weightSum) break
    }
    return value
  }

  // Transition to main page after configured delay
  setTimeout(() => {
    const overlay = document.querySelector(".landing-overlay")
    overlay.classList.add("fade-out")

    setTimeout(() => {
      window.location.href = "main.html"
    }, 1000)
  }, CONFIG.landing.transitionDelay)
}

// Main Page Logic
if (document.body.classList.contains("main-page")) {
  const data = window.portfolioData

  // Populate About Section
  const populateAbout = () => {
    const aboutImage = document.getElementById("about-image")
    const aboutDescription = document.getElementById("about-description")
    const aboutCredentials = document.getElementById("about-credentials")

    aboutImage.src = data.contact.about.image
    aboutImage.alt = data.contact.about.title
    aboutDescription.textContent = data.contact.about.description

    data.contact.about.credentials.forEach((credential) => {
      const li = document.createElement("li")
      li.textContent = credential
      aboutCredentials.appendChild(li)
    })
  }

  const createProjectLink = (project, category) => {
    const li = document.createElement("li")
    const link = document.createElement("a")
    link.href = `project.html?id=${project.id}&category=${category}`
    link.textContent = project.title
    li.appendChild(link)
    return li
  }

  // Populate Work Section
  const populateWork = () => {
    const installationsList = document.getElementById("installations-list")
    data.projects.installations.forEach((project) => {
      installationsList.appendChild(createProjectLink(project, "installations"))
    })

    const soundList = document.getElementById("sound-list")
    data.projects.soundInstallations.forEach((project) => {
      soundList.appendChild(createProjectLink(project, "soundInstallations"))
    })

    const performanceList = document.getElementById("performance-list")
    data.projects.performance.forEach((project) => {
      performanceList.appendChild(createProjectLink(project, "performance"))
    })

    const drawingsList = document.getElementById("drawings-list")

    // Filter out audiodevout projects from drawings
    const nonAudiodevoutDrawings = data.projects.drawings.filter((project) => !project.id.startsWith("audiodevout-"))

    nonAudiodevoutDrawings.forEach((project) => {
      drawingsList.appendChild(createProjectLink(project, "drawings"))
    })

    // Add single link to TouchDesigner Tutorials page
    const tutorialsLi = document.createElement("li")
    const tutorialsLink = document.createElement("a")
    tutorialsLink.href = "touchdesigner-tutorials.html"
    tutorialsLink.textContent = "TouchDesigner Tutorials"
    tutorialsLi.appendChild(tutorialsLink)
    drawingsList.appendChild(tutorialsLi)

    const writingList = document.getElementById("writing-list")
    data.projects.writing.forEach((project) => {
      writingList.appendChild(createProjectLink(project, "writing"))
    })
  }

  // Populate CV Section
  const populateCV = () => {
    // Work Experience
    const workExperience = document.getElementById("work-experience")
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
      workExperience.appendChild(item)
    })

    // Education
    const education = document.getElementById("education")
    data.contact.cv.education.forEach((edu) => {
      const item = document.createElement("div")
      item.innerHTML = `
        <h4>${edu.degree}</h4>
        <p>${edu.institution}</p>
        <p>${edu.location} • ${edu.period}</p>
      `
      education.appendChild(item)
    })

    // Skills
    const skills = document.getElementById("skills")

    const generalSkills = document.createElement("div")
    generalSkills.innerHTML = `
      <h4>General Skills</h4>
      <p>${data.contact.cv.skills.general.join(", ")}</p>
    `
    skills.appendChild(generalSkills)

    const technologies = document.createElement("div")
    technologies.innerHTML = `
      <h4>Technologies</h4>
      <p>${data.contact.cv.skills.technologies.join(", ")}</p>
    `
    skills.appendChild(technologies)

    const interests = document.createElement("div")
    interests.innerHTML = `
      <h4>Interests</h4>
      <p>${data.contact.cv.skills.interests.join(", ")}</p>
    `
    skills.appendChild(interests)
  }

  // Populate Contact Section
  const populateContact = () => {
    const contactDescription = document.getElementById("contact-description")
    const socialLinks = document.getElementById("social-links")

    contactDescription.textContent = data.contact.description

    data.contact.social.forEach((social) => {
      const link = document.createElement("a")
      link.href = social.url
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      link.textContent = social.name
      socialLinks.appendChild(link)

      // Add separator
      if (data.contact.social.indexOf(social) < data.contact.social.length - 1) {
        socialLinks.appendChild(document.createTextNode(" • "))
      }
    })
  }

  // Initialize Main Page
  populateAbout()
  populateWork()
  populateCV()
  populateContact()
}

// Project Detail Page Logic
if (document.body.classList.contains("project-page")) {
  const projectId = getUrlParameter("id")
  const category = getUrlParameter("category")
  const data = window.portfolioData

  let project = null
  if (category && data.projects[category]) {
    project = data.projects[category].find((p) => p.id === projectId)
  }

  if (project) {
    document.title = `${project.title} - Atharva Gupta`

    document.getElementById("project-title").textContent = project.title
    document.getElementById("project-category").textContent = project.category || category

    const descriptionContainer = document.getElementById("project-description")
    const description = document.createElement("p")
    description.textContent = project.fullDescription || project.description
    descriptionContainer.appendChild(description)

    const metaContainer = document.getElementById("project-meta")
    const metaFields = [
      { label: "Medium", value: project.medium },
      { label: "Themes", value: project.themes },
      { label: "Technical", value: project.technical },
      { label: "Technology", value: project.technology },
      { label: "Dimensions", value: project.dimensions },
    ]

    metaFields.forEach((field) => {
      if (field.value) {
        const metaItem = document.createElement("p")
        metaItem.innerHTML = `<strong>${field.label}:</strong> ${field.value}`
        metaContainer.appendChild(metaItem)
      }
    })

    const linksContainer = document.getElementById("project-links")
    if (project.urls) {
      Object.entries(project.urls).forEach(([label, url]) => {
        const link = document.createElement("a")
        link.href = url
        link.target = "_blank"
        link.rel = "noopener noreferrer"
        link.textContent = `View ${label.toUpperCase()}`
        linksContainer.appendChild(link)

        const entries = Object.entries(project.urls)
        if (entries.indexOf([label, url]) < entries.length - 1) {
          linksContainer.appendChild(document.createTextNode(" • "))
        }
      })
    }

    const mediaContainer = document.getElementById("project-media")
    let totalMediaItems = 0

    if (project.videos && project.videos.length > 0) {
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
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            iframe.allowFullscreen = true
            mediaContainer.appendChild(iframe)
            totalMediaItems++
          }
        } else {
          const video = document.createElement("video")
          video.src = videoUrl
          video.controls = true
          mediaContainer.appendChild(video)
          totalMediaItems++
        }
      })
    }

    // Bandcamp tracks
    if (project.bandcampTracks && project.bandcampTracks.length > 0) {
      project.bandcampTracks.forEach((track) => {
        const iframe = document.createElement("iframe")
        iframe.style.border = "0"
        iframe.style.width = "100%"
        iframe.style.height = "120px"
        iframe.src = `https://bandcamp.com/EmbeddedPlayer/track=${track.trackId}/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/artwork=small/transparent=true/`
        iframe.seamless = true
        mediaContainer.appendChild(iframe)
        totalMediaItems++
      })
    }

    // Images
    if (project.images && project.images.length > 0) {
      project.images.forEach((image) => {
        const img = document.createElement("img")
        img.src = image
        img.alt = project.title
        mediaContainer.appendChild(img)
        totalMediaItems++
      })
    }

    if (totalMediaItems > 2) {
      const navContainer = document.createElement("div")
      navContainer.className = "gallery-nav"

      const prevButton = document.createElement("button")
      prevButton.textContent = "← Previous"
      prevButton.id = "gallery-prev"

      const counter = document.createElement("span")
      counter.className = "gallery-counter"
      counter.id = "gallery-counter"
      counter.textContent = "1-2 of " + totalMediaItems

      const nextButton = document.createElement("button")
      nextButton.textContent = "Next →"
      nextButton.id = "gallery-next"

      navContainer.appendChild(prevButton)
      navContainer.appendChild(counter)
      navContainer.appendChild(nextButton)

      const wrapper = document.getElementById("media-gallery-wrapper")
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
  } else {
    document.querySelector("article").innerHTML = `
      <h1>Project Not Found</h1>
      <p>The project you're looking for doesn't exist.</p>
      <a href="main.html">← Back to Portfolio</a>
    `
  }
}

// TouchDesigner Tutorials Page Logic
if (document.body.classList.contains("tutorials-page")) {
  const data = window.portfolioData
  const tutorialsList = document.getElementById("tutorials-list")

  // Get all audiodevout projects from drawings category
  const audiodevoutProjects = data.projects.drawings.filter((project) => project.id.startsWith("audiodevout-"))

  audiodevoutProjects.forEach((project) => {
    const li = document.createElement("li")
    const link = document.createElement("a")
    link.href = `project.html?id=${project.id}&category=drawings`
    link.textContent = project.title
    li.appendChild(link)
    tutorialsList.appendChild(li)
  })
}

// Smooth scroll behavior
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
