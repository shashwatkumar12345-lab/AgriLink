
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import Card from '../components/Card';
import { regionData } from '../utils/regionData';
import InstallPWAButton from '../components/InstallPWAButton';

interface LocationSetupScreenProps {
  user: User;
  onLocationSet: (country: string, state: string) => void;
  t: (key: string) => string;
}

const LocationSetupScreen: React.FC<LocationSetupScreenProps> = ({ user, onLocationSet, t }) => {
  const [state, setState] = useState(user.state || '');
  const [error, setError] = useState('');
  const country = "India"; // Hardcoded

  const [statesList, setStatesList] = useState<string[]>([]);

  useEffect(() => {
    const countryData = regionData[country];
    if (countryData?.states && countryData.states.length > 0) {
      setStatesList(countryData.states);
    } else {
        setStatesList([]);
    }
  }, []);


  const handleConfirm = () => {
    if (!state) {
      setError('Please select your state/province.');
      return;
    }
    onLocationSet(country, state);
  };

  const inputClasses = "mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 placeholder-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:placeholder-gray-400 shadow-sm focus:border-green-500 focus:ring-green-500";

  return (
    <div className="min-h-screen bg-green-50/50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative">
      <InstallPWAButton t={t} />
      
      <div className="flex items-center space-x-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 7v10z" />
          <path d="M4 17a1 1 0 01-1.447.894l-2-1A1 1 0 010 16V6a1 1 0 01.553-.894l2-1A1 1 0 014 5v12z" />
        </svg>
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">AgriLink</h1>
      </div>
      <Card className="max-w-md w-full">
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">{t('locationSetupTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('locationSetupSubtitle')}</p>
          
          <div className="space-y-4 text-left rtl:text-right">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('country')}</label>
               <input type="text" value={country} disabled className={`${inputClasses} bg-gray-100 cursor-not-allowed`} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('stateProvince')}</label>
              {statesList.length > 0 ? (
                <select
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputClasses}
                  required
                >
                  <option value="">{t('selectStateProvince')}</option>
                  {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={inputClasses}
                  placeholder={t('stateProvincePlaceholder')}
                  required
                />
              )}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center pt-2">{error}</p>}
          </div>
          
          <button
            onClick={handleConfirm}
            disabled={!state}
            className="mt-8 w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400"
          >
            {t('confirmLocation')}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default LocationSetupScreen;
