// ===================================================================
// CUSTOM CURSOR SYSTEM
// Cyberpunk crosshair cursor with axis markers and particle repulsion
// ===================================================================

const CursorSystem = {
    // State
    isActive: false,
    mousePos: { x: 0, y: 0 },
    targetPos: { x: 0, y: 0 },
    trail: [],
    maxTrailLength: 10,
    
    // Elements
    cursor: null,
    dot: null,
    crosshairH: null,
    crosshairV: null,
    axisX: null,
    axisY: null,
    coordinates: null,

    // Settings
    smoothing: 0.15,
    trailSpacing: 20,
    showCoordinates: false,
    animationId: null,

    init() {
        // Skip on touch devices
        if (Utils.isTouchDevice()) {
            return;
        }

        this.createElements();
        this.bindEvents();
        this.startAnimation();
        this.isActive = true;
        
        Utils.performance.mark('cursor-system-init');
        console.log('✓ Cursor system initialized');
    },

    createElements() {
        // Get cursor container
        this.cursor = Utils.$('#custom-cursor');
        if (!this.cursor) return;

        // Get cursor elements
        this.dot = this.cursor.querySelector('.cursor-dot');
        this.crosshairH = this.cursor.querySelector('.cursor-crosshair-h');
        this.crosshairV = this.cursor.querySelector('.cursor-crosshair-v');
        this.axisX = this.cursor.querySelector('.cursor-axis-x');
        this.axisY = this.cursor.querySelector('.cursor-axis-y');
        this.coordinates = this.cursor.querySelector('.cursor-coordinates');

        // Hide cursor initially
        this.cursor.style.opacity = '0';
    },

    bindEvents() {
        if (!this.cursor) return;

        // Mouse movement
        Utils.events.on(document, 'mousemove', this.handleMouseMove.bind(this));
        
        // Mouse enter/leave window
        Utils.events.on(document, 'mouseenter', this.show.bind(this));
        Utils.events.on(document, 'mouseleave', this.hide.bind(this));
        
        // Mouse down/up for click effects
        Utils.events.on(document, 'mousedown', this.handleMouseDown.bind(this));
        Utils.events.on(document, 'mouseup', this.handleMouseUp.bind(this));
        
        // Hover states for interactive elements
        this.bindHoverStates();
        
        // Keyboard shortcuts
        Utils.events.on(document, 'keydown', this.handleKeyDown.bind(this));
    },

    bindHoverStates() {
        // Links and buttons
        const interactiveElements = 'a, button, [role="button"], .nav-link, .play-button, input, textarea, select';
        
        Utils.events.delegate(document, interactiveElements, 'mouseover', () => {
            this.setState('pointer');
        });
        
        Utils.events.delegate(document, interactiveElements, 'mouseout', () => {
            this.setState('default');
        });
        
        // Audio elements
        Utils.events.delegate(document, '.audio-player', 'mouseover', () => {
            this.setState('audio');
        });
        
        Utils.events.delegate(document, '.audio-player', 'mouseout', (e) => {
            if (!e.relatedTarget?.closest('.audio-player')) {
                this.setState('default');
            }
        });
        
        // Image elements
        Utils.events.delegate(document, 'img, .gallery-item', 'mouseover', () => {
            this.setState('image');
        });
        
        Utils.events.delegate(document, 'img, .gallery-item', 'mouseout', () => {
            this.setState('default');
        });
        
        // Text input areas
        Utils.events.delegate(document, 'input[type="text"], input[type="email"], textarea', 'mouseover', () => {
            this.setState('text');
        });
        
        Utils.events.delegate(document, 'input[type="text"], input[type="email"], textarea', 'mouseout', () => {
            this.setState('default');
        });
    },

    handleMouseMove(e) {
        this.targetPos.x = e.clientX;
        this.targetPos.y = e.clientY;
        
        // Update coordinates display
        if (this.coordinates && this.showCoordinates) {
            this.coordinates.textContent = `(${Math.round(e.clientX)}, ${Math.round(e.clientY)})`;
        }
        
        // Add trail point
        this.addTrailPoint(e.clientX, e.clientY);
        
        // Emit cursor move event for particle repulsion
        appEvents.emit('cursorMove', { x: e.clientX, y: e.clientY });
    },

    handleMouseDown(e) {
        this.setState('click');
        this.createRipple(e.clientX, e.clientY);
    },

    handleMouseUp() {
        this.setState('default');
    },

    handleKeyDown(e) {
        // Toggle coordinates display with 'C' key
        if (e.key === 'c' || e.key === 'C') {
            if (e.ctrlKey) return; // Don't interfere with copy
            this.toggleCoordinates();
        }
    },

    setState(state) {
        if (!this.cursor) return;
        
        // Remove all state classes
        this.cursor.classList.remove('hover', 'click', 'audio', 'image', 'text', 'pointer');
        
        // Add new state class
        if (state !== 'default') {
            this.cursor.classList.add(state);
        }
    },

    show() {
        if (!this.cursor) return;
        this.cursor.style.opacity = '0.8';
        this.cursor.classList.remove('hidden');
    },

    hide() {
        if (!this.cursor) return;
        this.cursor.style.opacity = '0';
        this.cursor.classList.add('hidden');
    },

    startAnimation() {
        if (Utils.prefersReducedMotion()) return;
        
        const animate = () => {
            this.updatePosition();
            this.updateTrail();
            this.animationId = Utils.raf(animate);
        };
        
        animate();
    },

    updatePosition() {
        if (!this.cursor) return;
        
        // Smooth cursor movement
        this.mousePos.x = Utils.lerp(this.mousePos.x, this.targetPos.x, this.smoothing);
        this.mousePos.y = Utils.lerp(this.mousePos.y, this.targetPos.y, this.smoothing);
        
        // Update cursor elements
        if (this.dot) {
            this.dot.style.left = `${this.mousePos.x}px`;
            this.dot.style.top = `${this.mousePos.y}px`;
        }
        
        if (this.crosshairH) {
            this.crosshairH.style.left = `${this.mousePos.x}px`;
            this.crosshairH.style.top = `${this.mousePos.y}px`;
        }
        
        if (this.crosshairV) {
            this.crosshairV.style.left = `${this.mousePos.x}px`;
            this.crosshairV.style.top = `${this.mousePos.y}px`;
        }
        
        if (this.axisX) {
            this.axisX.style.top = `${this.mousePos.y}px`;
        }
        
        if (this.axisY) {
            this.axisY.style.left = `${this.mousePos.x}px`;
        }
        
        if (this.coordinates) {
            this.coordinates.style.left = `${this.mousePos.x}px`;
            this.coordinates.style.top = `${this.mousePos.y}px`;
        }
    },

    addTrailPoint(x, y) {
        // Only add trail point if moved enough
        const lastPoint = this.trail[this.trail.length - 1];
        if (lastPoint && Utils.distance(x, y, lastPoint.x, lastPoint.y) < this.trailSpacing) {
            return;
        }
        
        this.trail.push({ x, y, opacity: 1, life: 1 });
        
        // Limit trail length
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
    },

    updateTrail() {
        this.trail.forEach((point, index) => {
            point.life -= 0.05;
            point.opacity = point.life;
            
            // Remove dead points
            if (point.life <= 0) {
                this.trail.splice(index, 1);
            }
        });
    },

    createRipple(x, y) {
        const ripple = Utils.createElement('div', {
            className: 'cursor-ripple'
        });
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        document.body.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    },

    toggleCoordinates() {
        this.showCoordinates = !this.showCoordinates;
        
        if (this.cursor) {
            this.cursor.classList.toggle('show-coordinates', this.showCoordinates);
        }
        
        // Save preference
        Utils.storage.set('cursor-show-coordinates', this.showCoordinates);
    },

    loadPreferences() {
        this.showCoordinates = Utils.storage.get('cursor-show-coordinates', false);
        
        if (this.cursor && this.showCoordinates) {
            this.cursor.classList.add('show-coordinates');
        }
    },

    getMousePosition() {
        return { ...this.mousePos };
    },

    isNearElement(element, threshold = 50) {
        if (!element) return false;
        
        const rect = element.getBoundingClientRect();
        const distance = Utils.distance(
            this.mousePos.x,
            this.mousePos.y,
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );
        
        return distance < threshold;
    },

    destroy() {
        if (this.animationId) {
            Utils.cancelRaf(this.animationId);
        }
        
        this.isActive = false;
        
        if (this.cursor) {
            this.cursor.style.opacity = '0';
        }
        
        // Remove all trail elements
        document.querySelectorAll('.cursor-trail').forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
        
        // Remove all ripple elements
        document.querySelectorAll('.cursor-ripple').forEach(el => {
            if (el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });
    }
};

// Auto-initialize on desktop devices
if (!Utils.isTouchDevice()) {
    document.addEventListener('DOMContentLoaded', () => {
        CursorSystem.init();
    });
}

// Export for global access
window.CursorSystem = CursorSystem;