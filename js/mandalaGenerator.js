/* mandalaGenerator.js - Lean, Visually Striking Geometric Mandala System
 *
 * PURPOSE: Generates dynamic mandalas focused on circles and octagons,
 * enhanced with efficient sphere decorations. Optimized for high performance
 * and visual clarity, emphasizing "beautiful math" with minimal computational overhead.
 *
 * ============================================================================
 * GLOBAL CONTROL PARAMETERS - Easily adjustable for visual customization
 * ============================================================================
 */

// 1. PERFORMANCE PROFILES - Device-specific settings for adaptive rendering
// These settings balance visual quality with performance based on detected device capabilities.
const MANDALA_PERFORMANCE_PROFILES = {
  mobile: {
    maxLayers: 1, // Increased layers for mobile as shapes are simpler
    baseSegments: 8, // More segments for smoother circles/octagons
    detailLevel: 0.7, // Moderate detail for sphere density
    bloomEnabled: false, // Disable bloom for performance
    updateFrequency: 30, // Target 30 FPS
    renderQuality: "low", // Low image smoothing quality
  },
  tablet: {
    maxLayers: 1,
    baseSegments: 8,
    detailLevel: 1.2,
    bloomEnabled: true,
    updateFrequency: 45, // Target 45 FPS
    renderQuality: "medium",
  },
  desktop: {
    maxLayers: 1, // Even more layers for richer visuals
    baseSegments: 16, // High base segments for intricate patterns
    detailLevel: 1.5, // High detail for dense sphere patterns
    bloomEnabled: true, // Enable bloom for striking glow effects
    updateFrequency: 60, // Target 60 FPS for smooth animation
    renderQuality: "high",
  },
}

// 2. TIME-BASED MORPHING SETTINGS
const MORPH_CYCLE_MINUTES = 5 // Total duration of one complete mandala style cycle
const SMOOTH_TRANSITIONS = true // Enable smooth cross-fading between mandala types
const TRANSITION_OVERLAP = 0.15 // Percentage of cycle where two types overlap during transition (e.g., 0.15 = 15% overlap)

// 3. MANDALA TYPES - Defines the sequence of visual styles
// Simplified to focus on core geometric forms.
const MANDALA_TYPES = ["circles", "octagons"]

// 4. SIZE AND SCALING
const MANDALA_BASE_SCALE = 1.5 // Overall scale of the mandala relative to canvas size
const LAYER_SPACING_FACTOR = 0.2 // Controls the radial distance between layers
const CENTER_PULSE_RADIUS = 300 // Base radius of the central pulsing circle
const SPHERE_RADIUS_FACTOR = 0.02 // Relative size of spheres to layer radius

// 5. ANIMATION SPEEDS
const ROTATION_SPEED = 0.001 // Speed of the overall mandala rotation
const PULSE_SPEED = 0.001 // Speed of the breathing/pulsing effect
const BREATHING_INTENSITY = 0.03 // Amplitude of the breathing effect (0 to 1)

// 6. BLOOM EFFECTS - Visual glow around shapes (conditional based on device)
const BLOOM_INTENSITY = 15 // Radius of the glow effect in pixels
const BLOOM_OPACITY = 0.8 // Opacity of the bloom effect (0 to 1)

// 7. TIME-BASED COLOR SCHEMES - Defines color palettes for different times of day
// Colors are HSL for easy adjustment of hue, saturation, and lightness.
const COLOR_SCHEMES = {
  dawn: [
    "hsl(340, 80%, 65%)",  // warm rosy coral
    "hsl(320, 75%, 70%)",  // soft magenta
    "hsl(350, 85%, 60%)",  // rich pinkish red
    "hsl(10, 90%, 65%)"    // bright orange-red
  ],
  morning: [
    "hsl(50, 85%, 65%)",   // golden yellow
    "hsl(40, 80%, 60%)",   // warm amber
    "hsl(30, 90%, 65%)",   // lively orange
    "hsl(60, 75%, 55%)"    // soft lime-green
  ],
  midday: [
    "hsl(180, 80%, 65%)",  // bright teal
    "hsl(170, 75%, 60%)",  // soft turquoise
    "hsl(190, 85%, 62%)",  // cool cyan
    "hsl(160, 90%, 65%)"   // light aquamarine
  ],
  afternoon: [
    "hsl(280, 75%, 60%)",  // soft violet
    "hsl(290, 80%, 65%)",  // pastel purple
    "hsl(260, 85%, 62%)",  // electric indigo
    "hsl(270, 90%, 60%)"   // medium lavender
  ],
  evening: [
    "hsl(0, 80%, 60%)",    // vivid red
    "hsl(350, 85%, 65%)",  // pinkish red
    "hsl(20, 90%, 62%)",   // coral red
    "hsl(10, 75%, 60%)"    // bright orange
  ],
  night: [
    "hsl(240, 65%, 55%)",  // royal blue, lightened
    "hsl(250, 70%, 50%)",  // medium purple
    "hsl(260, 60%, 52%)",  // muted violet
    "hsl(230, 75%, 55%)"   // desaturated blue
  ],
};



// 8. SHAPE COMPLEXITY LEVELS - Defines which drawing features are enabled
// Simplified to control elements within circles and octagons.
const SHAPE_COMPLEXITY = {
  simple: { radialLines: false, innerPolygons: false, sphereDensity: 0.5 },
  medium: { radialLines: true, innerPolygons: false, sphereDensity: 1.0 },
  complex: { radialLines: true, innerPolygons: true, sphereDensity: 1.5 },
}

/* ============================================================================
 * END OF GLOBAL CONTROL PARAMETERS
 * ============================================================================ */

class MandalaGenerator {
  /**
   * Initializes the MandalaGenerator.
   * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
   */
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")

    // Determine device capabilities and apply corresponding performance profile
    this.deviceProfile = this._detectDeviceProfile()
    this.performanceSettings = MANDALA_PERFORMANCE_PROFILES[this.deviceProfile]

    // Apply core parameters from global config
    this.morphCycleMs = MORPH_CYCLE_MINUTES * 60 * 1000
    this.smoothTransitions = SMOOTH_TRANSITIONS
    this.transitionOverlap = TRANSITION_OVERLAP

    // Dynamic state variables
    this.currentMandalaType = MANDALA_TYPES[0]
    this.nextMandalaType = MANDALA_TYPES[1]
    this.morphProgress = 0 // Progress of transition between current and next type (0 to 1)
    this.currentColors = COLOR_SCHEMES.midday // Initial color scheme
    this.currentComplexity = SHAPE_COMPLEXITY.simple // Initial complexity level

    this.scrollProgress = 0 // External input for dynamic adjustments (0 to 1)
    this.rotationOffset = 0 // Accumulative rotation for animation
    this.animationFrameId = null // Stores requestAnimationFrame ID for control
    this.lastFrameTime = 0 // Timestamp of the last animation frame
    this.frameInterval = 1000 / this.performanceSettings.updateFrequency // Target time per frame

    // Initialize the canvas and start the animation loop
    this._init()
  }

  /**
   * Detects the device profile (mobile, tablet, desktop) for performance scaling.
   * Considers user agent, device memory, and hardware concurrency.
   * @returns {string} The detected device profile.
   * @private
   */
  _detectDeviceProfile() {
    const isMobile = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)

    // Prioritize user preference for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "mobile" // Use lowest performance profile for accessibility
    }

    // Estimate device capabilities
    const deviceMemory = navigator.deviceMemory || 4 // Default to 4GB if not available
    const hardwareConcurrency = navigator.hardwareConcurrency || 4 // Default to 4 cores

    if (isMobile || deviceMemory < 4 || hardwareConcurrency < 4) {
      return "mobile"
    } else if (isTablet || deviceMemory < 8) {
      return "tablet"
    } else {
      return "desktop"
    }
  }

  /**
   * Initializes the canvas context and event listeners.
   * @private
   */
  _init() {
    if (!this.canvas || !this.ctx) {
      console.error("Canvas or 2D context not available. MandalaGenerator cannot initialize.")
      return
    }

    this._setupContext()
    this._updateCanvasSize()
    this._setupEventListeners()

    console.log(`MandalaGenerator initialized with ${this.deviceProfile} profile.`)
    this.startAnimation() // Start the animation loop
  }

  /**
   * Configures the 2D rendering context for optimal visual quality.
   * @private
   */
  _setupContext() {
    this.ctx.lineCap = "round" // Rounded line caps for smoother appearance
    this.ctx.lineJoin = "round" // Rounded line joins for cleaner corners

    // Adjust image smoothing based on performance profile for crispness
    this.ctx.imageSmoothingEnabled = this.performanceSettings.renderQuality !== "low"
    if (this.ctx.imageSmoothingEnabled && "imageSmoothingQuality" in this.ctx) {
      this.ctx.imageSmoothingQuality = this.performanceSettings.renderQuality
    }
  }

  /**
   * Sets up event listeners for window resize and document visibility changes.
   * @private
   */
  _setupEventListeners() {
    let resizeTimeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        this._updateCanvasSize()
      }, 250) // Debounce resize events for performance
    }

    window.addEventListener("resize", handleResize)

    const handleVisibilityChange = () => {
      if (document.hidden) {
        this.stopAnimation() // Pause animation when tab is not active
      } else {
        this.startAnimation() // Resume animation when tab becomes active
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)
  }

  /**
   * Updates the canvas dimensions to match its display size and adjusts DPR.
   * @private
   */
  _updateCanvasSize() {
    if (!this.canvas) return

    const rect = this.canvas.getBoundingClientRect()
    // Cap Device Pixel Ratio (DPR) to 2 for performance on high-DPR screens
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    this.canvas.width = rect.width * dpr
    this.canvas.height = rect.height * dpr

    // Scale the context to match the DPR, ensuring crisp rendering
    this.ctx.scale(dpr, dpr)
    this._setupContext() // Re-apply context settings after scaling
  }

  /**
   * Updates the current mandala type, morphing progress, colors, and complexity
   * based on the current time within the morph cycle.
   * @private
   */
  _updateTimeBasedState() {
    const now = Date.now()
    const cyclePosition = (now % this.morphCycleMs) / this.morphCycleMs // Normalized position (0 to 1)

    // Determine current and next mandala types for morphing
    const typeCount = MANDALA_TYPES.length
    const typeIndex = Math.floor(cyclePosition * typeCount)
    const nextTypeIndex = (typeIndex + 1) % typeCount

    this.currentMandalaType = MANDALA_TYPES[typeIndex]
    this.nextMandalaType = MANDALA_TYPES[nextTypeIndex]

    // Calculate morph progress for smooth transitions
    const segmentProgress = (cyclePosition * typeCount) % 1 // Progress within the current type's segment
    if (this.smoothTransitions && segmentProgress > 1 - this.transitionOverlap) {
      this.morphProgress = (segmentProgress - (1 - this.transitionOverlap)) / this.transitionOverlap
    } else {
      this.morphProgress = 0
    }

    // Update colors based on time of day
    this._updateTimeBasedColors()

    // Update complexity based on cycle position and device capabilities
    this._updateTimeBasedComplexity(cyclePosition)
  }

  /**
   * Selects the appropriate color scheme based on the current hour.
   * @private
   */
  _updateTimeBasedColors() {
    const hour = new Date().getHours()
    let colorSchemeName

    if (hour >= 5 && hour < 8) colorSchemeName = "dawn"
    else if (hour >= 8 && hour < 11) colorSchemeName = "morning"
    else if (hour >= 11 && hour < 15) colorSchemeName = "midday"
    else if (hour >= 15 && hour < 18) colorSchemeName = "afternoon"
    else if (hour >= 18 && hour < 21) colorSchemeName = "evening"
    else colorSchemeName = "night"

    this.currentColors = COLOR_SCHEMES[colorSchemeName]
  }

  /**
   * Adjusts the mandala's complexity level based on the morph cycle position
   * and the detected device profile.
   * @param {number} cyclePosition - The normalized position within the morph cycle (0 to 1).
   * @private
   */
  _updateTimeBasedComplexity(cyclePosition) {
    // Use a sine wave to create a smooth oscillation of complexity
    const complexityWave = Math.sin(cyclePosition * Math.PI * 2) * 0.5 + 0.5 // Ranges from 0 to 1

    // Apply complexity based on device profile and wave position
    if (this.deviceProfile === "mobile") {
      this.currentComplexity = SHAPE_COMPLEXITY.simple // Mobile devices stick to simple
    } else if (this.deviceProfile === "tablet") {
      this.currentComplexity = complexityWave < 0.5 ? SHAPE_COMPLEXITY.simple : SHAPE_COMPLEXITY.medium
    } else {
      // Desktop can cycle through all complexity levels
      if (complexityWave < 0.33) {
        this.currentComplexity = SHAPE_COMPLEXITY.simple
      } else if (complexityWave < 0.66) {
        this.currentComplexity = SHAPE_COMPLEXITY.medium
      } else {
        this.currentComplexity = SHAPE_COMPLEXITY.complex
      }
    }
  }

  /**
   * The main animation loop that updates and draws the mandala.
   * @param {DOMHighResTimeStamp} currentTime - The current time provided by requestAnimationFrame.
   */
  animate = (currentTime) => {
    // Frame rate limiting to match target update frequency
    if (currentTime - this.lastFrameTime < this.frameInterval) {
      this.animationFrameId = requestAnimationFrame(this.animate)
      return
    }
    this.lastFrameTime = currentTime

    // Update time-based morphing state
    this._updateTimeBasedState()

    const ctx = this.ctx
    const displayWidth = this.canvas.clientWidth || this.canvas.width / (window.devicePixelRatio || 1)
    const displayHeight = this.canvas.clientHeight || this.canvas.height / (window.devicePixelRatio || 1)

    // Calculate center coordinates based on display size
    const centerX = displayWidth / 2
    const centerY = displayHeight / 2

    // Calculate base radius, influenced by overall scale and breathing effect
    this.rotationOffset += ROTATION_SPEED // Continuous rotation
    const time = Date.now() * PULSE_SPEED // Time for pulsing effects
    const breathingEffect = Math.sin(time) * BREATHING_INTENSITY // Smooth in/out scaling
    const baseRadius = Math.min(displayWidth, displayHeight) * MANDALA_BASE_SCALE * (1 + breathingEffect)

    // Clear the canvas for the new frame
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    // Calculate dynamic number of layers and segments, influenced by scroll progress
    const numLayers = Math.max(
      1,
      Math.min(
        this.performanceSettings.maxLayers,
        Math.floor(1 + this.scrollProgress * (this.performanceSettings.maxLayers - 1)),
      ),
    )
    const effectiveSegments = Math.max(
      3,
      Math.floor(
        this.performanceSettings.baseSegments + this.scrollProgress * 8 * this.performanceSettings.detailLevel,
      ),
    )

    const drawingParams = {
      centerX,
      centerY,
      baseRadius,
      numLayers,
      effectiveSegments,
      time,
      rotationOffset: this.rotationOffset,
      scrollProgress: this.scrollProgress,
      currentColors: this.currentColors,
      currentComplexity: this.currentComplexity,
      bloomEnabled: this.performanceSettings.bloomEnabled,
      bloomIntensity: BLOOM_INTENSITY,
      bloomOpacity: BLOOM_OPACITY,
      layerSpacingFactor: LAYER_SPACING_FACTOR,
      centerPulseRadius: CENTER_PULSE_RADIUS,
      sphereRadiusFactor: SPHERE_RADIUS_FACTOR,
      deviceProfile: this.deviceProfile, // Pass device profile for specific drawing logic
    }

    // Render morphing mandala if transition is active, otherwise render current type
    if (this.morphProgress > 0 && this.smoothTransitions) {
      this._renderMorphingMandala(ctx, drawingParams)
    } else {
      this._renderMandalaByType(ctx, drawingParams, this.currentMandalaType)
    }

    // Request next animation frame
    this.animationFrameId = requestAnimationFrame(this.animate)
  }

  /**
   * Renders a smooth transition between the current and next mandala types.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {object} params - Drawing parameters.
   * @private
   */
  _renderMorphingMandala(ctx, params) {
    // Draw the current mandala type fading out
    ctx.save()
    ctx.globalAlpha = 1 - this.morphProgress
    this._renderMandalaByType(ctx, params, this.currentMandalaType)
    ctx.restore()

    // Draw the next mandala type fading in
    ctx.save()
    ctx.globalAlpha = this.morphProgress
    this._renderMandalaByType(ctx, params, this.nextMandalaType)
    ctx.restore()
  }

  /**
   * Dispatches rendering to the specific mandala type function.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {object} params - Drawing parameters.
   * @param {string} type - The type of mandala to render.
   * @private
   */
  _renderMandalaByType(ctx, params, type) {
    switch (type) {
      case "circles":
        this._drawCirclesMandala(ctx, params)
        break
      case "octagons":
        this._drawOctagonsMandala(ctx, params)
        break
      default:
        this._drawCirclesMandala(ctx, params) // Fallback
    }
  }

  /**
   * Applies common layer styling (stroke, fill, opacity, line width).
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {number} layer - The current layer index.
   * @param {number} numLayers - Total number of layers.
   * @param {object} params - Drawing parameters containing currentColors and scrollProgress.
   * @private
   */
  _setupLayerStyle(ctx, layer, numLayers, { currentColors, scrollProgress }) {
    // Opacity decreases with layer depth and scroll progress for a fading effect
    const opacity = Math.max(0.1, 1.2 - layer * 0.15 - scrollProgress * 0.2)
    // Line width decreases with layer depth for a sense of perspective
    const strokeWidth = Math.max(0.5, 3 - layer * 0.3)

    ctx.strokeStyle = currentColors[layer % currentColors.length]
    ctx.fillStyle = currentColors[layer % currentColors.length]
    ctx.lineWidth = strokeWidth
    ctx.globalAlpha = opacity
  }

  /**
   * Draws a shape with an optional bloom (glow) effect.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {function} drawFunction - A function that contains the actual drawing commands.
   * @param {object} params - Drawing parameters containing bloomEnabled, bloomIntensity, bloomOpacity.
   * @private
   */
  _drawWithBloom(ctx, drawFunction, { bloomEnabled, bloomIntensity, bloomOpacity }) {
    if (!bloomEnabled) {
      drawFunction() // Just draw if bloom is disabled
      return
    }

    ctx.save()
    // Apply shadow properties for the bloom effect
    ctx.shadowColor = ctx.strokeStyle // Bloom color matches stroke color
    ctx.shadowBlur = bloomIntensity // Controls the spread of the glow
    ctx.globalAlpha *= bloomOpacity // Controls the intensity of the glow

    drawFunction() // Draw the glowing layer

    ctx.restore()
    drawFunction() // Draw the main shape on top (without shadow) for crispness
  }

  /**
   * Draws a regular polygon.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {number} centerX - X coordinate of the center.
   * @param {number} centerY - Y coordinate of the center.
   * @param {number} radius - Radius of the polygon's circumcircle.
   * @param {number} sides - Number of sides of the polygon.
   * @param {number} rotation - Rotation angle in radians.
   * @param {object} params - Drawing parameters for bloom.
   * @private
   */
  _drawPolygon(ctx, centerX, centerY, radius, sides, rotation, params) {
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
    this._drawWithBloom(ctx, () => ctx.stroke(), params)
  }

  /**
   * Draws a small sphere (filled circle).
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {number} x - X coordinate of the sphere.
   * @param {number} y - Y coordinate of the sphere.
   * @param {number} radius - Radius of the sphere.
   * @param {object} params - Drawing parameters for bloom.
   * @private
   */
  _drawSphere(ctx, x, y, radius, params) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    this._drawWithBloom(ctx, () => ctx.fill(), params)
  }

  /**
   * Renders a pulsing circle at the center of the mandala.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {object} params - Drawing parameters including centerX, centerY, time, centerPulseRadius, bloom.
   * @private
   */
  _renderCenterPulse(
    ctx,
    { centerX, centerY, time, centerPulseRadius, scrollProgress, bloomEnabled, bloomIntensity, bloomOpacity },
  ) {
    ctx.save()
    ctx.globalAlpha = 0.9 // Slightly transparent
    ctx.strokeStyle = this.currentColors[0] // Use the first color of the scheme
    ctx.lineWidth = 2

    // Radius pulses and expands with scroll progress
    const pulseRadius = centerPulseRadius + Math.sin(time) * 3 + scrollProgress * 4

    ctx.beginPath()
    ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI)
    this._drawWithBloom(ctx, () => ctx.stroke(), { bloomEnabled, bloomIntensity, bloomOpacity })
    ctx.restore()
  }

  /* ============================================================================
   * MANDALA TYPE RENDERING FUNCTIONS - Each draws a specific style
   * ============================================================================ */

  /**
   * Draws a mandala composed of concentric circles and optional radial lines.
   * Enhanced with spheres along the circles.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {object} params - Drawing parameters.
   * @private
   */
  _drawCirclesMandala(ctx, params) {
    const { centerX, centerY, baseRadius, numLayers, effectiveSegments, rotationOffset, scrollProgress } = params

    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.3 + layer * params.layerSpacingFactor) // Radius increases with layer
      const segments = effectiveSegments + layer * 2 // Segments increase for outer layers
      const angleStep = (2 * Math.PI) / segments

      this._setupLayerStyle(ctx, layer, numLayers, params)

      // Draw concentric circles
      this._drawWithBloom(
        ctx,
        () => {
          ctx.beginPath()
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
          ctx.stroke()
        },
        params,
      )

      // Conditionally draw radial lines (the "wheel" effect)
      if (params.currentComplexity.radialLines) {
        for (let i = 0; i < segments; i++) {
          const angle = i * angleStep + rotationOffset + scrollProgress * Math.PI
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          this._drawWithBloom(
            ctx,
            () => {
              ctx.beginPath()
              ctx.moveTo(centerX, centerY)
              ctx.lineTo(x, y)
              ctx.stroke()
            },
            params,
          )
        }
      }

      // Add small spheres along the circle's border
      const sphereCount = Math.floor(segments * params.currentComplexity.sphereDensity)
      const sphereRadius = radius * params.sphereRadiusFactor * (1 + params.currentComplexity.sphereDensity * 0.5) // Sphere size scales with density
      for (let i = 0; i < sphereCount; i++) {
        const sphereAngle = (i / sphereCount) * 2 * Math.PI + rotationOffset * 2 // Spheres rotate faster
        const sphereX = centerX + Math.cos(sphereAngle) * radius
        const sphereY = centerY + Math.sin(sphereAngle) * radius
        this._drawSphere(ctx, sphereX, sphereY, sphereRadius, params)
      }
    }
    this._renderCenterPulse(ctx, params)
  }

  /**
   * Draws a mandala composed of concentric octagons and optional inner polygons.
   * Enhanced with spheres along the octagon edges.
   * @param {CanvasRenderingContext2D} ctx - The 2D rendering context.
   * @param {object} params - Drawing parameters.
   * @private
   */
  _drawOctagonsMandala(ctx, params) {
    const { centerX, centerY, baseRadius, numLayers, effectiveSegments, rotationOffset } = params
    const octagonSides = 8 // Fixed to octagon form

    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.2 + layer * params.layerSpacingFactor)
      const currentRotation = rotationOffset + layer * 0.1

      this._setupLayerStyle(ctx, layer, numLayers, params)

      // Draw main octagon for the layer
      this._drawPolygon(ctx, centerX, centerY, radius, octagonSides, currentRotation, params)

      // Add inner polygons for more complexity
      if (params.currentComplexity.innerPolygons && layer < numLayers - 1) {
        this._drawPolygon(ctx, centerX, centerY, radius * 0.7, octagonSides * 2, -currentRotation * 0.5, params)
      }

      // Add small spheres along the octagon's edges
      const sphereCountPerSide = Math.floor((effectiveSegments * params.currentComplexity.sphereDensity) / octagonSides)
      const sphereRadius = radius * params.sphereRadiusFactor * (1 + params.currentComplexity.sphereDensity * 0.5)

      for (let side = 0; side < octagonSides; side++) {
        const angle1 = (side / octagonSides) * 2 * Math.PI + currentRotation
        const angle2 = ((side + 1) / octagonSides) * 2 * Math.PI + currentRotation

        const x1 = centerX + Math.cos(angle1) * radius
        const y1 = centerY + Math.sin(angle1) * radius
        const x2 = centerX + Math.cos(angle2) * radius
        const y2 = centerY + Math.sin(angle2) * radius

        for (let i = 0; i <= sphereCountPerSide; i++) {
          const t = i / sphereCountPerSide
          const sphereX = x1 + (x2 - x1) * t
          const sphereY = y1 + (y2 - y1) * t
          this._drawSphere(ctx, sphereX, sphereY, sphereRadius, params)
        }
      }
    }
    this._renderCenterPulse(ctx, params)
  }

  /* ============================================================================
   * PUBLIC METHODS - For external control and information
   * ============================================================================ */

  /**
   * Starts the animation loop for the mandala.
   */
  startAnimation() {
    if (this.animationFrameId) return // Prevent multiple animation loops
    this.animationFrameId = requestAnimationFrame(this.animate)
    console.log("Mandala animation started.")
  }

  /**
   * Stops the animation loop for the mandala.
   */
  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
      console.log("Mandala animation stopped.")
    }
  }

  /**
   * Sets the scroll progress, influencing layer count and segment detail.
   * @param {number} progress - A value between 0 and 1.
   */
  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress))
  }

  /**
   * Gets current information about the rendered mandala for debugging or display.
   * @returns {object} An object containing current mandala state.
   */
  getCurrentMandalaInfo() {
    const hour = new Date().getHours()
    let colorSchemeName
    if (hour >= 5 && hour < 8) colorSchemeName = "dawn"
    else if (hour >= 8 && hour < 11) colorSchemeName = "morning"
    else if (hour >= 11 && hour < 15) colorSchemeName = "midday"
    else if (hour >= 15 && hour < 18) colorSchemeName = "afternoon"
    else if (hour >= 18 && hour < 21) colorSchemeName = "evening"
    else colorSchemeName = "night"

    const complexityName = Object.keys(SHAPE_COMPLEXITY).find((key) => SHAPE_COMPLEXITY[key] === this.currentComplexity)

    return {
      currentType: this.currentMandalaType,
      nextType: this.nextMandalaType,
      morphProgress: Number.parseFloat(this.morphProgress.toFixed(2)),
      colorScheme: colorSchemeName,
      complexity: complexityName,
      deviceProfile: this.deviceProfile,
      targetFPS: this.performanceSettings.updateFrequency,
      bloomEnabled: this.performanceSettings.bloomEnabled,
      numLayers: Math.max(
        1,
        Math.min(
          this.performanceSettings.maxLayers,
          Math.floor(1 + this.scrollProgress * (this.performanceSettings.maxLayers - 1)),
        ),
      ),
    }
  }

  /**
   * Cleans up resources when the generator is no longer needed.
   */
  destroy() {
    this.stopAnimation()
    // Remove event listeners if necessary (though current setup uses window/document directly)
    // For a more robust destroy, store event listener references and remove them here.
    console.log("MandalaGenerator destroyed.")
  }
}

// Expose the class globally for easy access in other scripts
if (typeof window !== "undefined") {
  window.MandalaGenerator = MandalaGenerator
}
