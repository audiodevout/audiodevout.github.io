import { useEffect, useState, useRef } from 'react';
import { usePortfolioData } from '@/hooks/usePortfolioData';

interface FloatingTextItem {
  id: number;
  text: string;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  opacity: number;
  size: number;
  age: number;
  maxAge: number;
}

export default function FloatingText() {
  const { data: portfolioData } = usePortfolioData();
  const [floatingTexts, setFloatingTexts] = useState<FloatingTextItem[]>([]);
  const textIdRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!portfolioData?.floatingText) return;

    // Listen for cursor movement
    const handleCursorMove = (e: any) => {
      mouseRef.current = { x: e.detail.x, y: e.detail.y };
    };
    window.addEventListener('cursor-move', handleCursorMove);

    const createFloatingText = () => {
      if (floatingTexts.length >= 12) return; // Limit active texts

      const text = portfolioData.floatingText[Math.floor(Math.random() * portfolioData.floatingText.length)];
      const startX = Math.random() * window.innerWidth;
      const startY = Math.random() * window.innerHeight;

      const newText: FloatingTextItem = {
        id: textIdRef.current++,
        text,
        x: startX,
        y: startY,
        baseX: startX,
        baseY: startY,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.3,
        size: Math.random() * 0.2 + 0.8, // 0.8 to 1.0
        age: 0,
        maxAge: 15000 + Math.random() * 10000, // 15-25 seconds
      };

      setFloatingTexts(prev => [...prev, newText]);
    };

    const updateFloatingTexts = () => {
      setFloatingTexts(prev => {
        return prev.map(text => {
          // Update age
          text.age += 16; // ~60fps

          // Gentle floating motion
          text.baseX += text.vx;
          text.baseY += text.vy;

          // Wrap around screen edges
          if (text.baseX < -100) text.baseX = window.innerWidth + 100;
          if (text.baseX > window.innerWidth + 100) text.baseX = -100;
          if (text.baseY < -50) text.baseY = window.innerHeight + 50;
          if (text.baseY > window.innerHeight + 50) text.baseY = -50;

          // Cursor repulsion
          const dx = mouseRef.current.x - text.baseX;
          const dy = mouseRef.current.y - text.baseY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const repulsionRadius = 100;
          
          let repelX = 0;
          let repelY = 0;
          
          if (distance < repulsionRadius && distance > 0) {
            const force = (repulsionRadius - distance) / repulsionRadius;
            const repulsionStrength = force * 30;
            repelX = -(dx / distance) * repulsionStrength;
            repelY = -(dy / distance) * repulsionStrength;
          }

          // Apply repulsion
          text.x = text.baseX + repelX;
          text.y = text.baseY + repelY;

          // Fade in/out based on age
          const fadeInDuration = 1000;
          const fadeOutDuration = 2000;
          
          if (text.age < fadeInDuration) {
            text.opacity = (text.age / fadeInDuration) * 0.6;
          } else if (text.age > text.maxAge - fadeOutDuration) {
            const fadeProgress = (text.maxAge - text.age) / fadeOutDuration;
            text.opacity = fadeProgress * 0.6;
          } else {
            text.opacity = 0.4 + Math.sin(text.age * 0.002) * 0.2; // Gentle pulsing
          }

          return text;
        }).filter(text => text.age < text.maxAge); // Remove expired texts
      });

      animationFrameRef.current = requestAnimationFrame(updateFloatingTexts);
    };

    // Create initial floating texts
    for (let i = 0; i < 8; i++) {
      setTimeout(() => createFloatingText(), i * 800);
    }

    // Continue creating texts
    const interval = setInterval(() => {
      createFloatingText();
    }, 4000);

    // Start animation loop
    updateFloatingTexts();

    return () => {
      clearInterval(interval);
      window.removeEventListener('cursor-move', handleCursorMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [portfolioData]);

  return (
    <div className="floating-text-container">
      {floatingTexts.map(item => (
        <div
          key={item.id}
          className="floating-text-item"
          style={{
            position: 'absolute',
            left: `${item.x}px`,
            top: `${item.y}px`,
            transform: 'translate(-50%, -50%)',
            color: 'var(--accent-color)',
            fontFamily: 'var(--font-main)',
            fontSize: `${item.size}rem`,
            fontWeight: 300,
            opacity: item.opacity,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            textShadow: '0 0 10px var(--accent-color)',
            transition: 'opacity 0.3s ease',
          }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
