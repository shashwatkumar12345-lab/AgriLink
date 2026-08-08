import React, { useState } from 'react';
import { UserRole, ConsultantType } from '../types';
import { LeafIcon } from '../components/icons/LeafIcon';
import { BriefcaseIcon } from '../components/icons/BriefcaseIcon';
import { AcademicCapIcon } from '../components/icons/AcademicCapIcon';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import InstallPWAButton from '../components/InstallPWAButton';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: UserRole, type?: ConsultantType) => void;
  t: (key: string) => string;
}

type SelectionStep = 'initial' | 'expert_specialty' | 'trainee_specialty';

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onRoleSelect, t }) => {
  const [step, setStep] = useState<SelectionStep>('initial');

  const renderSpecialtySelection = (role: 'consultant' | 'trainee') => {
    const isExpertPath = role === 'consultant';
    
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
              <div className="absolute -top-24 -left-24 w-72 h-72 md:w-96 md:h-96 bg-emerald-500 rounded-full blur-[100px] md:blur-[120px] animate-pulse"></div>
              <div className="absolute -bottom-24 -right-24 w-72 h-72 md:w-96 md:h-96 bg-blue-500 rounded-full blur-[100px] md:blur-[120px] animate-pulse delay-700"></div>
          </div>

          <InstallPWAButton t={t} />

          <div className="text-center mb-6 md:mb-10 z-10 max-w-lg">
             <h2 className="text-2xl md:text-5xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 leading-tight">
                {t(isExpertPath ? 'selectExpertSpecialty' : 'selectTrainingProgram')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 md:mt-4 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                  Choose your domain of professional expertise
              </p>
          </div>

          <div className="max-w-md w-full space-y-4 md:space-y-6 z-10">
            <RoleCard
              icon={<AcademicCapIcon className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 dark:text-emerald-400" />}
              title={t(isExpertPath ? 'agriculturalExpert' : 'agriculturalExpertProgram')}
              description={t(isExpertPath ? 'expertSubtitleCrops' : 'reviewCropIssues')}
              onClick={() => onRoleSelect(role, 'agronomist')}
              accent="emerald"
              badge="Crops & Soil"
            />
            <RoleCard
              icon={<StethoscopeIcon className="w-10 h-10 md:w-12 md:h-12 text-rose-600 dark:text-rose-400" />}
              title={t(isExpertPath ? 'veterinarian' : 'veterinarianProgram')}
              description={t(isExpertPath ? 'expertSubtitleAnimals' : 'reviewAnimalIssues')}
              onClick={() => onRoleSelect(role, 'veterinarian')}
              accent="rose"
              badge="Livestock Health"
            />
          </div>
          
          <button
            onClick={() => setStep('initial')}
            className="mt-8 md:mt-12 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all flex items-center gap-2 group z-10"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> {t('backToRoleSelection')}
          </button>
        </div>
    );
  };
  
  if (step === 'expert_specialty') return renderSpecialtySelection('consultant');
  if (step === 'trainee_specialty') return renderSpecialtySelection('trainee');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-500/10 rounded-full blur-[100px] md:blur-[150px] animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-500/10 rounded-full blur-[100px] md:blur-[150px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
      </div>

      <InstallPWAButton t={t} />

      <div className="flex flex-col items-center mb-6 md:mb-12 z-10">
        <div className="bg-white dark:bg-slate-900 p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/5 mb-3 md:mb-4 animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-14 md:w-14 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 7v10z" />
              <path d="M4 17a1 1 0 01-1.447.894l-2-1A1 1 0 010 16V6a1 1 0 01.553-.894l2-1A1 1 0 014 5v12z" />
            </svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-400 dark:to-emerald-200 tracking-tighter">AgriLink</h1>
        <div className="h-1 w-10 md:w-12 bg-emerald-500 rounded-full mt-1 md:mt-2 opacity-50"></div>
      </div>

      <div className="text-center mb-6 md:mb-10 z-10 px-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-800 dark:text-white tracking-tight uppercase tracking-[0.1em]">{t('selectYourRole')}</h2>
        <p className="text-[9px] md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1.5 md:mt-2">Join the future of digital agribusiness</p>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 z-10 px-4">
        <RoleCard
          icon={<LeafIcon className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 dark:text-emerald-400" />}
          title={t('iAmAFarmer')}
          description={t('farmerDescription')}
          onClick={() => onRoleSelect('farmer')}
          accent="emerald"
          badge="Productivity Tools"
        />
        <RoleCard
          icon={<ShieldCheckIcon className="w-10 h-10 md:w-12 md:h-12 text-blue-600 dark:text-blue-400" />}
          title={t('iAmAnExpert')}
          description={t('expertDescription')}
          onClick={() => setStep('expert_specialty')}
          accent="blue"
          badge="Earn Income"
        />
        <RoleCard
          icon={<BriefcaseIcon className="w-10 h-10 md:w-12 md:h-12 text-purple-600 dark:text-purple-400" />}
          title={t('becomeAnExpert')}
          description={t('becomeAnExpertDescription')}
          onClick={() => setStep('trainee_specialty')}
          accent="purple"
          badge="Get Certified"
        />
      </div>

      <p className="mt-8 md:mt-16 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] z-10">AgriLink Ecosystem • v1.0</p>
    </div>
  );
};

interface RoleCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  accent: 'emerald' | 'rose' | 'blue' | 'purple';
  badge?: string;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, title, description, onClick, accent, badge }) => {
  const gradients = {
    emerald: 'from-emerald-500/20 to-teal-500/5 hover:border-emerald-500/50',
    rose: 'from-rose-500/20 to-pink-500/5 hover:border-rose-500/50',
    blue: 'from-blue-500/20 to-indigo-500/5 hover:border-blue-500/50',
    purple: 'from-purple-500/20 to-fuchsia-500/5 hover:border-purple-500/50'
  };

  const iconGlows = {
    emerald: 'bg-emerald-500/10',
    rose: 'bg-rose-500/10',
    blue: 'bg-blue-500/10',
    purple: 'bg-purple-500/10'
  };

  const badgeColors = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-400'
  };

  return (
    <button
      onClick={onClick}
      className={`group relative bg-white dark:bg-slate-900 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-center transition-all duration-500 transform hover:-translate-y-2 active:scale-95 focus:outline-none ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-950 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-800 border border-slate-100 dark:border-white/5 w-full flex flex-col items-center overflow-hidden h-full`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[accent]} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      
      {badge && (
          <div className={`absolute top-3 right-4 md:top-4 md:right-6 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest ${badgeColors[accent]} shadow-sm transition-transform duration-500 group-hover:scale-110`}>
              {badge}
          </div>
      )}

      <div className="relative mb-4 md:mb-6">
          <div className={`absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity duration-700 ${iconGlows[accent]}`}></div>
          <div className="relative z-10 flex justify-center items-center h-16 w-16 md:h-20 md:w-20 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] md:rounded-[2rem] shadow-inner transition-transform duration-700 group-hover:rotate-6">
              {icon}
          </div>
      </div>

      <div className="relative z-10 space-y-2 md:space-y-3">
          <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight group-hover:scale-105 transition-transform duration-500">{title}</p>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-1 md:px-2">{description}</p>
      </div>
      
      <div className="mt-4 md:mt-8 relative z-10">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-md border dark:border-white/5">
              <span className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white text-base md:text-lg">→</span>
          </div>
      </div>
    </button>
  );
};

export default RoleSelectionScreen;
