/* particles.js - Background Particle System (Mobile Optimized)
 *
 * PURPOSE: Floating particles with dynamic links and mouse interaction
 * Optimized for mobile performance with adaptive particle counts and effects
 *
 * ============================================================================
 * MOBILE-OPTIMIZED PARAMETERS - Automatically adjusts based on device
 * ============================================================================
 */

// PERFORMANCE SETTINGS - Automatically scaled based on device capabilities
const PERFORMANCE_PROFILES = {
  mobile: {
    maxParticles: 50, // Reduced for mobile performance
    connectionDistance: 150, // Shorter connections
    mouseInfluence: 80, // Smaller influence radius
    enableConnections: false, // Disable connections on mobile
    animationQuality: "low", // Reduced animation quality
    updateFrequency: 30, // 30fps instead of 60fps
  },
  tablet: {
    maxParticles: 100,
    connectionDistance: 180,
    mouseInfluence: 90,
    enableConnections: true,
    animationQuality: "medium",
    updateFrequency: 45,
  },
  desktop: {
    maxParticles: 250,
    connectionDistance: 400,
    mouseInfluence: 100,
    enableConnections: true,
    animationQuality: "high",
    updateFrequency: 60,
  },
}

// VISUAL SETTINGS
const PARTICLE_COLORS = [
  "rgba(255, 149, 71, 1)", // saffron
  "rgba(0, 149, 255, 1)", // cerulean
  "rgba(255, 71, 172, 1)", // neon-magenta
  "rgba(173, 255, 71, 1)", // electric-lime
]

const CONNECTION_COLOR = "rgba(255,255,255,1)"
const PARTICLE_SIZE_RANGE = { min: 2.1, max: 3.5 }
const PARTICLE_SPEED_RANGE = { min: 0.2, max: 1.2 }
const PARTICLE_LIFE_RANGE = { min: 10000, max: 20000 }

// PHYSICS SETTINGS
const VELOCITY_DAMPING = 0.99 // Particle velocity decay
const MOUSE_FORCE_STRENGTH = 0.2 // Mouse interaction force
const BOUNDARY_BEHAVIOR = "wrap" // 'wrap' or 'bounce'

/* ============================================================================
 * END OF CONFIGURABLE PARAMETERS
 * ============================================================================ */

class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")
    this.particles = []

    // Detect device capabilities and set performance profile
    this.deviceProfile = this.detectDeviceProfile()
    this.performanceSettings = PERFORMANCE_PROFILES[this.deviceProfile]

    // Apply user options with performance profile defaults
    this.config = {
      ...this.performanceSettings,
      ...options,
    }

    // Visual settings
    this.colors = PARTICLE_COLORS
    this.connectionColor = CONNECTION_COLOR

    // Animation state
    this.animationFrame = null
    this.mouse = { x: 0, y: 0 }
    this.isRunning = false
    this.lastFrameTime = 0
    this.frameInterval = 1000 / this.config.updateFrequency

    // Performance monitoring
    this.frameCount = 0
    this.lastFPSCheck = 0
    this.currentFPS = 0
    this.adaptiveQuality = true

    try {
      this.init()
    } catch (error) {
      console.error("ParticleSystem initialization failed:", error)
    }
  }

  /**
   * Detect device capabilities for performance optimization
   */
  detectDeviceProfile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      return "mobile" // Use lowest performance profile
    }

    // Check device memory if available
    const deviceMemory = navigator.deviceMemory || 4
    const hardwareConcurrency = navigator.hardwareConcurrency || 4

    if (isMobile || deviceMemory < 4 || hardwareConcurrency < 4) {
      return "mobile"
    } else if (isTablet || deviceMemory < 8) {
      return "tablet"
    } else {
      return "desktop"
    }
  }

  init() {
    this.updateSize()
    this.createParticles()
    this.bindEvents()

    console.log(`ParticleSystem initialized with ${this.deviceProfile} profile:`, this.config)
  }

  updateSize() {
    if (!this.canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap DPR for performance
    const rect = this.canvas.getBoundingClientRect()

    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr
    this.canvas.style.width = rect.width + "px"
    this.canvas.style.height = rect.height + "px"

    this.ctx.setTransform(1, 0, 0, 1, 0, 0) // reset transform
    this.ctx.scale(dpr, dpr)

    // Update context settings for performance
    this.setupContext()
  }

  setupContext() {
    this.ctx.lineCap = "round"
    this.ctx.lineJoin = "round"

    // Optimize rendering based on quality setting
    if (this.config.animationQuality === "low") {
      this.ctx.imageSmoothingEnabled = false
    } else {
      this.ctx.imageSmoothingEnabled = true
      if ("imageSmoothingQuality" in this.ctx) {
        this.ctx.imageSmoothingQuality = this.config.animationQuality
      }
    }
  }

  bindEvents() {
    // Debounced resize handler
    let resizeTimeout
    this.resizeHandler = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this.updateSize()
        this.createParticles() // Recalculate particle positions
      }, 250)
    }

    // Optimized mouse move handler
    this.mouseMoveHandler = (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    }

    // Touch handler for mobile devices
    this.touchMoveHandler = (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX
        this.mouse.y = e.touches[0].clientY
      }
    }

    // Visibility change handler for performance
    this.visibilityChangeHandler = () => {
      if (document.hidden) {
        this.stop()
      } else if (this.isRunning) {
        this.start()
      }
    }

    window.addEventListener("resize", this.resizeHandler)

    // Only add mouse events on non-mobile devices
    if (this.deviceProfile !== "mobile") {
      window.addEventListener("mousemove", this.mouseMoveHandler, { passive: true })
    } else {
      // Add touch events for mobile
      window.addEventListener("touchmove", this.touchMoveHandler, { passive: true })
    }

    document.addEventListener("visibilitychange", this.visibilityChangeHandler)
  }

  createParticles() {
    this.particles = []
    for (let i = 0; i < this.config.maxParticles; i++) {
      this.particles.push(this.createParticle())
    }
  }

  createParticle() {
    const displayWidth = this.canvas.clientWidth || this.canvas.width
    const displayHeight = this.canvas.clientHeight || this.canvas.height

    return {
      x: Math.random() * displayWidth,
      y: Math.random() * displayHeight,
      vx: (Math.random() - 0.5) * PARTICLE_SPEED_RANGE.max,
      vy: (Math.random() - 0.5) * PARTICLE_SPEED_RANGE.max,
      size: Math.random() * (PARTICLE_SIZE_RANGE.max - PARTICLE_SIZE_RANGE.min) + PARTICLE_SIZE_RANGE.min,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      opacity: Math.random() * 0.8 + 0.5,
      life: Math.random() * (PARTICLE_LIFE_RANGE.max - PARTICLE_LIFE_RANGE.min) + PARTICLE_LIFE_RANGE.min,
      maxLife: Math.random() * (PARTICLE_LIFE_RANGE.max - PARTICLE_LIFE_RANGE.min) + PARTICLE_LIFE_RANGE.min,
      pulse: Math.random() * Math.PI * 2,
    }
  }

  updateParticle(p) {
    const displayWidth = this.canvas.clientWidth || this.canvas.width
    const displayHeight = this.canvas.clientHeight || this.canvas.height

    // Update position
    p.x += p.vx
    p.y += p.vy

    // Mouse/touch interaction (only if enabled)
    if (this.config.mouseInfluence > 0 && (this.mouse.x > 0 || this.mouse.y > 0)) {
      const dx = this.mouse.x - p.x
      const dy = this.mouse.y - p.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < this.config.mouseInfluence) {
        const force = (this.config.mouseInfluence - dist) / this.config.mouseInfluence
        p.vx += (dx / dist) * force * MOUSE_FORCE_STRENGTH
        p.vy += (dy / dist) * force * MOUSE_FORCE_STRENGTH
      }
    }

    // Apply velocity damping
    p.vx *= VELOCITY_DAMPING
    p.vy *= VELOCITY_DAMPING

    // Update visual properties
    p.pulse += 0.05
    p.opacity = Math.sin(p.pulse) * 0.2 + 0.9

    // Boundary handling
    if (BOUNDARY_BEHAVIOR === "wrap") {
      if (p.x < 0) p.x = displayWidth
      if (p.x > displayWidth) p.x = 0
      if (p.y < 0) p.y = displayHeight
      if (p.y > displayHeight) p.y = 0
    } else if (BOUNDARY_BEHAVIOR === "bounce") {
      if (p.x < 0 || p.x > displayWidth) p.vx *= -1
      if (p.y < 0 || p.y > displayHeight) p.vy *= -1
      p.x = Math.max(0, Math.min(displayWidth, p.x))
      p.y = Math.max(0, Math.min(displayHeight, p.y))
    }

    // Particle lifecycle
    p.life--
    if (p.life <= 0) {
      Object.assign(p, this.createParticle())
    }
  }

  drawParticle(p) {
    this.ctx.save()
    this.ctx.globalAlpha = p.opacity
    this.ctx.fillStyle = p.color

    // Conditional glow effect based on quality
    if (this.config.animationQuality !== "low") {
      this.ctx.shadowBlur = 8
      this.ctx.shadowColor = p.color
    }

    this.ctx.beginPath()
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.restore()
  }

  drawConnections() {
    if (!this.config.enableConnections) return

    this.ctx.save()
    this.ctx.lineWidth = 0.5
    this.ctx.strokeStyle = this.connectionColor

    // Optimize connection drawing for performance
    const maxConnections = this.deviceProfile === "mobile" ? 50 : 100
    let connectionCount = 0

    for (let i = 0; i < this.particles.length && connectionCount < maxConnections; i++) {
      const a = this.particles[i]

      for (let j = i + 1; j < this.particles.length && connectionCount < maxConnections; j++) {
        const b = this.particles[j]
        const dx = a.x - b.x
        const dy = a.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < this.config.connectionDistance) {
          const alpha = Math.max(0.1, ((this.config.connectionDistance - dist) / this.config.connectionDistance) * 0.4)
          this.ctx.globalAlpha = alpha

          this.ctx.beginPath()
          this.ctx.moveTo(a.x, a.y)
          this.ctx.lineTo(b.x, b.y)
          this.ctx.stroke()

          connectionCount++
        }
      }
    }

    this.ctx.restore()
  }

  animate(currentTime = 0) {
    if (!this.isRunning) return

    // Frame rate limiting for performance
    if (currentTime - this.lastFrameTime < this.frameInterval) {
      this.animationFrame = requestAnimationFrame((time) => this.animate(time))
      return
    }

    this.lastFrameTime = currentTime

    // Performance monitoring
    this.frameCount++
    if (currentTime - this.lastFPSCheck > 1000) {
      this.currentFPS = this.frameCount
      this.frameCount = 0
      this.lastFPSCheck = currentTime

      // Adaptive quality based on performance
      if (this.adaptiveQuality) {
        this.adjustQualityBasedOnPerformance()
      }
    }

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Update and draw particles
    for (const p of this.particles) {
      this.updateParticle(p)
      this.drawParticle(p)
    }

    // Draw connections
    this.drawConnections()

    this.animationFrame = requestAnimationFrame((time) => this.animate(time))
  }

  /**
   * Adaptive quality adjustment based on performance
   */
  adjustQualityBasedOnPerformance() {
    const targetFPS = this.config.updateFrequency
    const performanceRatio = this.currentFPS / targetFPS

    if (performanceRatio < 0.8 && this.config.maxParticles > 20) {
      // Reduce particle count if performance is poor
      this.config.maxParticles = Math.max(20, Math.floor(this.config.maxParticles * 0.9))
      this.particles = this.particles.slice(0, this.config.maxParticles)
      console.log(`Reduced particles to ${this.config.maxParticles} for better performance`)
    } else if (performanceRatio > 1.2 && this.config.maxParticles < this.performanceSettings.maxParticles) {
      // Increase particle count if performance is good
      this.config.maxParticles = Math.min(this.performanceSettings.maxParticles, this.config.maxParticles + 5)
      while (this.particles.length < this.config.maxParticles) {
        this.particles.push(this.createParticle())
      }
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.lastFrameTime = 0
      this.animate()
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
      this.isRunning = false
    }
  }

  /**
   * Get current performance statistics
   */
  getPerformanceStats() {
    return {
      fps: this.currentFPS,
      particleCount: this.particles.length,
      deviceProfile: this.deviceProfile,
      connectionsEnabled: this.config.enableConnections,
      animationQuality: this.config.animationQuality,
    }
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig }

    // Recreate particles if count changed
    if (newConfig.maxParticles && newConfig.maxParticles !== this.particles.length) {
      this.createParticles()
    }
  }

  destroy() {
    this.stop()

    // Remove event listeners
    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler)
    }
    if (this.mouseMoveHandler) {
      window.removeEventListener("mousemove", this.mouseMoveHandler)
    }
    if (this.touchMoveHandler) {
      window.removeEventListener("touchmove", this.touchMoveHandler)
    }
    if (this.visibilityChangeHandler) {
      document.removeEventListener("visibilitychange", this.visibilityChangeHandler)
    }

    this.particles = []
    this.canvas = null
    this.ctx = null
  }
}

// Export to global scope
if (typeof window !== "undefined") {
  window.ParticleSystem = ParticleSystem
}
