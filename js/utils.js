/**
 * utils.js - Cyberpunk Portfolio Utilities (Redesigned)
 *
 * ARCHITECTURE:
 * - Singleton pattern for performance
 * - Enhanced media handling with video support
 * - Optimized for monochrome aesthetic
 * - Grid-based layout utilities
 */

;(() => {
  // DEVICE DETECTION - Enhanced for cyberpunk performance profiling
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

      // Enhanced capability detection
      this.deviceMemory = navigator.deviceMemory || 4
      this.hardwareConcurrency = navigator.hardwareConcurrency || 4
      this.connectionSpeed = navigator.connection?.effectiveType || "4g"
      this.prefersReducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

      DeviceDetector.instance = this
    }

    getDeviceInfo() {
      return {
        isDesktop: this.isDesktop,
        isTouchDevice: this.isTouchDevice,
        deviceMemory: this.deviceMemory,
        hardwareConcurrency: this.hardwareConcurrency,
        connectionSpeed: this.connectionSpeed,
        prefersReducedMotion: this.prefersReducedMotion,
        userAgent: navigator.userAgent,
      }
    }

    getPerformanceProfile() {
      if (this.prefersReducedMotion) return "minimal"

      if (
        this.isMobile ||
        this.deviceMemory < 4 ||
        this.hardwareConcurrency < 4 ||
        ["slow-2g", "2g"].includes(this.connectionSpeed)
      ) {
        return "mobile"
      } else if (this.isTablet || this.deviceMemory < 8 || this.connectionSpeed === "3g") {
        return "tablet"
      } else {
        return "desktop"
      }
    }
  }

  // PERFORMANCE MONITOR - Enhanced for cyberpunk metrics
  class PerformanceMonitor {
    static instance = null

    constructor() {
      if (PerformanceMonitor.instance) {
        return PerformanceMonitor.instance
      }

      this.startTime = null
      this.measures = {}
      this.frameCount = 0
      this.lastFrameTime = 0
      this.fps = 0

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

    updateFPS() {
      const now = performance.now()
      this.frameCount++

      if (now - this.lastFrameTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFrameTime))
        this.frameCount = 0
        this.lastFrameTime = now
      }
    }

    getMeasure(name) {
      return this.measures[name] || null
    }

    getSystemStats() {
      return {
        fps: this.fps,
        measures: this.measures,
        memoryUsage: performance.memory
          ? {
              used: Math.round(performance.memory.usedJSHeapSize / 1048576),
              total: Math.round(performance.memory.totalJSHeapSize / 1048576),
              limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576),
            }
          : null,
      }
    }

    report() {
      console.group("🔧 Performance Report")
      console.log(`FPS: ${this.fps}`)

      for (const name in this.measures) {
        if (this.measures[name].end) {
          console.log(`${name}: ${this.measures[name].duration.toFixed(2)}ms`)
        } else {
          console.log(`${name}: Not completed`)
        }
      }

      if (performance.memory) {
        const memory = performance.memory
        console.log(
          `Memory: ${Math.round(memory.usedJSHeapSize / 1048576)}MB used / ${Math.round(memory.totalJSHeapSize / 1048576)}MB total`,
        )
      }

      console.groupEnd()
    }
  }

  // ANIMATION FRAME MANAGER - Optimized for cyberpunk effects
  class AnimationFrameManager {
    static instance = null

    constructor() {
      if (AnimationFrameManager.instance) {
        return AnimationFrameManager.instance
      }

      this.animationFrameId = null
      this.callbacks = []
      this.isRunning = false
      this.lastTime = 0
      this.deltaTime = 0
      this.targetFPS = 60
      this.frameInterval = 1000 / this.targetFPS

      AnimationFrameManager.instance = this
    }

    add(callback, priority = 0) {
      if (typeof callback === "function") {
        this.callbacks.push({ callback, priority })
        this.callbacks.sort((a, b) => b.priority - a.priority)

        if (!this.isRunning) {
          this.start()
        }
      }
    }

    remove(callback) {
      this.callbacks = this.callbacks.filter((item) => item.callback !== callback)
      if (this.callbacks.length === 0) {
        this.stop()
      }
    }

    start() {
      if (!this.isRunning) {
        this.isRunning = true
        this.lastTime = performance.now()
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

    tick(currentTime) {
      if (this.isRunning) {
        this.deltaTime = currentTime - this.lastTime

        if (this.deltaTime >= this.frameInterval) {
          for (const item of this.callbacks) {
            try {
              item.callback(this.deltaTime, currentTime)
            } catch (error) {
              console.warn("Animation callback error:", error)
            }
          }
          this.lastTime = currentTime - (this.deltaTime % this.frameInterval)
        }

        this.animationFrameId = requestAnimationFrame(this.tick.bind(this))
      }
    }

    setTargetFPS(fps) {
      this.targetFPS = Math.max(1, Math.min(120, fps))
      this.frameInterval = 1000 / this.targetFPS
    }
  }

  // COLOR UTILITIES - Enhanced for monochrome cyberpunk palette
  class ColorUtils {
    static instance = null

    constructor() {
      if (ColorUtils.instance) {
        return ColorUtils.instance
      }

      // Cyberpunk color palette
      this.palette = {
        pureBlack: "#000000",
        deepBlack: "#0a0a0a",
        charcoal: "#1a1a1a",
        darkGray: "#2a2a2a",
        midGray: "#404040",
        lightGray: "#808080",
        paleGray: "#c0c0c0",
        offWhite: "#f0f0f0",
        pureWhite: "#ffffff",
        electricLime: "hsl(83, 100%, 62%)",
        neonMagenta: "hsl(325, 100%, 59%)",
        cyberBlue: "hsl(205, 100%, 52%)",
        warningOrange: "hsl(18, 100%, 62%)",
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
        r = g = b = l
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
        h = s = 0
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

    // Generate monochrome variations
    getMonochromeVariation(baseColor, variation = 0.1) {
      const rgb = this.hexToRgb(baseColor)
      if (!rgb) return baseColor

      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b)
      hsl.l = Math.max(0, Math.min(1, hsl.l + variation))

      const newRgb = this.hslToRgb(hsl.h, hsl.s, hsl.l)
      return this.rgbToHex(newRgb.r, newRgb.g, newRgb.b)
    }

    // Get contrast color for accessibility
    getContrastColor(backgroundColor) {
      const rgb = this.hexToRgb(backgroundColor)
      if (!rgb) return this.palette.pureWhite

      const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
      return brightness > 128 ? this.palette.pureBlack : this.palette.pureWhite
    }
  }

  // MATH UTILITIES - Enhanced for geometric calculations
  class MathUtils {
    static instance = null

    constructor() {
      if (MathUtils.instance) {
        return MathUtils.instance
      }

      this.PI = Math.PI
      this.TWO_PI = Math.PI * 2
      this.HALF_PI = Math.PI / 2
      this.DEG_TO_RAD = Math.PI / 180
      this.RAD_TO_DEG = 180 / Math.PI

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

    randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    map(value, start1, stop1, start2, stop2) {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
    }

    distance(x1, y1, x2, y2) {
      const dx = x2 - x1
      const dy = y2 - y1
      return Math.sqrt(dx * dx + dy * dy)
    }

    angle(x1, y1, x2, y2) {
      return Math.atan2(y2 - y1, x2 - x1)
    }

    // Easing functions for smooth animations
    easeInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }

    easeOut(t) {
      return 1 - Math.pow(1 - t, 3)
    }

    easeIn(t) {
      return t * t * t
    }

    // Grid utilities
    snapToGrid(value, gridSize) {
      return Math.round(value / gridSize) * gridSize
    }

    getGridPosition(x, y, gridSize) {
      return {
        x: this.snapToGrid(x, gridSize),
        y: this.snapToGrid(y, gridSize),
      }
    }
  }

  // CANVAS UTILITIES - Enhanced for cyberpunk effects
  class CanvasUtils {
    static instance = null

    constructor() {
      if (CanvasUtils.instance) {
        return CanvasUtils.instance
      }

      CanvasUtils.instance = this
    }

    createCanvas(width, height, options = {}) {
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      if (options.alpha !== undefined) {
        canvas.style.background = options.alpha ? "transparent" : "#000000"
      }

      return canvas
    }

    getContext(canvas, contextType = "2d", options = {}) {
      const defaultOptions = {
        alpha: true,
        antialias: true,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
      }

      return canvas.getContext(contextType, { ...defaultOptions, ...options })
    }

    clearCanvas(context, width, height) {
      context.clearRect(0, 0, width, height)
    }

    // Cyberpunk-specific drawing utilities
    drawGlitchLine(context, x1, y1, x2, y2, intensity = 1) {
      context.save()

      const segments = Math.floor(intensity * 10)
      const segmentLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) / segments

      for (let i = 0; i < segments; i++) {
        const t1 = i / segments
        const t2 = (i + 1) / segments

        const sx = x1 + (x2 - x1) * t1
        const sy = y1 + (y2 - y1) * t1
        const ex = x1 + (x2 - x1) * t2
        const ey = y1 + (y2 - y1) * t2

        // Add random offset for glitch effect
        const offset = (Math.random() - 0.5) * intensity * 2

        context.beginPath()
        context.moveTo(sx + offset, sy + offset)
        context.lineTo(ex + offset, ey + offset)
        context.stroke()
      }

      context.restore()
    }

    drawFragmentedRect(context, x, y, width, height, fragmentSize = 10) {
      context.save()

      for (let fx = 0; fx < width; fx += fragmentSize) {
        for (let fy = 0; fy < height; fy += fragmentSize) {
          const fw = Math.min(fragmentSize, width - fx)
          const fh = Math.min(fragmentSize, height - fy)

          // Random offset for fragmentation
          const offsetX = (Math.random() - 0.5) * 2
          const offsetY = (Math.random() - 0.5) * 2

          context.fillRect(x + fx + offsetX, y + fy + offsetY, fw, fh)
        }
      }

      context.restore()
    }
  }

  // EVENT MANAGER - Enhanced for cyberpunk interactions
  class EventManager {
    static instance = null

    constructor() {
      if (EventManager.instance) {
        return EventManager.instance
      }

      this.events = {}
      this.eventHistory = []
      this.maxHistorySize = 100

      EventManager.instance = this
    }

    on(event, callback, options = {}) {
      if (!this.events[event]) {
        this.events[event] = []
      }

      this.events[event].push({
        callback,
        once: options.once || false,
        priority: options.priority || 0,
      })

      // Sort by priority
      this.events[event].sort((a, b) => b.priority - a.priority)
    }

    off(event, callback) {
      if (this.events[event]) {
        this.events[event] = this.events[event].filter((item) => item.callback !== callback)
      }
    }

    trigger(event, data) {
      // Add to history
      this.eventHistory.push({
        event,
        data,
        timestamp: Date.now(),
      })

      if (this.eventHistory.length > this.maxHistorySize) {
        this.eventHistory.shift()
      }

      if (this.events[event]) {
        this.events[event] = this.events[event].filter((item) => {
          try {
            item.callback(data)
            return !item.once
          } catch (error) {
            console.warn(`Event callback error for ${event}:`, error)
            return !item.once
          }
        })
      }
    }

    getEventHistory(eventType = null) {
      if (eventType) {
        return this.eventHistory.filter((item) => item.event === eventType)
      }
      return [...this.eventHistory]
    }

    clearHistory() {
      this.eventHistory = []
    }
  }

  // MEDIA UTILITIES - Enhanced with video support
  class MediaUtils {
    static instance = null

    constructor() {
      if (MediaUtils.instance) {
        return MediaUtils.instance
      }

      this.config = this.detectConfig()
      this.supportedFormats = this.getSupportedFormats()

      MediaUtils.instance = this
    }

    detectConfig() {
      return {
        basePath: window.location.pathname.includes("/audiodevout.github.io") ? "/audiodevout.github.io" : "",
        assetsPath: "./assets",
        isDevelopment: window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1",
      }
    }

    resolveAssetPath(path) {
      if (!path) return ""

      if (path.startsWith("http://") || path.startsWith("https://")) {
        return path
      }

      const cleanPath = path.startsWith("/") ? path.substring(1) : path

      if (cleanPath.startsWith("assets/")) {
        return "./" + cleanPath
      }

      return cleanPath.startsWith("./") ? cleanPath : "./" + cleanPath
    }

    async checkMediaExists(url) {
      try {
        const response = await fetch(url, { method: "HEAD" })
        return response.ok
      } catch (error) {
        console.warn("Media check failed:", url, error)
        return false
      }
    }

    // Enhanced video support
    isVideoUrl(url) {
      const videoExtensions = /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i
      const youtubePattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      const vimeoPattern = /vimeo\.com\/(\d+)/

      return videoExtensions.test(url) || youtubePattern.test(url) || vimeoPattern.test(url)
    }

    extractVideoId(url) {
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)

      if (youtubeMatch) {
        return { platform: "youtube", id: youtubeMatch[1] }
      } else if (vimeoMatch) {
        return { platform: "vimeo", id: vimeoMatch[1] }
      }

      return null
    }

    generateVideoEmbed(url, options = {}) {
      const videoInfo = this.extractVideoId(url)

      if (!videoInfo) {
        // Regular video file
        return `
          <video 
            controls 
            preload="metadata"
            style="width: 100%; height: auto; background: var(--pure-black);"
            ${options.poster ? `poster="${options.poster}"` : ""}
          >
            <source src="${url}" type="video/mp4">
            <p style="color: var(--mid-gray); font-family: var(--font-mono); font-size: var(--text-sm);">
              Your browser doesn't support video playback. 
              <a href="${url}" target="_blank" style="color: var(--electric-lime);">Download video</a>
            </p>
          </video>
        `
      }

      if (videoInfo.platform === "youtube") {
        return `
          <div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: var(--deep-black); border: var(--border-thin);">
            <iframe 
              src="https://www.youtube.com/embed/${videoInfo.id}" 
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
              referrerpolicy="strict-origin-when-cross-origin"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
            </iframe>
          </div>
        `
      }

      if (videoInfo.platform === "vimeo") {
        return `
          <div class="video-wrapper" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; background: var(--deep-black); border: var(--border-thin);">
            <iframe 
              src="https://player.vimeo.com/video/${videoInfo.id}" 
              title="Vimeo video player"
              frameborder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowfullscreen
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;">
            </iframe>
          </div>
        `
      }

      return ""
    }

    generateMediaFallback(type, path, title = "") {
      const fallbackStyles = `
        display: flex; 
        align-items: center; 
        justify-content: center; 
        min-height: 200px; 
        background: var(--charcoal); 
        border: var(--border-thin); 
        color: var(--mid-gray); 
        font-family: var(--font-mono); 
        font-size: var(--text-sm); 
        text-align: center; 
        padding: var(--space-4);
      `

      const messages = {
        image: `📷 Image not available<br><small style="font-size: 0.7rem; opacity: 0.7;">Path: ${path}</small>`,
        video: `🎬 Video not available<br><small style="font-size: 0.7rem; opacity: 0.7;">Path: ${path}</small>`,
        audio: `🎵 Audio not available<br><small style="font-size: 0.7rem; opacity: 0.7;">Path: ${path}</small>`,
      }

      return `<div class="media-fallback" style="${fallbackStyles}">${messages[type] || "Media not available"}</div>`
    }

    preloadMedia(urls) {
      if (!Array.isArray(urls)) return

      urls.forEach((url) => {
        const resolvedUrl = this.resolveAssetPath(url)

        if (url.match(/\.(jpg|jpeg|png|gif|webp|avif)$/i)) {
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

    supportsWebP() {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0
    }

    supportsAVIF() {
      const canvas = document.createElement("canvas")
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0
    }

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

    processPortfolioMedia(portfolioData) {
      if (!portfolioData || !portfolioData.projects) return portfolioData

      const processedData = JSON.parse(JSON.stringify(portfolioData))

      Object.values(processedData.projects).forEach((category) => {
        if (Array.isArray(category)) {
          category.forEach((project) => {
            if (project.images && Array.isArray(project.images)) {
              project.images = project.images.map((path) => this.resolveAssetPath(path))
            }

            if (project.videos && Array.isArray(project.videos)) {
              project.videos = project.videos.map((path) => this.resolveAssetPath(path))
            }

            if (project.audioFile && typeof project.audioFile === "string") {
              project.audioFile = this.resolveAssetPath(project.audioFile)
            }

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

  // GRID UTILITIES - New for cyberpunk layout system
  class GridUtils {
    static instance = null

    constructor() {
      if (GridUtils.instance) {
        return GridUtils.instance
      }

      this.baseUnit = 8 // 8px grid system
      this.breakpoints = {
        mobile: 480,
        tablet: 768,
        desktop: 1024,
        wide: 1440,
      }

      GridUtils.instance = this
    }

    getGridSize(multiplier = 1) {
      return this.baseUnit * multiplier
    }

    getBreakpoint() {
      const width = window.innerWidth

      if (width < this.breakpoints.mobile) return "mobile"
      if (width < this.breakpoints.tablet) return "tablet"
      if (width < this.breakpoints.desktop) return "desktop"
      return "wide"
    }

    calculateGridColumns(containerWidth, itemMinWidth, gap = 16) {
      const availableWidth = containerWidth - gap
      const itemWidth = itemMinWidth + gap
      return Math.max(1, Math.floor(availableWidth / itemWidth))
    }

    generateGridCSS(columns, gap = "var(--space-2)") {
      return {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: gap,
      }
    }

    // Fragmented grid for cyberpunk aesthetic
    generateFragmentedGrid(items, maxColumns = 6) {
      const breakpoint = this.getBreakpoint()
      let columns

      switch (breakpoint) {
        case "mobile":
          columns = Math.min(2, maxColumns)
          break
        case "tablet":
          columns = Math.min(3, maxColumns)
          break
        case "desktop":
          columns = Math.min(4, maxColumns)
          break
        default:
          columns = maxColumns
      }

      return {
        columns,
        itemsPerRow: Math.ceil(items.length / columns),
        css: this.generateGridCSS(columns),
      }
    }
  }

  // Export utilities to global scope
  if (typeof window !== "undefined") {
    window.DeviceDetector = DeviceDetector
    window.PerformanceMonitor = PerformanceMonitor
    window.AnimationFrameManager = AnimationFrameManager
    window.ColorUtils = ColorUtils
    window.MathUtils = MathUtils
    window.CanvasUtils = CanvasUtils
    window.EventManager = EventManager
    window.MediaUtils = MediaUtils
    window.GridUtils = GridUtils

    // Create global instances
    window.deviceDetector = new DeviceDetector()
    window.performanceMonitor = new PerformanceMonitor()
    window.animationFrameManager = new AnimationFrameManager()
    window.colorUtils = new ColorUtils()
    window.mathUtils = new MathUtils()
    window.canvasUtils = new CanvasUtils()
    window.eventManager = new EventManager()
    window.mediaUtils = new MediaUtils()
    window.gridUtils = new GridUtils()

    // Convenience functions
    window.resolveAssetPath = window.mediaUtils.resolveAssetPath.bind(window.mediaUtils)

    console.log("🔧 Cyberpunk Portfolio utilities loaded successfully")
    console.log("📊 Device Profile:", window.deviceDetector.getPerformanceProfile())
    console.log("🎬 Supported Formats:", window.mediaUtils.getSupportedFormats())
  }
})()
