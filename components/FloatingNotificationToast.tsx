
import React, { useState, useEffect, useRef } from 'react';
import { NotificationItem } from '../types';

interface FloatingNotificationToastProps {
  notification: NotificationItem;
  onClose: () => void;
  onClick: () => void;
}

const FloatingNotificationToast: React.FC<FloatingNotificationToastProps> = ({ notification, onClose, onClick }) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-remove after 7 seconds
    timerRef.current = window.setTimeout(onClose, 7000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [onClose]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
    // Pause timer while user is interacting
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX.current;
    setOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // If swiped significantly left or right, dismiss
    if (Math.abs(offset) > 100) {
      onClose();
    } else {
      setOffset(0);
      // Restart timer
      timerRef.current = window.setTimeout(onClose, 7000);
    }
  };

  const opacity = Math.max(0, 1 - Math.abs(offset) / 300);

  return (
    <div 
      className="fixed top-20 left-0 right-0 z-[110] px-4 pointer-events-none"
      style={{ transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }}
    >
      <div 
        className="max-w-md mx-auto pointer-events-auto cursor-pointer"
        style={{ transform: `translateX(${offset}px)`, opacity }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={onClick}
      >
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3 animate-pop-in relative overflow-hidden">
          {/* 7s timer bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500/30 w-full">
            <div className="h-full bg-blue-500 animate-[shrink_7s_linear_forwards]"></div>
          </div>

          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 text-blue-600 dark:text-blue-400 font-black text-[10px]">
            GOV
          </div>
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-100 line-clamp-1 flex-grow">
            {notification.title}
          </h4>
          <div className="text-[9px] text-gray-400 font-black uppercase tracking-tighter ml-2 opacity-50">Swipe</div>
        </div>
      </div>
      <style>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default FloatingNotificationToast;
