/* cursorTrail.js - Custom Cursor Effects
 * 
 * PURPOSE: Custom crosshair + trailing circle cursor system
 * 
 * EDITABLE PARAMETERS:
 * - Crosshair size (CSS: 20px): Main cursor size
 * - Trail size (CSS: 40px): Following circle size
 * - Trail delay (line 75): Following animation timing
 * - Interactive scaling (line 50): Hover effects on clickable elements
 * 
 * FEATURES: Lightweight, touch-device aware, hover state detection
 */
class CursorTrail {
  constructor() {
    this.crosshair = document.getElementById('cursorCrosshair');
    this.trail = document.getElementById('cursorTrail');
    this.mouse = { x: 0, y: 0 };
    this.trail.style.left = '0px';
    this.trail.style.top = '0px';
    this.isActive = false;
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.mouseMoveHandler = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      
      if (!this.isActive) {
        this.isActive = true;
        this.crosshair.style.opacity = '1';
        this.trail.style.opacity = '0.5';
      }

      this.updateCrosshair();
    };

    this.mouseLeaveHandler = () => {
      this.isActive = false;
      this.crosshair.style.opacity = '0';
      this.trail.style.opacity = '0';
    };

    this.mouseEnterHandler = () => {
      if (this.mouse.x > 0 || this.mouse.y > 0) {
        this.isActive = true;
        this.crosshair.style.opacity = '1';
        this.trail.style.opacity = '0.5';
      }
    };

    // Fixed event delegation for interactive elements
    this.elementInteractionHandler = (e) => {
      const interactiveElement = e.target.closest('a, button, .project-card, .nav-link');
      
      if (interactiveElement) {
        if (e.type === 'mouseenter') {
          this.crosshair.style.opacity = '0.3';
          this.trail.style.transform = 'translate(-50%, -50%) scale(1.2)';
        } else if (e.type === 'mouseleave') {
          this.crosshair.style.opacity = '1';
          this.trail.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      }
    };

    document.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
    document.addEventListener('mouseleave', this.mouseLeaveHandler);
    document.addEventListener('mouseenter', this.mouseEnterHandler);
    
    // Use event delegation instead of capturing all mouseenter/leave events
    document.addEventListener('mouseenter', this.elementInteractionHandler, true);
    document.addEventListener('mouseleave', this.elementInteractionHandler, true);
  }

  updateCrosshair() {
    // Update crosshair position with proper centering
    this.crosshair.style.left = `${this.mouse.x}px`;
    this.crosshair.style.top = `${this.mouse.y}px`;
    this.crosshair.style.transform = 'translate(-50%, -50%)';

    // Update trail position with slight delay and proper centering
    clearTimeout(this.trailTimeout);
    this.trailTimeout = setTimeout(() => {
      this.trail.style.left = `${this.mouse.x}px`;
      this.trail.style.top = `${this.mouse.y}px`;
    }, 50);
  }

  setColor(color) {
    this.crosshair.style.borderColor = color;
    this.trail.style.borderColor = color;
  }

  destroy() {
    if (this.mouseMoveHandler) {
      document.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    if (this.mouseLeaveHandler) {
      document.removeEventListener('mouseleave', this.mouseLeaveHandler);
    }
    if (this.mouseEnterHandler) {
      document.removeEventListener('mouseenter', this.mouseEnterHandler);
    }
    if (this.elementInteractionHandler) {
      document.removeEventListener('mouseenter', this.elementInteractionHandler, true);
      document.removeEventListener('mouseleave', this.elementInteractionHandler, true);
    }
    
    // Clear any pending timeouts
    if (this.trailTimeout) {
      clearTimeout(this.trailTimeout);
    }
  }
}

// Export for use in main.js
window.CursorTrail = CursorTrail;