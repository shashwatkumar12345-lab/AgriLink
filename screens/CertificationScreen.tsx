
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Content } from '@google/genai';
import { User, ChatMessage, UserRole, ConsultantType } from '../types';
import Card, { Certificate } from '../components/Card';
import { certificationData, CertificationCourse, Module, TestQuestion } from '../certificationData';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { AcademicCapIcon } from '../components/icons/AcademicCapIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { ChatBubbleLeftRightIcon } from '../components/icons/ChatBubbleLeftRightIcon';
import Spinner from '../components/Spinner';
import { generateImageForQuery, translateText } from '../services/geminiService';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';
import * as firebaseService from '../services/firebaseService';

interface CertificationScreenProps {
  user: User;
  t: (key: string) => string;
  onCertificationComplete: (certificationId: string) => void;
  userRole: UserRole;
  activeConsultantType: ConsultantType | null;
}

type View = 'COURSE_LIST' | 'COURSE_DETAILS' | 'MODULE_CONTENT' | 'MODULE_TEST' | 'FINAL_EXAM' | 'CERTIFICATE';

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const getThematicLogo = (id: string): string => {
    const mapping: Record<string, string> = {
        'agro_cert_1': '🌾', 'agro_cert_2': '🧪', 'agro_cert_3': '🛰️', 'agro_cert_4': '🍃', 'agro_cert_5': '💧', 'agro_cert_6': '🏢', 'agro_cert_7': '🚜',
        'vet_cert_1': '🩺', 'vet_cert_2': '🥩', 'vet_cert_3': '🥛', 'vet_cert_4': '🐔', 'vet_cert_5': '🧬', 'vet_cert_6': '🔬', 'vet_cert_7': '🏥',
    };
    if (mapping[id]) return mapping[id];
    if (id.endsWith('m1')) return '📘';
    if (id.endsWith('m2')) return '🌱';
    if (id.endsWith('m3')) return '🧪';
    if (id.endsWith('m4')) return '🛡️';
    return '🎓';
};

const ModuleView: React.FC<{
  module: Module;
  onBack: () => void;
  onStartTest: () => void;
  t: (key: string) => string;
  consultantType?: ConsultantType | null;
  language?: string;
}> = ({ module, onBack, onStartTest, t, consultantType, language = 'English' }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<string>('');
  const [displayContent, setDisplayContent] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const isAgronomist = consultantType === 'agronomist';
  const linkClass = isAgronomist ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400';
  const btnClass = isAgronomist ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'; 

  useEffect(() => {
    let isMounted = true;
    const loadOrGenerateImage = async () => {
      setIsImageLoading(true);
      setImageUrl(null);
      setImageError('');
      
      try {
        const cachedUrl = await firebaseService.getModuleImage(module.id);
        if (cachedUrl && isMounted) {
          setImageUrl(cachedUrl);
          setIsImageLoading(false);
          return;
        }

        const base64 = await generateImageForQuery(`Educational professional illustration for agricultural module: ${t(module.titleKey as any)}. High resolution farming infographic.`);
        if (base64) {
          const publicUrl = await firebaseService.saveModuleImage(module.id, base64);
          if (isMounted) setImageUrl(publicUrl);
        } else {
           throw new Error("Generation failure");
        }
      } catch (err) {
        if (isMounted) setImageError('Network sync jitter. Visual unavailable.');
      } finally {
        if (isMounted) setIsImageLoading(false);
      }
    };
    loadOrGenerateImage();
    return () => { isMounted = false; };
  }, [module.id, t]);
  
  useEffect(() => {
      let isMounted = true;
      const translateContent = async () => {
          if (language === 'English') {
              setDisplayContent(module.content);
              return;
          }
          setIsTranslating(true);
          try {
              const translated = await translateText(module.content, language);
              if (isMounted) setDisplayContent(translated);
          } catch (e) {
              if (isMounted) setDisplayContent(module.content);
          } finally {
              if (isMounted) setIsTranslating(false);
          }
      };
      translateContent();
      return () => { isMounted = false; };
  }, [module.content, language]);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className={`text-[10px] font-black uppercase tracking-widest ${linkClass} hover:underline flex items-center gap-1 transition-transform hover:-translate-x-1`}><ArrowLeftIcon className="w-4 h-4"/> {t('backToModules')}</button>
      <Card className="rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5 overflow-hidden !p-0 shadow-2xl">
        <div className="relative h-64 md:h-96 overflow-hidden bg-slate-900 group">
          {isImageLoading ? (
            <div className="w-full h-full flex flex-col justify-center items-center bg-slate-900/50 backdrop-blur-xl">
                <Spinner />
                <span className="mt-4 text-[10px] font-black uppercase text-white/40 tracking-[0.3em] animate-pulse">Syncing Visual Node...</span>
            </div>
          ) : imageError ? (
            <div className="w-full h-full flex justify-center items-center bg-red-950/20 text-center px-8">
                <p className="text-xs font-black uppercase text-red-500/60 tracking-widest">{imageError}</p>
            </div>
          ) : imageUrl && (
            <img src={imageUrl} alt={t(module.titleKey as any)} className="w-full h-full object-cover opacity-90 animate-fade-in group-hover:scale-105 transition-transform duration-[10s]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          <div className="absolute bottom-8 left-8 right-8">
             <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 text-white text-[8px] font-black uppercase tracking-widest rounded-full mb-3">Live Training Feed</span>
             <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">{t(module.titleKey as any)}</h3>
          </div>
        </div>

        <div className="p-8 md:p-12">
            {isTranslating ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Spinner />
                    <p className="mt-6 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Optimizing lesson for {language}...</p>
                </div>
            ) : (
                <div className="prose prose-sm md:prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-medium 
                    [&>strong]:text-slate-900 [&>strong]:dark:text-white [&>strong]:font-black
                    [&>ul]:space-y-2 [&>ul]:list-disc [&>ul]:pl-6">
                    <span dangerouslySetInnerHTML={{ __html: displayContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />') }} />
                </div>
            )}
            <div className="mt-12 pt-10 border-t dark:border-white/10">
                <button onClick={onStartTest} disabled={isTranslating} className={`w-full text-white font-black uppercase tracking-[0.3em] py-6 rounded-[2rem] shadow-2xl transition-all active:scale-95 transform hover:-translate-y-1 disabled:opacity-30 disabled:grayscale ${btnClass}`}>
                    Open Certification Exam
                </button>
            </div>
        </div>
      </Card>
    </div>
  );
};

const CertificationScreen: React.FC<CertificationScreenProps> = ({ user, t, onCertificationComplete, userRole, activeConsultantType }) => {
  const consultantType = activeConsultantType;
  const courses = activeConsultantType === 'agronomist' ? certificationData.agronomist : certificationData.veterinarian;
  const currentLanguage = user.languagePreference || 'English';

  const isAgronomist = activeConsultantType === 'agronomist';
  const primaryText = isAgronomist ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400';
  const secondaryText = isAgronomist ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
  const iconColor = isAgronomist ? 'text-emerald-500' : 'text-pink-500';
  const btnClass = isAgronomist ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700';
  const lightBg = isAgronomist ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-rose-50 dark:bg-rose-950/20';
  const selectedBg = isAgronomist ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30';
  const borderColor = isAgronomist ? 'border-emerald-400' : 'border-rose-400';
  const accentGradient = isAgronomist ? 'from-emerald-500 to-teal-700' : 'from-rose-500 to-pink-700';

  const [view, setView] = useState<View>('COURSE_LIST');
  const [selectedCourse, setSelectedCourse] = useState<CertificationCourse | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [moduleProgress, setModuleProgress] = useState<Record<string, Set<string>>>(() => {
      const savedProgress = localStorage.getItem(`agriLinkModuleProgress_${user.phone}`);
      if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          Object.keys(parsed).forEach(key => { parsed[key] = new Set(parsed[key]); });
          return parsed;
      }
      return {};
  });

  const [currentTest, setCurrentTest] = useState<{ questions: TestQuestion[]; type: 'module' | 'final' } | null>(null);
  const [testAnswers, setTestAnswers] = useState<Record<number, string[]>>({});
  const [testResult, setTestResult] = useState<{ score: number; total: number; passed: boolean } | null>(null);
  const [justCertifiedCourse, setJustCertifiedCourse] = useState<CertificationCourse | null>(null);
  const [isAiHelperOpen, setIsAiHelperOpen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [aiUsageFailure, setAiUsageFailure] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const courseIdsForCurrentType = new Set(courses.map(c => c.id));
  const hasCertsForCurrentType = (user.completedCertifications || []).some(certId => courseIdsForCurrentType.has(certId));

  useEffect(() => {
    const serializableProgress: Record<string, string[]> = {};
    Object.keys(moduleProgress).forEach(key => { serializableProgress[key] = Array.from(moduleProgress[key]); });
    localStorage.setItem(`agriLinkModuleProgress_${user.phone}`, JSON.stringify(serializableProgress));
  }, [moduleProgress, user.phone]);
  
  useEffect(() => {
    if (testStartTime && timeLeft > 0) {
      timerRef.current = setTimeout(() => { setTimeLeft(timeLeft - 1); }, 1000);
    } else if (timeLeft === 0 && testStartTime) {
      handleSubmitTest();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, testStartTime]);

  const handleSelectCourse = (course: CertificationCourse) => { setSelectedCourse(course); setView('COURSE_DETAILS'); };
  const handleStartModule = (module: Module) => { setSelectedModule(module); setView('MODULE_CONTENT'); };
  const handleStartTest = (course: CertificationCourse, module: Module | null, type: 'module' | 'final') => {
    setTestAnswers({}); setTestResult(null);
    const mcqs = type === 'module' ? module!.test.filter(q => q.type === 'mcq') : course.finalExam.filter(q => q.type === 'mcq');
    const msqs = type === 'module' ? module!.test.filter(q => q.type === 'msq') : course.finalExam.filter(q => q.type === 'msq');
    const questionsForTest = [...shuffleArray(mcqs).slice(0, type === 'module' ? 5 : 8), ...shuffleArray(msqs).slice(0, type === 'module' ? 3 : 5)];
    setCurrentTest({ questions: shuffleArray(questionsForTest), type });
    setView(type === 'module' ? 'MODULE_TEST' : 'FINAL_EXAM');
    setTimeLeft(type === 'module' ? 10 * 60 : 15 * 60);
    setTestStartTime(Date.now());
    setAiUsageFailure(false);
  };

  const handleAnswerChange = (questionIndex: number, answer: string, type: 'mcq' | 'msq') => {
    if (type === 'mcq') { setTestAnswers(prev => ({ ...prev, [questionIndex]: [answer] })); } 
    else { setTestAnswers(prev => { const currentAnswers = prev[questionIndex] || []; const newAnswers = currentAnswers.includes(answer) ? currentAnswers.filter(a => a !== answer) : [...currentAnswers, answer]; return { ...prev, [questionIndex]: newAnswers }; }); }
  };
  
  const handleSubmitTest = () => {
    if (!currentTest || !testStartTime) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setTestStartTime(null); setTimeLeft(0);
    const elapsedTime = Date.now() - testStartTime;
    const minTime = currentTest.type === 'module' ? (2 * 60 + 45) * 1000 : 5 * 60 * 1000;
    if (timeLeft > 0 && elapsedTime < minTime) { setAiUsageFailure(true); setTestResult({ score: 0, total: currentTest.questions.length, passed: false }); return; }
    let score = 0;
    currentTest.questions.forEach((q, index) => { 
        const userAnswersRaw = testAnswers[index]?.sort() || []; 
        const correctAnswersRaw = Array.isArray(q.correctAnswer) ? q.correctAnswer.sort() : [q.correctAnswer]; 
        if (JSON.stringify(userAnswersRaw) === JSON.stringify(correctAnswersRaw)) score++; 
    });
    const passed = (score / currentTest.questions.length) >= 0.85;
    setTestResult({ score, total: currentTest.questions.length, passed });
    if (passed) {
      if (currentTest.type === 'module' && selectedCourse && selectedModule) {
        setModuleProgress(prev => { const newProgress = { ...prev }; const courseProgress = new Set(newProgress[selectedCourse.id] || []); courseProgress.add(selectedModule.id); newProgress[selectedCourse.id] = courseProgress; return newProgress; });
      } else if (currentTest.type === 'final' && selectedCourse) {
        onCertificationComplete(selectedCourse.id); setJustCertifiedCourse(selectedCourse); setView('CERTIFICATE');
      }
    }
  };

  const handleExitTest = () => { if (timerRef.current) clearTimeout(timerRef.current); setTestStartTime(null); setTimeLeft(0); setCurrentTest(null); setTestAnswers({}); setTestResult(null); setView('COURSE_DETAILS'); setShowExitConfirm(false); };
  
  const renderCourseList = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter uppercase text-slate-800 dark:text-white">{t('certificationTitle')}</h2>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">{t('certificationSubtitle')}</p>
        </div>
        <button onClick={() => setIsAiHelperOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-2xl hover:bg-blue-700 transition shadow-xl active:scale-95"><ChatBubbleLeftRightIcon className="w-5 h-5" /><span className="hidden sm:inline">Expert AI Helper</span></button>
      </div>
      
      {userRole === 'trainee' && !hasCertsForCurrentType && (
        <div className="p-6 rounded-[2rem] bg-amber-50 dark:bg-amber-950/40 border-2 border-dashed border-amber-500/50 text-amber-800 dark:text-amber-200 text-xs font-bold text-center flex items-center justify-center gap-4">
            <span className="text-2xl">🚧</span>
            {t('noCertsWarning')}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {courses.map(course => {
          const isCertified = (user.completedCertifications || []).includes(course.id);
          const progressCount = moduleProgress[course.id]?.size || 0;
          const progressPercent = Math.round((progressCount / course.modules.length) * 100);

          return (
            <button key={course.id} onClick={() => handleSelectCourse(course)} className="group glass-card p-1.5 rounded-[2.5rem] shadow-xl text-left hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 active:scale-[0.98] relative overflow-hidden flex flex-col h-full">
              <div className="bg-white/20 dark:bg-slate-800/20 rounded-[2.2rem] p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-6">
                      <div className={`w-16 h-16 rounded-[1.5rem] bg-gradient-to-br ${accentGradient} flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          {getThematicLogo(course.id)}
                      </div>
                      {isCertified ? (
                          <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg animate-pop-in"><CheckCircleIcon className="w-6 h-6"/></div>
                      ) : (
                          <div className="glass-card border border-white/20 dark:border-white/10 px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{progressCount}/{course.modules.length} Nodes</span>
                          </div>
                      )}
                  </div>
                  
                  <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight leading-none mb-3 pr-8">{t(course.titleKey as any)}</h3>
                  
                  {!isCertified && (
                      <div className="mt-auto pt-6">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Progress</span>
                             <span className="text-[8px] font-black text-emerald-600 uppercase">{progressPercent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full transition-all duration-1000 ${isAgronomist ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${progressPercent}%` }}></div>
                          </div>
                      </div>
                  )}

                  {isCertified && (
                      <p className={`mt-auto text-[9px] font-black uppercase tracking-[0.2em] ${secondaryText} flex items-center gap-2`}>
                        {t('certifiedStatus')}
                      </p>
                  )}
              </div>
            </button>
          );
        })}
      </div>
      {isAiHelperOpen && <AIHelperModal t={t} user={user} onClose={() => setIsAiHelperOpen(false)} />}
    </div>
  );
  
  const renderCourseDetails = () => {
      if (!selectedCourse) return null;
      const completedInCourse = moduleProgress[selectedCourse.id] || new Set();
      const allModulesCompleted = completedInCourse.size === selectedCourse.modules.length;
      const isCertified = (user.completedCertifications || []).includes(selectedCourse.id);
      
      return (
          <div className="space-y-8 animate-fade-in-up">
              <button onClick={() => setView('COURSE_LIST')} className={`text-[10px] font-black uppercase tracking-widest ${primaryText} hover:underline flex items-center gap-1 transition-transform hover:-translate-x-1`}><ArrowLeftIcon className="w-4 h-4"/> {t('backToCourses')}</button>
              
              <div className="text-center px-4">
                  <div className="inline-block p-4 rounded-[1.5rem] bg-slate-100 dark:bg-slate-800 mb-4 text-4xl shadow-inner">
                      {getThematicLogo(selectedCourse.id)}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">{t(selectedCourse.titleKey as any)}</h2>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Select a module to initiate training</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCourse.modules.map((module, index) => { 
                      const isCompleted = completedInCourse.has(module.id); 
                      return ( 
                        <button key={module.id} onClick={() => handleStartModule(module)} className="group relative flex items-center gap-6 glass-card p-6 rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-300 transform active:scale-95 text-left">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-colors duration-500 ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-white/10 dark:bg-slate-800/40 text-slate-400 group-hover:bg-white/20 group-hover:text-slate-600'}`}>
                                {isCompleted ? '✓' : getThematicLogo(module.id)}
                            </div>
                            <div className="flex-grow">
                                <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1 block">Module 0{index + 1}</span>
                                <span className="font-black text-sm text-slate-800 dark:text-white tracking-tight leading-tight">{t(module.titleKey as any)}</span>
                            </div>
                            {isCompleted && (
                                <div className="absolute top-4 right-4 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">Mastered</div>
                            )}
                        </button> 
                      ) 
                  })}
              </div>

              <div className="pt-10 pb-20 text-center flex flex-col items-center gap-4">
                {isCertified ? (
                    <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 animate-pop-in ${lightBg}`}>
                        <CheckCircleIcon className={`w-16 h-16 mx-auto mb-4 ${iconColor}`} />
                        <h3 className="text-xl font-black uppercase tracking-tight mb-2">Certification Finalized</h3>
                        <button onClick={() => {setJustCertifiedCourse(selectedCourse); setView('CERTIFICATE');}} className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:underline">Download Expert Credential</button>
                    </div>
                ) : (
                    <button 
                        onClick={() => handleStartTest(selectedCourse, null, 'final')} 
                        disabled={!allModulesCompleted} 
                        className={`w-full max-w-md text-white font-black uppercase tracking-[0.2em] py-5 rounded-3xl shadow-2xl transition-all active:scale-95 transform hover:-translate-y-1 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed ${btnClass}`}
                    >
                        {allModulesCompleted ? 'Initiate Final Credentialing' : t('testDisabledTooltip')}
                    </button>
                )}
              </div>
          </div>
      )
  };

  const renderModuleContent = () => { if (!selectedModule || !selectedCourse) return null; return <ModuleView module={selectedModule} onBack={() => setView('COURSE_DETAILS')} onStartTest={() => handleStartTest(selectedCourse, selectedModule, 'module')} t={t} consultantType={consultantType} language={currentLanguage} />; };
  
  const renderTest = () => {
    if (!currentTest) return null;
    if (testResult) { return ( <Card className="rounded-[2.5rem] border-4 border-slate-100 dark:border-white/5 shadow-2xl !p-12"><div className="text-center space-y-6">{testResult.passed ? <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center mx-auto shadow-xl"><CheckCircleIcon className="w-16 h-16 text-emerald-600" /></div> : <div className="w-24 h-24 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto shadow-xl"><XCircleIcon className="w-16 h-16 text-red-600" /></div>}<h3 className="text-4xl font-black tracking-tighter uppercase">{t(testResult.passed ? 'testPassed' : 'testFailed')}</h3>{aiUsageFailure ? <p className="text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-[10px]">{t('testFailedAI')}</p> : <p className="text-slate-500 font-bold uppercase text-xs">Score Proficiency: {testResult.score} / {testResult.total}</p>}<button onClick={() => { setTestResult(null); setCurrentTest(null); setView('COURSE_DETAILS'); setAiUsageFailure(false); }} className={`w-full text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl ${btnClass}`}>{t('backToModules')}</button></div></Card> ); }
    const minutes = Math.floor(timeLeft / 60); const seconds = timeLeft % 60; const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return ( <> {showExitConfirm && ( <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex justify-center items-center p-4"><Card className="max-w-md w-full rounded-[2rem] !p-10 shadow-2xl border-2 border-red-500/20"><h3 className="text-2xl font-black tracking-tighter uppercase mb-4">{t('exitTestTitle')}</h3><p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{t('exitTestConfirmation')}</p><div className="flex gap-4 mt-10"><button onClick={() => setShowExitConfirm(false)} className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase text-[10px] py-4 rounded-xl">{t('exitTestNo')}</button><button onClick={handleExitTest} className="flex-1 bg-red-600 text-white font-black uppercase text-[10px] py-4 rounded-xl shadow-lg">{t('exitTestYes')}</button></div></Card></div> )} <div className="space-y-8 animate-fade-in pb-32"><div className="flex justify-between items-center px-2"><div><h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">{t(currentTest.type === 'module' ? 'moduleTest' : 'finalExam')}</h2><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('passMarkNotice')}</p></div><div className="flex items-center gap-6"><div className={`text-xl font-black p-4 rounded-[1.5rem] shadow-xl border border-white/10 ${timeLeft < 60 ? 'text-red-500 bg-red-50 dark:bg-red-950/40 animate-pulse' : 'text-slate-900 dark:text-white bg-white dark:bg-slate-900'}`}>{timeString}</div><button onClick={() => setShowExitConfirm(true)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><XCircleIcon className="w-8 h-8 text-slate-400"/></button></div></div><Card className="rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5 shadow-2xl !p-8 md:!p-12"><div className="space-y-12">{currentTest.questions.map((q, index) => ( <div key={index} className="space-y-6"><div className="flex gap-4"><span className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-sm font-black text-slate-400 shadow-inner">{index + 1}</span><p className="font-bold text-lg md:text-xl text-slate-900 dark:text-white leading-tight">{t(q.question)}</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-14">{q.options.map(option => ( <label key={option} className={`relative flex items-center p-5 rounded-[1.5rem] cursor-pointer transition-all duration-300 border-2 overflow-hidden group ${ (testAnswers[index] || []).includes(option) ? `${selectedBg} ${borderColor} scale-[1.02] shadow-md` : 'bg-slate-50/50 dark:bg-slate-900/50 border-transparent hover:border-slate-200 dark:hover:border-white/10'} `}><input type={q.type === 'mcq' ? 'radio' : 'checkbox'} name={`question-${index}`} value={option} checked={(testAnswers[index] || []).includes(option)} onChange={() => handleAnswerChange(index, option, q.type)} className="sr-only" /><span className={`font-bold text-sm leading-tight transition-colors ${ (testAnswers[index] || []).includes(option) ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200'}`}>{t(option)}</span></label> ))}</div></div> ))} <div className="pt-10 border-t dark:border-white/10"><button onClick={handleSubmitTest} className={`w-full text-white font-black uppercase tracking-[0.2em] py-5 rounded-3xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.4)] transition-all active:scale-95 ${btnClass}`}>Transmit Final Responses</button></div></div></Card></div> </> );
  };
  
  const renderCertificate = () => {
    if (!justCertifiedCourse) return null;
    const isFinalView = !!justCertifiedCourse;
    return ( <Certificate userName={user.name} certificationName={t(justCertifiedCourse.titleKey as any)} issueDate={new Date().toLocaleDateString()} t={t} onClose={() => { setJustCertifiedCourse(null); setView(isFinalView ? 'COURSE_LIST' : 'COURSE_DETAILS'); }} /> );
  };
  
  switch (view) { case 'COURSE_LIST': return renderCourseList(); case 'COURSE_DETAILS': return renderCourseDetails(); case 'MODULE_CONTENT': return renderModuleContent(); case 'MODULE_TEST': case 'FINAL_EXAM': return renderTest(); case 'CERTIFICATE': return renderCertificate(); default: return renderCourseList(); }
};

interface AIHelperModalProps {
  onClose: () => void;
  user: User;
  t: (key: string) => string;
}

const AIHelperModal: React.FC<AIHelperModalProps> = ({ onClose, user, t }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const currentLanguage = user.languagePreference || 'English';

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[currentLanguage]?.code || 'en-US');

  useEffect(() => {
    if (isListening) setUserInput(transcript);
  }, [transcript, isListening]);

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };
  
  const tutorNameKey = user.consultantType === 'agronomist' ? 'agriTutorName' : 'vetTutorName';
  const welcomeKey = user.consultantType === 'agronomist' ? 'agriTutorWelcome' : 'vetTutorWelcome';

  useEffect(() => {
    if (chatHistory.length === 0) setChatHistory([{ role: 'model', text: t(welcomeKey) }]);
  }, [t, welcomeKey]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: userInput };
    setChatHistory(prev => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);

    try {
        const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
        
        const courses = user.consultantType === 'agronomist' ? certificationData.agronomist : certificationData.veterinarian;
        const courseContext = courses.map(course => {
            const moduleTitles = course.modules.map(m => t(m.titleKey as any)).join(', ');
            return `- ${t(course.titleKey as any)}: Covers modules on ${moduleTitles}.`;
        }).join('\n');

        const systemInstruction = `You are an expert AI tutor for a veterinary or agricultural professional using the AgriLink app. Your name is ${t(tutorNameKey)}.
        Your ONLY purpose is to answer questions related to the certification courses available in the app.
        The user is currently studying for their ${user.consultantType} certification.
        The available courses are:\n${courseContext}\n
        Answer the user's question clearly and concisely in simple language.
        Provide helpful explanations based on the course topics. Be encouraging.`;

        const historyForApi: Content[] = chatHistory.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] }));
        const response = await ai.models.generateContent({
             model: 'gemini-3-flash-preview',
             contents: [...historyForApi, { role: 'user', parts: [{ text: userInput }] }],
             config: { systemInstruction }
        });
        
        setChatHistory(prev => [...prev, { role: 'model', text: response.text }]);

    } catch (e) {
        setChatHistory(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex justify-center items-center p-4">
        <Card className="max-w-md w-full h-[80vh] flex flex-col relative animate-pop-in rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate-800 !p-8 md:!p-10">
             <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors active:scale-90"><XCircleIcon className="w-8 h-8"/></button>
             <h3 className="text-2xl font-black tracking-tighter uppercase mb-6 flex items-center gap-3">
                 <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600"/>
                 {t(tutorNameKey)}
             </h3>
             <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-6 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-[2rem] mb-6 border border-slate-100 dark:border-white/5 shadow-inner no-scrollbar">
                 {chatHistory.map((msg, index) => (
                     <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[85%] p-4 rounded-2xl text-sm font-bold leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border dark:border-white/5'}`}>
                             {msg.text}
                         </div>
                     </div>
                 ))}
                 {isLoading && <div className="flex justify-start"><div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2"><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div><div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div></div></div>}
             </div>
             
             <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-inner relative">
                 <div className="flex-grow relative">
                    <input 
                        type="text" 
                        value={isListening && !userInput && transcript ? transcript : (isListening && !transcript ? t('listening') : userInput)}
                        onChange={e => setUserInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && sendMessage()} 
                        placeholder={t('askTheHelperPlaceholder')} 
                        className={`w-full text-sm font-black rounded-full pl-6 pr-12 py-4 bg-transparent outline-none ${isListening && !transcript ? 'text-blue-500 italic animate-pulse placeholder-blue-300' : 'text-gray-900 dark:text-white'}`}
                        disabled={isLoading}
                    />
                    {hasRecognitionSupport && (
                        <button onClick={handleMicClick} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg scale-110' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                            <MicrophoneIcon className="h-5 w-5" />
                        </button>
                    )}
                 </div>
                 <button onClick={sendMessage} disabled={isLoading || !userInput.trim()} className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl transition-all active:scale-95 flex-shrink-0">
                     <PaperAirplaneIcon className="w-6 h-6"/>
                 </button>
            </div>
        </Card>
    </div>
  );
};

export default CertificationScreen;
