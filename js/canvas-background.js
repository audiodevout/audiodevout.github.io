// ===================================================================
// ANIMATED BACKGROUND CANVAS
// Floating particles with cursor repulsion and neon effects
// ===================================================================

const BackgroundCanvas = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    // Canvas settings
    particles: [],
    maxParticles: 50,
    
    // Animation state
    time: 0,
    mousePos: { x: 0, y: 0 },
    repulsionRadius: 100,
    repulsionForce: 0.5,
    
    // Color scheme
    colors: [
        'hsl(180, 100%, 50%)', // Cyan
        'hsl(300, 100%, 50%)', // Magenta
        'hsl(60, 100%, 50%)',  // Yellow
        'hsl(120, 100%, 50%)', // Green
    ],
    
    init() {
        this.canvas = Utils.$('#background-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.bindEvents();
        this.createParticles();
        this.startAnimation();
        
        Utils.performance.mark('canvas-background-init');
        console.log('✓ Background canvas initialized');
    },
    
    setupCanvas() {
        this.resizeCanvas();
        
        // Set canvas style for better performance
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.globalCompositeOperation = 'source-over';
    },
    
    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        // Recreate particles after resize
        if (this.particles.length > 0) {
            this.createParticles();
        }
    },
    
    bindEvents() {
        // Window resize
        Utils.events.on(window, 'resize', Utils.debounce(() => {
            this.resizeCanvas();
        }, 250));
        
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
    },
    
    createParticles() {
        this.particles = [];
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Adjust particle count based on device
        const particleCount = Utils.isTouchDevice() ? 
            Math.min(this.maxParticles * 0.6, 30) : 
            this.maxParticles;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * canvasRect.width,
                y: Math.random() * canvasRect.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                originalVx: (Math.random() - 0.5) * 0.5,
                originalVy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                color: Utils.randomFromArray(this.colors),
                life: Math.random(),
                maxLife: Math.random() * 5 + 2,
                repulsed: false
            });
        }
    },
    
    startAnimation() {
        if (Utils.prefersReducedMotion()) return;
        
        const animate = () => {
            this.update();
            this.render();
            this.animationId = Utils.raf(animate);
        };
        
        animate();
    },
    
    update() {
        this.time += 0.01;
        const canvasRect = this.canvas.getBoundingClientRect();
        
        this.particles.forEach(particle => {
            // Store original position for repulsion calculation
            const originalX = particle.x;
            const originalY = particle.y;
            
            // Update life
            particle.life += 0.01;
            if (particle.life > particle.maxLife) {
                particle.life = 0;
                particle.opacity = Math.random() * 0.6 + 0.2;
            }
            
            // Base movement
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Cursor repulsion
            const distance = Utils.distance(
                particle.x, particle.y,
                this.mousePos.x, this.mousePos.y
            );
            
            if (distance < this.repulsionRadius) {
                const angle = Math.atan2(
                    particle.y - this.mousePos.y,
                    particle.x - this.mousePos.x
                );
                const force = (this.repulsionRadius - distance) / this.repulsionRadius * this.repulsionForce;
                
                particle.vx += Math.cos(angle) * force;
                particle.vy += Math.sin(angle) * force;
                particle.repulsed = true;
            } else {
                // Return to original velocity when not repulsed
                if (particle.repulsed) {
                    particle.vx = Utils.lerp(particle.vx, particle.originalVx, 0.05);
                    particle.vy = Utils.lerp(particle.vy, particle.originalVy, 0.05);
                    
                    if (Math.abs(particle.vx - particle.originalVx) < 0.01) {
                        particle.repulsed = false;
                    }
                }
            }
            
            // Apply velocity damping
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Boundary wrapping
            if (particle.x < -50) {
                particle.x = canvasRect.width + 50;
            } else if (particle.x > canvasRect.width + 50) {
                particle.x = -50;
            }
            
            if (particle.y < -50) {
                particle.y = canvasRect.height + 50;
            } else if (particle.y > canvasRect.height + 50) {
                particle.y = -50;
            }
            
            // Add slight random movement
            particle.vx += (Math.random() - 0.5) * 0.01;
            particle.vy += (Math.random() - 0.5) * 0.01;
            
            // Limit velocity
            const maxVel = 2;
            particle.vx = Utils.clamp(particle.vx, -maxVel, maxVel);
            particle.vy = Utils.clamp(particle.vy, -maxVel, maxVel);
        });
    },
    
    render() {
        const canvasRect = this.canvas.getBoundingClientRect();
        
        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
        
        // Draw grid
        this.drawGrid(canvasRect);
        
        // Draw particles
        this.drawParticles();
        
        // Draw connections between nearby particles
        this.drawConnections();
    },
    
    drawGrid(canvasRect) {
        const gridSize = 60;
        const time = this.time * 0.5;
        
        this.ctx.strokeStyle = `hsla(180, 100%, 50%, ${0.05 + Math.sin(time) * 0.02})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        
        // Vertical lines
        for (let x = 0; x <= canvasRect.width; x += gridSize) {
            const offset = Math.sin(time + x * 0.01) * 2;
            this.ctx.moveTo(x + offset, 0);
            this.ctx.lineTo(x + offset, canvasRect.height);
        }
        
        // Horizontal lines
        for (let y = 0; y <= canvasRect.height; y += gridSize) {
            const offset = Math.cos(time + y * 0.01) * 2;
            this.ctx.moveTo(0, y + offset);
            this.ctx.lineTo(canvasRect.width, y + offset);
        }
        
        this.ctx.stroke();
    },
    
    drawParticles() {
        this.particles.forEach(particle => {
            const alpha = particle.opacity * (0.8 + Math.sin(this.time + particle.life) * 0.2);
            const size = particle.size * (1 + Math.sin(this.time * 2 + particle.life) * 0.1);
            
            // Parse HSL color and adjust alpha
            const color = particle.color.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
            
            // Draw particle glow
            this.ctx.save();
            this.ctx.globalCompositeOperation = 'screen';
            this.ctx.fillStyle = color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = size * 3;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw particle core
            this.ctx.globalCompositeOperation = 'source-over';
            this.ctx.shadowBlur = 0;
            this.ctx.fillStyle = color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    },
    
    drawConnections() {
        const maxConnectionDistance = 100;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                
                const distance = Utils.distance(p1.x, p1.y, p2.x, p2.y);
                
                if (distance < maxConnectionDistance) {
                    const alpha = (1 - distance / maxConnectionDistance) * 0.2;
                    
                    this.ctx.save();
                    this.ctx.globalCompositeOperation = 'screen';
                    this.ctx.strokeStyle = `hsla(180, 100%, 50%, ${alpha})`;
                    this.ctx.lineWidth = 0.5;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                }
            }
        }
    },
    
    addParticle(x, y) {
        if (this.particles.length < this.maxParticles * 2) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                originalVx: (Math.random() - 0.5) * 0.5,
                originalVy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: 0.8,
                color: Utils.randomFromArray(this.colors),
                life: 0,
                maxLife: 3,
                repulsed: false
            });
        }
    },
    
    setRepulsionRadius(radius) {
        this.repulsionRadius = Utils.clamp(radius, 50, 200);
    },
    
    setRepulsionForce(force) {
        this.repulsionForce = Utils.clamp(force, 0.1, 2);
    },
    
    updateColors(newColors) {
        this.colors = newColors;
        
        // Update existing particles with new colors
        this.particles.forEach(particle => {
            if (Math.random() < 0.3) { // Only update 30% to avoid jarring changes
                particle.color = Utils.randomFromArray(this.colors);
            }
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
    
    destroy() {
        this.pause();
        this.particles = [];
        
        if (this.canvas && this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
};

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    BackgroundCanvas.init();
});

// Export for global access
window.BackgroundCanvas = BackgroundCanvas;