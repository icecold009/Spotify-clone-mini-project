import { useState, useCallback, useRef, useEffect } from 'react';
import { ITrack } from '@/types';
import { mcpAudioService } from '@/services/MCPAudioService';

interface AudioPlayerState {
  currentTrack: ITrack | null;
  currentIndex: number;
  queue: ITrack[];
  isPlaying: boolean;
  progress: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  isMinimized: boolean;
  isQueueOpen: boolean;
}

export const useAudioPlayer = () => {
  const [state, setState] = useState<AudioPlayerState>({
    currentTrack: null,
    currentIndex: -1,
    queue: [],
    isPlaying: false,
    progress: 0,
    volume: 80,
    isShuffled: false,
    repeatMode: 'off',
    isMinimized: false,
    isQueueOpen: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  const startSimulation = useCallback(() => {
    let simulatedProgress = 0;
    simulationInterval.current = setInterval(() => {
      simulatedProgress += 1;
      setState(prev => ({ ...prev, progress: simulatedProgress }));

      if (simulatedProgress >= 100) {
        if (simulationInterval.current) {
          clearInterval(simulationInterval.current);
          simulationInterval.current = null;
        }
        setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
      }
    }, 250);
  }, []);

  const loadTrack = useCallback(
    async (track: ITrack, shouldPlay = true) => {
      if (!track) return;

      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }

      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: shouldPlay,
        progress: 0,
      }));

      try {
        const enhancedTrack =
          track.preview_url && track.preview_url.length > 0
            ? track
            : await mcpAudioService.enhanceTrackWithPreview(track);

        setState(prev => ({
          ...prev,
          currentTrack: enhancedTrack,
        }));

        if (audioRef.current && enhancedTrack.preview_url && shouldPlay) {
          const audio = audioRef.current;
          audio.src = enhancedTrack.preview_url;
          audio.volume = state.volume / 100;

          try {
            await audio.play();
          } catch (error) {
            console.error('Audio play failed:', error);
            startSimulation();
          }
        } else if (shouldPlay) {
          startSimulation();
        }
      } catch (error) {
        console.error('Preview fetch failed, simulating playback:', error);
        if (shouldPlay) {
          startSimulation();
        }
      }
    },
    [startSimulation, state.volume]
  );

  const goToIndex = useCallback(
    async (nextIndex: number | null, autoPlay = true) => {
      if (nextIndex === null || nextIndex < 0 || nextIndex >= state.queue.length) {
        audioRef.current?.pause();
        setState(prev => ({ ...prev, isPlaying: false, progress: 0 }));
        return;
      }

      const nextTrack = state.queue[nextIndex];
      setState(prev => ({
        ...prev,
        currentIndex: nextIndex,
        currentTrack: nextTrack,
        isPlaying: autoPlay,
        progress: 0,
      }));

      if (autoPlay) {
        await loadTrack(nextTrack, true);
      }
    },
    [loadTrack, state.queue]
  );

  const skipNext = useCallback(async () => {
    if (state.queue.length === 0) return;

    if (state.repeatMode === 'one' && state.currentIndex >= 0) {
      await goToIndex(state.currentIndex, true);
      return;
    }

    let nextIndex = state.isShuffled
      ? Math.floor(Math.random() * state.queue.length)
      : state.currentIndex + 1;

    if (state.isShuffled && state.queue.length > 1 && nextIndex === state.currentIndex) {
      nextIndex = (nextIndex + 1) % state.queue.length;
    }

    if (nextIndex >= state.queue.length) {
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        await goToIndex(null);
        return;
      }
    }

    await goToIndex(nextIndex, true);
  }, [goToIndex, state.currentIndex, state.isShuffled, state.queue.length, state.repeatMode]);

  const skipPrevious = useCallback(async () => {
    if (state.queue.length === 0) return;

    let prevIndex = state.isShuffled
      ? Math.floor(Math.random() * state.queue.length)
      : state.currentIndex - 1;

    if (prevIndex < 0) {
      if (state.repeatMode === 'all') {
        prevIndex = state.queue.length - 1;
      } else {
        await goToIndex(null);
        return;
      }
    }

    await goToIndex(prevIndex, true);
  }, [goToIndex, state.currentIndex, state.isShuffled, state.queue.length, state.repeatMode]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();

    const audio = audioRef.current;

    const handleEnded = () => {
      skipNext();
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setState(prev => ({ ...prev, isPlaying: false }));
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [skipNext]);

  // Update progress
  useEffect(() => {
    if (state.isPlaying && audioRef.current) {
      progressInterval.current = setInterval(() => {
        const audio = audioRef.current;
        if (audio && audio.duration) {
          const currentProgress = (audio.currentTime / audio.duration) * 100;
          setState(prev => ({ ...prev, progress: currentProgress }));
        }
      }, 250);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, [state.isPlaying]);

  const openQueuePanel = useCallback(() => {
    setState(prev => ({ ...prev, isQueueOpen: true }));
  }, []);

  const closeQueuePanel = useCallback(() => {
    setState(prev => ({ ...prev, isQueueOpen: false }));
  }, []);

  const toggleQueuePanel = useCallback(() => {
    setState(prev => ({ ...prev, isQueueOpen: !prev.isQueueOpen }));
  }, []);

  const playTrack = useCallback(
    async (track: ITrack) => {
      if (!track) return;

      if (state.currentTrack?.id === track.id) {
        togglePlay();
        return;
      }

      setState(prev => ({
        ...prev,
        queue: [track],
        currentIndex: 0,
        currentTrack: track,
        isPlaying: true,
        progress: 0,
      }));

      await loadTrack(track, true);
    },
    [loadTrack, state.currentTrack, togglePlay]
  );

  const enqueue = useCallback((track: ITrack) => {
    setState(prev => {
      const nextQueue = [...prev.queue, track];
      const nextIndex = prev.currentIndex === -1 ? 0 : prev.currentIndex;

      return {
        ...prev,
        queue: nextQueue,
        currentIndex: nextIndex,
        currentTrack: prev.currentTrack ?? track,
      };
    });
  }, []);

  const enqueueNext = useCallback((track: ITrack) => {
    setState(prev => {
      if (prev.currentIndex === -1) {
        return {
          ...prev,
          queue: [track],
          currentIndex: 0,
          currentTrack: track,
        };
      }

      const nextQueue = [...prev.queue];
      nextQueue.splice(prev.currentIndex + 1, 0, track);

      return { ...prev, queue: nextQueue };
    });
  }, []);

  const seek = useCallback((position: number) => {
    setState(prev => ({ ...prev, progress: position }));

    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (position / 100) * audioRef.current.duration;
    }
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume }));

    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!state.currentTrack) return;

    if (state.isPlaying) {
      audioRef.current?.pause();

      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
        simulationInterval.current = null;
      }
    } else {
      if (audioRef.current && state.currentTrack.preview_url) {
        audioRef.current.play().catch(error => {
          console.error('Audio play failed:', error);
        });
      } else {
        startSimulation();
      }
    }

    setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [startSimulation, state.currentTrack, state.isPlaying]);

  const toggleShuffle = useCallback(() => {
    setState(prev => ({ ...prev, isShuffled: !prev.isShuffled }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setState(prev => {
      const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeatMode: nextMode };
    });
  }, []);

  const toggleFavorite = useCallback(() => {
    console.log('Toggle favorite - not implemented yet');
  }, []);

  const toggleMinimize = useCallback(() => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const clearQueue = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }

    setState(prev => ({
      ...prev,
      queue: [],
      currentIndex: -1,
      currentTrack: null,
      isPlaying: false,
      progress: 0,
    }));
  }, []);

  const removeFromQueue = useCallback(
    async (trackId: string) => {
      const currentQueue = state.queue;
      const index = currentQueue.findIndex(t => t.id === trackId);
      if (index === -1) return;

      const nextQueue = currentQueue.filter(t => t.id !== trackId);
      let nextIndex = state.currentIndex;
      let nextTrack: ITrack | null = state.currentTrack;

      if (index === state.currentIndex) {
        if (nextQueue.length === 0) {
          nextIndex = -1;
          nextTrack = null;
        } else if (state.currentIndex >= nextQueue.length) {
          nextIndex = nextQueue.length - 1;
          nextTrack = nextQueue[nextIndex];
        } else {
          nextTrack = nextQueue[state.currentIndex];
        }
      } else if (index < state.currentIndex) {
        nextIndex = Math.max(state.currentIndex - 1, 0);
        nextTrack = nextQueue[nextIndex] ?? null;
      }

      setState(prev => ({
        ...prev,
        queue: nextQueue,
        currentIndex: nextIndex,
        currentTrack: nextTrack,
        isPlaying: nextTrack ? prev.isPlaying : false,
        progress: nextTrack ? prev.progress : 0,
      }));

      if (nextTrack) {
        await loadTrack(nextTrack, state.isPlaying);
      } else {
        audioRef.current?.pause();
      }
    },
    [loadTrack, state.currentIndex, state.currentTrack, state.isPlaying, state.queue]
  );

  const reorderQueue = useCallback((from: number, to: number) => {
    setState(prev => {
      if (from === to || from < 0 || to < 0 || from >= prev.queue.length || to >= prev.queue.length) {
        return prev;
      }

      const updated = [...prev.queue];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);

      let nextIndex = prev.currentIndex;
      if (from === prev.currentIndex) {
        nextIndex = to;
      } else if (from < prev.currentIndex && to >= prev.currentIndex) {
        nextIndex = prev.currentIndex - 1;
      } else if (from > prev.currentIndex && to <= prev.currentIndex) {
        nextIndex = prev.currentIndex + 1;
      }

      return { ...prev, queue: updated, currentIndex: nextIndex };
    });
  }, []);

  const playFromQueue = useCallback(
    async (index: number) => {
      await goToIndex(index, true);
    },
    [goToIndex]
  );

  const closePlayer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    setState({
      currentTrack: null,
      currentIndex: -1,
      queue: [],
      isPlaying: false,
      progress: 0,
      volume: 80,
      isShuffled: false,
      repeatMode: 'off',
      isMinimized: false,
      isQueueOpen: false,
    });
  }, []);

  return {
    currentTrack: state.currentTrack,
    currentIndex: state.currentIndex,
    queue: state.queue,
    upNext: state.queue.slice(state.currentIndex + 1),
    isPlaying: state.isPlaying,
    progress: state.progress,
    volume: state.volume,
    isShuffled: state.isShuffled,
    repeatMode: state.repeatMode,
    isMinimized: state.isMinimized,
    isQueueOpen: state.isQueueOpen,

    playTrack,
    enqueue,
    enqueueNext,
    togglePlay,
    skipNext,
    skipPrevious,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleFavorite,
    toggleMinimize,
    clearQueue,
    removeFromQueue,
    reorderQueue,
    closePlayer,
    openQueuePanel,
    closeQueuePanel,
    toggleQueuePanel,
    playFromQueue,
    setQueue: (queue: ITrack[]) => setState(prev => ({ ...prev, queue })),
    setCurrentIndex: (idx: number) => setState(prev => ({ ...prev, currentIndex: idx })),
  };
};

