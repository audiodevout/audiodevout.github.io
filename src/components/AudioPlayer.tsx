import { useState, useRef, useEffect } from 'react';

interface AudioTrack {
  title: string;
  description: string;
  duration: string;
  year: string;
  file: string;
}

interface AudioPlayerProps {
  track: AudioTrack;
}

export default function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleError = () => {
      setIsLoading(false);
      console.error('Error loading audio:', track.file);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [track.file]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    const newTime = clickPercent * duration;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={track.file}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        controlsList="nodownload"
      />
      
      <div className="audio-info">
        <button 
          className="play-button" 
          onClick={togglePlay}
          disabled={isLoading}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          ) : (
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
          )}
        </button>
        
        <div className="audio-details flex-1">
          <h4 className="text-accent font-bold">{track.title}</h4>
          <p className="text-sm text-muted-foreground mb-1">
            {track.description}
          </p>
          <p className="text-xs text-muted-foreground">
            Duration: {track.duration} | Year: {track.year}
          </p>
        </div>
        
        <div className="time-display text-sm text-accent font-mono">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div 
        className="audio-progress cursor-pointer"
        onClick={handleProgressClick}
      >
        <div 
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
