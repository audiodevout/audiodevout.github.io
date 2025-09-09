// /* galaxy.js - Animated Galaxy Background Effect (Performance Optimized)
//  *
//  * PURPOSE: Creates a rich galaxy background with stars, nebulas, and cosmic dust
//  * Optimized for performance with WebGL batching and mobile-friendly settings
//  *
//  * ============================================================================
//  * GALAXY PERFORMANCE PARAMETERS - Device-specific optimization
//  * ============================================================================
//  */

// // PERFORMANCE PROFILES - Automatically scaled based on device capabilities
// const GALAXY_PERFORMANCE_PROFILES = {
//   mobile: {
//     maxStars: 200, // Reduced star count for mobile
//     maxNebulas: 3, // Fewer nebula clouds
//     maxDustParticles: 50, // Minimal dust particles
//     renderQuality: "low", // Lower quality rendering
//     updateFrequency: 30, // 30fps for mobile
//     enableBloom: false, // Disable bloom on mobile
//     enableParallax: false, // Disable parallax on mobile
//     useWebGL: false, // Use Canvas2D on mobile for better compatibility
//   },
//   tablet: {
//     maxStars: 400,
//     maxNebulas: 5,
//     maxDustParticles: 100,
//     renderQuality: "medium",
//     updateFrequency: 45,
//     enableBloom: true,
//     enableParallax: true,
//     useWebGL: true,
//   },
//   desktop: {
//     maxStars: 800,
//     maxNebulas: 8,
//     maxDustParticles: 200,
//     renderQuality: "high",
//     updateFrequency: 60,
//     enableBloom: true,
//     enableParallax: true,
//     useWebGL: true,
//   },
// }

// // VISUAL SETTINGS - Galaxy appearance configuration
// const GALAXY_VISUAL_CONFIG = {
//   // Star settings
//   starSizeRange: { min: 0.0, max: 0.0 },
//   starOpacityRange: { min: 0.0, max: 0.0 },
//   starTwinkleSpeed: 0.0,
//   starDriftSpeed: { min: 0.00, max: 0.00 },

//   // Nebula settings
//   nebulaSize: { min: 0, max: 0 },
//   nebulaOpacity: { min: 0.0, max: 0.0 },
//   nebulaPulseSpeed: 0.0,
//   nebulaColors: [
//     "rgba(138, 43, 226, 0.2)", // Deep purple
//     "rgba(72, 61, 139, 0.2)", // Dark slate blue
//     "rgba(25, 25, 112, 0.2)", // Midnight blue
//     "rgba(75, 0, 130, 0.2)", // Indigo
//     "rgba(106, 90, 205, 0.2)", // Slate blue
//   ],

//   // Dust particle settings
//   dustSize: { min: 0.2, max: 1.0 },
//   dustOpacity: { min: 0.1, max: 0.4 },
//   dustDriftSpeed: { min: 0.05, max: 0.02 },

//   // Parallax layers (depth simulation)
//   parallaxLayers: [
//     { depth: 0.1, speed: 0.02 }, // Far background
//     { depth: 0.3, speed: 0.05 }, // Mid background
//     { depth: 0.6, speed: 0.08 }, // Near background
//     { depth: 1.0, speed: 0.12 }, // Foreground
//   ],

//   // Color palette - Dark mode compatible
//   starColors: [
//     "#ffffff", // Pure white
//     "#f0f8ff", // Alice blue
//     "#e6e6fa", // Lavender
//     "#dda0dd", // Plum
//     "#add8e6", // Light blue
//     "#87ceeb", // Sky blue
//   ],

//   dustColors: [
//     "rgba(255, 255, 255, 0.3)", // White dust
//     "rgba(173, 216, 230, 0.2)", // Light blue dust
//     "rgba(221, 160, 221, 0.2)", // Plum dust
//     "rgba(230, 230, 250, 0.2)", // Lavender dust
//   ],
// }

// // ANIMATION SETTINGS
// const GALAXY_ANIMATION_CONFIG = {
//   globalRotationSpeed: 0.0001, // Very slow galaxy rotation
//   orbitVariation: 0.03, // Randomness in orbital motion
//   pulsationIntensity: 0.2, // Intensity of pulsing effects
//   driftRandomness: 0.1, // Random drift variation
// }

// /* ============================================================================
//  * END OF CONFIGURABLE PARAMETERS
//  * ============================================================================ */

// class GalaxyBackground {
//   constructor(canvas) {
//     this.canvas = canvas
//     this.ctx = null
//     this.gl = null

//     // Detect device capabilities and set performance profile
//     this.deviceProfile = this.detectDeviceProfile()
//     this.config = GALAXY_PERFORMANCE_PROFILES[this.deviceProfile]

//     // Visual configuration
//     this.visualConfig = GALAXY_VISUAL_CONFIG
//     this.animationConfig = GALAXY_ANIMATION_CONFIG

//     // Galaxy objects
//     this.stars = []
//     this.nebulas = []
//     this.dustParticles = []

//     // Animation state
//     this.animationFrame = null
//     this.isRunning = false
//     this.lastFrameTime = 0
//     this.frameInterval = 1000 / this.config.updateFrequency
//     this.globalTime = 0

//     // Performance monitoring
//     this.frameCount = 0
//     this.lastFPSCheck = 0
//     this.currentFPS = 0

//     // WebGL resources (if using WebGL)
//     this.shaderProgram = null
//     this.buffers = {}
//     this.uniforms = {}

//     // Canvas dimensions
//     this.width = 0
//     this.height = 0
//     this.centerX = 0
//     this.centerY = 0

//     try {
//       this.init()
//     } catch (error) {
//       console.error("GalaxyBackground initialization failed:", error)
//     }
//   }

//   /**
//    * Detect device capabilities for performance optimization
//    */
//   detectDeviceProfile() {
//     const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
//     const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)

//     // Check for reduced motion preference
//     const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
//     if (prefersReducedMotion) {
//       return "mobile" // Use lowest performance profile
//     }

//     // Check device capabilities
//     const deviceMemory = navigator.deviceMemory || 4
//     const hardwareConcurrency = navigator.hardwareConcurrency || 4

//     if (isMobile || deviceMemory < 4 || hardwareConcurrency < 4) {
//       return "mobile"
//     } else if (isTablet || deviceMemory < 8) {
//       return "tablet"
//     } else {
//       return "desktop"
//     }
//   }

//   init() {
//     this.updateSize()
//     this.setupRenderingContext()
//     this.generateGalaxyObjects()
//     this.bindEvents()

//     console.log(`GalaxyBackground initialized with ${this.deviceProfile} profile:`, this.config)
//   }

//   updateSize() {
//     if (!this.canvas) return

//     const dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap DPR for performance
//     const rect = this.canvas.getBoundingClientRect()

//     this.width = rect.width
//     this.height = rect.height
//     this.centerX = this.width / 2
//     this.centerY = this.height / 2

//     this.canvas.width = this.width * dpr
//     this.canvas.height = this.height * dpr
//     this.canvas.style.width = this.width + "px"
//     this.canvas.style.height = this.height + "px"

//     // Update rendering context
//     if (this.ctx) {
//       this.ctx.setTransform(1, 0, 0, 1, 0, 0)
//       this.ctx.scale(dpr, dpr)
//       this.setupCanvasContext()
//     }

//     if (this.gl) {
//       this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
//       this.updateWebGLUniforms()
//     }
//   }

//   setupRenderingContext() {
//     if (this.config.useWebGL && this.initWebGL()) {
//       console.log("Using WebGL for galaxy rendering")
//     } else {
//       this.initCanvas2D()
//       console.log("Using Canvas2D for galaxy rendering")
//     }
//   }

//   initWebGL() {
//     try {
//       this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl")

//       if (!this.gl) {
//         return false
//       }

//       // Setup WebGL shaders and buffers
//       this.setupWebGLShaders()
//       this.setupWebGLBuffers()
//       this.setupWebGLUniforms()

//       // Enable blending for transparency
//       this.gl.enable(this.gl.BLEND)
//       this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)

//       return true
//     } catch (error) {
//       console.warn("WebGL initialization failed, falling back to Canvas2D:", error)
//       return false
//     }
//   }

//   initCanvas2D() {
//     this.ctx = this.canvas.getContext("2d")
//     this.setupCanvasContext()
//   }

//   setupCanvasContext() {
//     this.ctx.lineCap = "round"
//     this.ctx.lineJoin = "round"

//     // Optimize rendering based on quality setting
//     if (this.config.renderQuality === "low") {
//       this.ctx.imageSmoothingEnabled = false
//     } else {
//       this.ctx.imageSmoothingEnabled = true
//       if ("imageSmoothingQuality" in this.ctx) {
//         this.ctx.imageSmoothingQuality = this.config.renderQuality
//       }
//     }
//   }

//   setupWebGLShaders() {
//     // Vertex shader for point rendering
//     const vertexShaderSource = `
//       attribute vec2 a_position;
//       attribute float a_size;
//       attribute vec4 a_color;
//       attribute float a_time;
      
//       uniform vec2 u_resolution;
//       uniform float u_globalTime;
//       uniform mat3 u_transform;
      
//       varying vec4 v_color;
//       varying float v_alpha;
      
//       void main() {
//         vec3 position = u_transform * vec3(a_position, 1.0);
        
//         // Convert to clip space
//         vec2 clipSpace = ((position.xy / u_resolution) * 2.0) - 1.0;
//         gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        
//         // Animate size and alpha based on time
//         float pulse = sin(u_globalTime * 0.01 + a_time) * 0.5 + 0.5;
//         gl_PointSize = a_size * (0.8 + pulse * 0.4);
        
//         v_color = a_color;
//         v_alpha = a_color.a * (0.7 + pulse * 0.3);
//       }
//     `

//     // Fragment shader for point rendering
//     const fragmentShaderSource = `
//       precision mediump float;
      
//       varying vec4 v_color;
//       varying float v_alpha;
      
//       void main() {
//         // Create circular points
//         vec2 coord = gl_PointCoord - vec2(0.5);
//         float dist = length(coord);
        
//         if (dist > 0.5) {
//           discard;
//         }
        
//         // Soft edges
//         float alpha = v_alpha * (1.0 - smoothstep(0.3, 0.5, dist));
//         gl_FragColor = vec4(v_color.rgb, alpha);
//       }
//     `

//     this.shaderProgram = this.createShaderProgram(vertexShaderSource, fragmentShaderSource)
//   }

//   createShaderProgram(vertexSource, fragmentSource) {
//     const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource)
//     const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource)

//     const program = this.gl.createProgram()
//     this.gl.attachShader(program, vertexShader)
//     this.gl.attachShader(program, fragmentShader)
//     this.gl.linkProgram(program)

//     if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
//       console.error("Shader program linking failed:", this.gl.getProgramInfoLog(program))
//       return null
//     }

//     return program
//   }

//   createShader(type, source) {
//     const shader = this.gl.createShader(type)
//     this.gl.shaderSource(shader, source)
//     this.gl.compileShader(shader)

//     if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
//       console.error("Shader compilation failed:", this.gl.getShaderInfoLog(shader))
//       this.gl.deleteShader(shader)
//       return null
//     }

//     return shader
//   }

//   setupWebGLBuffers() {
//     // Calculate total vertices needed
//     const totalVertices = this.config.maxStars + this.config.maxNebulas + this.config.maxDustParticles

//     // Create buffers for batched rendering
//     this.buffers.position = this.gl.createBuffer()
//     this.buffers.size = this.gl.createBuffer()
//     this.buffers.color = this.gl.createBuffer()
//     this.buffers.time = this.gl.createBuffer()

//     // Pre-allocate arrays
//     this.vertexData = {
//       positions: new Float32Array(totalVertices * 2),
//       sizes: new Float32Array(totalVertices),
//       colors: new Float32Array(totalVertices * 4),
//       times: new Float32Array(totalVertices),
//     }
//   }

//   setupWebGLUniforms() {
//     this.uniforms = {
//       resolution: this.gl.getUniformLocation(this.shaderProgram, "u_resolution"),
//       globalTime: this.gl.getUniformLocation(this.shaderProgram, "u_globalTime"),
//       transform: this.gl.getUniformLocation(this.shaderProgram, "u_transform"),
//     }

//     this.updateWebGLUniforms()
//   }

//   updateWebGLUniforms() {
//     if (!this.gl || !this.shaderProgram) return

//     this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height)

//     // Identity transform matrix
//     const transform = [1, 0, 0, 0, 1, 0, 0, 0, 1]
//     this.gl.uniformMatrix3fv(this.uniforms.transform, false, transform)
//   }

//   generateGalaxyObjects() {
//     this.generateStars()
//     this.generateNebulas()
//     this.generateDustParticles()
//   }

//   generateStars() {
//     this.stars = []

//     for (let i = 0; i < this.config.maxStars; i++) {
//       const star = this.createStar()
//       this.stars.push(star)
//     }
//   }

//   createStar() {
//     // Generate star in spiral galaxy pattern
//     const angle = Math.random() * Math.PI * 2
//     const radius = Math.random() * Math.min(this.width, this.height) * 0.6
//     const spiralOffset = radius * 0.01 // Slight spiral effect

//     // Add some randomness to break perfect spiral
//     const randomOffset = (Math.random() - 0.5) * 100

//     const x = this.centerX + Math.cos(angle + spiralOffset) * radius + randomOffset
//     const y = this.centerY + Math.sin(angle + spiralOffset) * radius + randomOffset

//     // Assign parallax layer
//     const layerIndex = Math.floor(Math.random() * this.visualConfig.parallaxLayers.length)
//     const layer = this.visualConfig.parallaxLayers[layerIndex]

//     return {
//       x: x,
//       y: y,
//       originalX: x,
//       originalY: y,
//       size:
//         Math.random() * (this.visualConfig.starSizeRange.max - this.visualConfig.starSizeRange.min) +
//         this.visualConfig.starSizeRange.min,
//       opacity:
//         Math.random() * (this.visualConfig.starOpacityRange.max - this.visualConfig.starOpacityRange.min) +
//         this.visualConfig.starOpacityRange.min,
//       color: this.visualConfig.starColors[Math.floor(Math.random() * this.visualConfig.starColors.length)],
//       twinklePhase: Math.random() * Math.PI * 2,
//       driftSpeed:
//         Math.random() * (this.visualConfig.starDriftSpeed.max - this.visualConfig.starDriftSpeed.min) +
//         this.visualConfig.starDriftSpeed.min,
//       driftAngle: Math.random() * Math.PI * 2,
//       orbitRadius: radius,
//       orbitAngle: angle,
//       orbitSpeed: (Math.random() - 0.5) * 0.001,
//       layer: layer,
//       timeOffset: Math.random() * 1000,
//     }
//   }

//   generateNebulas() {
//     this.nebulas = []

//     for (let i = 0; i < this.config.maxNebulas; i++) {
//       const nebula = this.createNebula()
//       this.nebulas.push(nebula)
//     }
//   }

//   createNebula() {
//     // Position nebulas in interesting locations
//     const angle = Math.random() * Math.PI * 2
//     const radius = Math.random() * Math.min(this.width, this.height) * 0.4

//     const x = this.centerX + Math.cos(angle) * radius
//     const y = this.centerY + Math.sin(angle) * radius

//     return {
//       x: x,
//       y: y,
//       originalX: x,
//       originalY: y,
//       size:
//         Math.random() * (this.visualConfig.nebulaSize.max - this.visualConfig.nebulaSize.min) +
//         this.visualConfig.nebulaSize.min,
//       opacity:
//         Math.random() * (this.visualConfig.nebulaOpacity.max - this.visualConfig.nebulaOpacity.min) +
//         this.visualConfig.nebulaOpacity.min,
//       color: this.visualConfig.nebulaColors[Math.floor(Math.random() * this.visualConfig.nebulaColors.length)],
//       pulsePhase: Math.random() * Math.PI * 2,
//       pulseSpeed: this.visualConfig.nebulaPulseSpeed * (0.5 + Math.random()),
//       driftSpeed: Math.random() * 0.1,
//       driftAngle: Math.random() * Math.PI * 2,
//       layer: this.visualConfig.parallaxLayers[Math.floor(Math.random() * 2)], // Keep nebulas in background
//       timeOffset: Math.random() * 1000,
//     }
//   }

//   generateDustParticles() {
//     this.dustParticles = []

//     for (let i = 0; i < this.config.maxDustParticles; i++) {
//       const dust = this.createDustParticle()
//       this.dustParticles.push(dust)
//     }
//   }

//   createDustParticle() {
//     return {
//       x: Math.random() * this.width,
//       y: Math.random() * this.height,
//       originalX: Math.random() * this.width,
//       originalY: Math.random() * this.height,
//       size:
//         Math.random() * (this.visualConfig.dustSize.max - this.visualConfig.dustSize.min) +
//         this.visualConfig.dustSize.min,
//       opacity:
//         Math.random() * (this.visualConfig.dustOpacity.max - this.visualConfig.dustOpacity.min) +
//         this.visualConfig.dustOpacity.min,
//       color: this.visualConfig.dustColors[Math.floor(Math.random() * this.visualConfig.dustColors.length)],
//       driftSpeed:
//         Math.random() * (this.visualConfig.dustDriftSpeed.max - this.visualConfig.dustDriftSpeed.min) +
//         this.visualConfig.dustDriftSpeed.min,
//       driftAngle: Math.random() * Math.PI * 2,
//       layer: this.visualConfig.parallaxLayers[Math.floor(Math.random() * this.visualConfig.parallaxLayers.length)],
//       timeOffset: Math.random() * 1000,
//     }
//   }

//   bindEvents() {
//     // Debounced resize handler
//     let resizeTimeout
//     this.resizeHandler = () => {
//       clearTimeout(resizeTimeout)
//       resizeTimeout = setTimeout(() => {
//         this.updateSize()
//         // Regenerate objects if canvas size changed significantly
//         this.generateGalaxyObjects()
//       }, 250)
//     }

//     // Visibility change handler for performance
//     this.visibilityChangeHandler = () => {
//       if (document.hidden) {
//         this.stop()
//       } else if (this.isRunning) {
//         this.start()
//       }
//     }

//     window.addEventListener("resize", this.resizeHandler)
//     document.addEventListener("visibilitychange", this.visibilityChangeHandler)
//   }

//   animate(currentTime = 0) {
//     if (!this.isRunning) return

//     // Frame rate limiting for performance
//     if (currentTime - this.lastFrameTime < this.frameInterval) {
//       this.animationFrame = requestAnimationFrame((time) => this.animate(time))
//       return
//     }

//     this.lastFrameTime = currentTime
//     this.globalTime = currentTime

//     // Performance monitoring
//     this.frameCount++
//     if (currentTime - this.lastFPSCheck > 1000) {
//       this.currentFPS = this.frameCount
//       this.frameCount = 0
//       this.lastFPSCheck = currentTime
//     }

//     // Update galaxy objects
//     this.updateGalaxyObjects(currentTime)

//     // Render
//     if (this.gl) {
//       this.renderWebGL(currentTime)
//     } else {
//       this.renderCanvas2D(currentTime)
//     }

//     this.animationFrame = requestAnimationFrame((time) => this.animate(time))
//   }

//   updateGalaxyObjects(currentTime) {
//     const globalRotation = currentTime * this.animationConfig.globalRotationSpeed

//     // Update stars
//     this.stars.forEach((star) => {
//       // Orbital motion
//       star.orbitAngle += star.orbitSpeed + globalRotation
//       const orbitX = Math.cos(star.orbitAngle) * star.orbitRadius
//       const orbitY = Math.sin(star.orbitAngle) * star.orbitRadius

//       // Drift motion
//       const driftX = Math.cos(star.driftAngle + currentTime * 0.0001) * star.driftSpeed
//       const driftY = Math.sin(star.driftAngle + currentTime * 0.0001) * star.driftSpeed

//       // Parallax effect
//       const parallaxOffset = this.config.enableParallax ? star.layer.speed * globalRotation * 100 : 0

//       star.x = this.centerX + orbitX + driftX + parallaxOffset
//       star.y = this.centerY + orbitY + driftY

//       // Twinkle effect
//       star.twinklePhase += this.visualConfig.starTwinkleSpeed
//     })

//     // Update nebulas
//     this.nebulas.forEach((nebula) => {
//       // Slow drift
//       nebula.x = nebula.originalX + Math.cos(currentTime * 0.0001 + nebula.driftAngle) * nebula.driftSpeed * 50
//       nebula.y = nebula.originalY + Math.sin(currentTime * 0.0001 + nebula.driftAngle) * nebula.driftSpeed * 50

//       // Pulse effect
//       nebula.pulsePhase += nebula.pulseSpeed

//       // Parallax
//       if (this.config.enableParallax) {
//         const parallaxOffset = nebula.layer.speed * globalRotation * 50
//         nebula.x += parallaxOffset
//       }
//     })

//     // Update dust particles
//     this.dustParticles.forEach((dust) => {
//       // Continuous drift
//       dust.x += Math.cos(dust.driftAngle) * dust.driftSpeed
//       dust.y += Math.sin(dust.driftAngle) * dust.driftSpeed

//       // Wrap around screen
//       if (dust.x < -10) dust.x = this.width + 10
//       if (dust.x > this.width + 10) dust.x = -10
//       if (dust.y < -10) dust.y = this.height + 10
//       if (dust.y > this.height + 10) dust.y = -10

//       // Parallax
//       if (this.config.enableParallax) {
//         const parallaxOffset = dust.layer.speed * globalRotation * 20
//         dust.x += parallaxOffset * 0.1
//       }
//     })
//   }

//   renderWebGL(currentTime) {
//     this.gl.clear(this.gl.COLOR_BUFFER_BIT)
//     this.gl.useProgram(this.shaderProgram)

//     // Update global time uniform
//     this.gl.uniform1f(this.uniforms.globalTime, currentTime)

//     // Prepare vertex data for batched rendering
//     this.prepareVertexData(currentTime)

//     // Bind attributes
//     this.bindVertexAttributes()

//     // Draw all objects in one call
//     const totalVertices = this.stars.length + this.nebulas.length + this.dustParticles.length
//     this.gl.drawArrays(this.gl.POINTS, 0, totalVertices)
//   }

//   prepareVertexData(currentTime) {
//     let vertexIndex = 0

//     // Add stars to vertex data
//     this.stars.forEach((star) => {
//       const twinkle = Math.sin(star.twinklePhase + currentTime * 0.001) * 0.3 + 0.7
//       const opacity = star.opacity * twinkle

//       this.addVertexData(vertexIndex, star.x, star.y, star.size, star.color, opacity, star.timeOffset)
//       vertexIndex++
//     })

//     // Add nebulas to vertex data
//     this.nebulas.forEach((nebula) => {
//       const pulse = Math.sin(nebula.pulsePhase + currentTime * 0.001) * 0.5 + 0.5
//       const opacity = nebula.opacity * (0.5 + pulse * 0.5)

//       this.addVertexData(vertexIndex, nebula.x, nebula.y, nebula.size, nebula.color, opacity, nebula.timeOffset)
//       vertexIndex++
//     })

//     // Add dust particles to vertex data
//     this.dustParticles.forEach((dust) => {
//       this.addVertexData(vertexIndex, dust.x, dust.y, dust.size, dust.color, dust.opacity, dust.timeOffset)
//       vertexIndex++
//     })

//     // Upload data to GPU
//     this.uploadVertexData()
//   }

//   addVertexData(index, x, y, size, color, opacity, timeOffset) {
//     // Position
//     this.vertexData.positions[index * 2] = x
//     this.vertexData.positions[index * 2 + 1] = y

//     // Size
//     this.vertexData.sizes[index] = size

//     // Color (parse color string to RGBA)
//     const rgba = this.parseColor(color, opacity)
//     this.vertexData.colors[index * 4] = rgba.r
//     this.vertexData.colors[index * 4 + 1] = rgba.g
//     this.vertexData.colors[index * 4 + 2] = rgba.b
//     this.vertexData.colors[index * 4 + 3] = rgba.a

//     // Time offset
//     this.vertexData.times[index] = timeOffset
//   }

//   parseColor(colorString, opacity = 1) {
//     // Simple color parsing for common formats
//     if (colorString.startsWith("#")) {
//       const hex = colorString.slice(1)
//       const r = Number.parseInt(hex.slice(0, 2), 16) / 255
//       const g = Number.parseInt(hex.slice(2, 4), 16) / 255
//       const b = Number.parseInt(hex.slice(4, 6), 16) / 255
//       return { r, g, b, a: opacity }
//     } else if (colorString.startsWith("rgba")) {
//       // Extract RGBA values from rgba string
//       const values = colorString.match(/[\d.]+/g)
//       return {
//         r: Number.parseFloat(values[0]) / 255,
//         g: Number.parseFloat(values[1]) / 255,
//         b: Number.parseFloat(values[2]) / 255,
//         a: Number.parseFloat(values[3]) * opacity,
//       }
//     }

//     // Default to white
//     return { r: 1, g: 1, b: 1, a: opacity }
//   }

//   uploadVertexData() {
//     // Upload position data
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position)
//     this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexData.positions, this.gl.DYNAMIC_DRAW)

//     // Upload size data
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.size)
//     this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexData.sizes, this.gl.DYNAMIC_DRAW)

//     // Upload color data
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color)
//     this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexData.colors, this.gl.DYNAMIC_DRAW)

//     // Upload time data
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.time)
//     this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexData.times, this.gl.DYNAMIC_DRAW)
//   }

//   bindVertexAttributes() {
//     // Position attribute
//     const positionLocation = this.gl.getAttribLocation(this.shaderProgram, "a_position")
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.position)
//     this.gl.enableVertexAttribArray(positionLocation)
//     this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0)

//     // Size attribute
//     const sizeLocation = this.gl.getAttribLocation(this.shaderProgram, "a_size")
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.size)
//     this.gl.enableVertexAttribArray(sizeLocation)
//     this.gl.vertexAttribPointer(sizeLocation, 1, this.gl.FLOAT, false, 0, 0)

//     // Color attribute
//     const colorLocation = this.gl.getAttribLocation(this.shaderProgram, "a_color")
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.color)
//     this.gl.enableVertexAttribArray(colorLocation)
//     this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 0, 0)

//     // Time attribute
//     const timeLocation = this.gl.getAttribLocation(this.shaderProgram, "a_time")
//     this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffers.time)
//     this.gl.enableVertexAttribArray(timeLocation)
//     this.gl.vertexAttribPointer(timeLocation, 1, this.gl.FLOAT, false, 0, 0)
//   }

//   renderCanvas2D(currentTime) {
//     // Clear canvas
//     this.ctx.clearRect(0, 0, this.width, this.height)

//     // Render in layers for proper depth
//     this.renderLayer(this.nebulas, currentTime, this.renderNebula.bind(this))
//     this.renderLayer(this.dustParticles, currentTime, this.renderDustParticle.bind(this))
//     this.renderLayer(this.stars, currentTime, this.renderStar.bind(this))
//   }

//   renderLayer(objects, currentTime, renderFunction) {
//     // Sort by layer depth for proper rendering order
//     const sortedObjects = objects.slice().sort((a, b) => a.layer.depth - b.layer.depth)

//     sortedObjects.forEach((obj) => {
//       renderFunction(obj, currentTime)
//     })
//   }

//   renderStar(star, currentTime) {
//     const twinkle = Math.sin(star.twinklePhase + currentTime * 0.001) * 0.3 + 0.7
//     const opacity = star.opacity * twinkle

//     this.ctx.save()
//     this.ctx.globalAlpha = opacity
//     this.ctx.fillStyle = star.color

//     // Add glow effect if bloom is enabled
//     if (this.config.enableBloom) {
//       this.ctx.shadowBlur = star.size * 2
//       this.ctx.shadowColor = star.color
//     }

//     this.ctx.beginPath()
//     this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
//     this.ctx.fill()

//     this.ctx.restore()
//   }

//   renderNebula(nebula, currentTime) {
//     const pulse = Math.sin(nebula.pulsePhase + currentTime * 0.001) * 0.5 + 0.5
//     const opacity = nebula.opacity * (0.5 + pulse * 0.5)
//     const size = nebula.size * (0.8 + pulse * 0.4)

//     this.ctx.save()
//     this.ctx.globalAlpha = opacity

//     // Create radial gradient for nebula effect
//     const gradient = this.ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, size)
//     gradient.addColorStop(0, nebula.color)
//     gradient.addColorStop(0.5, nebula.color.replace(/[\d.]+\)$/g, "0.1)"))
//     gradient.addColorStop(1, "transparent")

//     this.ctx.fillStyle = gradient

//     this.ctx.beginPath()
//     this.ctx.arc(nebula.x, nebula.y, size, 0, Math.PI * 2)
//     this.ctx.fill()

//     this.ctx.restore()
//   }

//   renderDustParticle(dust, currentTime) {
//     this.ctx.save()
//     this.ctx.globalAlpha = dust.opacity
//     this.ctx.fillStyle = dust.color

//     this.ctx.beginPath()
//     this.ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2)
//     this.ctx.fill()

//     this.ctx.restore()
//   }

//   start() {
//     if (!this.isRunning) {
//       this.isRunning = true
//       this.lastFrameTime = 0
//       this.animate()
//     }
//   }

//   stop() {
//     if (this.animationFrame) {
//       cancelAnimationFrame(this.animationFrame)
//       this.animationFrame = null
//       this.isRunning = false
//     }
//   }

//   /**
//    * Get current performance statistics
//    */
//   getPerformanceStats() {
//     return {
//       fps: this.currentFPS,
//       deviceProfile: this.deviceProfile,
//       renderingMode: this.gl ? "WebGL" : "Canvas2D",
//       objectCounts: {
//         stars: this.stars.length,
//         nebulas: this.nebulas.length,
//         dust: this.dustParticles.length,
//       },
//       config: this.config,
//     }
//   }

//   /**
//    * Update configuration at runtime
//    */
//   updateConfig(newConfig) {
//     this.config = { ...this.config, ...newConfig }

//     // Regenerate objects if counts changed
//     if (newConfig.maxStars || newConfig.maxNebulas || newConfig.maxDustParticles || newConfig.useWebGL !== undefined) {
//       this.setupRenderingContext()
//       this.generateGalaxyObjects()
//     }
//   }

//   destroy() {
//     this.stop()

//     // Remove event listeners
//     if (this.resizeHandler) {
//       window.removeEventListener("resize", this.resizeHandler)
//     }
//     if (this.visibilityChangeHandler) {
//       document.removeEventListener("visibilitychange", this.visibilityChangeHandler)
//     }

//     // Clean up WebGL resources
//     if (this.gl) {
//       Object.values(this.buffers).forEach((buffer) => {
//         if (buffer) this.gl.deleteBuffer(buffer)
//       })

//       if (this.shaderProgram) {
//         this.gl.deleteProgram(this.shaderProgram)
//       }
//     }

//     // Clear references
//     this.stars = []
//     this.nebulas = []
//     this.dustParticles = []
//     this.canvas = null
//     this.ctx = null
//     this.gl = null
//   }
// }

// // Export to global scope
// if (typeof window !== "undefined") {
//   window.GalaxyBackground = GalaxyBackground
// }
