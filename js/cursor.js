// ===================================================================
// CUSTOM CURSOR SYSTEM
// Cyberpunk crosshair cursor with axis markers and trail
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

        // Create coordinates display if needed
        if (this.showCoordinates) {
            this.createCoordinatesDisplay();
        }

        // Hide cursor initially
        this.cursor.style.opacity = '0.8';
    },

    createCoordinatesDisplay() {
        this.coordinates = Utils.createElement('div', {
            className: 'cursor-coordinates',
            innerHTML: 'X: 0, Y: 0'
        });
        document.body.appendChild(this.coordinates);
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
        
        Utils.events.on(document, 'mouseover', (e) => {
            if (e.target.matches(interactiveElements)) {
                this.setState('pointer');
            }
        });
        
        Utils.events.on(document, 'mouseout', (e) => {
            if (e.target.matches(interactiveElements)) {
                this.setState('default');
            }
        });
        
        // Audio elements
        Utils.events.on(document, 'mouseover', (e) => {
            if (e.target.closest('.audio-player')) {
                this.setState('audio');
            }
        });
        
        Utils.events.on(document, 'mouseout', (e) => {
            if (e.target.closest('.audio-player') && !e.relatedTarget?.closest('.audio-player')) {
                this.setState('default');
            }
        });
        
        // Image elements
        Utils.events.on(document, 'mouseover', (e) => {
            if (e.target.matches('img, .image-item')) {
                this.setState('image');
            }
        });
        
        Utils.events.on(document, 'mouseout', (e) => {
            if (e.target.matches('img, .image-item')) {
                this.setState('default');
            }
        });
        
        // Text areas
        Utils.events.on(document, 'mouseover', (e) => {
            if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
                this.setState('text');
            }
        });
        
        Utils.events.on(document, 'mouseout', (e) => {
            if (e.target.matches('input[type="text"], input[type="email"], textarea')) {
                this.setState('default');
            }
        });
    },

    handleMouseMove(e) {
        this.show();
        this.targetPos.x = e.clientX;
        this.targetPos.y = e.clientY;
        
        // Update coordinates display
        if (this.coordinates) {
            this.coordinates.innerHTML = `X: ${Math.round(e.clientX)}, Y: ${Math.round(e.clientY)}`;
        }
        
        // Add to trail
        this.addTrailPoint(e.clientX, e.clientY);
        
        // Update CSS custom properties for color effects
        this.updateColorVariables(e.clientX, e.clientY);
    },

    handleMouseDown() {
        this.setState('click');
    },

    handleMouseUp() {
        this.setState('default');
    },

    handleKeyDown(e) {
        // Toggle coordinates display with Ctrl+Shift+C
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            this.toggleCoordinates();
        }
        
        // Toggle cursor with Ctrl+Shift+X
        if (e.ctrlKey && e.shiftKey && e.key === 'X') {
            this.toggle();
        }
    },

    setState(state) {
        if (!this.cursor) return;
        
        // Remove all state classes
        this.cursor.classList.remove('hover', 'click', 'text', 'pointer', 'audio', 'image', 'loading', 'disabled');
        
        // Add new state class
        if (state !== 'default') {
            this.cursor.classList.add(state);
        }
    },

    addTrailPoint(x, y) {
        // Only add if far enough from last point
        const lastPoint = this.trail[this.trail.length - 1];
        if (lastPoint && Utils.distance(x, y, lastPoint.x, lastPoint.y) < this.trailSpacing) {
            return;
        }
        
        this.trail.push({ x, y, time: Date.now() });
        
        // Remove old trail points
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        // Create trail element
        this.createTrailElement(x, y);
    },

    createTrailElement(x, y) {
        if (Utils.prefersReducedMotion()) return;
        
        const trailElement = Utils.createElement('div', {
            className: 'cursor-trail',
            style: `left: ${x}px; top: ${y}px;`
        });
        
        document.body.appendChild(trailElement);
        
        // Remove after animation
        setTimeout(() => {
            if (trailElement.parentNode) {
                trailElement.parentNode.removeChild(trailElement);
            }
        }, 800);
    },

    updateColorVariables(x, y) {
    const normalizedX = x / window.innerWidth;
    const normalizedY = y / window.innerHeight;

    // Stronger, brighter color range
    const hue = Math.round(normalizedX * 60 + 160); // Still cyan-blue range
    const saturation = 100; // Full saturation
    const lightness = 70; // Bright enough to pop even on dark bg

    document.documentElement.style.setProperty('--cursor-hue', hue);
    document.documentElement.style.setProperty('--cursor-saturation', `${saturation}%`);
    document.documentElement.style.setProperty('--cursor-lightness', `${lightness}%`);

    // Brighter dynamic neon color
    const dynamicNeon = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    document.documentElement.style.setProperty('--color-neon-dynamic', dynamicNeon);
}


    startAnimation() {
        if (!this.isActive || !this.cursor) return;
        
        // Smooth cursor movement
        this.mousePos.x = Utils.lerp(this.mousePos.x, this.targetPos.x, this.smoothing);
        this.mousePos.y = Utils.lerp(this.mousePos.y, this.targetPos.y, this.smoothing);
        
        // Update cursor position
        this.updateCursorPosition();
        
        // Continue animation
        requestAnimationFrame(() => this.startAnimation());
    },

    updateCursorPosition() {
        if (!this.cursor) return;
        
        const { x, y } = this.mousePos;
        
        // Update dot position
        if (this.dot) {
            this.dot.style.left = x + 'px';
            this.dot.style.top = y + 'px';
        }
        
        // Update crosshair positions
        if (this.crosshairH) {
            this.crosshairH.style.left = x + 'px';
            this.crosshairH.style.top = y + 'px';
        }
        
        if (this.crosshairV) {
            this.crosshairV.style.left = x + 'px';
            this.crosshairV.style.top = y + 'px';
        }
        
        // Update axis positions
        if (this.axisX) {
            this.axisX.style.top = y + 'px';
        }
        
        if (this.axisY) {
            this.axisY.style.left = x + 'px';
        }
    },

    show() {
        if (!this.cursor) return;
        
        this.cursor.style.opacity = '1';
        this.cursor.classList.remove('hidden');
    },

    hide() {
        if (!this.cursor) return;
        
        this.cursor.style.opacity = '0.7';
        this.cursor.classList.add('hidden');
    },

    toggle() {
        if (!this.cursor) return;
        
        if (this.cursor.style.opacity === '0' || this.cursor.classList.contains('hidden')) {
            this.show();
        } else {
            this.hide();
        }
    },

    toggleCoordinates() {
        if (this.coordinates) {
            if (this.coordinates.classList.contains('visible')) {
                this.coordinates.classList.remove('visible');
            } else {
                this.coordinates.classList.add('visible');
            }
        } else {
            this.createCoordinatesDisplay();
            this.coordinates.classList.add('visible');
        }
    },

    setLoading(loading = true) {
        if (loading) {
            this.setState('loading');
        } else {
            this.setState('default');
        }
    },

    setDisabled(disabled = true) {
        if (disabled) {
            this.setState('disabled');
        } else {
            this.setState('default');
        }
    },

    // Pulse effect for notifications
    pulse() {
        if (!this.cursor) return;
        
        this.cursor.classList.add('pulse');
        setTimeout(() => {
            this.cursor.classList.remove('pulse');
        }, 500);
    },

    // Scan effect for special interactions
    scan() {
        if (!this.cursor || Utils.prefersReducedMotion()) return;
        
        const scanLine = Utils.createElement('div', {
            className: 'cursor-scan-line'
        });
        
        scanLine.style.left = this.mousePos.x + 'px';
        scanLine.style.top = this.mousePos.y + 'px';
        
        this.cursor.appendChild(scanLine);
        
        setTimeout(() => {
            if (scanLine.parentNode) {
                scanLine.parentNode.removeChild(scanLine);
            }
        }, 2000);
    },

    destroy() {
        this.isActive = false;
        
        // Remove event listeners
        Utils.events.off(document, 'mousemove', this.handleMouseMove);
        Utils.events.off(document, 'mouseenter', this.show);
        Utils.events.off(document, 'mouseleave', this.hide);
        Utils.events.off(document, 'mousedown', this.handleMouseDown);
        Utils.events.off(document, 'mouseup', this.handleMouseUp);
        Utils.events.off(document, 'keydown', this.handleKeyDown);
        
        // Remove coordinates display
        if (this.coordinates && this.coordinates.parentNode) {
            this.coordinates.parentNode.removeChild(this.coordinates);
        }
        
        // Clear trail
        this.trail = [];
        
        // Show default cursor
        document.body.style.cursor = 'default';
    }
};

// Make CursorSystem available globally
window.CursorSystem = CursorSystem;

window.addEventListener('DOMContentLoaded', () => {
    CursorSystem.init();
});
