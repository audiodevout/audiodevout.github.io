/* utils.js - Shared Utilities and Performance Helpers
 *
 * PURPOSE: Centralized utility functions to reduce code duplication
 * and improve maintainability across all animation systems
 */

// DEVICE DETECTION - Centralized to avoid duplication
class DeviceDetector {
  static instance = null

  constructor() {
    if (DeviceDetector.instance) {
      return DeviceDetector.instance
    }

    this.profile = this.detectProfile()
    this.capabilities = this.detectCapabilities()
    DeviceDetector.instance = this
  }

  detectProfile() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      return "mobile" // Use lowest performance profile
    }

    // Check device capabilities
    const deviceMemory = navigator.deviceMemory || 4
    const hardwareConcurrency = navigator.hardwareConcurrency || 4
    const connectionSpeed = navigator.connection?.effectiveType || "4g"

    if (
      isMobile ||
      deviceMemory < 4 ||
      hardwareConcurrency < 4 ||
      connectionSpeed === "slow-2g" ||
      connectionSpeed === "2g"
    ) {
      return "mobile"
    } else if (isTablet || deviceMemory < 8 || connectionSpeed === "3g") {
      return "tablet"
    } else {
      return "desktop"
    }
  }

  detectCapabilities() {
    return {
      webgl: this.hasWebGLSupport(),
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      maxTextureSize: this.getMaxTextureSize(),
      supportsBackdropFilter: CSS.supports("backdrop-filter", "blur(1px)"),
      supportsWebP: this.supportsWebP(),
    }
  }

  hasWebGLSupport() {
    try {
      const canvas = document.createElement("canvas")
      return !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    } catch (e) {
      return false
    }
  }

  getMaxTextureSize() {
    if (!this.capabilities?.webgl) return 2048

    try {
      const canvas = document.createElement("canvas")
      const gl = canvas.getContext("webgl")
      return gl.getParameter(gl.MAX_TEXTURE_SIZE)
    } catch (e) {
      return 2048
    }
  }

  supportsWebP() {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
  }

  getProfile() {
    return this.profile
  }

  getCapabilities() {
    return this.capabilities
  }
}

// PERFORMANCE MONITOR - Centralized FPS and performance tracking
class PerformanceMonitor {
  constructor(name = "Unknown") {
    this.name = name
    this.frameCount = 0
    this.lastFPSCheck = 0
    this.currentFPS = 0
    this.frameTimings = []
    this.maxFrameTimings = 60 // Keep last 60 frame timings
    this.isMonitoring = false
  }

  startFrame() {
    this.frameStartTime = performance.now()
  }

  endFrame() {
    if (!this.frameStartTime) return

    const frameTime = performance.now() - this.frameStartTime
    this.frameTimings.push(frameTime)

    if (this.frameTimings.length > this.maxFrameTimings) {
      this.frameTimings.shift()
    }

    this.frameCount++
    const now = performance.now()

    if (now - this.lastFPSCheck > 1000) {
      this.currentFPS = this.frameCount
      this.frameCount = 0
      this.lastFPSCheck = now
    }
  }

  getStats() {
    const avgFrameTime =
      this.frameTimings.length > 0 ? this.frameTimings.reduce((a, b) => a + b, 0) / this.frameTimings.length : 0

    return {
      name: this.name,
      fps: this.currentFPS,
      avgFrameTime: avgFrameTime.toFixed(2),
      maxFrameTime: Math.max(...this.frameTimings).toFixed(2),
      minFrameTime: Math.min(...this.frameTimings).toFixed(2),
    }
  }

  shouldReduceQuality() {
    return this.currentFPS < 30 || this.getAverageFrameTime() > 33 // 33ms = 30fps
  }

  getAverageFrameTime() {
    return this.frameTimings.length > 0 ? this.frameTimings.reduce((a, b) => a + b, 0) / this.frameTimings.length : 0
  }
}

// ANIMATION FRAME MANAGER - Centralized RAF management
class AnimationFrameManager {
  constructor() {
    this.animations = new Map()
    this.isRunning = false
    this.rafId = null
    this.lastTime = 0
  }

  register(name, callback, priority = 0) {
    this.animations.set(name, { callback, priority, active: true })
    this.sortAnimations()

    if (!this.isRunning) {
      this.start()
    }
  }

  unregister(name) {
    this.animations.delete(name)

    if (this.animations.size === 0) {
      this.stop()
    }
  }

  pause(name) {
    const animation = this.animations.get(name)
    if (animation) {
      animation.active = false
    }
  }

  resume(name) {
    const animation = this.animations.get(name)
    if (animation) {
      animation.active = true
    }
  }

  sortAnimations() {
    // Sort by priority (higher priority runs first)
    this.animations = new Map([...this.animations.entries()].sort((a, b) => b[1].priority - a[1].priority))
  }

  start() {
    if (this.isRunning) return

    this.isRunning = true
    this.lastTime = performance.now()
    this.animate()
  }

  stop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    this.isRunning = false
  }

  animate = (currentTime = performance.now()) => {
    if (!this.isRunning) return

    const deltaTime = currentTime - this.lastTime
    this.lastTime = currentTime

    // Execute all active animations
    for (const [name, { callback, active }] of this.animations) {
      if (active) {
        try {
          callback(currentTime, deltaTime)
        } catch (error) {
          console.error(`Animation error in ${name}:`, error)
        }
      }
    }

    this.rafId = requestAnimationFrame(this.animate)
  }
}

// COLOR UTILITIES - Centralized color parsing and manipulation
class ColorUtils {
  static parseColor(colorString, opacity = 1) {
    if (colorString.startsWith("#")) {
      const hex = colorString.slice(1)
      const r = Number.parseInt(hex.slice(0, 2), 16) / 255
      const g = Number.parseInt(hex.slice(2, 4), 16) / 255
      const b = Number.parseInt(hex.slice(4, 6), 16) / 255
      return { r, g, b, a: opacity }
    } else if (colorString.startsWith("rgba")) {
      const values = colorString.match(/[\d.]+/g)
      return {
        r: Number.parseFloat(values[0]) / 255,
        g: Number.parseFloat(values[1]) / 255,
        b: Number.parseFloat(values[2]) / 255,
        a: Number.parseFloat(values[3]) * opacity,
      }
    } else if (colorString.startsWith("rgb")) {
      const values = colorString.match(/[\d.]+/g)
      return {
        r: Number.parseFloat(values[0]) / 255,
        g: Number.parseFloat(values[1]) / 255,
        b: Number.parseFloat(values[2]) / 255,
        a: opacity,
      }
    }

    // Default to white
    return { r: 1, g: 1, b: 1, a: opacity }
  }

  static rgbaToString(r, g, b, a = 1) {
    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`
  }

  static hexToRgba(hex, opacity = 1) {
    const color = this.parseColor(hex, opacity)
    return this.rgbaToString(color.r, color.g, color.b, color.a)
  }

  static interpolateColor(color1, color2, factor) {
    const c1 = this.parseColor(color1)
    const c2 = this.parseColor(color2)

    return this.rgbaToString(
      c1.r + (c2.r - c1.r) * factor,
      c1.g + (c2.g - c1.g) * factor,
      c1.b + (c2.b - c1.b) * factor,
      c1.a + (c2.a - c1.a) * factor,
    )
  }
}

// MATH UTILITIES - Common mathematical functions
class MathUtils {
  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  static lerp(start, end, factor) {
    return start + (end - start) * factor
  }

  static smoothstep(edge0, edge1, x) {
    const t = this.clamp((x - edge0) / (edge1 - edge0), 0, 1)
    return t * t * (3 - 2 * t)
  }

  static easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  static randomRange(min, max) {
    return Math.random() * (max - min) + min
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  static distance(x1, y1, x2, y2) {
    const dx = x2 - x1
    const dy = y2 - y1
    return Math.sqrt(dx * dx + dy * dy)
  }

  static angle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1)
  }

  static normalizeAngle(angle) {
    while (angle > Math.PI) angle -= 2 * Math.PI
    while (angle < -Math.PI) angle += 2 * Math.PI
    return angle
  }
}

// CANVAS UTILITIES - Common canvas operations
class CanvasUtils {
  static setupContext(ctx, quality = "high") {
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    if (quality === "low") {
      ctx.imageSmoothingEnabled = false
    } else {
      ctx.imageSmoothingEnabled = true
      if ("imageSmoothingQuality" in ctx) {
        ctx.imageSmoothingQuality = quality
      }
    }
  }

  static setupCanvas(canvas, dpr = null) {
    const devicePixelRatio = dpr || Math.min(window.devicePixelRatio || 1, 2)
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * devicePixelRatio
    canvas.height = rect.height * devicePixelRatio
    canvas.style.width = rect.width + "px"
    canvas.style.height = rect.height + "px"

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    return {
      width: rect.width,
      height: rect.height,
      devicePixelRatio,
      ctx,
    }
  }

  static drawCircle(ctx, x, y, radius, fillStyle = null, strokeStyle = null, lineWidth = 1) {
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)

    if (fillStyle) {
      ctx.fillStyle = fillStyle
      ctx.fill()
    }

    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle
      ctx.lineWidth = lineWidth
      ctx.stroke()
    }
  }

  static drawGlow(ctx, drawFunction, glowColor, glowSize = 10) {
    ctx.save()
    ctx.shadowColor = glowColor
    ctx.shadowBlur = glowSize
    drawFunction()
    ctx.restore()

    // Draw the shape again without glow for crisp edges
    drawFunction()
  }
}

// EVENT MANAGER - Centralized event handling with cleanup
class EventManager {
  constructor() {
    this.listeners = []
  }

  add(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options)
    this.listeners.push({ element, event, handler, options })
  }

  remove(element, event, handler) {
    element.removeEventListener(event, handler)
    this.listeners = this.listeners.filter(
      (listener) => !(listener.element === element && listener.event === event && listener.handler === handler),
    )
  }

  removeAll() {
    this.listeners.forEach(({ element, event, handler }) => {
      try {
        element.removeEventListener(event, handler)
      } catch (error) {
        console.warn("Error removing event listener:", error)
      }
    })
    this.listeners = []
  }

  addDebounced(element, event, handler, delay = 250, options = {}) {
    let timeout
    const debouncedHandler = (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => handler(...args), delay)
    }

    this.add(element, event, debouncedHandler, options)
    return debouncedHandler
  }

  addThrottled(element, event, handler, delay = 16, options = {}) {
    let lastCall = 0
    const throttledHandler = (...args) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        handler(...args)
      }
    }

    this.add(element, event, throttledHandler, options)
    return throttledHandler
  }
}

// WEBGL UTILITIES - Common WebGL operations
class WebGLUtils {
  static createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compilation error:", gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  static createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }

    return program
  }

  static createBuffer(gl, data, usage = gl.STATIC_DRAW) {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, data, usage)
    return buffer
  }

  static setupAttribute(gl, program, attributeName, buffer, size, type = gl.FLOAT) {
    const location = gl.getAttribLocation(program, attributeName)
    if (location === -1) return null

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(location)
    gl.vertexAttribPointer(location, size, type, false, 0, 0)

    return location
  }
}

// Export utilities
if (typeof window !== "undefined") {
  window.DeviceDetector = DeviceDetector
  window.PerformanceMonitor = PerformanceMonitor
  window.AnimationFrameManager = AnimationFrameManager
  window.ColorUtils = ColorUtils
  window.MathUtils = MathUtils
  window.CanvasUtils = CanvasUtils
  window.EventManager = EventManager
  window.WebGLUtils = WebGLUtils
}
