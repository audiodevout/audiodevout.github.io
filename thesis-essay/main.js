// Constellation particle system for thesis home page
// Text-based particles (no colored dots) with reduced repulsion for click functionality

class Particle {
  constructor(section, canvas) {
    this.section = section
    this.canvas = canvas
    this.baseX = section.position.x * canvas.width
    this.baseY = section.position.y * canvas.height
    this.x = this.baseX
    this.y = this.baseY
    this.vx = 0
    this.vy = 0
    
    // Use section label for text display
    this.label = section.label || section.title
    this.fontSize = section.id === "equilibrium" ? 18 : 14
    this.hovered = false
    this.glowPhase = Math.random() * Math.PI * 2
    this.driftPhase = Math.random() * Math.PI * 2
    
    // Calculate text dimensions for hit detection
    this.updateTextDimensions(canvas.getContext("2d"))
  }

  updateTextDimensions(ctx) {
    ctx.font = `${this.fontSize}px "Inter", sans-serif`
    const metrics = ctx.measureText(this.label)
    this.textWidth = metrics.width
    this.textHeight = this.fontSize
  }

  update(mouseX, mouseY, config) {
    // Drift animation using Perlin-like noise
    this.driftPhase += 0.008
    const driftX = Math.sin(this.driftPhase) * config.particleDrift * 15
    const driftY = Math.cos(this.driftPhase * 0.7) * config.particleDrift * 12

    // Target position with drift
    let targetX = this.baseX + driftX
    let targetY = this.baseY + driftY

    // REDUCED cursor repulsion for better clickability
    const dx = this.x - mouseX
    const dy = this.y - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)

    // Much smaller repulsion radius and force
    const repulsionRadius = config.cursorRepulsion * 0.5
    if (dist < repulsionRadius && dist > 0) {
      const force = (repulsionRadius - dist) / repulsionRadius
      // Reduced repulsion force from 30 to 10
      targetX += (dx / dist) * force * 10
      targetY += (dy / dist) * force * 10
    }

    // Smooth movement with spring physics
    this.vx += (targetX - this.x) * 0.04
    this.vy += (targetY - this.y) * 0.04
    this.vx *= 0.85
    this.vy *= 0.85
    this.x += this.vx
    this.y += this.vy

    // Glow animation
    this.glowPhase += 0.015
  }

  draw(ctx, config) {
    const glowIntensity = config.glowIntensity * (0.6 + 0.4 * Math.sin(this.glowPhase))
    
    // Set font with weight hierarchy
    const fontWeight = this.hovered ? 600 : (this.section.id === "equilibrium" ? 500 : 400)
    ctx.font = `${fontWeight} ${this.fontSize}px "Inter", sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw text glow (grayscale only)
    if (this.hovered) {
      ctx.shadowBlur = 30
      ctx.shadowColor = "rgba(255, 255, 255, 0.8)"
    } else {
      ctx.shadowBlur = 15
      ctx.shadowColor = `rgba(255, 255, 255, ${glowIntensity * 0.4})`
    }

    // Draw the text label itself
    ctx.fillStyle = this.hovered ? "#ffffff" : `rgba(255, 255, 255, ${0.7 + glowIntensity * 0.3})`
    ctx.fillText(this.label, this.x, this.y)

    // Reset shadow
    ctx.shadowBlur = 0
  }

  contains(x, y) {
    // More generous hit area for text-based particles
    const padding = 10
    return (
      x >= this.x - this.textWidth / 2 - padding &&
      x <= this.x + this.textWidth / 2 + padding &&
      y >= this.y - this.textHeight / 2 - padding &&
      y <= this.y + this.textHeight / 2 + padding
    )
  }
}

class ConstellationSystem {
  constructor() {
    this.canvas = document.getElementById("constellation-canvas")
    this.ctx = this.canvas.getContext("2d")
    this.particles = []
    this.mouseX = -1000 // Start offscreen
    this.mouseY = -1000
    this.config = THESIS_DATA.config
    this.tooltip = document.getElementById("tooltip")
    this.hoveredParticle = null
    
    // Check for reduced-motion preference
    this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    this.init()
  }

  init() {
    this.resize()
    this.createParticles()
    this.addEventListeners()
    
    // Draw static frame if reduced motion, otherwise animate
    if (this.prefersReducedMotion) {
      this.drawStaticFrame()
    } else {
      this.animate()
    }
  }

  drawStaticFrame() {
    // Render a single static frame for reduced-motion users
    this.ctx.fillStyle = "#0a0a0a"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.drawBackground()
    this.drawConnections()
    this.particles.forEach((p) => {
      p.draw(this.ctx, this.config)
    })
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    // Update particle positions on resize
    this.particles.forEach((p) => {
      p.baseX = p.section.position.x * this.canvas.width
      p.baseY = p.section.position.y * this.canvas.height
      p.updateTextDimensions(this.ctx)
    })
  }

  createParticles() {
    this.particles = THESIS_DATA.sections.map((section) => new Particle(section, this.canvas))
  }

  addEventListeners() {
    window.addEventListener("resize", () => this.resize())

    this.canvas.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      this.checkHover()
    })

    this.canvas.addEventListener("click", (e) => {
      const clicked = this.particles.find((p) => p.contains(e.clientX, e.clientY))
      if (clicked) {
        this.navigateToProject(clicked.section.id)
      }
    })

    this.canvas.addEventListener("mouseleave", () => {
      this.mouseX = -1000
      this.mouseY = -1000
      this.hideTooltip()
    })
  }

  checkHover() {
    let foundHover = false

    this.particles.forEach((p) => {
      if (p.contains(this.mouseX, this.mouseY)) {
        p.hovered = true
        foundHover = true
        this.hoveredParticle = p
        this.showTooltip(p)
        this.canvas.style.cursor = "pointer"
      } else {
        p.hovered = false
      }
    })

    if (!foundHover) {
      this.hoveredParticle = null
      this.hideTooltip()
      this.canvas.style.cursor = "default"
    }
  }

  showTooltip(particle) {
    this.tooltip.innerHTML = `
      <strong>${particle.section.title}</strong><br>
      <span style="color: #b0b0b0;">${particle.section.subtitle}</span>
    `
    this.tooltip.style.left = `${particle.x + 20}px`
    this.tooltip.style.top = `${particle.y - 10}px`
    this.tooltip.classList.add("visible")
  }

  hideTooltip() {
    this.tooltip.classList.remove("visible")
  }

  navigateToProject(id) {
    const overlay = document.getElementById("transition-overlay")
    overlay.classList.add("active")

    setTimeout(() => {
      window.location.href = `project.html?id=${id}`
    }, this.config.transitionDuration)
  }

  drawConnections() {
    // Draw lines between nearby particles (grayscale only)
    this.particles.forEach((p1, i) => {
      this.particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x
        const dy = p1.y - p2.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < this.config.connectionDistance) {
          const opacity = (1 - dist / this.config.connectionDistance) * 0.12
          this.ctx.beginPath()
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
          this.ctx.lineWidth = 0.5
          this.ctx.stroke()
        }
      })
    })
  }

  drawBackground() {
    // Pure black background with subtle gray gradient
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width * 0.5,
      this.canvas.height * 0.4,
      0,
      this.canvas.width * 0.5,
      this.canvas.height * 0.4,
      this.canvas.width * 0.7,
    )
    gradient.addColorStop(0, "#0f0f0f")
    gradient.addColorStop(1, "#0a0a0a")

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  animate() {
    // Clear canvas with deep black
    this.ctx.fillStyle = "#0a0a0a"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Subtle background
    this.drawBackground()

    // Draw connections
    this.drawConnections()

    // Update and draw particles (text labels)
    this.particles.forEach((p) => {
      // Only animate if motion is allowed
      if (!this.prefersReducedMotion) {
        p.update(this.mouseX, this.mouseY, this.config)
      }
      p.draw(this.ctx, this.config)
    })

    // Continue animation loop only if motion is allowed
    if (!this.prefersReducedMotion) {
      requestAnimationFrame(() => this.animate())
    }
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  new ConstellationSystem()
})
