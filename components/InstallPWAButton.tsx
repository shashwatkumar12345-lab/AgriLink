
import React from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { DownloadIcon } from './icons/DownloadIcon';

interface InstallPWAButtonProps {
  t: (key: string) => string;
  className?: string;
}

const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({ t, className = '' }) => {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button 
      onClick={install}
      className={`absolute top-4 right-4 z-50 group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all duration-300 animate-fade-in ${className}`}
      title={t('installApp')}
    >
      <div className="p-1 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
         <DownloadIcon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wide pr-1">{t('installApp')}</span>
      
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
      </div>
    </button>
  );
};

export default InstallPWAButton;
