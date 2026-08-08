import React from 'react';
import Card from './Card';
import { PencilSquareIcon } from './icons/PencilSquareIcon';

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProfile: () => void;
  t: (key: string) => string;
}

const CompleteProfileModal: React.FC<CompleteProfileModalProps> = ({ isOpen, onClose, onGoToProfile, t }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <Card className="max-w-md w-full">
        <div className="text-center p-4">
          <PencilSquareIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('completeProfileTitle')}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('completeProfileBody')}</p>
          <div className="flex flex-col sm:flex-row-reverse gap-2 justify-center">
             <button onClick={onGoToProfile} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300">
              {t('completeProfileButton')}
            </button>
            <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition duration-300">
              {t('maybeLater')}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CompleteProfileModal;
