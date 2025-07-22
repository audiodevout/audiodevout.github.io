import { useEffect, useRef } from 'react';
import { useAudioPlayer } from '../hooks/useAudioPlayer';

interface AudioPlayerProps {
  title: string;
  src: string;
  className?: string;
}

export default function AudioPlayer({ title, src, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isPlaying,
    isLoading,
    currentTime,
    duration,
    progress,
    error,
    toggle,
    setProgress,
    formatTime,
    initializeAudio,
  } = useAudioPlayer();

  useEffect(() => {
    if (!audioRef.current) return;
    return initializeAudio(audioRef.current);
  }, [initializeAudio]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(e.target.value));
  };

  return (
    <div className={`audio-player rounded-lg p-4 md:p-6 ${className}`}>
      <div className="flex flex-col space-y-4">
        <h3 className="text-base md:text-lg font-semibold" style={{ color: 'var(--accent-color)' }}>
          {title}
        </h3>
        
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        
        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={toggle}
            disabled={isLoading}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-current flex items-center justify-center hover:bg-current hover:text-black transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-current disabled:opacity-50"
            style={{ 
              color: 'var(--accent-color)', 
              borderColor: 'var(--accent-color)' 
            }}
            aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              <i 
                className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-sm md:text-base`} 
                aria-hidden="true" 
              />
            )}
          </button>
          
          <div className="flex-1 flex items-center space-x-3">
            <input
              type="range"
              className="audio-progress flex-1 h-2 rounded-full cursor-pointer"
              value={progress}
              min="0"
              max="100"
              onChange={handleProgressChange}
              aria-label="Audio progress"
            />
            
            <span
              className="text-xs md:text-sm font-mono min-w-0 md:min-w-20 text-right tabular-nums"
              style={{ color: 'var(--accent-color)' }}
              aria-live="polite"
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
        
        <audio
          ref={audioRef}
          preload="metadata"
          style={{ display: 'none' }}
        >
          <source src={src} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
}
