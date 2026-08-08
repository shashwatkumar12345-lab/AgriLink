
import React, { useState } from 'react';
import { User } from '../types';
import Card from '../components/Card';
import { regionData } from '../utils/regionData';
import { supportedLanguages } from '../utils/countryLanguages';
import { GlobeAltIcon } from '../components/icons/GlobeAltIcon'; 
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import InstallPWAButton from '../components/InstallPWAButton';

interface LanguageSelectionScreenProps {
  user: User;
  onLanguageSelect: (language: string) => void;
  t: (key: string) => string;
}

interface LanguageButtonProps {
  lang: string;
  isSuggested?: boolean;
  isSelected: boolean;
  onSelect: (lang: string) => void;
}

const LanguageButton: React.FC<LanguageButtonProps> = ({ lang, isSuggested, isSelected, onSelect }) => (
  <button
    onClick={() => onSelect(lang)}
    className={`relative w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between ${
      isSelected
        ? 'border-green-600 bg-green-50 dark:bg-green-900/30'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-green-300'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-2xl">{isSuggested ? '📍' : '🌐'}</span>
      <span className={`font-semibold ${isSelected ? 'text-green-700 dark:text-green-300' : 'text-gray-700 dark:text-gray-300'}`}>
        {lang}
      </span>
    </div>
    {isSelected && (
      <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
    )}
  </button>
);

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ user, onLanguageSelect, t }) => {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  // Requirement: English first, then others.
  const sortedLanguages = ['English', ...supportedLanguages.filter(l => l !== 'English')];

  const countryInfo = regionData[user.country];
  const suggestedLanguages = countryInfo?.languages?.filter(lang => supportedLanguages.includes(lang)) || [];

  const handleConfirm = () => {
    if (selectedLang) {
      onLanguageSelect(selectedLang);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative">
      <InstallPWAButton t={t} />
      
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-2">Welcome, {user.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please select your preferred language.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="space-y-3">
            {sortedLanguages.map(lang => (
              <LanguageButton 
                key={lang} 
                lang={lang} 
                isSuggested={suggestedLanguages.includes(lang)} 
                isSelected={selectedLang === lang}
                onSelect={setSelectedLang}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedLang}
          className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;
