import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppBannerProps {
  t: (key: string) => string;
}

const InstallAppBanner: React.FC<InstallAppBannerProps> = ({ t }) => {
  const { isInstallable, install } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isInstallable || isDismissed) return null;

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-up">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border-t-4 border-green-500 p-4 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex-1 mr-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t('installApp')}</h3>
          <p className="text-xs text-gray-600 dark:text-gray-300">{t('installDescription')}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            {t('dismiss')}
          </button>
          <button
            onClick={install}
            className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 rounded-lg shadow-md transition-transform active:scale-95 whitespace-nowrap"
          >
            {t('installButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallAppBanner;