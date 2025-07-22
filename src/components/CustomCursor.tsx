import { useEffect, useState, useRef } from 'react';

interface CursorTrail {
  x: number;
  y: number;
  id: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [trails, setTrails] = useState<CursorTrail[]>([]);
  const trailIdRef = useRef(0);
  const mousePositionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Only show cursor on desktop devices
    const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newPos = { x: e.clientX, y: e.clientY };
      
      // Update immediately for real-time tracking
      mousePositionRef.current = newPos;
      setPosition(newPos);
      setIsVisible(true);

      // Add trail element
      const trail: CursorTrail = {
        x: newPos.x,
        y: newPos.y,
        id: trailIdRef.current++
      };

      setTrails(prev => [...prev, trail]);

      // Remove trail after animation duration
      setTimeout(() => {
        setTrails(prev => prev.filter(t => t.id !== trail.id));
      }, 800);

      // Emit cursor position for particle/text repulsion
      window.dispatchEvent(new CustomEvent('cursor-move', { 
        detail: { x: newPos.x, y: newPos.y } 
      }));
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Use passive listeners for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Handle hover states for interactive elements
    const updateHoverElements = () => {
      const interactiveElements = document.querySelectorAll('a, button, .gallery-item, .audio-player, .featured-item, input, textarea');
      
      const addHoverState = () => setIsHovering(true);
      const removeHoverState = () => setIsHovering(false);

      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', addHoverState);
        el.addEventListener('mouseleave', removeHoverState);
      });

      return () => {
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', addHoverState);
          el.removeEventListener('mouseleave', removeHoverState);
        });
      };
    };

    const cleanup = updateHoverElements();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cleanup();
    };
  }, []);

  // Provide current mouse position for other components
  useEffect(() => {
    (window as any).getCurrentMousePosition = () => mousePositionRef.current;
  }, []);

  // Don't render on mobile devices
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return null;
  }

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'hover' : ''}`}
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {/* Trail elements */}
      {trails.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{ 
            left: trail.x, 
            top: trail.y,
            position: 'absolute',
            width: '6px',
            height: '6px',
            background: 'var(--accent-color)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            opacity: 0.6,
            animation: 'cursor-trail-fade 0.8s ease-out forwards',
            boxShadow: '0 0 8px var(--accent-color)',
          }}
        />
      ))}
      
      {/* Main cursor dot */}
      <div 
        className="cursor-dot"
        style={{ 
          left: position.x, 
          top: position.y,
          transition: 'none' // Remove transition for immediate response
        }}
      />
      
      {/* Crosshair lines */}
      <div 
        className="cursor-crosshair-h"
        style={{ 
          left: position.x, 
          top: position.y,
          transition: 'none'
        }}
      />
      <div 
        className="cursor-crosshair-v"
        style={{ 
          left: position.x, 
          top: position.y,
          transition: 'none'
        }}
      />
      
      {/* Axis lines */}
      <div 
        className="cursor-axis-x"
        style={{ 
          top: position.y,
          transition: 'none'
        }}
      />
      <div 
        className="cursor-axis-y"
        style={{ 
          left: position.x,
          transition: 'none'
        }}
      />
    </div>
  );
}
