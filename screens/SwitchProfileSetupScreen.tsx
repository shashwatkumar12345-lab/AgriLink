import React from 'react';
import { ConsultantType } from '../types';
import { AcademicCapIcon } from '../components/icons/AcademicCapIcon';
import { StethoscopeIcon } from '../components/icons/StethoscopeIcon';

interface SwitchProfileSetupScreenProps {
  onSelect: (type: ConsultantType) => void;
  onCancel: () => void;
  t: (key: string) => string;
  agronomistProfileExists: boolean;
  veterinarianProfileExists: boolean;
  intent: 'consultant' | 'trainee';
}

const RoleCard: React.FC<{ 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
    onClick: () => void;
    accent: 'emerald' | 'rose';
    badge?: string;
}> = ({ icon, title, description, onClick, accent, badge }) => {
  const gradients = {
    emerald: 'from-emerald-500/20 to-teal-500/5 hover:border-emerald-500/50',
    rose: 'from-rose-500/20 to-pink-500/5 hover:border-rose-500/50'
  };

  const badgeColors = {
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400',
    rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-400'
  };

  return (
    <button
      onClick={onClick}
      className="group relative bg-white dark:bg-slate-900 p-5 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-xl text-center transition-all duration-500 transform hover:-translate-y-2 active:scale-95 border border-slate-100 dark:border-white/5 w-full flex flex-col items-center overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[accent]} opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
      
      {badge && (
          <div className={`absolute top-3 right-4 md:top-4 md:right-6 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest ${badgeColors[accent]} shadow-sm`}>
              {badge}
          </div>
      )}

      <div className="relative z-10 mb-4 md:mb-6 flex justify-center items-center h-16 w-16 md:h-20 md:w-20 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] md:rounded-[2rem] shadow-inner transition-transform duration-700 group-hover:rotate-6">
          {icon}
      </div>

      <div className="relative z-10 space-y-2 md:space-y-3">
          <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">{title}</p>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed px-2 md:px-4">{description}</p>
      </div>

      <div className="mt-4 md:mt-8 relative z-10">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-md border dark:border-white/5">
              <span className="text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white text-base md:text-lg">→</span>
          </div>
      </div>
    </button>
  );
};


const SwitchProfileSetupScreen: React.FC<SwitchProfileSetupScreenProps> = ({ onSelect, onCancel, t, agronomistProfileExists, veterinarianProfileExists, intent }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 md:p-6 relative overflow-y-auto overscroll-contain">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] dark:opacity-[0.05]"></div>
            </div>

            <div className="text-center mb-8 md:mb-12 z-10">
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                    {t(intent === 'consultant' ? 'selectExpertSpecialty' : 'selectTrainingProgram')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 md:mt-3 font-bold uppercase tracking-widest text-[9px] md:text-[10px]">
                    Create a secondary profile for professional services
                </p>
            </div>

            <div className="max-w-md w-full space-y-4 md:space-y-6 z-10 px-2">
                {!agronomistProfileExists && (
                    <RoleCard
                        icon={<AcademicCapIcon className="w-10 h-10 md:w-12 md:h-12 text-emerald-600 dark:text-emerald-400" />}
                        title={t(intent === 'consultant' ? 'agriculturalExpert' : 'agriculturalExpertProgram')}
                        description={t('reviewCropIssues')}
                        onClick={() => onSelect('agronomist')}
                        accent="emerald"
                        badge="New Profile"
                    />
                )}
                {!veterinarianProfileExists && (
                    <RoleCard
                        icon={<StethoscopeIcon className="w-10 h-10 md:w-12 md:h-12 text-rose-600 dark:text-rose-400" />}
                        title={t(intent === 'consultant' ? 'veterinarian' : 'veterinarianProgram')}
                        description={t('reviewAnimalIssues')}
                        onClick={() => onSelect('veterinarian')}
                        accent="rose"
                        badge="New Profile"
                    />
                )}
            </div>
            
            <button
                onClick={onCancel}
                className="mt-8 md:mt-12 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all z-10"
            >
                {t('cancel')}
            </button>
        </div>
    );
};

export default SwitchProfileSetupScreen;
