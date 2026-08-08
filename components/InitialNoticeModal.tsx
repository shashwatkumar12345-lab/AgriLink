
import React from 'react';
import Card from './Card';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { AppMode } from '../types';

interface InitialNoticeModalProps {
  notice: { title: string; message: string };
  onClose: () => void;
  t: (key: string) => string;
  appMode?: AppMode;
}

const InitialNoticeModal: React.FC<InitialNoticeModalProps> = ({ notice, onClose, t, appMode = 'crops' }) => {
  const isCrops = appMode === 'crops';
  const iconColor = isCrops ? 'text-green-500' : 'text-pink-500';
  const btnClass = isCrops ? 'bg-green-600 hover:bg-green-700' : 'bg-pink-600 hover:bg-pink-700';

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm" onClick={onClose}>
      {/* Fix: Wrapped Card in a div to handle stopPropagation on click since Card props do not include onClick */}
      <div className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <Card>
          <div className="text-center p-4">
            <CheckCircleIcon className={`w-16 h-16 ${iconColor} mx-auto mb-4`} />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{notice.title}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{notice.message}</p>
            <div className="flex justify-center">
              <button onClick={onClose} className={`text-white font-bold py-2 px-6 rounded-lg transition duration-300 shadow-md active:scale-95 ${btnClass}`}>
                {t('gotIt')}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default InitialNoticeModal;
