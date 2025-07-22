import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  hue: number;
  baseX: number;
  baseY: number;
  angle: number;
  speed: number;
}

export default function ParticleSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particle system
    const particles: Particle[] = [];
    const maxParticles = 40;

    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Recreate particles when size changes
      particles.length = 0;
      for (let i = 0; i < maxParticles; i++) {
        particles.push(createParticle());
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Listen for cursor movement
    const handleCursorMove = (e: any) => {
      mouseRef.current = { x: e.detail.x, y: e.detail.y };
    };
    window.addEventListener('cursor-move', handleCursorMove);

    // Create initial particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle());
    }

    function createParticle(): Particle {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      return {
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.8 + 0.3,
        size: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.6 + 0.4,
        hue: Math.random() < 0.33 ? 180 : Math.random() < 0.5 ? 330 : 120, // Cyan, hot pink, acid green
      };
    }

    function updateParticles() {
      particles.forEach(particle => {
        // Gentle floating motion
        particle.angle += 0.005;
        particle.baseX += particle.vx;
        particle.baseY += particle.vy;

        // Wrap around screen edges
        if (particle.baseX < 0) particle.baseX = canvas.width;
        if (particle.baseX > canvas.width) particle.baseX = 0;
        if (particle.baseY < 0) particle.baseY = canvas.height;
        if (particle.baseY > canvas.height) particle.baseY = 0;

        // Add floating motion
        const floatX = Math.sin(particle.angle) * 30;
        const floatY = Math.cos(particle.angle * 0.7) * 20;

        // Cursor repulsion
        const dx = mouseRef.current.x - particle.baseX;
        const dy = mouseRef.current.y - particle.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = 120;
        
        let repelX = 0;
        let repelY = 0;
        
        if (distance < repulsionRadius && distance > 0) {
          const force = (repulsionRadius - distance) / repulsionRadius;
          const repulsionStrength = force * 50;
          repelX = -(dx / distance) * repulsionStrength;
          repelY = -(dy / distance) * repulsionStrength;
        }

        // Apply all movements
        particle.x = particle.baseX + floatX + repelX;
        particle.y = particle.baseY + floatY + repelY;

        // Subtle opacity pulsing
        particle.opacity = 0.3 + Math.sin(particle.angle * 2) * 0.2;
      });
    }

    function drawParticles() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // Create gradient for glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 4
        );
        gradient.addColorStop(0, `hsl(${particle.hue}, 100%, 60%)`);
        gradient.addColorStop(1, `hsl(${particle.hue}, 100%, 60%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw core particle with stronger glow
        ctx.fillStyle = `hsl(${particle.hue}, 100%, 70%)`;
        ctx.shadowColor = `hsl(${particle.hue}, 100%, 60%)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.save();
            ctx.globalAlpha = (100 - distance) / 100 * 0.2;
            ctx.strokeStyle = `hsl(180, 100%, 50%)`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      });
    }

    function animate() {
      updateParticles();
      drawParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    }

    // Start animation
    particlesRef.current = particles;
    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      window.removeEventListener('cursor-move', handleCursorMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 'var(--z-particles)',
        pointerEvents: 'none',
        opacity: 0.8,
      }}
    />
  );
}
