import { useState, useRef, useCallback } from 'react';

interface AudioPlayerState {
  isPlaying: boolean;
  isLoading: boolean;
  duration: number;
  currentTime: number;
  progress: number;
  error: string | null;
}

export function useAudioPlayer(src?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioPlayerState>({
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    progress: 0,
    error: null,
  });

  const updateState = useCallback((updates: Partial<AudioPlayerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const play = useCallback(async () => {
    if (!audioRef.current) return;

    try {
      updateState({ isLoading: true, error: null });
      await audioRef.current.play();
      updateState({ isPlaying: true, isLoading: false });
    } catch (error) {
      console.error('Audio play failed:', error);
      updateState({ 
        isPlaying: false, 
        isLoading: false, 
        error: 'Failed to play audio' 
      });
    }
  }, [updateState]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    updateState({ isPlaying: false });
  }, [updateState]);

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }, []);

  const setProgress = useCallback((progressPercent: number) => {
    if (!audioRef.current || !state.duration) return;
    const time = (progressPercent / 100) * state.duration;
    seek(time);
  }, [state.duration, seek]);

  const formatTime = useCallback((seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const initializeAudio = useCallback((audioElement: HTMLAudioElement) => {
    audioRef.current = audioElement;

    const handleLoadStart = () => updateState({ isLoading: true });
    const handleCanPlay = () => updateState({ isLoading: false });
    const handleLoadedMetadata = () => {
      updateState({ duration: audioElement.duration || 0 });
    };

    const handleTimeUpdate = () => {
      const currentTime = audioElement.currentTime;
      const duration = audioElement.duration || 0;
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
      
      updateState({ currentTime, progress });
    };

    const handleEnded = () => {
      updateState({ 
        isPlaying: false, 
        currentTime: 0, 
        progress: 0 
      });
    };

    const handleError = () => {
      updateState({ 
        isLoading: false, 
        isPlaying: false, 
        error: 'Error loading audio' 
      });
    };

    // Add event listeners
    audioElement.addEventListener('loadstart', handleLoadStart);
    audioElement.addEventListener('canplay', handleCanPlay);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);

    // Cleanup function
    return () => {
      audioElement.removeEventListener('loadstart', handleLoadStart);
      audioElement.removeEventListener('canplay', handleCanPlay);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, [updateState]);

  return {
    ...state,
    play,
    pause,
    toggle,
    seek,
    setProgress,
    formatTime,
    initializeAudio,
    audioRef,
  };
}
