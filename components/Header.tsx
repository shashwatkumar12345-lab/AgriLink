
import React, { useState, useRef, useEffect } from 'react';
import { Screen, User, AppMode, Theme, UserRole, ConsultantType, NotificationItem } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { MoonIcon } from './icons/MoonIcon';
import { SunIcon } from './icons/SunIcon';
import { QuestionBubbleIcon } from './icons/QuestionBubbleIcon';
import { SwitchHorizontalIcon } from './icons/SwitchHorizontalIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { StethoscopeIcon } from './icons/StethoscopeIcon';
import { LeafIcon } from './icons/LeafIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { UserMaleIcon } from './icons/UserMaleIcon';
import { UserFemaleIcon } from './icons/UserFemaleIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ChartBarIcon } from './icons/ChartBarIcon'; 
import { BellIcon } from './icons/BellIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import NotificationPanel from './NotificationPanel';


interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  language: string;
  setLanguage: (lang: string) => void;
  setActiveScreen: (screen: Screen) => void;
  t: (key: string) => string;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  availableLanguages: string[];
  theme: Theme;
  setTheme: (theme: Theme | ((theme: Theme) => Theme)) => void;
  userRole: UserRole;
  consultantType: ConsultantType | null;
  onFaqOpen: () => void;
  onSwitchProfile: (type: ConsultantType) => void;
  onBecomeNewExpert: () => void;
  onSwitchToFarmer: () => void;
  agronomistRole: UserRole | null;
  veterinarianRole: UserRole | null;
  freeConsultationsCount: number;
  onIAmAnExpert: () => void;
  notifications: NotificationItem[];
  hasUnreadNotifications: boolean;
  onMarkNotificationsRead: () => void;
  isNotificationsLoading: boolean;
  onRefreshNotifications: () => void;
  onNotificationClick: (item: NotificationItem) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, onLogout, language, setLanguage, setActiveScreen, t, appMode, setAppMode, availableLanguages, theme, setTheme, userRole, consultantType, onFaqOpen, 
  onSwitchProfile, onBecomeNewExpert, onSwitchToFarmer, agronomistRole, veterinarianRole, freeConsultationsCount, onIAmAnExpert,
  notifications, hasUnreadNotifications, onMarkNotificationsRead, isNotificationsLoading, onRefreshNotifications, onNotificationClick
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDropdownOpen]);

  const handleSwitch = (type: ConsultantType) => {
    onSwitchProfile(type);
    setIsDropdownOpen(false);
  };

  const handleBecomeExpert = () => {
    onBecomeNewExpert();
    setIsDropdownOpen(false);
  };

  const handleIAmExpert = () => {
    onIAmAnExpert();
    setIsDropdownOpen(false);
  }
  
  const handleSwitchFarmer = () => {
    onSwitchToFarmer();
    setIsDropdownOpen(false);
  };

  const toggleNotifications = () => {
      const newState = !isNotificationOpen;
      setIsNotificationOpen(newState);
      if (newState) {
          onMarkNotificationsRead();
      }
  }

  const hasValidProfilePic = user?.profilePictureUrl && (user.profilePictureUrl.startsWith('data:') || user.profilePictureUrl.startsWith('http'));

  const MenuItem: React.FC<{ 
    onClick: () => void; 
    icon?: React.ReactNode; 
    children: React.ReactNode; 
    disabled?: boolean;
    className?: string;
    danger?: boolean;
  }> = ({ onClick, icon, children, disabled, className = '', danger = false }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-all duration-200 outline-none
        ${disabled ? 'opacity-50 cursor-default' : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/80 active:scale-[0.98]'}
        ${danger ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}
        ${className}`}
    >
      {icon && <span className={`flex-shrink-0 ${danger ? 'text-rose-500' : 'text-slate-400 dark:text-slate-500'}`}>{icon}</span>}
      <span className="truncate">{children}</span>
    </button>
  );

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200/50 dark:border-white/10 sticky top-0 z-[60] transition-all duration-300 shadow-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between relative">
        <div className="flex items-center gap-2">
            <div className="relative" ref={dropdownRef} id="header-profile">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center">
                    {hasValidProfilePic ? (
                      <img src={user?.profilePictureUrl!} alt={user?.name} className="w-full h-full object-cover" />
                    ) : user?.gender === 'male' ? (
                      <UserMaleIcon className="w-full h-full p-1 bg-slate-100 dark:bg-slate-800" />
                    ) : user?.gender === 'female' ? (
                      <UserFemaleIcon className="w-full h-full p-1 bg-slate-100 dark:bg-slate-800" />
                    ) : (
                      <UserCircleIcon className="w-full h-full p-1 bg-slate-100 dark:bg-slate-800" />
                    )}
                    {user && user.role !== 'farmer' && user.degreeVerificationStatus === 'verified' && (
                        <div className="absolute bottom-0 right-0 bg-white dark:bg-emerald-500 rounded-full p-0.5 shadow-sm border border-emerald-500/20">
                            <ShieldCheckIcon className="w-2.5 h-2.5 text-blue-600 dark:text-white" />
                        </div>
                    )}
                </div>
            </button>
            
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[100] bg-black/10 backdrop-blur-sm" 
                  onClick={() => setIsDropdownOpen(false)}
                  style={{ touchAction: 'none' }}
                />
                <div className="absolute top-full left-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.25)] py-2 z-[110] border border-slate-200 dark:border-white/10 animate-pop-in overflow-y-auto overscroll-contain max-h-[calc(100dvh-6rem)] pointer-events-auto">
                    {/* Header User Section */}
                    {user && (
                        <div className="px-5 py-4 mb-1 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 mx-2 rounded-xl">
                          <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5 truncate block w-full">{user.phone}</p>
                        </div>
                    )}

                    <div className="py-1">
                        <MenuItem onClick={() => { setActiveScreen(Screen.PROFILE); setIsDropdownOpen(false); }} icon={<UserCircleIcon className="w-5 h-5"/>}>
                            {t('myProfile')}
                        </MenuItem>
                        {userRole === 'farmer' && (
                            <MenuItem onClick={() => { setActiveScreen(Screen.BUSINESS_PLAN); setIsDropdownOpen(false); }} icon={<ChartBarIcon className="w-5 h-5 text-emerald-600" />}>
                                {t('businessPlanTitle')}
                            </MenuItem>
                        )}
                        <MenuItem onClick={() => { setActiveScreen(Screen.ABOUT); setIsDropdownOpen(false); }} icon={<QuestionBubbleIcon className="w-5 h-5"/>}>
                            {t('aboutAgriLink')}
                        </MenuItem>
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/5 my-1"></div>

                    <div className="py-1">
                        <div className="px-5 py-2">
                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('switchToRole').replace('{role}', '')}</span>
                        </div>
                        
                        {userRole === 'farmer' ? (
                          <>
                            <div className="px-5 py-2.5 mx-2 mb-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex items-center gap-3">
                                <LeafIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">{t('iAmAFarmer')}</span>
                            </div>
                            {agronomistRole && (
                              <MenuItem onClick={() => handleSwitch('agronomist')} icon={<AcademicCapIcon className="h-5 w-5" />}>
                                {agronomistRole === 'trainee' ? t('agriculturalTrainee') : t('agriculturalExpert')}
                              </MenuItem>
                            )}
                            {veterinarianRole && (
                              <MenuItem onClick={() => handleSwitch('veterinarian')} icon={<StethoscopeIcon className="h-5 w-5" />}>
                                  {veterinarianRole === 'trainee' ? t('veterinaryTrainee') : t('veterinarian')}
                              </MenuItem>
                            )}
                            {!(agronomistRole && veterinarianRole) && (
                              /* Fix: handleIAmAnExpert was a typo, corrected to handleIAmExpert */
                              <MenuItem onClick={handleIAmExpert} icon={<ShieldCheckIcon className="h-5 w-5" />}>
                                {t('iAmAnExpert')}...
                              </MenuItem>
                            )}
                            {!(agronomistRole && veterinarianRole) && (
                              /* Fix: handleBecomeAnExpert was a typo, corrected to handleBecomeExpert */
                              <MenuItem onClick={handleBecomeExpert} icon={<SwitchHorizontalIcon className="h-5 w-5" />}>
                                {!(agronomistRole || veterinarianRole) ? t('becomeAnExpert') : `${t('becomeAnExpert')}...`}
                              </MenuItem>
                            )}
                          </>
                        ) : (
                           <>
                            <MenuItem onClick={handleSwitchFarmer} icon={<LeafIcon className="h-5 w-5" />}>
                               {t('switchToFarmer')}
                            </MenuItem>
                            
                            {consultantType === 'agronomist' && (
                              <div className="px-5 py-2.5 mx-2 mb-1 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-800/50 flex items-center gap-3">
                                <AcademicCapIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                <span className="text-xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider">{userRole === 'trainee' ? t('agriculturalTrainee') : t('agriculturalExpert')}</span>
                              </div>
                            )}
                            {consultantType === 'veterinarian' && (
                               <div className="px-5 py-2.5 mx-2 mb-1 bg-pink-50 dark:bg-pink-950/40 rounded-xl border border-pink-100 dark:border-pink-800/50 flex items-center gap-3">
                                <StethoscopeIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                <span className="text-xs font-black text-pink-700 dark:text-pink-300 uppercase tracking-wider">{userRole === 'trainee' ? t('veterinaryTrainee') : t('veterinarian')}</span>
                              </div>
                            )}
                            {consultantType === 'veterinarian' && agronomistRole && (
                               <MenuItem onClick={() => handleSwitch('agronomist')} icon={<AcademicCapIcon className="h-5 w-5" />}>
                                {agronomistRole === 'trainee' ? t('agriculturalTrainee') : t('agriculturalExpert')}
                               </MenuItem>
                            )}
                             {consultantType === 'agronomist' && veterinarianRole && (
                               <MenuItem onClick={() => handleSwitch('veterinarian')} icon={<StethoscopeIcon className="h-5 w-5" />}>
                                {veterinarianRole === 'trainee' ? t('veterinaryTrainee') : t('veterinarian')}
                               </MenuItem>
                            )}
                            {!(agronomistRole && veterinarianRole) && (
                                <MenuItem onClick={handleBecomeExpert} icon={<PlusCircleIcon className="h-5 w-5" />}>
                                    {t('becomeAnExpert')}...
                                </MenuItem>
                            )}
                           </>
                        )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/5 my-1"></div>

                    {/* Settings Section */}
                    <div className="py-2">
                        <div className="px-5 mb-2">
                            <label className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 block">{t('language')}</label>
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value)} 
                                className="w-full bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-bold border border-slate-200 dark:border-white/10 rounded-xl py-2.5 px-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {availableLanguages.map(lang => (<option key={lang} value={lang}>{lang}</option>))}
                            </select>
                        </div>
                        
                        <div className="px-5 py-2 flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{userRole === 'farmer' ? t('farmerFreeConsultationsLeft') : t('freeConsultationsRemaining')}</span>
                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg font-black text-sm">{freeConsultationsCount}</span>
                        </div>

                        <MenuItem 
                            onClick={() => setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')} 
                            icon={theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                        >
                            {theme === 'light' ? t('darkMode') : t('lightMode')}
                        </MenuItem>
                    </div>

                    <div className="border-t border-slate-100 dark:border-white/5 mt-1"></div>
                    
                    <MenuItem onClick={() => { onLogout(); setIsDropdownOpen(false); }} icon={<XCircleIcon className="w-5 h-5"/>} danger>
                        {t('logout')}
                    </MenuItem>
                </div>
              </>
            )}
            </div>
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-emerald-600 dark:text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 7v10z" /><path d="M4 17a1 1 0 01-1.447.894l-2-1A1 1 0 010 16V6a1 1 0 01.553-.894l2-1A1 1 0 014 5v12z" /></svg>
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-400 dark:to-emerald-300 tracking-tight hidden md:block">AgriLink</h1>
            </div>
        </div>
        {userRole === 'farmer' && (
          <div id="header-mode-toggle" className="flex items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-1 flex shadow-inner border dark:border-white/5">
              <button onClick={() => setAppMode('crops')} className={`px-4 py-1.5 text-xs font-black rounded-full transition-all duration-300 ${appMode === 'crops' ? 'bg-white dark:bg-emerald-900 text-emerald-700 dark:text-emerald-100 shadow-md transform scale-105' : 'text-gray-500 dark:text-gray-500 hover:text-gray-700'}`}>{t('crops')}</button>
              <button onClick={() => setAppMode('animals')} className={`px-4 py-1.5 text-xs font-black rounded-full transition-all duration-300 ${appMode === 'animals' ? 'bg-white dark:bg-rose-900 text-rose-700 dark:text-rose-100 shadow-md transform scale-105' : 'text-gray-500 dark:text-gray-500 hover:text-gray-700'}`}>{t('animals')}</button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={toggleNotifications} className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title="Updates & Alerts">
                <BellIcon className="h-6 w-6" hasNotification={hasUnreadNotifications} />
            </button>
            <button onClick={onFaqOpen} className="p-2 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" title={t('faqTitle')}>
                <QuestionBubbleIcon className="h-6 w-6" />
            </button>
        </div>
        {user && <NotificationPanel 
            isOpen={isNotificationOpen} 
            onClose={() => setIsNotificationOpen(false)} 
            user={user} t={t} 
            notifications={notifications}
            isLoading={isNotificationsLoading}
            onRefresh={onRefreshNotifications}
            onMarkRead={onMarkNotificationsRead}
            onItemClick={onNotificationClick}
        />}
      </div>
    </header>
  );
};

export default Header;
