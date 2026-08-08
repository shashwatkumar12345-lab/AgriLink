
import React, { useState, useCallback, useEffect, useRef, useMemo, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { App as CapApp } from '@capacitor/app';
import { Screen, User, WeatherData, Harvest, InitialLocationData, Animal, AppMode, Theme, UserRole, ConsultantType, Diagnosis, ConsultationRequest, LiveChatMessage, DiagnosisContext, NotificationItem } from './types';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import TraceScreen from './screens/TraceScreen';
import AugmentScreen from './screens/AugmentScreen';
import ConsultScreen from './screens/ConsultScreen';
import LearnScreen from './screens/LearnScreen';
import WeatherScreen from './screens/WeatherScreen';
import AskScreen from './screens/AskScreen';
import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import AboutScreen from './screens/AboutScreen';
import AnimalDiagnoseScreen from './screens/AnimalDiagnoseScreen';
import LocationSetupScreen from './screens/LocationSetupScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import ConsultantDashboardScreen from './screens/ConsultantDashboardScreen';
import CertificationScreen from './screens/CertificationScreen';
import BusinessPlanScreen from './screens/BusinessPlanScreen';
import { getInitialLocationData, fetchFarmerNotifications } from './services/geminiService';
import { translations } from './translations';
import { regionData } from './utils/regionData';
import FAQModal from './components/FAQModal';
import SwitchProfileSetupScreen from './screens/SwitchProfileSetupScreen';
import { certificationData } from './certificationData';
import { getDistance } from './utils/locationUtils';
import InitialNoticeModal from './components/InitialNoticeModal';
import LiveAssistantButton from './components/LiveAssistantButton';
import LiveAssistantScreen from './screens/LiveAssistantScreen';
import { useDynamicTranslation } from './hooks/useDynamicTranslation';
import LanguageLoader from './components/LanguageLoader';
import { audioUtils } from './utils/audioUtils';
import * as firebaseService from './services/firebaseService';
import { auth } from './config/firebase';
import LanguageSelectionScreen from './screens/LanguageSelectionScreen';
import OnboardingOverlay from './components/OnboardingOverlay';
import HighSeverityAlert from './components/HighSeverityAlert';
import NotificationDetailModal from './components/NotificationDetailModal';
import FloatingNotificationToast from './components/FloatingNotificationToast';
import { supportedLanguages, languageConfig, LanguageConfig } from './utils/countryLanguages';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(() => localStorage.getItem('agriLinkUserRole') as UserRole | null);
  const [consultantType, setConsultantType] = useState<ConsultantType | null>(() => localStorage.getItem('agriLinkConsultantType') as ConsultantType | null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [appMode, setAppMode] = useState<AppMode>('crops');
  const [activeScreen, setActiveScreen] = useState<Screen>(Screen.DIAGNOSE);
  const [language, setLanguage] = useState<string>(() => localStorage.getItem('agriLinkLanguage') || 'English');
  const [isLanguageLoading, setIsLanguageLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('agriLinkTheme');
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;
    return 'light';
  });
  const [availableLanguages, setAvailableLanguages] = useState<string[]>(supportedLanguages);
  const [locationName, setLocationName] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(true);
  const [weatherError, setWeatherError] = useState<string>('');
  const [weatherLastUpdated, setWeatherLastUpdated] = useState<number | null>(null);
  
  const [initialAskQuery, setInitialAskQuery] = useState<{ text: string, timestamp: number } | null>(null);
  const [prefillConsultation, setPrefillConsultation] = useState<Partial<ConsultationRequest> | null>(null);
  const [recentDiagnosis, setRecentDiagnosis] = useState<DiagnosisContext | null>(null);

  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [animals, setAnimals] = useState<Animal[]>([]);

  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [agronomistRole, setAgronomistRole] = useState<'consultant' | 'trainee' | null>(() => localStorage.getItem('agriLinkExpertAgronomistRole') as any);
  const [veterinarianRole, setVeterinarianRole] = useState<'consultant' | 'trainee' | null>(() => localStorage.getItem('agriLinkExpertVeterinarianRole') as any);
  const [isSettingUpNewExpertProfile, setIsSettingUpNewExpertProfile] = useState(false);
  const [expertSetupIntent, setExpertSetupIntent] = useState<'consultant' | 'trainee'>('trainee');

  const [freeConsultationsCount, setFreeConsultationsCount] = useState(3);
  const [isLiveAssistantOpen, setIsLiveAssistantOpen] = useState(false);

  const [showSplash, setShowSplash] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showLanguageSetup, setShowLanguageSetup] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const [highSeverityAlert, setHighSeverityAlert] = useState<NotificationItem | null>(null);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('agriLinkReadNotificationIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const t = useDynamicTranslation(language);
  
  useEffect(() => {
    localStorage.setItem('agriLinkReadNotificationIds', JSON.stringify(Array.from(readNotificationIds)));
  }, [readNotificationIds]);

  useEffect(() => {
    const handleOnline = () => { firebaseService.syncOfflineData(); };
    window.addEventListener('online', handleOnline);
    if (navigator.onLine) { firebaseService.syncOfflineData(); }
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  // Scroll Preservation Logic
  const scrollPositions = useRef<Record<string, number>>({});
  
  const handleSetActiveScreen = (screen: Screen) => {
    const key = `${activeScreen}-${appMode}-${userRole || 'guest'}`;
    scrollPositions.current[key] = window.scrollY;
    setActiveScreen(screen);
  };

  const handleSetAppMode = (mode: AppMode) => {
    const key = `${activeScreen}-${appMode}-${userRole || 'guest'}`;
    scrollPositions.current[key] = window.scrollY;
    setAppMode(mode);
  };

  useLayoutEffect(() => {
    const key = `${activeScreen}-${appMode}-${userRole || 'guest'}`;
    const savedY = scrollPositions.current[key];
    if (savedY !== undefined) {
       window.scrollTo(0, savedY);
    } else {
       window.scrollTo(0, 0);
    }
  }, [activeScreen, appMode, userRole]);

  const handleStartApp = () => {
    try { audioUtils.playStartupSound(); } catch(e) { console.log("Audio autoplay blocked", e); }
    setFadeOut(true);
    setTimeout(() => { setShowSplash(false); }, 500); 
  };

  const fetchNotifications = async (force: boolean = false) => {
      if (!user || !user.state) return;
      
      const lastFetchKey = `agriLinkLastNotificationFetch_${user.state}`;
      const lastFetchTime = Number(localStorage.getItem(lastFetchKey) || 0);
      const TWELVE_HOURS = 1000 * 60 * 60 * 12;
      
      if (!force && (Date.now() - lastFetchTime < TWELVE_HOURS) && notifications.length > 0) {
          return;
      }

      setIsNotificationsLoading(true);
      
      try {
          const sharedStateUpdates = await firebaseService.getSharedNotifications('state', user.state, language);
          const sharedNationalUpdates = await firebaseService.getSharedNotifications('national', user.country, language);
          let allFetched: NotificationItem[] = [...sharedStateUpdates, ...sharedNationalUpdates];

          if (allFetched.length === 0 || force) {
              const aiUpdates = await fetchFarmerNotifications(user.state, user.country, language);
              if (aiUpdates.length > 0) {
                  const stateScope = aiUpdates.filter(u => u.scope === 'state');
                  const nationalScope = aiUpdates.filter(u => u.scope === 'national');
                  if (stateScope.length > 0) await firebaseService.saveSharedNotifications('state', user.state, language, stateScope);
                  if (nationalScope.length > 0) await firebaseService.saveSharedNotifications('national', user.country, language, nationalScope);
                  allFetched = aiUpdates;
              }
          }

          localStorage.setItem(lastFetchKey, String(Date.now()));

          const visible = allFetched.filter(n => n.severity === 'high' || !readNotificationIds.has(n.id));
          const sorted = visible.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          
          setNotifications(sorted);
          setHasUnreadNotifications(sorted.some(n => !readNotificationIds.has(n.id)));

          if (!force) {
              const unreadOnly = sorted.filter(n => !readNotificationIds.has(n.id));
              const highAlert = unreadOnly.find(n => n.severity === 'high');
              if (highAlert) {
                  const seenKey = `agriLinkSeenAlert_${highAlert.id}`;
                  if (!sessionStorage.getItem(seenKey)) {
                      setHighSeverityAlert(highAlert);
                      sessionStorage.setItem(seenKey, 'true');
                  }
              }
          }
      } catch (e) {
          console.error("Critical: Notification sync failure", e);
      } finally {
          setIsNotificationsLoading(false);
      }
  };

  const handleMarkNotificationsRead = () => {
      const allIds = notifications.map(n => n.id);
      setReadNotificationIds(prev => new Set([...Array.from(prev), ...allIds]));
      setHasUnreadNotifications(false);
  };

  const handleNotificationClick = (item: NotificationItem) => {
      setSelectedNotification(item);
      setReadNotificationIds(prev => new Set([...Array.from(prev), item.id]));
  };

  const handleTutorialComplete = async () => {
    if (auth.currentUser) {
      await firebaseService.markTutorialComplete(auth.currentUser.uid);
      setUser(prev => prev ? { ...prev, hasSeenTutorial: true } : null);
    }
    setShowTutorial(false);
  };

  useEffect(() => { 
    if (isLoggedIn && user?.state) { 
        fetchNotifications(); 
    } 
  }, [isLoggedIn, user?.state, language]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') { root.classList.add('dark'); } else { root.classList.remove('dark'); }
    localStorage.setItem('agriLinkTheme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('agriLinkLanguage', language);
    const config = languageConfig[language] || languageConfig.English;
    document.documentElement.dir = config.dir;
    Object.values(languageConfig).forEach((langConf: LanguageConfig) => { document.body.classList.remove(`lang-${langConf.code}`); });
    document.body.classList.add(`lang-${config.code}`);
  }, [language]);

  const handleLanguageChange = async (newLang: string) => {
    setLanguage(newLang);
    const staticLanguages = ['English'];
    if (!staticLanguages.includes(newLang)) { setIsLanguageLoading(true); setTimeout(() => { setIsLanguageLoading(false); }, 15000); } else { setIsLanguageLoading(false); }
    if (auth.currentUser) { await firebaseService.updateUserProfile(auth.currentUser.uid, { languagePreference: newLang }); }
  };

  const handleInitialLanguageSelect = async (selectedLang: string) => {
      if (auth.currentUser) { await firebaseService.updateUserProfile(auth.currentUser.uid, { languagePreference: selectedLang });
          const staticLanguages = ['English'];
          if (!staticLanguages.includes(selectedLang)) { setIsLanguageLoading(true); setTimeout(() => setIsLanguageLoading(false), 15000); } else { setIsLanguageLoading(false); }
      }
      setLanguage(selectedLang);
      setShowLanguageSetup(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
            const userProfile = await firebaseService.getUserProfile(firebaseUser.uid);
            if (userProfile) {
                if (!userProfile.profilePictureUrl && firebaseUser.photoURL) {
                    await firebaseService.updateUserProfile(firebaseUser.uid, { profilePictureUrl: firebaseUser.photoURL });
                    userProfile.profilePictureUrl = firebaseUser.photoURL;
                }
                setUser(userProfile); setIsLoggedIn(true);
                if (userProfile.languagePreference) { setLanguage(userProfile.languagePreference); } else { setShowLanguageSetup(true); }
                
                // Show Tutorial if user hasn't seen it
                if (!userProfile.hasSeenTutorial && userProfile.role === 'farmer') {
                    setShowTutorial(true);
                }

                setLocationName(userProfile.location);
                const userIdToUse = userProfile.uid || userProfile.phone;
                setHarvests(await firebaseService.getHarvests(userIdToUse));
                setAnimals(await firebaseService.getAnimals(userIdToUse));
            }
        } else { setUser(null); setIsLoggedIn(false); setHarvests([]); setAnimals([]); setShowLanguageSetup(false); setShowTutorial(false); setWeatherData(null); }
    });
    return () => unsubscribe();
  }, []); 

  const fetchWeather = useCallback((force: boolean = false) => {
    if (!isLoggedIn || !user || !user.state) return;

    const cachedDataRaw = localStorage.getItem('agriLinkInitialData');
    let hasCachedData = false; 
    let isStale = false;
    if (cachedDataRaw) {
        try {
            const cachedData = JSON.parse(cachedDataRaw);
            setLocationName(cachedData.data.locationName); 
            setWeatherData(cachedData.data.weatherData); 
            setWeatherLastUpdated(cachedData.timestamp); 
            hasCachedData = true;
            if (Date.now() - (cachedData.timestamp || 0) > 30 * 60 * 1000) { isStale = true; }
            if (!cachedData.data?.weatherData?.hourly?.length || !cachedData.data?.weatherData?.forecast?.length) { isStale = true; }
        } catch (e) { console.warn("Failed to parse cached data.", e); }
    }

    if (!force && hasCachedData && !isStale) {
        setIsWeatherLoading(false);
        return;
    }

    setIsWeatherLoading(true); setWeatherError('');

    const executeFetch = async (lat: number, lon: number) => {
         try {
            const initialData: InitialLocationData = await getInitialLocationData(lat, lon, language);
            setLocationName(initialData.locationName); 
            setWeatherData(initialData.weatherData); 
            setWeatherLastUpdated(Date.now());
            localStorage.setItem('agriLinkInitialData', JSON.stringify({ timestamp: Date.now(), latitude: lat, longitude: lon, language: language, data: initialData }));
        } catch (e) {
            if (!hasCachedData) { setWeatherError("Climate node sync jitter. Please retry."); }
        } finally { setIsWeatherLoading(false); }
    };

    if (user.latitude && user.longitude) {
        executeFetch(user.latitude, user.longitude);
    } else {
        navigator.geolocation.getCurrentPosition(
            (position) => executeFetch(position.coords.latitude, position.coords.longitude),
            (err) => {
                if (!hasCachedData) { setWeatherError("Enable location access to view climate data."); }
                setIsWeatherLoading(false);
            },
            { timeout: 10000, enableHighAccuracy: false }
        );
    }
  }, [isLoggedIn, user, language]);

  useEffect(() => {
    if (isLoggedIn && user?.state) {
        fetchWeather();
        const interval = setInterval(() => {
            fetchWeather(true);
        }, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }
  }, [isLoggedIn, user?.state, fetchWeather]);

  const handleRoleSelect = (role: UserRole, type?: ConsultantType) => {
    localStorage.setItem('agriLinkUserRole', role); setUserRole(role);
    if (type) { localStorage.setItem('agriLinkConsultantType', type); setConsultantType(type); } else { localStorage.removeItem('agriLinkConsultantType'); setConsultantType(null); }
  };

  const handleBackToRoleSelection = () => {
    localStorage.removeItem('agriLinkUserRole'); localStorage.removeItem('agriLinkConsultantType');
    setUserRole(null); setConsultantType(null);
  };

  const handleLoginSuccess = async (userData: Omit<User, 'role' | 'consultantType' | 'completedCertifications'>) => {
    const roleForUserObject = userRole === 'farmer' ? 'farmer' : 'consultant';
    const isCertifiedOnSignup = userRole === 'consultant';
    const fullUserData: User = { ...userData, role: roleForUserObject, signupRole: userRole, consultantType: consultantType || undefined, completedCertifications: isCertifiedOnSignup ? ['expert_onboarding'] : [], consultantId: (userRole === 'consultant' || userRole === 'trainee') ? `expert-${userData.phone}` : undefined, degreeVerificationStatus: (userRole !== 'farmer') ? 'not_uploaded' : undefined, };
    if (auth.currentUser) {
        await firebaseService.createUserProfile(auth.currentUser.uid, fullUserData);
        setUser(fullUserData); setIsLoggedIn(true);
        if (!fullUserData.languagePreference) { setShowLanguageSetup(true); }
        
        // Trigger tutorial for new farmer users
        if (!fullUserData.hasSeenTutorial && roleForUserObject === 'farmer') {
             setShowTutorial(true);
        }
        
        setLocationName(fullUserData.location);
        setFreeConsultationsCount(userRole === 'trainee' ? 7 : 3);
    }
  };

  const handleLogout = async () => {
    await firebaseService.logoutUser();
    localStorage.removeItem('agriLinkUserRole'); localStorage.removeItem('agriLinkConsultantType');
    setUser(null); setUserRole(null); setConsultantType(null); setIsLoggedIn(false);
  };
  
  const handleUpdateUser = async (updatedUser: User, silent: boolean = false) => {
    if (auth.currentUser) {
        await firebaseService.updateUserProfile(auth.currentUser.uid, updatedUser);
        setUser(updatedUser); setLocationName(updatedUser.location);
    }
  };
  
  const handleCertificationComplete = (certificationId: string) => {
      if (user) {
          const updatedCerts = [...new Set([...(user.completedCertifications || []), certificationId])];
          const certifiedUser = { ...user, completedCertifications: updatedCerts };
          handleUpdateUser(certifiedUser, true);
      }
  };

  const handleSwitchToExpert = (type: ConsultantType, roleOverride?: UserRole | null) => {
    const role = roleOverride || (type === 'agronomist' ? agronomistRole : veterinarianRole);
    if (role) {
      setFreeConsultationsCount(role === 'trainee' ? 7 : 3);
      setUserRole(role); setConsultantType(type); localStorage.setItem('agriLinkUserRole', role); localStorage.setItem('agriLinkConsultantType', type); handleSetActiveScreen(Screen.DIAGNOSE);
    }
  };

  const handleSwitchToFarmer = () => {
    setUserRole('farmer'); setConsultantType(null); setFreeConsultationsCount(3); localStorage.setItem('agriLinkUserRole', 'farmer'); localStorage.removeItem('agriLinkConsultantType'); handleSetActiveScreen(Screen.DIAGNOSE);
  };

  const handleBecomeNewExpert = () => { setExpertSetupIntent('trainee'); setIsSettingUpNewExpertProfile(true); };
  const handleIAmAnExpert = () => { setExpertSetupIntent('consultant'); setIsSettingUpNewExpertProfile(true); };

  const handleNewExpertProfileSetup = (type: ConsultantType) => {
    const newRole: UserRole = expertSetupIntent;
    if (type === 'agronomist') { setAgronomistRole(newRole); localStorage.setItem('agriLinkExpertAgronomistRole', newRole); } else if (type === 'veterinarian') { setVeterinarianRole(newRole); localStorage.setItem('agriLinkExpertVeterinarianRole', newRole); }
    setIsSettingUpNewExpertProfile(false); handleSwitchToExpert(type, newRole);
  };

  const handleLocationSet = (country: string, state: string) => { if (user) { handleUpdateUser({ ...user, country, state }, true); } };

  const handleAddHarvest = async (data: any) => {
    if (!user) return;
    const userId = user.uid || user.phone;
    const newHarvest: Harvest = { ...data, id: `H-${Date.now()}`, timestamp: new Date().toISOString() };
    await firebaseService.saveHarvest(userId, newHarvest);
    setHarvests(prev => [newHarvest, ...prev]);
  };

  const handleUpdateHarvest = async (h: Harvest) => {
    if (!user) return;
    const userId = user.uid || user.phone;
    await firebaseService.saveHarvest(userId, h);
    setHarvests(prev => prev.map(item => item.id === h.id ? h : item));
  };

  const handleDeleteHarvest = async (id: string) => {
    if (window.confirm(t('confirmDeleteLog'))) {
      await firebaseService.deleteHarvestDoc(id);
      setHarvests(prev => prev.filter(h => h.id !== id));
    }
  };

  const handleAddAnimal = async (data: any) => {
    if (!user) return;
    const userId = user.uid || user.phone;
    const newAnimal: Animal = { ...data, id: `A-${Date.now()}`, timestamp: new Date().toISOString() };
    await firebaseService.saveAnimal(userId, newAnimal);
    setAnimals(prev => [newAnimal, ...prev]);
  };

  const handleUpdateAnimal = async (a: Animal) => {
    if (!user) return;
    const userId = user.uid || user.phone;
    await firebaseService.saveAnimal(userId, a);
    setAnimals(prev => prev.map(item => item.id === a.id ? a : item));
  };

  const handleDeleteAnimal = async (id: string) => {
    if (window.confirm(t('confirmDeleteLog'))) {
      await firebaseService.deleteAnimalDoc(id);
      setAnimals(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleLinkDiagnosis = async (itemId: string, itemType: 'harvest' | 'animal', diagnosis: Diagnosis) => {
    if (!user) return;
    const userId = user.uid || user.phone;
    if (itemType === 'harvest') {
        const h = harvests.find(h => h.id === itemId);
        if (h) {
            const updatedH = { ...h, diagnoses: [...(h.diagnoses || []), diagnosis] };
            await firebaseService.saveHarvest(userId, updatedH);
            setHarvests(prev => prev.map(item => item.id === h.id ? updatedH : item));
        }
    } else {
        const a = animals.find(a => a.id === itemId);
        if (a) {
            const updatedA = { ...a, diagnoses: [...(a.diagnoses || []), diagnosis] };
            await firebaseService.saveAnimal(userId, updatedA);
            setAnimals(prev => prev.map(item => item.id === a.id ? updatedA : item));
        }
    }
  };

  const handleSetDiagnosisContext = useCallback((context: DiagnosisContext) => { setRecentDiagnosis(context); }, []);

  const userContext = useMemo(() => `My farm is ${user?.farmSize || 'not specified'} with ${user?.soilType || 'unknown soil type'}. I primarily grow ${user?.primaryCrops || 'various crops'}. My farm is located in ${user?.location || 'an unknown city'}.`, [user]);

  const farmerTutorialSteps = useMemo(() => [
    { targetId: 'header-profile', title: t('myProfile'), content: 'Tap the profile icon to edit your personal details, switch roles, and access the Business Plan tool.' },
    { targetId: 'header-mode-toggle', title: 'App Mode Toggle', content: 'Switch between "Crops" and "Animals" mode here.' },
    { targetId: 'nav-trace', title: t('trace'), content: 'Log your harvests or animal groups here.' },
    { targetId: 'nav-diagnose', title: t('diagnose'), content: 'Use AI to identify pests, diseases, or health issues.' },
    { targetId: 'nav-ask', title: t('askAI'), content: 'Chat with our AI assistant for general farming questions.' },
    { targetId: 'nav-consult', title: t('consult'), content: 'Need a human expert? Submit a detailed request here.' },
    { targetId: 'nav-learn', title: t('learn'), content: 'Access interactive lessons on farming best practices.' },
    { targetId: 'nav-weather', title: t('weather'), content: 'Check real-time weather forecasts.' },
  ], [t]);

  const expertTutorialSteps = useMemo(() => [
    { targetId: 'header-profile', title: t('myProfile'), content: 'Manage your expert profile here. Upload your degree for verification.' },
    { targetId: 'tab-requests', title: t('consultationRequests'), content: 'View pending requests from farmers.' },
    { targetId: 'tab-training', title: t('trainingCenter'), content: 'Access certification courses.' },
  ], [t]);

  const renderFarmerScreens = () => (
    <>
        <div style={{ display: activeScreen === Screen.TRACE ? 'block' : 'none' }}>
            <TraceScreen 
              t={t} 
              user={user} 
              harvests={harvests} 
              onAddHarvest={handleAddHarvest} 
              onUpdateHarvest={handleUpdateHarvest} 
              onDeleteHarvest={handleDeleteHarvest} 
              animals={animals} 
              onAddAnimal={handleAddAnimal} 
              onUpdateAnimal={handleUpdateAnimal} 
              onDeleteAnimal={handleDeleteAnimal} 
              language={language}
              appMode={appMode} 
            />
        </div>
        <div style={{ display: activeScreen === Screen.DIAGNOSE && appMode === 'crops' ? 'block' : 'none' }}>
            <AugmentScreen 
              activeScreen={activeScreen}
              appMode={appMode}
              t={t} language={language} locationName={locationName} userContext={userContext} weatherData={weatherData} weatherError={weatherError} harvests={harvests} onLinkDiagnosis={handleLinkDiagnosis} user={user} 
              onNavigateToAsk={(query) => { setInitialAskQuery({ text: query, timestamp: Date.now() }); handleSetActiveScreen(Screen.ASK); }} 
              onNavigateToConsult={(data) => { setPrefillConsultation(data); handleSetActiveScreen(Screen.CONSULT); }} onSetDiagnosisContext={handleSetDiagnosisContext} onAddHarvestAndLink={handleAddHarvest} />
        </div>
        <div style={{ display: activeScreen === Screen.DIAGNOSE && appMode === 'animals' ? 'block' : 'none' }}>
            <AnimalDiagnoseScreen 
              activeScreen={activeScreen}
              appMode={appMode}
              t={t} language={language} locationName={locationName} userContext={userContext} animals={animals} onLinkDiagnosis={handleLinkDiagnosis} 
              onNavigateToConsult={(data) => { setPrefillConsultation(data); handleSetActiveScreen(Screen.CONSULT); }} 
              onNavigateToAsk={(query) => { setInitialAskQuery({ text: query, timestamp: Date.now() }); handleSetActiveScreen(Screen.ASK); }}
              onSetDiagnosisContext={handleSetDiagnosisContext} user={user} onAddAnimalAndLink={handleAddAnimal} />
        </div>
        <div style={{ display: activeScreen === Screen.ASK ? 'block' : 'none' }}>
            <AskScreen t={t} language={language} locationName={locationName} userContext={userContext} appMode={appMode} initialQuery={initialAskQuery} />
        </div>
        <div style={{ display: activeScreen === Screen.CONSULT ? 'block' : 'none' }}>
            <ConsultScreen t={t} appMode={appMode} user={user} language={language} prefillData={prefillConsultation} />
        </div>
        <div style={{ display: activeScreen === Screen.LEARN ? 'block' : 'none' }}>
            <LearnScreen t={t} language={language} locationName={locationName} userContext={userContext} appMode={appMode} />
        </div>
        <div style={{ display: activeScreen === Screen.WEATHER ? 'block' : 'none' }}>
            <WeatherScreen t={t} locationName={locationName} weatherData={weatherData} isLoading={isWeatherLoading} error={weatherError} weatherLastUpdated={weatherLastUpdated} onOpenAssistant={() => setIsLiveAssistantOpen(true)} onManualRefresh={() => fetchWeather(true)} />
        </div>
    </>
  );

  const renderContent = () => {
    if (showSplash) {
        return (
            <div onClick={handleStartApp} className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`} >
                <div className="animate-bounce">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 7v10z" /><path d="M4 17a1 1 0 01-1.447.894l-2-1A1 1 0 010 16V6a1 1 0 01.553-.894l2-1A1 1 0 014 5v12z" /></svg>
                </div>
                <h1 className="mt-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 tracking-wider">AgriLink</h1>
                <p className="mt-2 text-sm text-green-700 dark:text-green-300 font-medium opacity-80">Empowering Indian Agriculture</p>
                <div className="mt-8 px-6 py-2 bg-white/30 dark:bg-black/30 rounded-full backdrop-blur-sm border border-white/20 animate-pulse cursor-pointer">
                    <span className="text-green-800 dark:text-green-200 font-bold text-sm uppercase tracking-wide">Tap to Start</span>
                </div>
            </div>
        );
    }
    if (isSettingUpNewExpertProfile) { return <SwitchProfileSetupScreen onSelect={handleNewExpertProfileSetup} onCancel={() => setIsSettingUpNewExpertProfile(false)} t={t} agronomistProfileExists={!!agronomistRole} veterinarianProfileExists={!!veterinarianRole} intent={expertSetupIntent} /> }
    if (!userRole) { return <RoleSelectionScreen onRoleSelect={handleRoleSelect} t={t} />; }
    if (!isLoggedIn) { return <AuthScreen onLoginSuccess={handleLoginSuccess} t={t} userRole={userRole} onBackToRoleSelection={handleBackToRoleSelection} />; }
    if (showLanguageSetup && user) { return <LanguageSelectionScreen user={user} onLanguageSelect={handleInitialLanguageSelect} t={t} />; }
    if (!user?.state) { return <LocationSetupScreen user={user!} onLocationSet={handleLocationSet} t={t} />; }
    
    return (
      <>
        {isLanguageLoading && <LanguageLoader language={language} />}
        {user && <FAQModal isOpen={isFaqOpen} user={user} appMode={appMode} t={t} language={language} onClose={() => setIsFaqOpen(false)} />}
        {selectedNotification && <NotificationDetailModal item={selectedNotification} onClose={() => setSelectedNotification(null)} user={user!} t={t} />}
        {isLiveAssistantOpen && user && <LiveAssistantScreen isOpen={isLiveAssistantOpen} onClose={() => setIsLiveAssistantOpen(false)} user={user} t={t} language={language} userContext={userContext} appMode={appMode} recentDiagnosis={recentDiagnosis} weatherData={weatherData} />}
        {highSeverityAlert && <HighSeverityAlert alert={highSeverityAlert} onClose={() => setHighSeverityAlert(null)} onViewDetails={(item) => { setHighSeverityAlert(null); handleNotificationClick(item); }} />}
        {activeToast && <FloatingNotificationToast notification={activeToast} onClose={() => setActiveToast(null)} onClick={() => { handleNotificationClick(activeToast); setActiveToast(null); }} />}
        {showTutorial && <OnboardingOverlay steps={userRole === 'farmer' ? farmerTutorialSteps : expertTutorialSteps} onComplete={handleTutorialComplete} onSkip={handleTutorialComplete} />}
        
        <div className="min-h-screen flex flex-col">
          <Header 
            user={user} onLogout={handleLogout} language={language} setLanguage={handleLanguageChange} 
            setActiveScreen={handleSetActiveScreen} t={t} appMode={appMode} setAppMode={handleSetAppMode} 
            availableLanguages={availableLanguages} theme={theme} setTheme={setTheme} userRole={userRole}
            consultantType={consultantType} onFaqOpen={() => setIsFaqOpen(true)}
            agronomistRole={agronomistRole} veterinarianRole={veterinarianRole}
            onBecomeNewExpert={handleBecomeNewExpert} onIAmAnExpert={handleIAmAnExpert}
            onSwitchProfile={handleSwitchToExpert} onSwitchToFarmer={handleSwitchToFarmer}
            freeConsultationsCount={freeConsultationsCount}
            notifications={notifications} hasUnreadNotifications={hasUnreadNotifications}
            onMarkNotificationsRead={handleMarkNotificationsRead} isNotificationsLoading={isNotificationsLoading}
            onRefreshNotifications={() => fetchNotifications(true)}
            onNotificationClick={handleNotificationClick}
          />
          <main className="flex-grow container mx-auto px-4 py-4 md:py-6 pb-48 min-h-[calc(100dvh-8rem)]">
            {userRole !== 'farmer' ? (
                activeScreen === Screen.PROFILE ? <ProfileScreen user={user!} onUpdateUser={handleUpdateUser} t={t} setActiveScreen={handleSetActiveScreen} freeConsultationsCount={freeConsultationsCount} setLanguage={handleLanguageChange} language={language} />
                : activeScreen === Screen.ABOUT ? <AboutScreen t={t} setActiveScreen={handleSetActiveScreen} user={user} />
                : <ConsultantDashboardScreen user={user!} t={t} onCertificationComplete={handleCertificationComplete} setActiveScreen={handleSetActiveScreen} userRole={userRole} activeConsultantType={consultantType} />
            ) : (
                activeScreen === Screen.PROFILE ? <ProfileScreen user={user!} onUpdateUser={handleUpdateUser} t={t} setActiveScreen={handleSetActiveScreen} freeConsultationsCount={freeConsultationsCount} setLanguage={handleLanguageChange} language={language} />
                : activeScreen === Screen.ABOUT ? <AboutScreen t={t} setActiveScreen={handleSetActiveScreen} user={user} />
                : activeScreen === Screen.BUSINESS_PLAN ? <BusinessPlanScreen user={user!} t={t} language={language} appMode={appMode} onBack={() => handleSetActiveScreen(Screen.DIAGNOSE)} />
                : renderFarmerScreens()
            )}
          </main>
          {userRole === 'farmer' && activeScreen !== Screen.BUSINESS_PLAN && !isLiveAssistantOpen && (
            <LiveAssistantButton onClick={() => setIsLiveAssistantOpen(true)} t={t} appMode={appMode} />
          )}
          {userRole === 'farmer' && activeScreen !== Screen.BUSINESS_PLAN && !isLiveAssistantOpen && (
            <BottomNav activeScreen={activeScreen} setActiveScreen={handleSetActiveScreen} t={t} appMode={appMode} />
          )}
        </div>
      </>
    );
  };
  return renderContent();
};

export default App;
