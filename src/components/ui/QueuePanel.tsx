import React from 'react';
import { FiX, FiArrowUp, FiArrowDown, FiTrash2, FiList, FiPlay } from 'react-icons/fi';
import { useAudioPlayerContext } from '@/context/audioPlayerContext';
import { getImageUrl, cn } from '@/utils';
import { Button } from './button';

const QueuePanel: React.FC = () => {
  const {
    queue,
    currentTrack,
    currentIndex,
    isQueueOpen,
    closeQueuePanel,
    toggleQueuePanel,
    removeFromQueue,
    reorderQueue,
    playFromQueue,
    clearQueue,
  } = useAudioPlayerContext();

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    reorderQueue(index, target);
  };

  return (
    <>
      <button
        onClick={toggleQueuePanel}
        className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-gray-900 text-white px-4 py-2 shadow-lg hover:bg-black transition-colors duration-150"
      >
        <FiList className="w-4 h-4" />
        <span className="text-sm font-semibold">Queue</span>
        <span className="text-xs bg-white/20 rounded-full px-2 py-0.5">
          {queue.length}
        </span>
      </button>

      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 transition-transform duration-300 border-l border-gray-200 dark:border-gray-800 flex flex-col',
          isQueueOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <FiList className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Up Next</p>
              <p className="text-xs text-gray-500">{queue.length} tracks in queue</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {queue.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearQueue} className="text-xs">
                <FiTrash2 className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={closeQueuePanel}>
              <FiX className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {currentTrack && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Now Playing</p>
            <div className="flex items-center gap-3">
              <img
                src={getImageUrl(currentTrack.poster_path)}
                alt={currentTrack.title || currentTrack.name}
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {currentTrack.title || currentTrack.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {currentTrack.artist || 'Unknown Artist'}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="ml-auto"
                onClick={() => playFromQueue(currentIndex)}
              >
                <FiPlay className="w-4 h-4" />
                Play
              </Button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {queue.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              Queue is empty. Add tracks from any card.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-800">
              {queue.map((track, index) => {
                const isCurrent = index === currentIndex;
                return (
                  <li
                    key={track.id}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3',
                      isCurrent ? 'bg-blue-50 dark:bg-blue-900/30' : 'bg-transparent'
                    )}
                  >
                    <span className="text-xs text-gray-500 w-5 text-center">{index + 1}</span>
                    <img
                      src={getImageUrl(track.poster_path)}
                      alt={track.title || track.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <button
                      className="flex-1 text-left min-w-0"
                      onClick={() => playFromQueue(index)}
                    >
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {track.title || track.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {track.artist || track.album || 'Unknown Artist'}
                      </p>
                    </button>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === 0}
                        onClick={() => handleMove(index, 'up')}
                        title="Move up"
                      >
                        <FiArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={index === queue.length - 1}
                        onClick={() => handleMove(index, 'down')}
                        title="Move down"
                      >
                        <FiArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromQueue(track.id)}
                        title="Remove"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default QueuePanel;

