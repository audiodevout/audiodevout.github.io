// // cursorTrail.js - Custom Cursor Effects (Mobile Optimized)
// //
// // PURPOSE: Custom crosshair + trailing circle cursor system
// // Automatically disabled on touch devices for better performance
// //
// // ============================================================================
// // MOBILE-OPTIMIZED PARAMETERS
// // ============================================================================
// const CURSOR_CONFIG = {
//   crosshairSize: 20, // Main cursor size (CSS controlled)
//   trailSize: 40, // Following circle size (CSS controlled)
//   trailDelay: 50, // Following animation timing (ms)
//   interactiveScaling: 1.2, // Hover effect scale multiplier
//   fadeSpeed: 0.3, // Fade in/out speed (seconds)
//   enableOnTouch: false, // Disable on touch devices
// }

// // INTERACTIVE ELEMENTS - Elements that trigger hover effects
// const INTERACTIVE_SELECTORS = [
//   "a",
//   "button",
//   ".project-card",
//   ".nav-link",
//   ".social-link",
//   ".modal-close",
//   '[role="button"]',
//   '[tabindex="0"]',
// ]

// /* ============================================================================
//  * END OF CONFIGURABLE PARAMETERS
//  * ============================================================================
//  */

// document.addEventListener("DOMContentLoaded", () => {
//   const cursor = document.createElement("div")
//   cursor.className = "cursor-trail"
//   document.body.appendChild(cursor)

//   let lastX = 0
//   let lastY = 0

//   document.addEventListener("mousemove", (e) => {
//     cursor.style.left = `${e.clientX}px`
//     cursor.style.top = `${e.clientY}px`

//     lastX = e.clientX
//     lastY = e.clientY
//   })

//   document.addEventListener("click", (e) => {
//     elementInteractionHandler(e)
//   })

//   class CursorTrail {
//     constructor() {
//       // Check if device supports touch - disable cursor effects on touch devices
//       this.isTouchDevice = this.detectTouchDevice()

//       if (this.isTouchDevice && !CURSOR_CONFIG.enableOnTouch) {
//         console.log("CursorTrail disabled on touch device")
//         return
//       }

//       // Get cursor elements
//       this.crosshair = document.getElementById("cursorCrosshair")
//       this.trail = document.getElementById("cursorTrail")

//       if (!this.crosshair || !this.trail) {
//         console.warn("Cursor elements not found")
//         return
//       }

//       // Initialize state
//       this.mouse = { x: 0, y: 0 }
//       this.isActive = false
//       this.trailTimeout = null
//       this.currentInteractiveElement = null

//       // Performance optimization
//       this.rafId = null
//       this.lastUpdateTime = 0
//       this.updateThrottle = 16 // ~60fps

//       this.init()
//     }

//     /**
//      * Detect if device supports touch
//      */
//     detectTouchDevice() {
//       return (
//         "ontouchstart" in window ||
//         navigator.maxTouchPoints > 0 ||
//         navigator.msMaxTouchPoints > 0 ||
//         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
//       )
//     }

//     init() {
//       this.setupInitialStyles()
//       this.bindEvents()
//       console.log("CursorTrail initialized for desktop device")
//     }

//     setupInitialStyles() {
//       // Ensure cursor elements are properly positioned
//       this.crosshair.style.left = "0px"
//       this.crosshair.style.top = "0px"
//       this.crosshair.style.opacity = "0"

//       this.trail.style.left = "0px"
//       this.trail.style.top = "0px"
//       this.trail.style.opacity = "0"
//       this.trail.style.transform = "translate(-50%, -50%) scale(1)"
//     }

//     bindEvents() {
//       // Mouse move handler with throttling
//       this.mouseMoveHandler = (e) => {
//         this.mouse.x = e.clientX
//         this.mouse.y = e.clientY

//         const now = Date.now()
//         if (now - this.lastUpdateTime > this.updateThrottle) {
//           this.updateCursorPosition()
//           this.lastUpdateTime = now
//         } else if (!this.rafId) {
//           this.rafId = requestAnimationFrame(() => {
//             this.updateCursorPosition()
//             this.rafId = null
//           })
//         }

//         if (!this.isActive) {
//           this.showCursor()
//         }
//       }

//       // Mouse leave handler
//       this.mouseLeaveHandler = () => {
//         this.hideCursor()
//       }

//       // Mouse enter handler
//       this.mouseEnterHandler = () => {
//         if (this.mouse.x > 0 || this.mouse.y > 0) {
//           this.showCursor()
//         }
//       }

//       // Interactive element handlers with improved event delegation
//       this.elementInteractionHandler = (e) => {
//         // FIX APPLIED HERE: Ensure e.target is an Element before calling .closest()
//         const interactiveElement =
//           e.target instanceof Element ? e.target.closest(INTERACTIVE_SELECTORS.join(", ")) : null

//         if (e.type === "mouseenter" && interactiveElement) {
//           this.handleInteractiveEnter(interactiveElement)
//         } else if (e.type === "mouseleave" && this.currentInteractiveElement) {
//           this.handleInteractiveLeave()
//         }
//       }

//       // Bind events
//       document.addEventListener("mousemove", this.mouseMoveHandler, { passive: true })
//       document.addEventListener("mouseleave", this.mouseLeaveHandler)
//       document.addEventListener("mouseenter", this.mouseEnterHandler)

//       // Use event delegation for interactive elements
//       document.addEventListener("mouseenter", this.elementInteractionHandler, true)
//       document.addEventListener("mouseleave", this.elementInteractionHandler, true)

//       // Handle page visibility for performance
//       this.visibilityChangeHandler = () => {
//         if (document.hidden) {
//           this.hideCursor()
//         }
//       }
//       document.addEventListener("visibilitychange", this.visibilityChangeHandler)
//     }

//     updateCursorPosition() {
//       if (!this.isActive) return

//       // Update crosshair position immediately
//       this.crosshair.style.left = `${this.mouse.x}px`
//       this.crosshair.style.top = `${this.mouse.y}px`

//       // Update trail position with delay
//       clearTimeout(this.trailTimeout)
//       this.trailTimeout = setTimeout(() => {
//         this.trail.style.left = `${this.mouse.x}px`
//         this.trail.style.top = `${this.mouse.y}px`
//       }, CURSOR_CONFIG.trailDelay)
//     }

//     showCursor() {
//       this.isActive = true
//       this.crosshair.style.opacity = "1"
//       this.trail.style.opacity = "0.5"
//     }

//     hideCursor() {
//       this.isActive = false
//       this.crosshair.style.opacity = "0"
//       this.trail.style.opacity = "0"

//       // Reset any interactive states
//       if (this.currentInteractiveElement) {
//         this.handleInteractiveLeave()
//       }
//     }

//     handleInteractiveEnter(element) {
//       this.currentInteractiveElement = element

//       // Reduce crosshair opacity and scale up trail
//       this.crosshair.style.opacity = "0.3"
//       this.trail.style.transform = `translate(-50%, -50%) scale(${CURSOR_CONFIG.interactiveScaling})`

//       // Add transition for smooth scaling
//       this.trail.style.transition = `transform ${CURSOR_CONFIG.fadeSpeed}s ease`
//     }

//     handleInteractiveLeave() {
//       this.currentInteractiveElement = null

//       // Restore normal cursor state
//       this.crosshair.style.opacity = "1"
//       this.trail.style.transform = "translate(-50%, -50%) scale(1)"

//       // Remove transition after animation completes
//       setTimeout(() => {
//         this.trail.style.transition = ""
//       }, CURSOR_CONFIG.fadeSpeed * 1000)
//     }

//     /**
//      * Update cursor colors dynamically
//      */
//     setColor(crosshairColor, trailColor = null) {
//       this.crosshair.style.borderColor = crosshairColor
//       this.trail.style.borderColor = trailColor || crosshairColor
//     }

//     /**
//      * Temporarily hide cursor (useful for modals, etc.)
//      */
//     hide() {
//       this.crosshair.style.display = "none"
//       this.trail.style.display = "none"
//     }

//     /**
//      * Show cursor again
//      */
//     show() {
//       this.crosshair.style.display = "block"
//       this.trail.style.display = "block"
//     }

//     /**
//      * Get current cursor state for debugging
//      */
//     getState() {
//       return {
//         isActive: this.isActive,
//         isTouchDevice: this.isTouchDevice,
//         mousePosition: { ...this.mouse },
//         currentInteractiveElement: this.currentInteractiveElement?.tagName || null,
//       }
//     }

//     destroy() {
//       // Clear any pending timeouts
//       if (this.trailTimeout) {
//         clearTimeout(this.trailTimeout)
//       }

//       if (this.rafId) {
//         cancelAnimationFrame(this.rafId)
//       }

//       // Remove event listeners
//       if (this.mouseMoveHandler) {
//         document.removeEventListener("mousemove", this.mouseMoveHandler)
//       }
//       if (this.mouseLeaveHandler) {
//         document.removeEventListener("mouseleave", this.mouseLeaveHandler)
//       }
//       if (this.mouseEnterHandler) {
//         document.removeEventListener("mouseenter", this.mouseEnterHandler)
//       }
//       if (this.elementInteractionHandler) {
//         document.removeEventListener("mouseenter", this.elementInteractionHandler, true)
//         document.removeEventListener("mouseleave", this.elementInteractionHandler, true)
//       }
//       if (this.visibilityChangeHandler) {
//         document.removeEventListener("visibilitychange", this.visibilityChangeHandler)
//       }

//       // Reset cursor elements
//       if (this.crosshair) {
//         this.crosshair.style.opacity = "0"
//       }
//       if (this.trail) {
//         this.trail.style.opacity = "0"
//       }

//       console.log("CursorTrail destroyed")
//     }
//   }

//   // Export for use in main.js
//   if (typeof window !== "undefined") {
//     window.CursorTrail = CursorTrail
//   }

//   const cursorTrailInstance = new CursorTrail()
// })

// function elementInteractionHandler(e) {
//   // Check if e.target is an element and has the closest method
//   const interactiveElement = e.target instanceof Element ? e.target.closest(INTERACTIVE_SELECTORS.join(", ")) : null
//   if (interactiveElement) {
//     // Handle interaction with interactive element
//     console.log("Interactive element clicked:", interactiveElement)
//   }
// }
