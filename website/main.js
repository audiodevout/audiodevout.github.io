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

// Canvas Animation for Landing Page
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.particles = []
    this.particleCount = 100
    this.mouse = { x: null, y: null, radius: 150 }

    this.resize()
    this.init()

    window.addEventListener("resize", () => this.resize())
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.x
      this.mouse.y = e.y
    })
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  init() {
    this.particles = []
    for (let i = 0; i < this.particleCount; i++) {
      const size = Math.random() * 3 + 1
      const x = Math.random() * this.canvas.width
      const y = Math.random() * this.canvas.height
      const speedX = (Math.random() - 0.5) * 0.5
      const speedY = (Math.random() - 0.5) * 0.5

      this.particles.push({
        x,
        y,
        size,
        speedX,
        speedY,
        baseX: x,
        baseY: y,
      })
    }
  }

  drawParticles() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    for (let i = 0; i < this.particles.length; i++) {
      const particle = this.particles[i]

      // Draw particle
      this.ctx.fillStyle = "rgba(232, 232, 232, 0.5)"
      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fill()

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const particle2 = this.particles[j]
        const dx = particle.x - particle2.x
        const dy = particle.y - particle2.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          this.ctx.strokeStyle = `rgba(232, 232, 232, ${0.2 * (1 - distance / 100)})`
          this.ctx.lineWidth = 0.5
          this.ctx.beginPath()
          this.ctx.moveTo(particle.x, particle.y)
          this.ctx.lineTo(particle2.x, particle2.y)
          this.ctx.stroke()
        }
      }

      // Mouse interaction
      const dx = this.mouse.x - particle.x
      const dy = this.mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < this.mouse.radius) {
        const force = (this.mouse.radius - distance) / this.mouse.radius
        const directionX = dx / distance
        const directionY = dy / distance
        particle.x -= directionX * force * 2
        particle.y -= directionY * force * 2
      } else {
        // Return to base position
        if (particle.x !== particle.baseX) {
          const dx = particle.x - particle.baseX
          particle.x -= dx / 20
        }
        if (particle.y !== particle.baseY) {
          const dy = particle.y - particle.baseY
          particle.y -= dy / 20
        }
      }

      // Move particles
      particle.x += particle.speedX
      particle.y += particle.speedY

      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.speedX *= -1
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.speedY *= -1
      }
    }
  }

  animate() {
    this.drawParticles()
    requestAnimationFrame(() => this.animate())
  }
}

// Landing Page Logic
if (document.body.classList.contains("landing-page")) {
  const canvas = document.getElementById("canvas")
  const particleSystem = new ParticleSystem(canvas)
  particleSystem.animate()

  // Transition to main page after 4 seconds
  setTimeout(() => {
    const overlay = document.querySelector(".landing-overlay")
    overlay.classList.add("fade-out")

    setTimeout(() => {
      window.location.href = "main.html"
    }, 1000)
  }, 4000)
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
    data.projects.drawings.forEach((project) => {
      drawingsList.appendChild(createProjectLink(project, "drawings"))
    })

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
      const itemWidth = 600 + 24 // width + gap
      const itemsPerView = 2

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
