// ===================================================================
// FLOATING TEXT SYSTEM
// Editable floating background text with cursor repulsion
// ===================================================================

const FloatingText = {
    container: null,
    textItems: [],
    animationId: null,

    // Settings
    maxItems: 15,
    spawnRate: 3000, // milliseconds between spawns
    mousePos: { x: 0, y: 0 },
    repulsionRadius: 80,
    repulsionForce: 50,

    // Text sources
    textSources: [],

    init() {
        this.container = Utils.$('#floating-text');
        if (!this.container) return;

        this.loadTextSources();
        this.bindEvents();
        this.startSpawning();
        this.startAnimation();

        Utils.performance.mark('floating-text-init');
        console.log('✓ Floating text system initialized');
    },

    loadTextSources() {
        // Load from portfolio data
        if (typeof portfolioData !== 'undefined' && portfolioData.floatingText) {
            this.textSources = [...portfolioData.floatingText];
        } else {
            // Fallback text
            this.textSources = [
                'experimental systems',
                'kinetic sound',
                'digital entropy',
                'glitch protocols',
                'audio experiments',
                'generative compositions',
                'critical making',
                'system failures',
                'noise patterns',
                'temporal distortions'
            ];
        }
    },

    bindEvents() {
        // Cursor movement for repulsion
        appEvents.on('cursorMove', (data) => {
            this.mousePos.x = data.x;
            this.mousePos.y = data.y;
        });

        // Fallback mouse tracking
        Utils.events.on(document, 'mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });

        // Window resize
        Utils.events.on(window, 'resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));

        // Visibility change to pause/resume
        Utils.events.on(document, 'visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    },

    startSpawning() {
        if (Utils.prefersReducedMotion()) return;

        const spawn = () => {
            if (this.textItems.length < this.maxItems) {
                this.createTextItem();
            }

            // Random spawn interval
            const interval = this.spawnRate + (Math.random() - 0.5) * 1000;
            setTimeout(spawn, interval);
        };

        // Initial spawn
        setTimeout(spawn, 1000);
    },

    createTextItem() {
        const text = Utils.randomFromArray(this.textSources);
        const viewport = Utils.getViewportSize();

        // Create element
        const element = Utils.createElement('div', {
            className: 'floating-text-item',
            textContent: text
        });

        // Random initial position (left side, offscreen)
        const startX = -200;
        const startY = Math.random() * (viewport.height - 100) + 50;

        // Random movement parameters
        const speed = 0.3 + Math.random() * 0.5;
        const drift = (Math.random() - 0.5) * 0.2;
        const opacity = 0.2 + Math.random() * 0.3;

        const textItem = {
            element: element,
            x: startX,
            y: startY,
            targetX: viewport.width + 200,
            targetY: startY + drift * 200,
            vx: speed,
            vy: drift,
            originalVx: speed,
            originalVy: drift,
            opacity: opacity,
            life: 0,
            maxLife: (viewport.width + 400) / speed / 60, // seconds to cross screen
            repulsed: false,
            size: 0.7 + Math.random() * 0.3
        };

        // Apply initial styles
        element.style.left = `${textItem.x}px`;
        element.style.top = `${textItem.y}px`;
        element.style.opacity = textItem.opacity;
        element.style.fontSize = `${textItem.size}rem`;
        element.style.animationDelay = `${Math.random() * 2}s`;

        // Add to DOM and tracking
        this.container.appendChild(element);
        this.textItems.push(textItem);
    },

    startAnimation() {
        if (Utils.prefersReducedMotion()) return;

        const animate = () => {
            this.updateTextItems();
            this.animationId = Utils.raf(animate);
        };

        animate();
    },

    updateTextItems() {
        this.textItems.forEach((item, index) => {
            // Update life
            item.life += 1/60; // assuming 60fps

            // Remove expired items
            if (item.life > item.maxLife || item.x > Utils.getViewportSize().width + 300) {
                this.removeTextItem(index);
                return;
            }

            // Base movement
            item.x += item.vx;
            item.y += item.vy;

            // Cursor repulsion
            const distance = Utils.distance(item.x, item.y, this.mousePos.x, this.mousePos.y);

            if (distance < this.repulsionRadius) {
                const angle = Math.atan2(item.y - this.mousePos.y, item.x - this.mousePos.x);
                const force = (this.repulsionRadius - distance) / this.repulsionRadius * this.repulsionForce;

                item.vx += Math.cos(angle) * force * 0.01;
                item.vy += Math.sin(angle) * force * 0.01;
                item.repulsed = true;

                // Add slight opacity change when repulsed
                item.element.style.opacity = Math.min(item.opacity * 1.5, 0.8);
            } else {
                // Return to original velocity when not repulsed
                if (item.repulsed) {
                    item.vx = Utils.lerp(item.vx, item.originalVx, 0.02);
                    item.vy = Utils.lerp(item.vy, item.originalVy, 0.02);
                    item.element.style.opacity = item.opacity;

                    if (Math.abs(item.vx - item.originalVx) < 0.01) {
                        item.repulsed = false;
                    }
                }
            }

            // Apply velocity damping
            item.vx *= 0.995;
            item.vy *= 0.995;

            // Update element position
            item.element.style.left = `${item.x}px`;
            item.element.style.top = `${item.y}px`;

            // Fade effect based on life
            const fadeStart = 0.8;
            if (item.life / item.maxLife > fadeStart) {
                const fadeProgress = (item.life / item.maxLife - fadeStart) / (1 - fadeStart);
                const currentOpacity = item.opacity * (1 - fadeProgress);
                item.element.style.opacity = currentOpacity;
            }
        });
    },

    removeTextItem(index) {
        const item = this.textItems[index];
        if (item && item.element && item.element.parentNode) {
            item.element.parentNode.removeChild(item.element);
        }
        this.textItems.splice(index, 1);
    },

    handleResize() {
        // Update existing items to adjust to new viewport
        const viewport = Utils.getViewportSize();

        this.textItems.forEach(item => {
            // Adjust Y position if outside new viewport
            if (item.y > viewport.height - 50) {
                item.y = viewport.height - 50;
                item.targetY = item.y;
            }
        });
    },

    addText(text) {
        if (this.textSources.indexOf(text) === -1) {
            this.textSources.push(text);
        }
    },

    removeText(text) {
        const index = this.textSources.indexOf(text);
        if (index > -1) {
            this.textSources.splice(index, 1);
        }
    },

    updateTextSources(newTexts) {
        this.textSources = [...newTexts];
    },

    setSpawnRate(rate) {
        this.spawnRate = Utils.clamp(rate, 1000, 10000);
    },

    setMaxItems(max) {
        this.maxItems = Utils.clamp(max, 5, 30);

        // Remove excess items if necessary
        while (this.textItems.length > this.maxItems) {
            this.removeTextItem(this.textItems.length - 1);
        }
    },

    setRepulsionRadius(radius) {
        this.repulsionRadius = Utils.clamp(radius, 30, 150);
    },

    setRepulsionForce(force) {
        this.repulsionForce = Utils.clamp(force, 10, 100);
    },

    showDebugInfo() {
        console.log('Floating Text Debug Info:', {
            textSources: this.textSources.length,
            activeItems: this.textItems.length,
            maxItems: this.maxItems,
            spawnRate: this.spawnRate,
            repulsionRadius: this.repulsionRadius,
            repulsionForce: this.repulsionForce
        });
    },

    pause() {
        if (this.animationId) {
            Utils.cancelRaf(this.animationId);
            this.animationId = null;
        }
    },

    resume() {
        if (!this.animationId && !Utils.prefersReducedMotion()) {
            this.startAnimation();
        }
    },

    clear() {
        this.textItems.forEach(item => {
            if (item.element && item.element.parentNode) {
                item.element.parentNode.removeChild(item.element);
            }
        });
        this.textItems = [];
    },

    destroy() {
        this.pause();
        this.clear();
    },
    setupTitleRotation() {
        // Rotate between artist names
        setInterval(() => {
            if (this.rotatingTitle && !Utils.prefersReducedMotion()) {
                this.rotatingTitle.classList.add('glitch-active');

                setTimeout(() => {
                    this.currentTitleIndex = (this.currentTitleIndex + 1) % this.titleNames.length;
                    const newTitle = this.titleNames[this.currentTitleIndex];
                    this.rotatingTitle.textContent = newTitle;
                    this.rotatingTitle.setAttribute('data-text', newTitle);
                    this.rotatingTitle.classList.remove('glitch-active');
                }, 250);
            }
        }, 3000);
    },
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    FloatingText.init();
});

// Export for global access
window.FloatingText = FloatingText;