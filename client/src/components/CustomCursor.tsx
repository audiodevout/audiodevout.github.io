import { useEffect, useState } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';
import { useIsMobile } from '../hooks/use-mobile';

export default function CustomCursor() {
  const mousePosition = useMousePosition();
  const isMobile = useIsMobile();
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (isMobile) return;

    // Create trail effect (reduced frequency for performance)
    if (Math.random() > 0.8) {
      const id = Date.now() + Math.random();
      const newTrail = { id, x: mousePosition.x, y: mousePosition.y };
      
      setTrails(prev => [...prev, newTrail]);
      
      // Remove trail after animation
      setTimeout(() => {
        setTrails(prev => prev.filter(trail => trail.id !== id));
      }, 2000);
    }
  }, [mousePosition, isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        className="cursor-element custom-cursor"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
        aria-hidden="true"
      />
      
      {/* Crosshair X */}
      <div
        className="cursor-element crosshair-x"
        style={{
          top: `${mousePosition.y}px`,
        }}
        aria-hidden="true"
      />
      
      {/* Crosshair Y */}
      <div
        className="cursor-element crosshair-y"
        style={{
          left: `${mousePosition.x}px`,
        }}
        aria-hidden="true"
      />
      
      {/* Axis markers */}
      <div
        className="cursor-element axis-marker"
        style={{
          left: `${mousePosition.x + 10}px`,
          top: '5px',
        }}
        aria-hidden="true"
      >
        x: {mousePosition.x}
      </div>
      
      <div
        className="cursor-element axis-marker"
        style={{
          left: '5px',
          top: `${mousePosition.y + 10}px`,
        }}
        aria-hidden="true"
      >
        y: {mousePosition.y}
      </div>
      
      {/* Trail effects */}
      {trails.map(trail => (
        <div
          key={trail.id}
          className="cursor-element trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
