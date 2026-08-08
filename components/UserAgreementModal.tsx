
import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface UserAgreementModalProps {
  onAgree: () => void;
  t: (key: string) => string;
  role: 'farmer' | 'expert';
}

const UserAgreementModal: React.FC<UserAgreementModalProps> = ({ onAgree, t, role }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const isFarmer = role === 'farmer';

  const renderHTML = (key: string) => {
      const htmlContent = t(key);
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }

  if (showFullTerms) {
    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-center items-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:border dark:border-gray-700 max-w-lg w-full max-h-[90vh] flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center flex-shrink-0">
            <button 
              onClick={() => setShowFullTerms(false)} 
              className="mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {t('tcTitle')}
            </h3>
          </div>
          <div className="p-4 md:p-6 flex-grow overflow-y-auto text-sm text-gray-700 dark:text-gray-300 space-y-4">
            <p className="font-medium">{t('tcIntro')}</p>
            
            <div>
              <h4 className="font-bold mb-1 text-green-700 dark:text-green-400">{t('tcSection1Title')}</h4>
              {renderHTML('tcSection1Body')}
            </div>

            <div>
              <h4 className="font-bold mb-1 text-green-700 dark:text-green-400">{t('tcSection2Title')}</h4>
              {renderHTML('tcSection2Body')}
            </div>

            <div>
              <h4 className="font-bold mb-1 text-green-700 dark:text-green-400">{t('tcSection3Title')}</h4>
              {renderHTML('tcSection3Body')}
            </div>

            {isFarmer ? (
              <div>
                <h4 className="font-bold mb-1 text-green-700 dark:text-green-400">{t('tcSectionFarmerTitle')}</h4>
                {renderHTML('tcSectionFarmerBody')}
              </div>
            ) : (
              <div>
                <h4 className="font-bold mb-1 text-green-700 dark:text-green-400">{t('tcSectionExpertTitle')}</h4>
                {renderHTML('tcSectionExpertBody')}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
             <button
                onClick={() => setShowFullTerms(false)}
                className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                {t('tcBack')}
              </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:border dark:border-gray-700 max-w-lg w-full max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t(isFarmer ? 'userAgreementTitle' : 'expertAgreementTitle')}
          </h3>
        </div>
        
        <div className="p-4 md:p-6 flex-grow overflow-y-auto">
          <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
            <p>{t(isFarmer ? 'userAgreementWhy' : 'expertAgreementWhy')}</p>
            
            {isFarmer ? (
              <ul className="space-y-3 list-inside">
                <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('userAgreementLocationTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('userAgreementLocationDesc')}</p>
                </li>
                <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('userAgreementCameraTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('userAgreementCameraDesc')}</p>
                </li>
                <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('userAgreementDataTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('userAgreementDataDesc')}</p>
                </li>
                <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('userAgreementLocationPrivacyTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('userAgreementLocationPrivacyDescFarmer')}</p>
                </li>
              </ul>
            ) : ( // Expert agreement
              <ul className="space-y-3 list-inside">
                  <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('expertAgreementRespTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('expertAgreementRespDesc')}</p>
                </li>
                <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('expertAgreementPenaltyTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('expertAgreementPenaltyDesc')}</p>
                </li>
                <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('expertAgreementMediaTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('expertAgreementMediaDesc')}</p>
                </li>
                <li>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{t('userAgreementLocationPrivacyTitle')}</h4>
                  <p className="pl-5 rtl:pl-0 rtl:pr-5">{t('userAgreementLocationPrivacyDescExpert')}</p>
                </li>
              </ul>
            )}
          </div>
        </div>
        
        <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex flex-col space-y-4">
              <button 
                onClick={() => setShowFullTerms(true)}
                className="text-left text-sm text-green-600 dark:text-green-400 hover:underline font-medium focus:outline-none"
              >
                {t('readFullTC')}
              </button>

              <label className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked(!isChecked)}
                  className="rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('userAgreementCheckbox')}</span>
              </label>
            </div>

            <div className="pt-4">
              <button
                onClick={onAgree}
                disabled={!isChecked}
                className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {t('userAgreementButton')}
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserAgreementModal;
