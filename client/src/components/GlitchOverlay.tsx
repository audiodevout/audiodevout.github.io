import { useState, useCallback } from 'react';

export default function GlitchOverlay() {
  const [isActive, setIsActive] = useState(false);

  const triggerGlitch = useCallback((callback?: () => void) => {
    setIsActive(true);
    
    setTimeout(() => {
      if (callback) callback();
      setIsActive(false);
    }, 600);
  }, []);

  // Expose the trigger function globally for use in navigation
  (window as any).triggerGlitch = triggerGlitch;

  return (
    <div
      className={`glitch-overlay ${isActive ? 'active' : ''}`}
      aria-hidden="true"
    />
  );
}
