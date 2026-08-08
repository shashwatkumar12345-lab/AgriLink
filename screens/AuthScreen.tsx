
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import Card from '../components/Card';
import { GoogleIcon } from '../components/icons/GoogleIcon';
import { FacebookIcon } from '../components/icons/FacebookIcon';
import { regionData } from '../utils/regionData';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { EyeIcon } from '../components/icons/EyeIcon';
import { EyeSlashIcon } from '../components/icons/EyeSlashIcon';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';
import Spinner from '../components/Spinner';
import * as firebaseService from '../services/firebaseService';
import { auth } from '../config/firebase';
import { UserCredential, onAuthStateChanged } from 'firebase/auth';
import InstallPWAButton from '../components/InstallPWAButton';

interface AuthScreenProps {
  onLoginSuccess: (user: Omit<User, 'role' | 'consultantType' | 'completedCertifications'>) => void;
  t: (key: string) => string;
  userRole: UserRole;
  onBackToRoleSelection: () => void;
}

const PasswordRequirement: React.FC<{isValid: boolean; text: string}> = ({ isValid, text }) => (
  <li className={`flex items-center text-sm ${isValid ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
    {isValid ? <CheckCircleIcon className="w-4 h-4 mr-2"/> : <XCircleIcon className="w-4 h-4 mr-2"/>}
    {text}
  </li>
);

const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess, t, userRole, onBackToRoleSelection }) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  
  // Form States
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isVerifyPasswordVisible, setIsVerifyPasswordVisible] = useState(false);
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  // Hardcoded Country
  const country = "India"; 
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [statesList, setStatesList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isSocialLoginLoading, setIsSocialLoginLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  
  const [passwordCriteria, setPasswordCriteria] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const isLoginView = view === 'login';

  // Helper to allow phone numbers to work with Firebase Email Auth
  const getInternalEmail = (id: string) => {
    const trimmed = id.trim();
    if (trimmed.includes('@')) return trimmed;
    const cleaned = trimmed.replace(/\+/g, '');
    if (/^\d+$/.test(cleaned)) {
        return `${cleaned}@agrilink.app`;
    }
    return trimmed;
  };

  // Robust Auth State Listener - Keep this to handle auto-login for session persistence
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser: any) => {
        if (currentUser && !isDemoLoading) { // Skip if demo loading is handling it manually for speed
            // User is signed in.
            try {
                const profile = await firebaseService.getUserProfile(currentUser.uid);
                if (profile) {
                    onLoginSuccess(profile);
                } else {
                    // Profile missing (new Google user, anonymous user, or incomplete setup).
                    const isAnon = currentUser.isAnonymous;
                    onLoginSuccess({
                        name: currentUser.displayName || (isAnon ? 'Guest User' : 'User'),
                        phone: currentUser.phoneNumber || currentUser.email || (isAnon ? 'Demo Account' : identifier) || '',
                        location: isAnon ? 'Demo Town' : '',
                        state: isAnon ? 'Punjab' : '',
                        country: 'India',
                        profilePictureUrl: currentUser.photoURL || undefined,
                    });
                }
            } catch (e) {
                console.error("Auto-login error", e);
                // Fallback attempt to proceed if profile fetch failed but auth exists
                const isAnon = currentUser.isAnonymous;
                onLoginSuccess({
                    name: currentUser.displayName || (isAnon ? 'Guest User' : 'User'),
                    phone: currentUser.email || (isAnon ? 'Demo Account' : ''),
                    location: isAnon ? 'Demo Town' : '',
                    state: isAnon ? 'Punjab' : '',
                    country: 'India',
                    profilePictureUrl: currentUser.photoURL || undefined,
                });
            }
        }
    });
    return () => unsubscribe();
  }, [isDemoLoading]); 

  // Load Indian States on Mount
  useEffect(() => {
    const countryData = regionData[country];
    if (countryData?.states && countryData.states.length > 0) {
      setStatesList(countryData.states);
    }
  }, []);

  useEffect(() => {
    if (!isLoginView) {
        setPasswordCriteria({
            minLength: password.length >= 8,
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[!@#$%^&*]/.test(password),
        });
    }
  }, [password, isLoginView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const normalizedEmail = getInternalEmail(identifier);

        if (isLoginView) {
          if (!identifier || !password) {
            throw new Error(t('allFieldsRequired'));
          }
          await firebaseService.loginUser(normalizedEmail, password);
          // Let onAuthStateChanged handle success
        } else { // Signup
          if (!name || !identifier || !password || !location || !state || !gender || !age) {
            throw new Error(t('allFieldsRequired'));
          }
          
          const isPasswordStrong = Object.values(passwordCriteria).every(Boolean);
          if (!isPasswordStrong) {
            throw new Error(t('passwordNotStrong'));
          }
          if (password !== verifyPassword) {
            throw new Error(t('passwordsDoNotMatch'));
          }
          
          await firebaseService.registerUser(normalizedEmail, password, name);
          
          const userToCreate = {
            name,
            phone: identifier,
            location,
            state,
            country: country,
            gender: gender as 'male' | 'female' | 'other',
            age: Number(age),
            degreeVerificationStatus: (userRole !== 'farmer') ? 'not_uploaded' as const : undefined,
          };
          
          onLoginSuccess(userToCreate);
        }
    } catch (err: any) {
        console.error(err);
        let msg = err.message;
        if (err.code === 'auth/email-already-in-use') msg = 'Email/Phone already in use.';
        if (err.code === 'auth/invalid-email') msg = 'Invalid email/phone format.';
        if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
        if (err.code === 'auth/user-not-found') msg = 'No account found.';
        setError(msg);
        setIsLoading(false); 
    }
  };

  const handleGoogleLogin = async () => {
    setIsSocialLoginLoading(true);
    setError('');
    try {
      await firebaseService.loginWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Google Sign-In failed.");
      setIsSocialLoginLoading(false);
    }
  };
  
  const handleFacebookLogin = async () => {
    setIsSocialLoginLoading(true);
    setError('');
    try {
      await firebaseService.loginWithFacebook();
    } catch (err: any) {
      console.error(err);
      let message = err.message || "Facebook Sign-In failed.";
      if (err.code === 'auth/account-exists-with-different-credential') {
          message = "An account already exists with the same email address but different sign-in credentials.";
      }
      setError(message);
      setIsSocialLoginLoading(false);
    }
  };
  
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setError('');

    // 1. Get/Create Device ID immediately
    let deviceId = localStorage.getItem('agrilink_device_id');
    if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('agrilink_device_id', deviceId);
    }

    const shortId = deviceId.substring(0, 8);
    const demoEmail = `demo_device_${shortId}@agrilink.farm`;
    const demoPassword = `DemoAccess!${shortId}`; 
    const demoName = `Guest User ${shortId}`;

    // 2. Prepare User Object Optimistically
    const demoUserObject = {
        name: demoName,
        phone: 'Demo Account',
        location: 'Demo Town',
        state: 'Punjab',
        country: 'India',
        gender: 'other' as const,
        age: 30,
        role: userRole,
    };

    try {
        console.log("Starting demo login race...");
        
        // 3. Race against timeout (10s limit)
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Login timed out. Check your connection.")), 10000)
        );

        const authPromise = firebaseService.loginOrRegisterDemoUser(demoEmail, demoPassword, demoName);

        // Wait for either success or timeout
        await Promise.race([authPromise, timeoutPromise]);
        
        console.log("Demo login successful. Navigating immediately...");
        
        // 4. IMMEDIATE NAVIGATION: Do not wait for Firestore to confirm profile existence.
        // Pass the optimistic object. The App.tsx will handle the background profile sync/creation 
        // because it calls createUserProfile internally if needed, but the UI updates instantly.
        onLoginSuccess(demoUserObject);

    } catch (err: any) {
        console.error("Demo login error:", err);
        let msg = err.message || "Demo login failed.";
        if (msg.includes("timed out")) msg = "Network slow. Retrying...";
        setError(msg);
        setIsDemoLoading(false);
    }
  };

  const inputClasses = "block w-full rounded-xl border-gray-300 bg-gray-50/50 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-100 dark:placeholder-gray-500 shadow-inner focus:border-green-500 focus:ring-green-500 focus:bg-white dark:focus:bg-gray-700 transition-colors py-3";
  const passwordInputClasses = `${inputClasses} pr-10`;
  
  return (
    <div className="min-h-screen font-sans bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <InstallPWAButton t={t} className="glass border border-white/20 backdrop-blur-md" />
      
      <div className="flex flex-col items-center space-y-2 mb-8 z-10">
        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-green-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2A1 1 0 0011 7v10z" />
            <path d="M4 17a1 1 0 01-1.447.894l-2-1A1 1 0 010 16V6a1 1 0 01.553-.894l2-1A1 1 0 014 5v12z" />
            </svg>
        </div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600 dark:from-green-400 dark:to-emerald-300 tracking-tight">AgriLink</h1>
      </div>

      <div className="glass w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/40 dark:border-white/10 dark:bg-gray-800/80">
        <button onClick={onBackToRoleSelection} className="absolute top-4 left-4 text-gray-400 hover:text-green-600 dark:hover:text-white transition-colors p-2 rounded-full hover:bg-gray-100/50 dark:hover:bg-gray-700/50" aria-label={t('backToRoleSelection')} title={t('backToRoleSelection')}>
            <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-2">
            {isLoginView ? t('welcomeBack') : t('createAccount')}
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 text-sm">
            {isLoginView ? t('signInToContinue') : t('joinNetwork')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('fullName')}</label>
                <input id="name" name="name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} placeholder={t('yourName')} />
              </div>
            )}
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('phoneNumber')}</label>
              <input id="identifier" name="identifier" type="text" autoComplete="username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} className={inputClasses} placeholder={t('mobileNumberPlaceholder')} />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('password')}</label>
              <div className="relative">
                <input id="password" name="password" type={isPasswordVisible ? 'text' : 'password'} autoComplete={isLoginView ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className={passwordInputClasses} placeholder="********" />
                <button type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                  {isPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {!isLoginView && (
              <>
                <div>
                  <label htmlFor="verifyPassword" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('verifyPassword')}</label>
                  <div className="relative">
                    <input id="verifyPassword" name="verifyPassword" type={isVerifyPasswordVisible ? 'text' : 'password'} autoComplete="new-password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} className={passwordInputClasses} placeholder="********" />
                    <button type="button" onClick={() => setIsVerifyPasswordVisible(!isVerifyPasswordVisible)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      {isVerifyPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="p-3 bg-gray-50/80 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-600">
                  <h4 className="text-xs font-bold text-gray-500 dark:text-gray-300 uppercase mb-2">{t('passwordRequirements')}</h4>
                  <ul className="space-y-1">
                    <PasswordRequirement isValid={passwordCriteria.minLength} text={t('passwordRequirementLength')} />
                    <PasswordRequirement isValid={passwordCriteria.hasUppercase} text={t('passwordRequirementUpper')} />
                    <PasswordRequirement isValid={passwordCriteria.hasLowercase} text={t('passwordRequirementLower')} />
                    <PasswordRequirement isValid={passwordCriteria.hasNumber} text={t('passwordRequirementNumber')} />
                    <PasswordRequirement isValid={passwordCriteria.hasSpecialChar} text={t('passwordRequirementSpecial')} />
                  </ul>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="gender" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('gender')}</label>
                        <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value as any)} className={inputClasses} required>
                            <option value="">{t('selectGender')}</option> <option value="male">{t('male')}</option> <option value="female">{t('female')}</option> <option value="other">{t('other')}</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="age" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('age')}</label>
                        <input id="age" name="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} className={inputClasses} placeholder="e.g. 35" />
                    </div>
                </div>
                <div>
                  <label htmlFor="state" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('stateProvince')}</label>
                  {statesList.length > 0 ? (
                    <select id="state" name="state" value={state} onChange={(e) => setState(e.target.value)} className={inputClasses} required>
                      <option value="">{t('selectStateProvince')}</option> {statesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input id="state" type="text" name="state" value={state} onChange={(e) => setState(e.target.value)} className={inputClasses} placeholder={t('stateProvincePlaceholder')} required />
                  )}
                </div>
                <div>
                  <label htmlFor="location" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 ml-1">{t('cityTown')}</label>
                  <input id="location" name="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} placeholder={t('locationPlaceholder')} required />
                </div>
              </>
            )}

            {error && <p className="text-sm text-red-500 text-center font-medium bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? <Spinner /> : (isLoginView ? t('login') : t('signUp'))}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider"><span className="bg-white/50 dark:bg-gray-800 px-3 text-gray-400 dark:text-gray-500 backdrop-blur-sm">{t('or')}</span></div>
          </div>

          <div className="space-y-3">
            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              disabled={isSocialLoginLoading || isDemoLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-300 disabled:opacity-50"
            >
              {isSocialLoginLoading ? <Spinner /> : <><GoogleIcon className="w-5 h-5 mr-3" /> {t('signInWithGoogle')}</>}
            </button>
            <button 
              type="button" 
              onClick={handleFacebookLogin} 
              disabled={isSocialLoginLoading || isDemoLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm bg-[#1877F2] text-sm font-semibold text-white hover:bg-[#166fe5] transition duration-300 disabled:opacity-50"
            >
              {isSocialLoginLoading ? <Spinner /> : <><FacebookIcon className="w-5 h-5 mr-3 fill-white" /> {t('signInWithFacebook')}</>}
            </button>
            <button 
              type="button" 
              onClick={handleDemoLogin} 
              disabled={isSocialLoginLoading || isDemoLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 text-sm font-bold text-slate-700 dark:text-slate-200 hover:from-slate-200 hover:to-slate-300 transition duration-300 disabled:opacity-50"
            >
              {isDemoLoading ? <Spinner /> : <><UserCircleIcon className="w-5 h-5 mr-3" /> Demo Login (Guest)</>}
            </button>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => { setView(isLoginView ? 'signup' : 'login'); setError(''); }} className="text-sm font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-500 transition-colors">
              {isLoginView ? t('needAccount') : t('haveAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
