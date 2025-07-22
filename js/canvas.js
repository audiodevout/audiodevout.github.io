// ===================================================================
// BACKGROUND CANVAS ANIMATION
// ===================================================================

class BackgroundCanvas {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        
        this.isDesktop = !isMobile();
        this.reduceMotion = prefersReducedMotion();
        
        if (this.canvas && !this.reduceMotion) {
            this.init();
        }
    }
    
    init() {
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) return;
        
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        
        // Set canvas style for better performance
        this.ctx.imageSmoothingEnabled = false;
    }
    
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createParticles() {
       const rect = this.canvas.getBoundingClientRect();
const width = rect.width;
const height = rect.height;

for (let i = 0; i < particleCount; i++) {
    this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.2
    });
}

    
    bindEvents() {
        window.addEventListener('resize', debounce(() => {
            this.resizeCanvas();
            this.createParticles();
        }, 250));
        
        // Listen for theme changes
        window.appEvents.on('themeChanged', () => {
            this.updateColors();
        });
    }
    
    updateColors() {
        // Colors will be updated in the draw loop using CSS variables
    }
    
    animate() {
        this.clear();
        this.drawGrid();
        this.updateParticles();
        this.drawParticles();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    drawGrid() {
    const gridSize = 40;
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const accent = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-primary').trim();

    this.ctx.strokeStyle = this.hexToRgba(accent, 0.1);
    this.ctx.lineWidth = 0.5;

    for (let x = 0; x < width; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
    }
}

    
    updateParticles() {
    const rect = this.canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    this.particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x <= 0 || particle.x >= width) {
            particle.vx *= -1;
            particle.x = Math.max(0, Math.min(width, particle.x));
        }

        if (particle.y <= 0 || particle.y >= height) {
            particle.vy *= -1;
            particle.y = Math.max(0, Math.min(height, particle.y));
        }

        particle.vx += (Math.random() - 0.5) * 0.01;
        particle.vy += (Math.random() - 0.5) * 0.01;

        const maxVel = 1;
        particle.vx = Math.max(-maxVel, Math.min(maxVel, particle.vx));
        particle.vy = Math.max(-maxVel, Math.min(maxVel, particle.vy));
    });
}

    
    drawParticles() {
        // Get current accent color
        const accent = getComputedStyle(document.documentElement)
            .getPropertyValue('--accent-primary').trim();
            
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.hexToRgba(accent, particle.opacity);
            this.ctx.fill();
        });
    }
    
    // Helper function to convert HSL/hex to rgba
    hexToRgba(color, alpha) {
        if (color.startsWith('hsl')) {
            // Parse HSL and convert to RGBA
            const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
            if (hslMatch) {
                const [, h, s, l] = hslMatch.map(Number);
                return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
            }
        }
        
        // Fallback to cyan
        return `rgba(0, 255, 255, ${alpha})`;
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        window.removeEventListener('resize', this.resizeCanvas);
    }
}

// ===================================================================
// TITLE ANIMATION
// ===================================================================

class TitleAnimation {
    constructor() {
        this.titleElement = document.getElementById('site-title');
        this.titleText = this.titleElement?.querySelector('.title-text');
        this.originalTitle = 'Atharva Gupta';
        this.aliases = ['Asymmetrica', 'AudioDevout'];
        this.currentIndex = 0;
        this.intervalId = null;
        
        if (this.titleText && !prefersReducedMotion()) {
            this.init();
        }
    }
    
    init() {
        this.startCycling();
        this.bindEvents();
    }
    
    startCycling() {
        this.intervalId = setInterval(() => {
            this.cycleTitle();
        }, 4000);
    }
    
    cycleTitle() {
        const titles = [this.originalTitle, ...this.aliases];
        this.currentIndex = (this.currentIndex + 1) % titles.length;
        
        // Add glitch effect
        this.titleText.style.animation = 'none';
        this.titleText.offsetHeight; // Trigger reflow
        this.titleText.style.animation = null;
        
        this.titleText.textContent = titles[this.currentIndex];
    }
    
    bindEvents() {
        // Pause animation when user hovers over title
        this.titleElement.addEventListener('mouseenter', () => {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
        });
        
        this.titleElement.addEventListener('mouseleave', () => {
            this.startCycling();
        });
        
        // Handle visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                }
            } else {
                this.startCycling();
            }
        });
    }
    
    destroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

// ===================================================================
// PERFORMANCE MONITOR
// ===================================================================

class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 60;
        this.isMonitoring = false;
        
        // Only monitor on desktop
        if (!isMobile()) {
            this.startMonitoring();
        }
    }
    
    startMonitoring() {
        this.isMonitoring = true;
        this.monitorFrame();
    }
    
    monitorFrame() {
        if (!this.isMonitoring) return;
        
        this.frameCount++;
        const currentTime = performance.now();
        
        if (currentTime - this.lastTime >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
            this.frameCount = 0;
            this.lastTime = currentTime;
            
            // Adjust quality based on performance
            this.adjustQuality();
        }
        
        requestAnimationFrame(() => this.monitorFrame());
    }
    
    adjustQuality() {
        if (this.fps < 30) {
            // Reduce particle count or disable some effects
            window.appEvents.emit('performanceLow', this.fps);
        } else if (this.fps > 50) {
            // Can increase quality if needed
            window.appEvents.emit('performanceGood', this.fps);
        }
    }
    
    getFPS() {
        return this.fps;
    }
}

// ===================================================================
// INITIALIZE CANVAS SYSTEM
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.backgroundCanvas = new BackgroundCanvas();
    window.titleAnimation = new TitleAnimation();
    window.performanceMonitor = new PerformanceMonitor();
});
