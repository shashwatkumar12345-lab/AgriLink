import React from 'react';
import { Screen, User } from '../types';
import Card from '../components/Card';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import KnowUsSection from '../components/KnowUsSection';
import { TargetIcon } from '../components/icons/TargetIcon';
import { BookOpenIcon } from '../components/icons/BookOpenIcon';
import { CubeTransparentIcon } from '../components/icons/CubeTransparentIcon';
import { HeartIcon } from '../components/icons/HeartIcon';
import { UsersIcon } from '../components/icons/UsersIcon';

interface AboutScreenProps {
  t: (key: string) => string;
  setActiveScreen: (screen: Screen) => void;
  user: User | null;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ t, setActiveScreen, user }) => {
  const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <div className="text-gray-600 dark:text-gray-300 leading-relaxed pl-14 rtl:pl-0 rtl:pr-14">{children}</div>
    </div>
  );

  const Feature: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
     <div className="glass-card p-4 rounded-xl border border-white/20 dark:border-white/5">
        <h4 className="font-semibold text-lg text-green-700 dark:text-green-300">{title}</h4>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{children}</p>
     </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setActiveScreen(Screen.PROFILE)}
          className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label={t('back')}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="text-left rtl:text-right">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('aboutTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{t('aboutSubtitle')}</p>
        </div>
      </div>
      
      <div className="glass-card rounded-[2rem] shadow-xl overflow-hidden w-full">
         <div className="p-6 md:p-8 h-[calc(100vh-200px)] overflow-y-auto">
             <Section title={t('ourMissionTitle')} icon={<TargetIcon className="w-6 h-6 text-green-700 dark:text-green-300" />}>{t('ourMissionText')}</Section>
             <Section title={t('ourStoryTitle')} icon={<BookOpenIcon className="w-6 h-6 text-green-700 dark:text-green-300" />}>{t('ourStoryText')}</Section>

             <div className="mb-8">
               <div className="flex items-center space-x-3 mb-4">
                 <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                   <CubeTransparentIcon className="w-6 h-6 text-green-700 dark:text-green-300" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('ourPlatformTitle')}</h3>
               </div>
               <div className="pl-14 rtl:pl-0 rtl:pr-14">
                 <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{t('platformIntro')}</p>
                 <div className="space-y-4">
                     <Feature title={t('featureTraceTitle')}>{t('featureTraceText')}</Feature>
                     <Feature title={t('featureAugmentTitle')}>{t('featureAugmentText')}</Feature>
                     <Feature title={t('featurePulseTitle')}>{t('featurePulseText')}</Feature>
                 </div>
               </div>
             </div>

             <div className="mb-8">
                 <div className="flex items-center space-x-3 mb-4">
                     <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                         <UsersIcon className="w-6 h-6 text-green-700 dark:text-green-300" />
                     </div>
                     <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('ourImpactTitle')}</h3>
                 </div>
                 <div className="pl-14 rtl:pl-0 rtl:pr-14 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                     <div className="glass-card p-4 rounded-xl border border-white/20 dark:border-white/5 shadow-sm">
                         <p className="text-2xl font-bold text-green-600 dark:text-green-400">10,000+</p>
                         <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('farmersHelped')}</p>
                     </div>
                     <div className="glass-card p-4 rounded-xl border border-white/20 dark:border-white/5 shadow-sm">
                         <p className="text-2xl font-bold text-green-600 dark:text-green-400">50,000+</p>
                         <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('acresCovered')}</p>
                     </div>
                     <div className="glass-card p-4 rounded-xl border border-white/20 dark:border-white/5 shadow-sm">
                         <p className="text-2xl font-bold text-green-600 dark:text-green-400">5,000+</p>
                         <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{t('consultationsProvided')}</p>
                     </div>
                 </div>
             </div>

             <div className="mt-8">
                 <Section title={t('ourCommitmentTitle')} icon={<HeartIcon className="w-6 h-6 text-green-700 dark:text-green-300" />}>
                     {t('ourCommitmentText')}
                     {user && ` ${t('ourCommitmentPersonalized').replace('{userName}', user.name)}`}
                 </Section>
             </div>
            
             <KnowUsSection t={t} />
         </div>
      </div>
    </div>
  );
};

export default AboutScreen;