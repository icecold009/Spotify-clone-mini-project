import React, { createContext, useContext, ReactNode } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { ITrack } from '@/types';

interface AudioPlayerContextType {
  currentTrack: ITrack | null;
  currentIndex: number;
  queue: ITrack[];
  upNext: ITrack[];
  isPlaying: boolean;
  progress: number;
  volume: number;
  isShuffled: boolean;
  repeatMode: 'off' | 'one' | 'all';
  isMinimized: boolean;
  isQueueOpen: boolean;
  playTrack: (track: ITrack) => void;
  enqueue: (track: ITrack) => void;
  enqueueNext: (track: ITrack) => void;
  togglePlay: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
  seek: (position: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: () => void;
  toggleMinimize: () => void;
  clearQueue: () => void;
  removeFromQueue: (trackId: string) => void;
  reorderQueue: (from: number, to: number) => void;
  playFromQueue: (index: number) => void;
  closePlayer: () => void;
  openQueuePanel: () => void;
  closeQueuePanel: () => void;
  toggleQueuePanel: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

interface AudioPlayerProviderProps {
  children: ReactNode;
}

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const audioPlayer = useAudioPlayer();

  return (
    <AudioPlayerContext.Provider value={audioPlayer}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayerContext = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayerContext must be used within AudioPlayerProvider');
  }
  return context;
};

