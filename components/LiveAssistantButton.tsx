
import React, { useState, useEffect } from 'react';
import { VoiceAssistantIcon } from './icons/VoiceAssistantIcon';
import { AppMode } from '../types';

interface LiveAssistantButtonProps {
  onClick: () => void;
  t: (key: string) => string;
  appMode: AppMode;
}

const LiveAssistantButton: React.FC<LiveAssistantButtonProps> = ({ onClick, t, appMode }) => {
  const isCrops = appMode === 'crops';
  // Use more vibrant gradients
  const baseClasses = isCrops
    ? 'bg-gradient-to-br from-green-500 to-emerald-700 hover:from-green-600 hover:to-emerald-800 shadow-green-500/40'
    : 'bg-gradient-to-br from-pink-500 to-rose-700 hover:from-pink-600 hover:to-rose-800 shadow-pink-500/40';

  const [showLabel, setShowLabel] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowLabel(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-24 right-4 rtl:right-auto rtl:left-4 z-30 flex items-center gap-3 flex-row-reverse rtl:flex-row pointer-events-none">
        <button
          onClick={onClick}
          className={`pointer-events-auto text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ${baseClasses}`}
          aria-label={t('openLiveVoiceAssistant')}
        >
          <VoiceAssistantIcon className="w-8 h-8 animate-pulse-slow drop-shadow-md" />
        </button>
        
        {/* Floating Bubble */}
        <div className={`transition-all duration-700 ease-out transform ${showLabel ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-4 scale-90 pointer-events-none'}`}>
             <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xl whitespace-nowrap animate-bounce-slow">
                 <span className="flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    AI Live Assistant
                 </span>
                 {/* Triangle Arrow */}
                 <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-purple-600 transform -translate-y-1/2 rotate-45 rounded-sm"></div>
             </div>
        </div>
    </div>
  );
};

export default LiveAssistantButton;
