
import React from 'react';
import { Screen, AppMode } from '../types';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { LeafIcon } from './icons/LeafIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { CloudIcon } from './icons/CloudIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { HeartIcon } from './icons/HeartIcon';

interface BottomNavProps {
  activeScreen: Screen;
  setActiveScreen: (screen: Screen) => void;
  t: (key: string) => string;
  appMode: AppMode;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeScreen, setActiveScreen, t, appMode }) => {
  const isCrops = appMode === 'crops';
  
  const navItems = [
    { id: 'nav-trace', screen: Screen.TRACE, label: t('trace'), icon: DocumentTextIcon },
    { 
      id: 'nav-diagnose',
      screen: Screen.DIAGNOSE, 
      label: t('diagnose'), 
      icon: isCrops ? LeafIcon : HeartIcon 
    },
    { id: 'nav-ask', screen: Screen.ASK, label: t('askAI'), icon: QuestionMarkCircleIcon },
    { id: 'nav-consult', screen: Screen.CONSULT, label: t('consult'), icon: PhoneIcon },
    { 
      id: 'nav-learn',
      screen: Screen.LEARN, 
      label: isCrops ? t('learn') : t('husbandry'), 
      icon: BookOpenIcon 
    },
    { id: 'nav-weather', screen: Screen.WEATHER, label: t('weather'), icon: CloudIcon },
  ];

  const activePillColor = isCrops 
    ? 'bg-emerald-600 dark:bg-emerald-500 shadow-lg shadow-emerald-500/20' 
    : 'bg-rose-600 dark:bg-rose-500 shadow-lg shadow-rose-500/20';
    
  const activeIconColor = 'text-white';
  const activeTextColor = isCrops ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400';
  const inactiveColor = 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300';

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none px-4 md:px-0">
      <div className="w-full max-w-xl pointer-events-auto">
        <nav className="relative flex items-center justify-between px-2 py-2.5 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/50 dark:border-white/10 shadow-[0_20px_50px_-12px_rgba(16,185,129,0.05)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 rounded-[2.5rem] border border-white/40 pointer-events-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-none"></div>

          {navItems.map(({ id, screen, label, icon: Icon }) => {
            const isActive = activeScreen === screen;

            return (
              <button
                key={screen}
                id={id}
                onClick={() => setActiveScreen(screen)}
                className={`relative flex flex-col items-center justify-center transition-all duration-300 flex-1 outline-none group ${
                  isActive ? 'scale-100' : 'hover:scale-110 active:scale-90'
                }`}
              >
                <div className="relative flex flex-col items-center gap-1">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? `${activePillColor} -translate-y-1` 
                      : 'bg-transparent'
                  }`}>
                    <Icon 
                      className={`w-6 h-6 transition-all duration-300 ${
                        isActive 
                          ? `${activeIconColor} scale-110` 
                          : inactiveColor
                      }`} 
                    />
                  </div>
                  
                  {isActive && (
                    <div className={`absolute -bottom-1 w-1 h-1 rounded-full ${isCrops ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                  )}

                  <span className={`text-[7px] sm:text-[9px] font-black uppercase tracking-[0.15em] transition-all duration-300 leading-none ${
                    isActive 
                      ? `${activeTextColor} opacity-100 translate-y-0` 
                      : 'text-slate-400 dark:text-slate-600 opacity-0 group-hover:opacity-100 translate-y-1'
                  }`}>
                    {label}
                  </span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
