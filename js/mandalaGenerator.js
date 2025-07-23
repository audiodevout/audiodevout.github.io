/* mandalaGenerator.js - Generative Mandala Rendering (Refined)

 * PURPOSE: Draws full-screen procedural mandalas as visual anchors
 * 
 * PARAMETERS:
 * - Colors: Accent palette for layers
 * - Base radius: Responsive scaling
 * - Segments: Adaptive complexity by scroll
 * - Rotation: Dynamic breathing rotation
 */

class MandalaGenerator {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.colors = [
      'hsl(18, 100%, 62%)',
      'hsl(205, 100%, 52%)',
      'hsl(325, 100%, 59%)',
      'hsl(83, 100%, 62%)'
    ];

    this.baseSegments = 8;
    this.maxLayers = 6;
    this.rotationSpeed = 0.0005;
    this.scrollProgress = 0;
    this.currentSegments = this.baseSegments;
    this.animationFrame = null;

    this.rotationOffset = 0;

    this.validateCanvas();
    this.updateSize();
    window.addEventListener('resize', () => this.updateSize());
  }

  validateCanvas() {
    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas or 2D context not available');
    }
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
  }

  setSegments(segments) {
    this.currentSegments = segments;
  }

  generateMandala() {
    const ctx = this.ctx;
    const { width, height } = this.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.4;

    ctx.clearRect(0, 0, width, height);

    const numLayers = Math.floor(2 + this.scrollProgress * 4);
    const effectiveSegments = Math.floor(this.currentSegments + this.scrollProgress * 12);
    const scrollRotation = this.scrollProgress * Math.PI;
    this.rotationOffset += this.rotationSpeed;

    for (let layer = 0; layer < numLayers; layer++) {
      const radius = baseRadius * (0.35 + layer * 0.18);
      const segments = effectiveSegments + layer * 2;
      const angleStep = (2 * Math.PI) / segments;
      const opacity = Math.max(0.15, 0.7 - layer * 0.12 - this.scrollProgress * 0.2);
      const strokeWidth = Math.max(0.6, 2 - layer * 0.25);

      ctx.strokeStyle = this.colors[layer % this.colors.length];
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = opacity;

      for (let i = 0; i < segments; i++) {
        const angle = i * angleStep + scrollRotation + this.rotationOffset;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x1, y1);
        ctx.stroke();

        if (layer === 0) {
          ctx.beginPath();
          ctx.arc(x1, y1, 1.5 + this.scrollProgress * 2, 0, 2 * Math.PI);
          ctx.fillStyle = this.colors[layer % this.colors.length];
          ctx.fill();
        }

        const nextAngle = angle + angleStep;
        const x2 = centerX + Math.cos(nextAngle) * radius;
        const y2 = centerY + Math.sin(nextAngle) * radius;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, angle, nextAngle);
        ctx.stroke();
      }

      if (layer % 2 === 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    // Center pulse circle
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = this.colors[0];
    ctx.lineWidth = 2;
    ctx.beginPath();
    const pulseRadius = 6 + Math.sin(Date.now() * 0.002) * 2 + this.scrollProgress * 4;
    ctx.arc(centerX, centerY, pulseRadius, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.globalAlpha = 1;
  }

  startAnimation() {
    const animate = () => {
      this.generateMandala();
      this.animationFrame = requestAnimationFrame(animate);
    };
    if (!this.animationFrame) {
      animate();
    }
  }

  stopAnimation() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  updateSize() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';

    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  destroy() {
    this.stopAnimation();
  }
}

// Export to window for main.js use
window.MandalaGenerator = MandalaGenerator;
