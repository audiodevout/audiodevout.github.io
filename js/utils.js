// DEVICE DETECTION - Detects device type and capabilities
class DeviceDetector {
  static instance = null

  constructor() {
    if (DeviceDetector.instance) {
      return DeviceDetector.instance
    }

    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    this.isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows( +arm)))/i.test(navigator.userAgent)
    this.isDesktop = !this.isMobile && !this.isTablet
    this.isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    this.isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0

    DeviceDetector.instance = this
  }

  getDeviceInfo() {
    return {
      isMobile: this.isMobile,
      isTablet: this.isTablet,
      isDesktop: this.isDesktop,
      isiOS: this.isiOS,
      isTouchDevice: this.isTouchDevice,
      userAgent: navigator.userAgent,
    }
  }
}

// PERFORMANCE MONITOR - Measures and reports performance metrics
class PerformanceMonitor {
  static instance = null

  constructor() {
    if (PerformanceMonitor.instance) {
      return PerformanceMonitor.instance
    }

    this.startTime = null
    this.measures = {}
    PerformanceMonitor.instance = this
  }

  start(name) {
    this.startTime = performance.now()
    this.measures[name] = { start: this.startTime, end: null, duration: null }
  }

  end(name) {
    if (this.measures[name]) {
      this.measures[name].end = performance.now()
      this.measures[name].duration = this.measures[name].end - this.measures[name].start
    }
  }

  getMeasure(name) {
    return this.measures[name] || null
  }

  report() {
    for (const name in this.measures) {
      if (this.measures[name].end) {
        console.log(`${name}: ${this.measures[name].duration.toFixed(2)}ms`)
      } else {
        console.log(`${name}: Not completed`)
      }
    }
  }
}

// ANIMATION FRAME MANAGER - Manages and optimizes animation frames
class AnimationFrameManager {
  static instance = null

  constructor() {
    if (AnimationFrameManager.instance) {
      return AnimationFrameManager.instance
    }

    this.animationFrameId = null
    this.callbacks = []
    this.isRunning = false
    AnimationFrameManager.instance = this
  }

  add(callback) {
    if (typeof callback === "function") {
      this.callbacks.push(callback)
      if (!this.isRunning) {
        this.start()
      }
    }
  }

  remove(callback) {
    this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    if (this.callbacks.length === 0) {
      this.stop()
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.animationFrameId = requestAnimationFrame(this.tick.bind(this))
    }
  }

  stop() {
    if (this.isRunning) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
      this.isRunning = false
    }
  }

  tick() {
    if (this.isRunning) {
      for (const callback of this.callbacks) {
        callback()
      }
      this.animationFrameId = requestAnimationFrame(this.tick.bind(this))
    }
  }
}

// COLOR UTILITIES - Color manipulation and conversion functions
class ColorUtils {
  static instance = null

  constructor() {
    if (ColorUtils.instance) {
      return ColorUtils.instance
    }

    ColorUtils.instance = this
  }

  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  hslToRgb(h, s, l) {
    h /= 360
    let r, g, b

    if (s === 0) {
      r = g = b = l // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  rgbToHsl(r, g, b) {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b)
    let h,
      s,
      l = (max + min) / 2

    if (max === min) {
      h = s = 0 // achromatic
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: h * 360,
      s: s,
      l: l,
    }
  }
}

// MATH UTILITIES - Mathematical functions and constants
class MathUtils {
  static instance = null

  constructor() {
    if (MathUtils.instance) {
      return MathUtils.instance
    }

    this.PI = Math.PI
    this.TWO_PI = Math.PI * 2
    this.HALF_PI = Math.PI / 2
    MathUtils.instance = this
  }

  lerp(a, b, t) {
    return a + (b - a) * t
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
  }

  random(min, max) {
    return Math.random() * (max - min) + min
  }

  map(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  }
}

// CANVAS UTILITIES - Canvas manipulation and drawing functions
class CanvasUtils {
  static instance = null

  constructor() {
    if (CanvasUtils.instance) {
      return CanvasUtils.instance
    }

    CanvasUtils.instance = this
  }

  createCanvas(width, height) {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    return canvas
  }

  getContext(canvas, contextType = "2d") {
    return canvas.getContext(contextType)
  }

  clearCanvas(context, width, height) {
    context.clearRect(0, 0, width, height)
  }
}

// EVENT MANAGER - Manages custom events and listeners
class EventManager {
  static instance = null

  constructor() {
    if (EventManager.instance) {
      return EventManager.instance
    }

    this.events = {}
    EventManager.instance = this
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback)
    }
  }

  trigger(event, data) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => callback(data))
    }
  }
}

// WEBGL UTILITIES - WebGL helper functions
class WebGLUtils {
  static instance = null

  constructor() {
    if (WebGLUtils.instance) {
      return WebGLUtils.instance
    }

    WebGLUtils.instance = this
  }

  createShader(gl, type, source) {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }

    return shader
  }

  createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram()
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }

    return program
  }
}

// MEDIA UTILITIES - Media path resolution and handling for GitHub Pages
class MediaUtils {
  static instance = null

  constructor() {
    if (MediaUtils.instance) {
      return MediaUtils.instance
    }

    this.config = this.detectConfig()
    MediaUtils.instance = this
  }

  detectConfig() {
    return {
      basePath: window.location.pathname.includes("/audiodevout.github.io") ? "/audiodevout.github.io" : "",
      assetsPath: "./assets",
      isDevelopment: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1",
    }
  }

  // Resolve asset paths for different deployment scenarios
  resolveAssetPath(path) {
    if (!path) return ""

    // If it's already a full URL, return as-is
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path
    }

    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.substring(1) : path

    // For GitHub Pages, use relative paths
    if (cleanPath.startsWith("assets/")) {
      return "./" + cleanPath
    }

    // Default to relative path
    return cleanPath.startsWith("./") ? cleanPath : "./" + cleanPath
  }

  // Check if media file exists (basic implementation)
  async checkMediaExists(url) {
    try {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok
    } catch (error) {
      console.warn("Media check failed:", url, error)
      return false
    }
  }

  // Generate fallback content for missing media
  generateMediaFallback(type, path, title = "") {
    const fallbackStyles = `
      display: flex; 
      align-items: center; 
      justify-content: center; 
      min-height: 200px; 
      background: var(--glass-panel-light); 
      border: 2px dashed var(--glass-border); 
      border-radius: var(--radius-lg); 
      color: var(--color-pale-gray); 
      font-family: var(--font-mono); 
      font-size: var(--text-sm); 
      text-align: center; 
      padding: var(--space-md);
    `

    const messages = {
      image: `📷 Image not available<br><small style="font-size: 0.7rem; opacity: 0.7;">Path: ${path}</small>`,
      video: `🎬 Video not available<br><small style="font-size: 0.7rem; opacity: 0.7;">Path: ${path}</small>`,
      audio: `🎵 Audio not available<br><small style="font-size: 0.7rem; opacity: 0.7;">Path: ${path}</small>`,
    }

    return `<div class="media-fallback" style="${fallbackStyles}">${messages[type] || "Media not available"}</div>`
  }

  // Preload critical media files
  preloadMedia(urls) {
    if (!Array.isArray(urls)) return

    urls.forEach((url) => {
      const resolvedUrl = this.resolveAssetPath(url)

      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        const img = new Image()
        img.src = resolvedUrl
        img.onerror = () => console.warn(`Failed to preload image: ${resolvedUrl}`)
      } else if (url.match(/\.(mp4|webm|ogg)$/i)) {
        const video = document.createElement("video")
        video.preload = "metadata"
        video.src = resolvedUrl
        video.onerror = () => console.warn(`Failed to preload video: ${resolvedUrl}`)
      } else if (url.match(/\.(mp3|wav|ogg)$/i)) {
        const audio = new Audio()
        audio.preload = "metadata"
        audio.src = resolvedUrl
        audio.onerror = () => console.warn(`Failed to preload audio: ${resolvedUrl}`)
      }
    })
  }

  // Get supported media formats for the current browser
  getSupportedFormats() {
    const video = document.createElement("video")
    const audio = document.createElement("audio")

    return {
      video: {
        mp4: video.canPlayType("video/mp4") !== "",
        webm: video.canPlayType("video/webm") !== "",
        ogg: video.canPlayType("video/ogg") !== "",
      },
      audio: {
        mp3: audio.canPlayType("audio/mpeg") !== "",
        wav: audio.canPlayType("audio/wav") !== "",
        ogg: audio.canPlayType("audio/ogg") !== "",
      },
      image: {
        webp: this.supportsWebP(),
        avif: this.supportsAVIF(),
      },
    }
  }

  // Check WebP support
  supportsWebP() {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
  }

  // Check AVIF support
  supportsAVIF() {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0
  }

  // Generate responsive image sources
  generateResponsiveImageSources(basePath, formats = ["webp", "jpg"]) {
    const sources = []
    const resolvedBasePath = this.resolveAssetPath(basePath)

    formats.forEach((format) => {
      const path = resolvedBasePath.replace(/\.[^/.]+$/, `.${format}`)
      sources.push({
        srcset: path,
        type: `image/${format}`,
      })
    })

    return sources
  }

  // Batch process media paths in portfolio data
  processPortfolioMedia(portfolioData) {
    if (!portfolioData || !portfolioData.projects) return portfolioData

    const processedData = JSON.parse(JSON.stringify(portfolioData)) // Deep clone

    Object.values(processedData.projects).forEach((category) => {
      if (Array.isArray(category)) {
        category.forEach((project) => {
          // Process images
          if (project.images && Array.isArray(project.images)) {
            project.images = project.images.map((path) => this.resolveAssetPath(path))
          }

          // Process videos
          if (project.videos && Array.isArray(project.videos)) {
            project.videos = project.videos.map((path) => this.resolveAssetPath(path))
          }

          // Process audio files
          if (project.audioFile && typeof project.audioFile === "string") {
            project.audioFile = this.resolveAssetPath(project.audioFile)
          }

          // Process document URLs
          if (project.urls && typeof project.urls === "object") {
            Object.keys(project.urls).forEach((key) => {
              if (project.urls[key] && !project.urls[key].startsWith("http")) {
                project.urls[key] = this.resolveAssetPath(project.urls[key])
              }
            })
          }
        })
      }
    })

    return processedData
  }

  // Get media statistics
  getMediaStats(portfolioData) {
    let imageCount = 0
    let videoCount = 0
    let audioCount = 0

    if (portfolioData && portfolioData.projects) {
      Object.values(portfolioData.projects).forEach((category) => {
        if (Array.isArray(category)) {
          category.forEach((project) => {
            if (project.images) imageCount += project.images.length
            if (project.videos) videoCount += project.videos.length
            if (project.audioFile) audioCount += 1
          })
        }
      })
    }

    return { imageCount, videoCount, audioCount }
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
  window.MediaUtils = MediaUtils

  // Create global instances for convenience
  window.mediaUtils = new MediaUtils()
  window.resolveAssetPath = window.mediaUtils.resolveAssetPath.bind(window.mediaUtils)

  console.log("Portfolio utilities loaded successfully")
  console.log("Supported media formats:", window.mediaUtils.getSupportedFormats())
}
