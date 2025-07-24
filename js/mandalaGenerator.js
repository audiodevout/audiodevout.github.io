/* mandalaGenerator.js - Time-Morphing Mandala System (Mobile Optimized)
 *
 * PURPOSE: Creates mandalas that morph between different styles based on time
 * Optimized for mobile performance with adaptive rendering and reduced complexity
 *
 * ============================================================================
 * MOBILE-OPTIMIZED PARAMETERS - Automatically adjusts based on device
 * ============================================================================
 */

// PERFORMANCE PROFILES - Device-specific settings
const MANDALA_PERFORMANCE_PROFILES = {
  mobile: {
    maxLayers: 2, // Reduced layers for mobile
    baseSegments: 8, // Fewer segments
    detailLevel: 0.3, // Lower detail
    bloomEnabled: false, // Disable bloom on mobile
    updateFrequency: 20, // 20fps for mobile
    renderQuality: "low", // Low quality rendering
  },
  tablet: {
    maxLayers: 3,
    baseSegments: 12,
    detailLevel: 0.4,
    bloomEnabled: true,
    updateFrequency: 30,
    renderQuality: "medium",
  },
  desktop: {
    maxLayers: 4,
    baseSegments: 16,
    detailLevel: 1,
    bloomEnabled: true,
    updateFrequency: 60,
    renderQuality: "high",
  },
}

// TIME-BASED MORPHING SETTINGS
const MORPH_CYCLE_MINUTES = 30 // Total cycle time in minutes
const SMOOTH_TRANSITIONS = true // Enable smooth morphing between types
const TRANSITION_OVERLAP = 0.1 // How much types overlap during transition

// MANDALA TYPES - These will cycle automatically based on time
const MANDALA_TYPES = [
  "classic", // 0-4 minutes
  "geometric", // 4-8 minutes
  "floral", // 8-12 minutes
  "crystalline", // 12-16 minutes
  "tribal", // 16-20 minutes
  "cosmic", // 20-24 minutes
  "fractal", // 24-28 minutes
  "lotus", // 28-30 minutes
]

// SIZE AND SCALING - Mobile optimized
const MANDALA_SIZE = 0.35 // Smaller overall size for mobile
const LAYER_SPACING = 0.25 // Tighter spacing
const CENTER_SIZE = 6 // Smaller center circle

// ANIMATION - Reduced for mobile performance
const ROTATION_SPEED = 0.0005 // Slower rotation
const PULSE_SPEED = 0.001 // Slower pulse
const BREATHING_INTENSITY = 0.03 // Reduced breathing effect

// BLOOM EFFECTS - Conditional based on device
const BLOOM_INTENSITY = 15 // Reduced bloom radius
const BLOOM_OPACITY = 1 // Reduced bloom opacity

// TIME-BASED COLOR MORPHING - Optimized color schemes
const COLOR_SCHEMES = {
  dawn: [
    "hsl(25, 100%, 65%)", // Warm orange
    "hsl(45, 100%, 70%)", // Golden yellow
    "hsl(15, 90%, 60%)", // Soft red
    "hsl(35, 95%, 65%)", // Amber
  ],
  morning: [
    "hsl(200, 80%, 60%)", // Sky blue
    "hsl(180, 70%, 55%)", // Cyan
    "hsl(220, 85%, 65%)", // Light blue
    "hsl(160, 75%, 50%)", // Teal
  ],
  midday: [
    "hsl(18, 100%, 62%)", // Saffron
    "hsl(205, 100%, 52%)", // Cerulean
    "hsl(325, 100%, 59%)", // Neon Magenta
    "hsl(83, 100%, 62%)", // Electric Lime
  ],
  afternoon: [
    "hsl(280, 80%, 60%)", // Purple
    "hsl(300, 85%, 65%)", // Magenta
    "hsl(260, 75%, 55%)", // Violet
    "hsl(320, 90%, 60%)", // Pink
  ],
  evening: [
    "hsl(14, 100%, 65%)", // Orange
    "hsl(340, 100%, 70%)", // Pink
    "hsl(45, 100%, 60%)", // Gold
    "hsl(280, 100%, 65%)", // Purple
  ],
  night: [
    "hsl(240, 60%, 40%)", // Deep blue
    "hsl(260, 70%, 45%)", // Dark purple
    "hsl(220, 55%, 35%)", // Navy
    "hsl(280, 65%, 40%)", // Dark violet
  ],
}

// SHAPE COMPLEXITY LEVELS - Mobile optimized
const SHAPE_COMPLEXITY = {
  simple: { curves: false, polygons: true, stars: false, fractals: false },
  medium: { curves: true, polygons: true, stars: false, fractals: false },
  complex: { curves: true, polygons: true, stars: true, fractals: false }, // Disable fractals on mobile
}

/* ============================================================================
 * END OF CONFIGURABLE PARAMETERS
 * ============================================================================ */

class MandalaGenerator {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")

    // Detect device capabilities and set performance profile
    this.deviceProfile = this.detectDeviceProfile()
    this.performanceSettings = MANDALA_PERFORMANCE_PROFILES[this.deviceProfile]

    // Apply performance-based parameters
    this.mandalaTypes = MANDALA_TYPES
    this.morphCycleMs = MORPH_CYCLE_MINUTES * 60 * 1000
    this.smoothTransitions = SMOOTH_TRANSITIONS
    this.transitionOverlap = TRANSITION_OVERLAP

    this.baseSegments = this.performanceSettings.baseSegments
    this.maxLayers = this.performanceSettings.maxLayers
    this.radiusScale = MANDALA_SIZE
    this.layerSpacing = LAYER_SPACING
    this.centerSize = CENTER_SIZE
    this.detailLevel = this.performanceSettings.detailLevel
    this.rotationSpeed = ROTATION_SPEED
    this.pulseSpeed = PULSE_SPEED
    this.breathingIntensity = BREATHING_INTENSITY
    this.bloomEnabled = this.performanceSettings.bloomEnabled
    this.bloomIntensity = BLOOM_INTENSITY
    this.bloomOpacity = BLOOM_OPACITY

    // Time-based morphing state
    this.currentMandalaType = "classic"
    this.nextMandalaType = "geometric"
    this.morphProgress = 0
    this.currentColors = COLOR_SCHEMES.midday
    this.currentComplexity = SHAPE_COMPLEXITY.simple

    // Internal state
    this.scrollProgress = 0
    this.currentSegments = this.baseSegments
    this.animationFrame = null
    this.rotationOffset = 0
    this.isInitialized = false
    this.isVisible = true
    this.isAnimating = false

    // Performance monitoring
    this.frameCount = 0
    this.lastFPSCheck = 0
    this.currentFPS = 0
    this.lastFrameTime = 0
    this.frameInterval = 1000 / this.performanceSettings.updateFrequency

    this.init()
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

    // Check device memory and hardware
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
    this.validateCanvas()
    this.setupContext()
    this.updateSize()
    this.setupEventListeners()
    this.isInitialized = true

    console.log(`MandalaGenerator initialized with ${this.deviceProfile} profile:`, this.performanceSettings)
  }

  validateCanvas() {
    if (!this.canvas || !this.ctx) {
      throw new Error("Canvas or 2D context not available")
    }
  }

  setupContext() {
    this.ctx.lineCap = "round"
    this.ctx.lineJoin = "round"

    // Optimize rendering based on device profile
    if (this.performanceSettings.renderQuality === "low") {
      this.ctx.imageSmoothingEnabled = false
    } else {
      this.ctx.imageSmoothingEnabled = true
      if ("imageSmoothingQuality" in this.ctx) {
        this.ctx.imageSmoothingQuality = this.performanceSettings.renderQuality
      }
    }
  }

  setupEventListeners() {
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (this.isInitialized) {
          this.updateSize()
        }
      }, 250) // Increased debounce for mobile
    }

    window.addEventListener("resize", handleResize)

    // Visibility change handler for performance
    const handleVisibilityChange = () => {
      if (document.hidden) {
        this.stopAnimation()
      } else if (this.isAnimating) {
        this.startAnimation()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
  }

  updateSize() {
    if (!this.canvas) return

    const rect = this.canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap DPR for performance

    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr

    this.ctx.scale(dpr, dpr)
    this.setupContext()
  }

  // Calculate current mandala state based on time
  updateTimeBasedState() {
    const now = Date.now()
    const cyclePosition = (now % this.morphCycleMs) / this.morphCycleMs // 0 to 1

    // Determine which mandala types we're transitioning between
    const typeCount = this.mandalaTypes.length
    const typeIndex = Math.floor(cyclePosition * typeCount)
    const nextTypeIndex = (typeIndex + 1) % typeCount

    this.currentMandalaType = this.mandalaTypes[typeIndex]
    this.nextMandalaType = this.mandalaTypes[nextTypeIndex]

    // Calculate morph progress within current type segment
    const segmentProgress = (cyclePosition * typeCount) % 1

    if (this.smoothTransitions) {
      // Create smooth transitions with overlap
      if (segmentProgress > 1 - this.transitionOverlap) {
        this.morphProgress = (segmentProgress - (1 - this.transitionOverlap)) / this.transitionOverlap
      } else {
        this.morphProgress = 0
      }
    } else {
      this.morphProgress = 0
    }

    // Update colors based on time of day
    this.updateTimeBasedColors()

    // Update complexity based on cycle position and device capabilities
    this.updateTimeBasedComplexity(cyclePosition)
  }

  updateTimeBasedColors() {
    const hour = new Date().getHours()
    let colorScheme

    if (hour >= 5 && hour < 8) colorScheme = COLOR_SCHEMES.dawn
    else if (hour >= 8 && hour < 11) colorScheme = COLOR_SCHEMES.morning
    else if (hour >= 11 && hour < 15) colorScheme = COLOR_SCHEMES.midday
    else if (hour >= 15 && hour < 18) colorScheme = COLOR_SCHEMES.afternoon
    else if (hour >= 18 && hour < 21) colorScheme = COLOR_SCHEMES.evening
    else colorScheme = COLOR_SCHEMES.night

    this.currentColors = colorScheme
  }

  updateTimeBasedComplexity(cyclePosition) {
    // Complexity increases and decreases in waves throughout the cycle
    const complexityWave = Math.sin(cyclePosition * Math.PI * 2) * 0.5 + 0.5

    // Adjust complexity based on device capabilities
    if (this.deviceProfile === "mobile") {
      // Mobile devices stay on simple complexity
      this.currentComplexity = SHAPE_COMPLEXITY.simple
    } else if (this.deviceProfile === "tablet") {
      // Tablets can handle simple to medium
      if (complexityWave < 0.5) {
        this.currentComplexity = SHAPE_COMPLEXITY.simple
      } else {
        this.currentComplexity = SHAPE_COMPLEXITY.medium
      }
    } else {
      // Desktop can handle all complexity levels
      if (complexityWave < 0.33) {
        this.currentComplexity = SHAPE_COMPLEXITY.simple
      } else if (complexityWave < 0.66) {
        this.currentComplexity = SHAPE_COMPLEXITY.medium
      } else {
        this.currentComplexity = SHAPE_COMPLEXITY.complex
      }
    }
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress))
  }

  setSegments(segments) {
    this.currentSegments = Math.max(3, Math.floor(segments))
  }

  generateMandala(currentTime = 0) {
    if (!this.isInitialized || !this.ctx || !this.isVisible) return

    // Frame rate limiting for performance
    if (currentTime - this.lastFrameTime < this.frameInterval) {
      return
    }
    this.lastFrameTime = currentTime

    // Performance monitoring
    this.frameCount++
    if (currentTime - this.lastFPSCheck > 1000) {
      this.currentFPS = this.frameCount
      this.frameCount = 0
      this.lastFPSCheck = currentTime
    }

    // Update time-based morphing state
    this.updateTimeBasedState()

    const ctx = this.ctx
    const displayWidth = this.canvas.clientWidth || this.canvas.width
    const displayHeight = this.canvas.clientHeight || this.canvas.height

    // Proper centering using display dimensions
    const centerX = displayWidth / 2
    const centerY = displayHeight / 2

    // Scale radius based on display size
    const baseRadius = Math.min(displayWidth, displayHeight) * this.radiusScale

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Calculate dynamic values
    const numLayers = Math.max(1, Math.min(this.maxLayers, Math.floor(1 + this.scrollProgress * (this.maxLayers - 1))))
    const effectiveSegments = Math.max(3, Math.floor(this.currentSegments + this.scrollProgress * 8 * this.detailLevel))

    this.rotationOffset += this.rotationSpeed
    const time = Date.now() * this.pulseSpeed
    const breathingEffect = Math.sin(time) * this.breathingIntensity

    const params = {
      centerX,
      centerY,
      baseRadius: baseRadius * (1 + breathingEffect),
      numLayers,
      effectiveSegments,
      time,
    }

    // Render morphing mandala
    if (this.morphProgress > 0 && this.smoothTransitions) {
      this.renderMorphingMandala(ctx, params)
    } else {
      this.renderMandalaByType(ctx, params, this.currentMandalaType)
    }
  }

  renderMorphingMandala(ctx, params) {
    // Render current mandala type with reduced opacity
    ctx.save()
    ctx.globalAlpha = 1 - this.morphProgress
    this.renderMandalaByType(ctx, params, this.currentMandalaType)
    ctx.restore()

    // Render next mandala type with increasing opacity
    ctx.save()
    ctx.globalAlpha = this.morphProgress
    this.renderMandalaByType(ctx, params, this.nextMandalaType)
    ctx.restore()
  }

  renderMandalaByType(ctx, params, type) {
    switch (type) {
      case "classic":
        this.renderClassicMandala(ctx, params)
        break
      case "geometric":
        this.renderGeometricMandala(ctx, params)
        break
      case "floral":
        this.renderFloralMandala(ctx, params)
        break
      case "crystalline":
        this.renderCrystallineMandala(ctx, params)
        break
      case "tribal":
        this.renderTribalMandala(ctx, params)
        break
      case "cosmic":
        this.renderCosmicMandala(ctx, params)
        break
      case "fractal":
        this.renderFractalMandala(ctx, params)
        break
      case "lotus":
        this.renderLotusMandala(ctx, params)
        break
      default:
        this.renderClassicMandala(ctx, params)
    }
  }

  renderClassicMandala(ctx, { centerX, centerY, baseRadius, numLayers, effectiveSegments, time }) {
    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.3 + layer * this.layerSpacing)
      const segments = effectiveSegments + layer * 2
      const angleStep = (2 * Math.PI) / segments

      this.setupLayerStyle(ctx, layer, numLayers)

      // Radial lines
      for (let i = 0; i < segments; i++) {
        const angle = i * angleStep + this.rotationOffset + this.scrollProgress * Math.PI
        const x1 = centerX + Math.cos(angle) * radius
        const y1 = centerY + Math.sin(angle) * radius

        if (this.bloomEnabled) {
          this.drawWithBloom(ctx, () => {
            ctx.beginPath()
            ctx.moveTo(centerX, centerY)
            ctx.lineTo(x1, y1)
            ctx.stroke()
          })
        } else {
          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.lineTo(x1, y1)
          ctx.stroke()
        }

        // Endpoint decorations (only on higher quality devices)
        if (layer === 0 && this.currentComplexity.curves && this.deviceProfile !== "mobile") {
          this.drawEndpointDecoration(ctx, x1, y1, layer)
        }
      }

      // Concentric circles
      if (layer % 2 === 0) {
        if (this.bloomEnabled) {
          this.drawWithBloom(ctx, () => {
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
            ctx.stroke()
          })
        } else {
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
          ctx.stroke()
        }
      }
    }

    this.renderCenterPulse(ctx, centerX, centerY, time)
  }

  renderGeometricMandala(ctx, { centerX, centerY, baseRadius, numLayers, effectiveSegments }) {
    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.2 + layer * this.layerSpacing)
      const segments = Math.max(3, effectiveSegments - layer)

      this.setupLayerStyle(ctx, layer, numLayers)

      // Draw polygons
      this.drawPolygon(ctx, centerX, centerY, radius, segments, this.rotationOffset + layer * 0.1)

      // Add inner geometric patterns (only on higher performance devices)
      if (this.currentComplexity.polygons && layer < numLayers - 1 && this.deviceProfile !== "mobile") {
        this.drawPolygon(ctx, centerX, centerY, radius * 0.7, segments * 2, -this.rotationOffset + layer * 0.15)
      }
    }
  }

  renderFloralMandala(ctx, { centerX, centerY, baseRadius, numLayers, effectiveSegments }) {
    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.25 + layer * this.layerSpacing)
      const petals = Math.max(4, effectiveSegments + layer)

      this.setupLayerStyle(ctx, layer, numLayers)

      // Draw flower petals
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * 2 * Math.PI + this.rotationOffset
        this.drawPetal(ctx, centerX, centerY, radius, angle, layer)
      }
    }
  }

  renderCrystallineMandala(ctx, { centerX, centerY, baseRadius, numLayers, effectiveSegments }) {
    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.2 + layer * this.layerSpacing)
      const facets = Math.max(6, effectiveSegments + layer * 2)

      this.setupLayerStyle(ctx, layer, numLayers)

      // Draw crystal facets
      for (let i = 0; i < facets; i++) {
        const angle1 = (i / facets) * 2 * Math.PI + this.rotationOffset
        const angle2 = ((i + 1) / facets) * 2 * Math.PI + this.rotationOffset

        this.drawCrystalFacet(ctx, centerX, centerY, radius, angle1, angle2, layer)
      }
    }
  }

  renderTribalMandala(ctx, { centerX, centerY, baseRadius, numLayers, effectiveSegments }) {
    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.3 + layer * this.layerSpacing)
      const elements = Math.max(4, effectiveSegments)

      this.setupLayerStyle(ctx, layer, numLayers)

      // Draw tribal patterns
      for (let i = 0; i < elements; i++) {
        const angle = (i / elements) * 2 * Math.PI + this.rotationOffset
        this.drawTribalElement(ctx, centerX, centerY, radius, angle, layer)
      }
    }
  }

  renderCosmicMandala(ctx, { centerX, centerY, baseRadius, numLayers, effectiveSegments, time }) {
    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.15 + layer * this.layerSpacing)
      const orbits = Math.max(3, effectiveSegments - layer)

      this.setupLayerStyle(ctx, layer, numLayers)

      // Draw cosmic orbits and celestial bodies
      for (let i = 0; i < orbits; i++) {
        const angle = (i / orbits) * 2 * Math.PI + this.rotationOffset * (1 + layer * 0.5)
        this.drawCosmicOrbit(ctx, centerX, centerY, radius, angle, layer, time)
      }

      // Add spiral arms (only on higher performance devices)
      if (this.currentComplexity.curves && this.deviceProfile !== "mobile") {
        this.drawSpiralArm(ctx, centerX, centerY, radius, layer, time)
      }
    }
  }

  renderFractalMandala(ctx, { centerX, centerY, baseRadius, numLayers }) {
    if (this.currentComplexity.fractals && this.deviceProfile === "desktop") {
      this.drawFractalPattern(ctx, centerX, centerY, baseRadius, 0, Math.min(numLayers, 3))
    } else {
      // Fallback to geometric if fractals are disabled or on mobile
      const params = { centerX, centerY, baseRadius, numLayers }
      this.renderGeometricMandala(ctx, params)
    }
  }

  renderLotusMandala(ctx, { centerX, centerY, baseRadius, numLayers, effectiveSegments }) {
    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.2 + layer * this.layerSpacing)
      const petals = Math.max(8, effectiveSegments + layer * 2)

      this.setupLayerStyle(ctx, layer, numLayers)

      // Draw lotus petals
      for (let i = 0; i < petals; i++) {
        const angle = (i / petals) * 2 * Math.PI + this.rotationOffset
        this.drawLotusPetal(ctx, centerX, centerY, radius, angle, layer)
      }
    }
  }

  // Helper drawing methods
  setupLayerStyle(ctx, layer, numLayers) {
    const opacity = Math.max(0.1, 1.2 - layer * 0.15 - this.scrollProgress * 0.2)
    const strokeWidth = Math.max(0.5, 3 - layer * 0.3)

    ctx.strokeStyle = this.currentColors[layer % this.currentColors.length]
    ctx.fillStyle = this.currentColors[layer % this.currentColors.length]
    ctx.lineWidth = strokeWidth
    ctx.globalAlpha = opacity
  }

  drawWithBloom(ctx, drawFunction) {
    if (!this.bloomEnabled) {
      drawFunction()
      return
    }

    ctx.save()

    // Draw bloom effect
    ctx.shadowColor = ctx.strokeStyle
    ctx.shadowBlur = this.bloomIntensity
    ctx.globalAlpha *= this.bloomOpacity

    drawFunction()

    ctx.restore()

    // Draw main shape
    drawFunction()
  }

  drawPolygon(ctx, centerX, centerY, radius, sides, rotation) {
    ctx.beginPath()
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * 2 * Math.PI + rotation
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    }

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.stroke())
    } else {
      ctx.stroke()
    }
  }

  drawPetal(ctx, centerX, centerY, radius, angle, layer) {
    const petalLength = radius * 0.8
    const petalWidth = radius * 0.3

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle)

    ctx.beginPath()
    ctx.ellipse(petalLength / 2, 0, petalLength / 2, petalWidth / 2, 0, 0, 2 * Math.PI)

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.stroke())
    } else {
      ctx.stroke()
    }

    ctx.restore()
  }

  drawCrystalFacet(ctx, centerX, centerY, radius, angle1, angle2, layer) {
    const x1 = centerX + Math.cos(angle1) * radius
    const y1 = centerY + Math.sin(angle1) * radius
    const x2 = centerX + Math.cos(angle2) * radius
    const y2 = centerY + Math.sin(angle2) * radius

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.closePath()

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.stroke())
    } else {
      ctx.stroke()
    }
  }

  drawTribalElement(ctx, centerX, centerY, radius, angle, layer) {
    const x = centerX + Math.cos(angle) * radius
    const y = centerY + Math.sin(angle) * radius

    // Draw tribal-style zigzag (simplified for mobile)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)

    const steps = this.deviceProfile === "mobile" ? 3 : 5
    for (let i = 0; i < steps; i++) {
      const t = i / (steps - 1)
      const zigzagX =
        centerX + Math.cos(angle) * radius * t + Math.cos(angle + Math.PI / 2) * Math.sin(t * Math.PI * 2) * 8
      const zigzagY =
        centerY + Math.sin(angle) * radius * t + Math.sin(angle + Math.PI / 2) * Math.sin(t * Math.PI * 2) * 8
      ctx.lineTo(zigzagX, zigzagY)
    }

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.stroke())
    } else {
      ctx.stroke()
    }
  }

  drawCosmicOrbit(ctx, centerX, centerY, radius, angle, layer, time) {
    // Draw orbit (simplified on mobile)
    if (this.deviceProfile !== "mobile") {
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.globalAlpha *= 0.3
      ctx.stroke()
      ctx.globalAlpha /= 0.3
    }

    // Draw celestial body
    const bodyX = centerX + Math.cos(angle + time * 0.5) * radius
    const bodyY = centerY + Math.sin(angle + time * 0.5) * radius

    ctx.beginPath()
    ctx.arc(bodyX, bodyY, 2 + layer, 0, 2 * Math.PI)

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.fill())
    } else {
      ctx.fill()
    }
  }

  drawSpiralArm(ctx, centerX, centerY, radius, layer, time) {
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)

    const steps = this.deviceProfile === "mobile" ? 50 : 100
    for (let i = 0; i < steps; i++) {
      const t = i / steps
      const spiralRadius = radius * t
      const spiralAngle = t * Math.PI * 3 + this.rotationOffset + time * 0.1

      const x = centerX + Math.cos(spiralAngle) * spiralRadius
      const y = centerY + Math.sin(spiralAngle) * spiralRadius

      ctx.lineTo(x, y)
    }

    ctx.globalAlpha *= 0.5
    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.stroke())
    } else {
      ctx.stroke()
    }
  }

  drawFractalPattern(ctx, centerX, centerY, radius, depth, maxDepth) {
    if (depth >= maxDepth || radius < 5) return

    const segments = 6
    this.setupLayerStyle(ctx, depth, maxDepth)

    // Draw current level
    this.drawPolygon(ctx, centerX, centerY, radius, segments, this.rotationOffset * (depth + 1))

    // Recurse to smaller patterns (limited on mobile)
    const childCount = this.deviceProfile === "mobile" ? 3 : segments
    for (let i = 0; i < childCount; i++) {
      const angle = (i / childCount) * 2 * Math.PI
      const newX = centerX + Math.cos(angle) * radius * 0.6
      const newY = centerY + Math.sin(angle) * radius * 0.6

      this.drawFractalPattern(ctx, newX, newY, radius * 0.4, depth + 1, maxDepth)
    }
  }

  drawLotusPetal(ctx, centerX, centerY, radius, angle, layer) {
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(angle)

    // Draw lotus petal shape
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.quadraticCurveTo(radius * 0.3, -radius * 0.2, radius, 0)
    ctx.quadraticCurveTo(radius * 0.3, radius * 0.2, 0, 0)

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.stroke())
    } else {
      ctx.stroke()
    }

    ctx.restore()
  }

  drawEndpointDecoration(ctx, x, y, layer) {
    ctx.save()
    ctx.beginPath()
    ctx.arc(x, y, 2 + this.scrollProgress * 2, 0, 2 * Math.PI)

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.fill())
    } else {
      ctx.fill()
    }

    ctx.restore()
  }

  renderCenterPulse(ctx, centerX, centerY, time) {
    ctx.save()
    ctx.globalAlpha = 0.9
    ctx.strokeStyle = this.currentColors[0]
    ctx.lineWidth = 2

    const pulseRadius = this.centerSize + Math.sin(time) * 3 + this.scrollProgress * 4

    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI)

    if (this.bloomEnabled) {
      this.drawWithBloom(ctx, () => ctx.stroke())
    } else {
      ctx.stroke()
    }

    ctx.restore()
  }

  startAnimation() {
    if (this.animationFrame) return

    this.isAnimating = true
    const animate = (currentTime) => {
      this.generateMandala(currentTime)
      if (this.isAnimating) {
        this.animationFrame = requestAnimationFrame(animate)
      }
    }
    animate()
  }

  stopAnimation() {
    this.isAnimating = false
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame)
      this.animationFrame = null
    }
  }

  /**
   * Get current performance statistics
   */
  getPerformanceStats() {
    return {
      fps: this.currentFPS,
      deviceProfile: this.deviceProfile,
      currentType: this.currentMandalaType,
      morphProgress: this.morphProgress,
      layerCount: this.maxLayers,
      bloomEnabled: this.bloomEnabled,
    }
  }

  // Get current mandala info for debugging
  getCurrentMandalaInfo() {
    return {
      currentType: this.currentMandalaType,
      nextType: this.nextMandalaType,
      morphProgress: this.morphProgress,
      colorScheme: this.getColorSchemeName(),
      complexity: this.getCurrentComplexityName(),
      deviceProfile: this.deviceProfile,
    }
  }

  getColorSchemeName() {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 8) return "dawn"
    if (hour >= 8 && hour < 11) return "morning"
    if (hour >= 11 && hour < 15) return "midday"
    if (hour >= 15 && hour < 18) return "afternoon"
    if (hour >= 18 && hour < 21) return "evening"
    return "night"
  }

  getCurrentComplexityName() {
    if (this.currentComplexity === SHAPE_COMPLEXITY.simple) return "simple"
    if (this.currentComplexity === SHAPE_COMPLEXITY.medium) return "medium"
    return "complex"
  }

  destroy() {
    this.stopAnimation()
  }
}

// Export to window
if (typeof window !== "undefined") {
  window.MandalaGenerator = MandalaGenerator
}
