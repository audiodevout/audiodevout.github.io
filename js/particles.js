/* particles.js - Background Particle System
 *
 * PURPOSE: Floating particles with dynamic links and mouse interaction
 * 
 * EDITABLE PARAMETERS:
 * - maxParticles: Total particles (default: 150)
 * - connectionDistance: Particle link threshold (default: 200)
 * - mouseInfluence: Mouse interaction radius (default: 100)
 */

class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];

    // Editable parameters
    this.maxParticles = options.maxParticles || 150;
    this.connectionDistance = options.connectionDistance || 200;
    this.mouseInfluence = options.mouseInfluence || 100;

    this.colors = [
      'rgba(255, 149, 71, 0.6)',   // saffron
      'rgba(0, 149, 255, 0.6)',    // cerulean
      'rgba(255, 71, 172, 0.6)',   // neon-magenta
      'rgba(173, 255, 71, 0.6)'    // electric-lime
    ];

    this.animationFrame = null;
    this.mouse = { x: 0, y: 0 };
    this.isRunning = false;

    try {
      this.init();
    } catch (error) {
      console.error('ParticleSystem initialization failed:', error);
    }
  }

  init() {
    this.updateSize();
    this.createParticles();
    this.bindEvents();
  }

  updateSize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // reset
    this.ctx.scale(dpr, dpr);
  }

  bindEvents() {
    this.resizeHandler = () => {
      this.updateSize();
      this.createParticles(); // recalculate particle positions
    };
    this.mouseMoveHandler = (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    };

    window.addEventListener('resize', this.resizeHandler);
    window.addEventListener('mousemove', this.mouseMoveHandler, { passive: true });
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      opacity: Math.random() * 0.5 + 0.1,
      life: Math.random() * 1200 + 800,
      pulse: Math.random() * Math.PI * 2
    };
  }

  updateParticle(p) {
    p.x += p.vx;
    p.y += p.vy;

    const dx = this.mouse.x - p.x;
    const dy = this.mouse.y - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.mouseInfluence) {
      const force = (this.mouseInfluence - dist) / this.mouseInfluence;
      p.vx += (dx / dist) * force * 0.01;
      p.vy += (dy / dist) * force * 0.01;
    }

    p.vx *= 0.99;
    p.vy *= 0.99;

    p.pulse += 0.05;
    p.opacity = Math.sin(p.pulse) * 0.3 + 0.3;

    // boundary wrapping
    if (p.x < 0) p.x = this.canvas.width;
    if (p.x > this.canvas.width) p.x = 0;
    if (p.y < 0) p.y = this.canvas.height;
    if (p.y > this.canvas.height) p.y = 0;

    p.life--;
    if (p.life <= 0) {
      Object.assign(p, this.createParticle());
    }
  }

  drawParticle(p) {
    this.ctx.save();
    this.ctx.globalAlpha = p.opacity;
    this.ctx.fillStyle = p.color;
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = p.color;

    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawConnections() {
    this.ctx.save();
    this.ctx.lineWidth = 0.5;

    for (let i = 0; i < this.particles.length; i++) {
      const a = this.particles[i];

      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.connectionDistance) {
          const alpha = Math.max(0.1, (this.connectionDistance - dist) / this.connectionDistance * 0.4);
          this.ctx.globalAlpha = alpha;
          this.ctx.strokeStyle = 'rgba(255,255,255,' + alpha + ')';
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }
    }

    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let p of this.particles) {
      this.updateParticle(p);
      this.drawParticle(p);
    }

    this.drawConnections();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }

  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
      this.isRunning = false;
    }
  }

  destroy() {
    this.stop();
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
    if (this.mouseMoveHandler) {
      window.removeEventListener('mousemove', this.mouseMoveHandler);
    }
    this.particles = [];
  }
}

window.ParticleSystem = ParticleSystem;
