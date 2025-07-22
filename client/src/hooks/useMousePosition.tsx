import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    let lastMouseMove = 0;
    const throttleDelay = 16; // ~60fps

    const updateMousePosition = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseMove < throttleDelay) return;
      lastMouseMove = now;

      setMousePosition({ x: e.clientX, y: e.clientY });

      // Update dynamic colors based on position
      const hue = Math.floor((e.clientX + e.clientY) * 180 / 512) % 360;
      const newAccent = `hsl(${hue}, 100%, 50%)`;
      const newText = `hsl(${(hue + 180) % 360}, 100%, 70%)`;

      document.documentElement.style.setProperty('--accent-color', newAccent);
      document.documentElement.style.setProperty('--text-color', newText);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
}
