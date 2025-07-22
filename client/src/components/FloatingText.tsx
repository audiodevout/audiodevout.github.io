import { useEffect, useState, useRef } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

const descriptors = [
  'Thinker', 'Student', 'Maker', 'Observer', 'Reader', 'Listener', 'Cook', 'Friend', 'Human', 'Son',
  'Philosopher', 'Sociologist', 'Scientist', 'Generalist', 'Anti-Specialist', 'AIUser', 'Critic', 'Researcher', 'Smoker', 'Overanalyser',
  'Dreamer', 'Technologist', 'Wanderer', 'Glitcher', 'Cyborg', 'Outsider', 'Alien', 'Futurist', 'Tinkerer', 'Assembler',
  'Mutator', 'Decoder', 'Dissident', 'Collector', 'Noiser', 'Deconstructor', 'Drifter', 'Skeptic', 'Witness', 'Seeker',
  'Sketcher', 'Painter', 'Sculptor', 'Explorer', 'Experiencer', 'Feeler', 'Imaginer', 'Reflector', 'Intuiter', 'Responder',
  'Navigator', 'Mapper', 'Composer', 'Harmonizer', 'Synthesizer', 'Amplifier', 'Filterer', 'Modulator', 'Echoer', 'Translator'
];

interface FloatingTextItem {
  id: number;
  text: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function FloatingText() {
  const [textItems, setTextItems] = useState<FloatingTextItem[]>([]);
  const mousePosition = useMousePosition();
  const animationRef = useRef<number>();

  useEffect(() => {
    // Initialize floating texts
    const items = descriptors.map((text, index) => ({
      id: index,
      text,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
    }));
    
    setTextItems(items);
  }, []);

  useEffect(() => {
    const animate = () => {
      setTextItems(prev => prev.map(item => {
        const dx = item.x - mousePosition.x;
        const dy = item.y - mousePosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = 150;

        let newVx = item.vx;
        let newVy = item.vy;

        // Mouse repulsion
        if (dist < minDist && dist > 0) {
          const force = (minDist - dist) / minDist * 2;
          newVx += (dx / dist) * force;
          newVy += (dy / dist) * force;
        }

        // Friction
        newVx *= 0.9;
        newVy *= 0.9;

        let newX = item.x + newVx;
        let newY = item.y + newVy;

        // Boundary collision
        if (newX < 0 || newX > window.innerWidth - 100) {
          newVx *= -1;
          newX = Math.max(0, Math.min(window.innerWidth - 100, newX));
        }

        if (newY < 0 || newY > window.innerHeight - 30) {
          newVy *= -1;
          newY = Math.max(0, Math.min(window.innerHeight - 30, newY));
        }

        return {
          ...item,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
        };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    if (textItems.length > 0) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mousePosition, textItems.length]);

  return (
    <>
      {textItems.map(item => (
        <span
          key={item.id}
          className="floating-text text-xs md:text-sm opacity-60"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            color: 'var(--accent-color)',
          }}
          aria-hidden="true"
        >
          {item.text}
        </span>
      ))}
    </>
  );
}
