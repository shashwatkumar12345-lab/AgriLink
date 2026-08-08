
import React from 'react';
import Spinner from './Spinner';

interface LanguageLoaderProps {
  language: string;
}

const LanguageLoader: React.FC<LanguageLoaderProps> = ({ language }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col items-center justify-center">
      <div className="scale-150 mb-6">
        <Spinner />
      </div>
      <h3 className="text-xl font-bold text-green-600 dark:text-green-400 animate-pulse mb-2">
        Translating to {language}...
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
        Optimizing the interface for your region.
      </p>
    </div>
  );
};

export default LanguageLoader;
