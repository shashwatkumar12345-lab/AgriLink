import React from 'react';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface CardProps {
  title?: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`glass-card overflow-hidden w-full ${className}`}>
      {title && (
        <div className="p-4 md:p-5 bg-white/20 dark:bg-slate-900/10 border-b border-white/20 dark:border-white/5">
          <div className="text-lg font-black tracking-tight">{title}</div>
        </div>
      )}
      <div className="p-4 md:p-6">{children}</div>
    </div>
  );
};

export default Card;

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

interface CertificateProps {
  userName: string;
  certificationName: string;
  issueDate: string;
  t: (key: string) => string;
  onClose: () => void;
}

export const Certificate: React.FC<CertificateProps> = ({ userName, certificationName, issueDate, t, onClose }) => {
    const handleDownload = () => {
        window.print();
    };

    const certificateId = `CERT-${userName.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 90000) + 10000}`;

    return (
        <div className="printable-modal fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="certificate-container-print bg-white dark:bg-gray-900 rounded-xl shadow-2xl dark:border dark:border-gray-700 max-w-4xl w-full relative aspect-[1.414/1] overflow-hidden transform transition-all scale-100">
                <div className="certificate-content h-full w-full p-2 bg-white dark:bg-gray-900">
                    <div className="w-full h-full border-8 border-green-800 dark:border-green-600 p-2">
                        <div className="w-full h-full border-2 border-green-800 dark:border-green-600 p-8 flex flex-col justify-between items-center text-center relative bg-green-50/20 dark:bg-green-900/10">
                            {/* Decorative Corner */}
                            <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-green-400"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-green-400"></div>

                            {/* Header */}
                            <div className="w-full">
                                <div className="flex justify-center items-center space-x-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 7v10z" />
                                        <path d="M4 17a1 1 0 01-1.447.894l-2-1A1 1 0 010 16V6a1 1 0 01.553-.894l2-1A1 1 0 014 5v12z" />
                                    </svg>
                                    <h1 className="text-3xl font-bold text-green-800 dark:text-green-300" style={{ fontFamily: 'serif' }}>AgriLink</h1>
                                </div>
                                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mt-4 tracking-wider uppercase">{t('certificateOfCompletion')}</h2>
                            </div>

                            {/* Main Content */}
                            <div className="space-y-3 my-8 w-full flex-grow flex flex-col justify-center">
                                <p className="text-lg text-gray-600 dark:text-gray-400">{t('thisCertifiesThat')}</p>
                                <p className="text-5xl font-bold text-green-700 dark:text-green-300 tracking-wide break-words" style={{ fontFamily: 'serif' }}>{userName}</p>
                                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">{t('hasSuccessfullyCompleted')}</p>
                                <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200">{certificationName}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">{t('issuedOn')}: {issueDate}</p>
                            </div>

                            {/* Footer */}
                            <div className="w-full flex justify-between items-end">
                                <div className="text-left w-1/3">
                                    <p className="border-b-2 border-gray-400 dark:border-gray-600 w-full mb-1"></p>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('headOfCertification')}</p>
                                </div>
                                
                                <div className="w-1/4">
                                  <div className="mx-auto w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/50 flex flex-col items-center justify-center border-4 border-green-700 dark:border-green-400 text-green-800 dark:text-green-200">
                                      <AcademicCapIcon className="w-8 h-8" />
                                      <p className="text-xs font-bold mt-1">Certified</p>
                                      <p className="text-[8px] font-semibold">AgriLink</p>
                                  </div>
                                </div>

                                <div className="text-right w-1/3">
                                    <p className="border-b-2 border-gray-400 dark:border-gray-600 w-full mb-1"></p>
                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t('ceoAgriLink')}</p>
                                </div>
                            </div>
                            <div className="absolute bottom-2 left-8 text-left text-[10px] text-gray-400">
                                <p>{t('certificateId')}: {certificateId}</p>
                                <p>{t('verifyAt')}: verify.agrilink.app/{certificateId}</p>
                            </div>
                        </div>
                    </div>
                </div>

                 <div className="no-print absolute -bottom-16 left-1/2 -translate-x-1/2 w-full max-w-md flex flex-col sm:flex-row justify-center items-center gap-3">
                    <button
                        onClick={handleDownload}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg hover:-translate-y-0.5"
                    >
                        <DownloadIcon className="w-5 h-5" />
                        <span>{t('downloadCertificate')}</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition shadow-lg hover:-translate-y-0.5"
                    >
                        {t('close')}
                    </button>
                </div>
                <button onClick={onClose} className="no-print absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition">
                    <XCircleIcon className="w-8 h-8"/>
                </button>
            </div>
        </div>
    );
};
