// Project page loader and sketch manager
// All p5.js sketches are FULL-BACKGROUND and GRAYSCALE-ONLY

class ProjectLoader {
  constructor() {
    this.currentSection = null
    this.currentSketch = null
    this.init()
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search)
    const sectionId = urlParams.get("id") || "introduction"

    this.loadSection(sectionId)
    this.setupNavigation(sectionId)
    this.loadSketch(sectionId)
  }

  loadSection(id) {
    const section = THESIS_DATA.sections.find((s) => s.id === id)
    if (!section) {
      window.location.href = "index.html"
      return
    }

    this.currentSection = section

    // Update page title
    document.title = `${section.title} — Equilibrium`

    // Update content
    document.getElementById("project-label").textContent = section.label
    document.getElementById("project-title").textContent = section.title
    document.getElementById("project-subtitle").textContent = section.subtitle
    document.getElementById("project-body").innerHTML = section.content

    // Update active nav link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
      if (link.href.includes(id)) {
        link.classList.add("active")
      }
    })

    // Load media if available
    this.loadMedia(section.media)

    // Add fade-in animation
    document.querySelector(".project-content").classList.add("fade-in")
  }

  loadMedia(media) {
    const container = document.getElementById("project-media")
    container.innerHTML = ""

    if (!media || media.length === 0) return

    media.forEach((item) => {
      const mediaEl = document.createElement("div")
      mediaEl.className = "media-item"

      if (item.type === "image") {
        mediaEl.innerHTML = `
          <img src="${item.url}" alt="${item.caption || ""}" loading="lazy">
          ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ""}
        `
      } else if (item.type === "video") {
        mediaEl.innerHTML = `
          <iframe src="${item.url}" allowfullscreen></iframe>
          ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ""}
        `
      } else if (item.type === "audio") {
        mediaEl.innerHTML = `
          <audio controls src="${item.url}"></audio>
          ${item.caption ? `<div class="media-caption">${item.caption}</div>` : ""}
        `
      }

      container.appendChild(mediaEl)
    })
  }

  setupNavigation(currentId) {
    const sections = THESIS_DATA.sections
    const currentIndex = sections.findIndex((s) => s.id === currentId)

    const prevBtn = document.getElementById("prev-project")
    const nextBtn = document.getElementById("next-project")

    if (currentIndex > 0) {
      const prev = sections[currentIndex - 1]
      prevBtn.href = `project.html?id=${prev.id}`
      prevBtn.querySelector(".nav-label").textContent = prev.title
    } else {
      prevBtn.classList.add("hidden")
    }

    if (currentIndex < sections.length - 1) {
      const next = sections[currentIndex + 1]
      nextBtn.href = `project.html?id=${next.id}`
      nextBtn.querySelector(".nav-label").textContent = next.title
    } else {
      nextBtn.classList.add("hidden")
    }
  }

  loadSketch(sectionId) {
    const section = THESIS_DATA.sections.find((s) => s.id === sectionId)
    if (!section || !section.sketch) return

    const container = document.getElementById("sketch-container")
    
    // Check for reduced-motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    
    if (prefersReducedMotion) {
      // Show static fallback instead of sketch
      container.innerHTML = `
        <div style="width: 100%; height: 100%; background: #0a0a0a; display: flex; align-items: center; justify-content: center;">
          <p style="color: #808080; font-family: 'Inter', sans-serif; font-size: 14px; opacity: 0.5;">
            Animation disabled (reduced motion)
          </p>
        </div>
      `
      return
    }

    // Map sketch names to functions
    const sketchFunctions = {
      "noise-field": this.noiseFieldSketch,
      "particle-drift": this.particleDriftSketch,
      "glow-particles": this.glowParticlesSketch,
      "recursive-tree": this.recursiveTreeSketch,
      "wave-interference": this.waveInterferenceSketch,
      "sine-cosine-graph": this.sineCosineGraphSketch,
      "particle-path": this.particlePathSketch,
      "orbit-control": this.orbitControlSketch,
      "game-of-life": this.gameOfLifeSketch,
    }

    const sketchFn = sketchFunctions[section.sketch]
    if (sketchFn) {
      // Remove existing canvas if any
      const existingCanvas = container.querySelector("canvas")
      if (existingCanvas) {
        existingCanvas.remove()
      }

      // Create new p5 instance (no color parameter needed - all grayscale)
      this.currentSketch = new p5(sketchFn.bind(this), container)
    }
  }

  // Sketch: Flowing noise field (GRAYSCALE FULL-BACKGROUND)
  noiseFieldSketch(p) {
    const particles = []
    const numParticles = 300

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.noStroke()

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.random(1, 4),
        })
      }
    }

    p.draw = () => {
      p.background(10, 10, 10, 25)

      const time = p.frameCount * 0.008

      particles.forEach((particle) => {
        const noiseVal = p.noise(particle.x * 0.004, particle.y * 0.004, time)
        const angle = noiseVal * p.TWO_PI * 3

        particle.x += p.cos(angle) * 1.2
        particle.y += p.sin(angle) * 1.2

        // Wrap around
        if (particle.x < 0) particle.x = p.width
        if (particle.x > p.width) particle.x = 0
        if (particle.y < 0) particle.y = p.height
        if (particle.y > p.height) particle.y = 0

        const brightness = p.map(noiseVal, 0, 1, 150, 255)
        p.fill(brightness, 180)
        p.ellipse(particle.x, particle.y, particle.size)
      })
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  // Sketch: Drifting particles (GRAYSCALE FULL-BACKGROUND)
  particleDriftSketch(p) {
    const particles = []

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.noStroke()

      for (let i = 0; i < 80; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.random(2, 6),
          speed: p.random(0.3, 1.2),
          phase: p.random(p.TWO_PI),
        })
      }
    }

    p.draw = () => {
      p.background(10, 10, 10, 30)

      particles.forEach((particle) => {
        particle.phase += 0.015
        particle.y -= particle.speed
        particle.x += p.sin(particle.phase) * 0.7

        if (particle.y < -10) {
          particle.y = p.height + 10
          particle.x = p.random(p.width)
        }

        const alpha = p.map(particle.y, 0, p.height, 80, 220)
        p.fill(255, alpha)
        p.ellipse(particle.x, particle.y, particle.size)
      })
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  // Sketch: Glowing particles (GRAYSCALE FULL-BACKGROUND)
  glowParticlesSketch(p) {
    const particles = []

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)

      for (let i = 0; i < 40; i++) {
        particles.push({
          x: p.random(p.width),
          y: p.random(p.height),
          size: p.random(15, 40),
          brightness: p.random(150, 255),
          phase: p.random(p.TWO_PI),
        })
      }
    }

    p.draw = () => {
      p.background(10, 10, 10)
      p.noStroke()

      particles.forEach((particle) => {
        particle.phase += 0.02
        const glow = p.map(p.sin(particle.phase), -1, 1, 0.4, 1)

        // Outer glow layers
        for (let i = 4; i > 0; i--) {
          const alpha = (glow * 30) / i
          p.fill(particle.brightness, alpha)
          p.ellipse(particle.x, particle.y, particle.size * i * 2)
        }

        // Core
        p.fill(255, glow * 200)
        p.ellipse(particle.x, particle.y, particle.size)
      })
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  // Sketch: Recursive tree (GRAYSCALE FULL-BACKGROUND)
  recursiveTreeSketch(p) {
    let angle

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.angleMode(p.DEGREES)
    }

    p.draw = () => {
      p.background(10, 10, 10)
      angle = (p.mouseX / p.width) * 50 + 20

      p.push()
      p.translate(p.width / 2, p.height)
      p.stroke(200)
      p.strokeWeight(3)
      p.line(0, 0, 0, -p.height * 0.25)
      p.translate(0, -p.height * 0.25)

      branch(p.height * 0.25, 0, p)
      p.pop()
    }

    const branch = (h, level, p) => {
      const brightness = p.map(level, 0, 8, 200, 100)
      p.stroke(brightness)
      p.strokeWeight(p.max(1, 4 - level * 0.4))

      h *= 0.66

      if (h > 10) {
        p.push()
        p.rotate(angle)
        p.line(0, 0, 0, -h)
        p.translate(0, -h)
        branch(h, level + 1, p)
        p.pop()

        p.push()
        p.rotate(-angle)
        p.line(0, 0, 0, -h)
        p.translate(0, -h)
        branch(h, level + 1, p)
        p.pop()
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  // Sketch: Wave interference (GRAYSCALE FULL-BACKGROUND)
  waveInterferenceSketch(p) {
    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
    }

    p.draw = () => {
      p.background(10, 10, 10)
      p.noFill()

      const centerY = p.height / 2
      const time = p.frameCount * 0.02

      for (let wave = 0; wave < 8; wave++) {
        p.beginShape()
        const brightness = p.map(wave, 0, 7, 180, 100)
        p.stroke(brightness, 150)
        p.strokeWeight(2)

        for (let x = 0; x < p.width; x += 3) {
          const y1 = p.sin(x * 0.015 + time + wave * 0.5) * 50
          const y2 = p.sin(x * 0.02 - time * 0.4) * 30
          const y = centerY + y1 + y2 + wave * 20 - 80
          p.vertex(x, y)
        }
        p.endShape()
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  // Sketch: Sine/Cosine graph (GRAYSCALE FULL-BACKGROUND)
  sineCosineGraphSketch(p) {
    let circleX, circleY, circleRadius
    let graphX, graphY, graphAmplitude, graphPeriod

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.angleMode(p.DEGREES)

      // Responsive sizing
      circleRadius = p.min(p.width, p.height) * 0.12
      circleX = p.width * 0.25
      circleY = p.height * 0.3
      graphX = p.width * 0.15
      graphY = p.height * 0.75
      graphAmplitude = p.height * 0.12
      graphPeriod = p.width * 0.6
    }

    p.draw = () => {
      p.background(10, 10, 10)

      const angle = p.frameCount % 360

      // Display angle
      p.fill(255)
      p.noStroke()
      p.textSize(16)
      p.textAlign(p.LEFT, p.CENTER)
      p.text(`angle: ${angle}°`, 25, 25)

      // Draw circle
      p.noFill()
      p.stroke(150)
      p.strokeWeight(2)
      p.circle(circleX, circleY, 2 * circleRadius)
      p.line(circleX, circleY - circleRadius, circleX, circleY + circleRadius)
      p.line(circleX - circleRadius, circleY, circleX + circleRadius, circleY)

      // Moving point on circle
      const pointX = circleX + circleRadius * p.cos(angle)
      const pointY = circleY - circleRadius * p.sin(angle)

      p.stroke(180)
      p.line(circleX, circleY, pointX, pointY)

      p.noStroke()
      p.fill(255)
      p.circle(pointX, pointY, 10)

      p.fill(180)
      p.circle(pointX, circleY, 8)
      p.circle(circleX, pointY, 8)

      // Draw graph axes
      p.stroke(120)
      p.strokeWeight(2)
      p.line(graphX, graphY, graphX + graphPeriod, graphY)
      p.line(graphX, graphY - graphAmplitude, graphX, graphY + graphAmplitude)
      p.line(
        graphX + graphPeriod,
        graphY - graphAmplitude,
        graphX + graphPeriod,
        graphY + graphAmplitude
      )

      // Labels
      p.fill(150)
      p.noStroke()
      p.textAlign(p.CENTER, p.CENTER)
      p.textSize(12)
      p.text("0", graphX, graphY + graphAmplitude + 20)
      p.text("360", graphX + graphPeriod, graphY + graphAmplitude + 20)
      p.text("1", graphX - 20, graphY - graphAmplitude)
      p.text("0", graphX - 20, graphY)
      p.text("-1", graphX - 20, graphY + graphAmplitude)

      p.text("cos", graphX + graphPeriod + 40, graphY - graphAmplitude)
      p.text("sin", graphX + graphPeriod + 40, graphY)

      // Draw cosine curve
      p.noFill()
      p.stroke(200)
      p.strokeWeight(2)
      p.beginShape()
      for (let t = 0; t <= 360; t++) {
        const x = p.map(t, 0, 360, graphX, graphX + graphPeriod)
        const y = graphY - graphAmplitude * p.cos(t)
        p.vertex(x, y)
      }
      p.endShape()

      // Draw sine curve
      p.stroke(160)
      p.beginShape()
      for (let t = 0; t <= 360; t++) {
        const x = p.map(t, 0, 360, graphX, graphX + graphPeriod)
        const y = graphY - graphAmplitude * p.sin(t)
        p.vertex(x, y)
      }
      p.endShape()

      // Moving line
      const lineX = p.map(angle, 0, 360, graphX, graphX + graphPeriod)
      p.stroke(100)
      p.strokeWeight(1)
      p.line(lineX, graphY - graphAmplitude, lineX, graphY + graphAmplitude)

      // Moving points on graph
      const cosY = graphY - graphAmplitude * p.cos(angle)
      const sinY = graphY - graphAmplitude * p.sin(angle)

      p.noStroke()
      p.fill(200)
      p.circle(lineX, cosY, 8)
      p.fill(160)
      p.circle(lineX, sinY, 8)
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
      circleRadius = p.min(p.width, p.height) * 0.12
      circleX = p.width * 0.25
      circleY = p.height * 0.3
      graphX = p.width * 0.15
      graphY = p.height * 0.75
      graphAmplitude = p.height * 0.12
      graphPeriod = p.width * 0.6
    }
  }

  // Sketch: Particle path (GRAYSCALE FULL-BACKGROUND)
  particlePathSketch(p) {
    const paths = []
    const particleFadeFrames = 180

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.background(10, 10, 10)

      for (let i = 0; i < 4; i++) {
        createPath(p.random(p.width), p.random(p.height))
      }
    }

    const createPath = (startX, startY) => {
      const path = { particles: [] }
      let x = startX
      let y = startY

      for (let i = 0; i < 60; i++) {
        const angle = p.noise(x * 0.008, y * 0.008) * p.TWO_PI * 3
        const vx = p.cos(angle) * 2
        const vy = p.sin(angle) * 2

        path.particles.push({
          x,
          y,
          vx,
          vy,
          brightness: p.random(150, 255),
          framesRemaining: particleFadeFrames,
        })

        x += vx * 6
        y += vy * 6
      }

      paths.push(path)
    }

    p.draw = () => {
      p.background(10, 10, 10, 15)

      paths.forEach((path) => {
        for (let i = path.particles.length - 1; i >= 0; i--) {
          const particle = path.particles[i]

          particle.x += particle.vx * 0.12
          particle.y += particle.vy * 0.12
          particle.vx *= 0.98
          particle.vy *= 0.98
          particle.framesRemaining--

          if (particle.framesRemaining <= 0) {
            path.particles.splice(i, 1)
            continue
          }

          const opacity = (particle.framesRemaining / particleFadeFrames) * 200
          p.noStroke()
          p.fill(particle.brightness, opacity)
          p.ellipse(particle.x, particle.y, 10)

          // Connection line
          if (i < path.particles.length - 1) {
            const next = path.particles[i + 1]
            p.stroke(particle.brightness, opacity * 0.4)
            p.strokeWeight(1)
            p.line(particle.x, particle.y, next.x, next.y)
          }
        }
      })

      // Regenerate paths
      if (p.frameCount % 120 === 0) {
        createPath(p.random(p.width), p.random(p.height))
      }
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
    }
  }

  // Sketch: 3D orbit control (GRAYSCALE FULL-BACKGROUND)
  orbitControlSketch(p) {
    let rotation = 0
    const cubes = []

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)

      // Create cube positions in circular orbit
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * p.TWO_PI
        cubes.push({
          angle: angle,
          distance: p.min(p.width, p.height) * 0.25,
          size: 20,
        })
      }
    }

    p.draw = () => {
      p.background(10, 10, 10)
      p.translate(p.width / 2, p.height / 2)

      rotation += 0.012

      // Draw cubes in orbit
      cubes.forEach((cube, i) => {
        const x = p.cos(cube.angle + rotation) * cube.distance
        const y = p.sin(cube.angle + rotation) * cube.distance * 0.4
        const z = p.sin(cube.angle + rotation)

        const brightness = p.map(z, -1, 1, 80, 220)
        const size = p.map(z, -1, 1, 12, 28)

        p.noStroke()
        p.fill(brightness)
        p.rectMode(p.CENTER)
        p.rect(x, y, size, size, 3)
      })

      // Center point
      p.fill(255)
      p.ellipse(0, 0, 12)
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
      cubes.forEach((cube) => {
        cube.distance = p.min(p.width, p.height) * 0.25
      })
    }
  }

  // Sketch: Game of Life (GRAYSCALE FULL-BACKGROUND)
  gameOfLifeSketch(p) {
    let cellSize = 15
    let columnCount
    let rowCount
    let currentCells = []
    let nextCells = []

    p.setup = () => {
      p.createCanvas(p.windowWidth, p.windowHeight)
      p.frameRate(8)

      columnCount = p.floor(p.width / cellSize)
      rowCount = p.floor(p.height / cellSize)

      for (let column = 0; column < columnCount; column++) {
        currentCells[column] = []
        nextCells[column] = []
      }

      randomizeBoard()
    }

    const randomizeBoard = () => {
      for (let column = 0; column < columnCount; column++) {
        for (let row = 0; row < rowCount; row++) {
          currentCells[column][row] = p.random([0, 1])
        }
      }
    }

    const generate = () => {
      for (let column = 0; column < columnCount; column++) {
        for (let row = 0; row < rowCount; row++) {
          const left = (column - 1 + columnCount) % columnCount
          const right = (column + 1) % columnCount
          const above = (row - 1 + rowCount) % rowCount
          const below = (row + 1) % rowCount

          const neighbours =
            currentCells[left][above] +
            currentCells[column][above] +
            currentCells[right][above] +
            currentCells[left][row] +
            currentCells[right][row] +
            currentCells[left][below] +
            currentCells[column][below] +
            currentCells[right][below]

          if (neighbours < 2 || neighbours > 3) {
            nextCells[column][row] = 0
          } else if (neighbours === 3) {
            nextCells[column][row] = 1
          } else {
            nextCells[column][row] = currentCells[column][row]
          }
        }
      }

      const temp = currentCells
      currentCells = nextCells
      nextCells = temp
    }

    p.draw = () => {
      generate()

      for (let column = 0; column < columnCount; column++) {
        for (let row = 0; row < rowCount; row++) {
          const cell = currentCells[column][row]
          const brightness = cell * 255

          p.fill(brightness)
          p.stroke(30)
          p.strokeWeight(1)
          p.rect(column * cellSize, row * cellSize, cellSize, cellSize)
        }
      }
    }

    p.mousePressed = () => {
      randomizeBoard()
    }

    p.windowResized = () => {
      p.resizeCanvas(p.windowWidth, p.windowHeight)
      columnCount = p.floor(p.width / cellSize)
      rowCount = p.floor(p.height / cellSize)

      currentCells = []
      nextCells = []
      for (let column = 0; column < columnCount; column++) {
        currentCells[column] = []
        nextCells[column] = []
      }

      randomizeBoard()
    }
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  new ProjectLoader()
})
