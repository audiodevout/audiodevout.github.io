// ===================================================================
// ANIMATED BACKGROUND CANVAS
// Cyberpunk grid with particle effects
// ===================================================================

const BackgroundCanvas = {
    canvas: null,
    ctx: null,
    animationId: null,
    
    // Grid settings
    gridSize: 50,
    particles: [],
    maxParticles: 20,
    
    // Animation state
    time: 0,
    mousePos: { x: 0, y: 0 },
    
    init() {
        this.canvas = Utils.$('#background-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.setupCanvas();
        this.bindEvents();
        this.createParticles();
        this.startAnimation();
        
        Utils.performance.mark('canvas-background-init');
    },
    
    setupCanvas() {
        this.resizeCanvas();
    },
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },
    
    bindEvents() {
        Utils.events.on(window, 'resize', Utils.debounce(() => {
            this.resizeCanvas();
        }, 250));
        
        Utils.events.on(document, 'mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
        });
    },
    
    createParticles() {
    for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            life: 0.5 + Math.random() * 0.5,  // start with 50%-100% life
            decay: 0.001 + Math.random() * 0.002
        });
    }
},

    
    startAnimation() {
        if (Utils.prefersReducedMotion()) return;
        
        const animate = () => {
            this.update();
            this.render();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    },
    
    update() {
        this.time += 0.01;
        
        // Update particles
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Respawn dead particles
            if (particle.life <= 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.life = 1;
            }
            
            // Wrap around edges
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
        });
    },
    
    render() {
        const { width, height } = this.canvas;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw particles
        this.drawParticles();
        
        // Draw mouse influence
        this.drawMouseInfluence();
    },
    
    drawGrid() {
        const { width, height } = this.canvas;
        
        this.ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        // Vertical lines
        for (let x = 0; x <= width; x += this.gridSize) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += this.gridSize) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
        }
        
        this.ctx.stroke();
    },
    
    drawParticles() {
    this.particles.forEach(particle => {
        const alpha = Math.min(1, particle.life * 1.2); // cap alpha at 1
        const size = 1 + particle.life * 2;

        // Brighter, slightly whitish cyan
        this.ctx.fillStyle = `rgba(150, 255, 255, ${alpha})`;

        this.ctx.shadowColor = `rgba(150, 255, 255, ${alpha})`;
        this.ctx.shadowBlur = 20;  // increase blur for stronger glow

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
        this.ctx.fill();

        // Reset shadowBlur so it doesn't affect other drawings
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'transparent';
    });
},

    
    drawMouseInfluence() {
        const { x, y } = this.mousePos;
        const radius = 100;
        
        // Create radial gradient around mouse
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(0, 255, 255, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    },
    
    handleResize() {
        this.resizeCanvas();
    },
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        Utils.events.off(window, 'resize');
        Utils.events.off(document, 'mousemove');
    }
};

window.BackgroundCanvas = BackgroundCanvas;
