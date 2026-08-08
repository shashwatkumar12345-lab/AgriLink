
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, AppMode, BusinessPlan, ChatMessage } from '../types';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { generateBusinessPlan, generateImageForQuery, translateText, ENGAGING_INSTRUCTION } from '../services/geminiService';
import * as firebaseService from '../services/firebaseService';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { SpeakerWaveIcon } from '../components/icons/SpeakerWaveIcon';
import { StopIcon } from '../components/icons/StopIcon';
import { useGenAITTS } from '../hooks/useGenAITTS';
import { DownloadIcon } from '../components/icons/DownloadIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon'; 
import { PencilSquareIcon } from '../components/icons/PencilSquareIcon';
import { GoogleGenAI } from '@google/genai';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';

interface BusinessPlanScreenProps {
  user: User;
  t: (key: string) => string;
  language: string;
  appMode: AppMode;
  onBack: () => void;
}

const EngagingLoader: React.FC<{ t: (key: string) => string }> = ({ t }) => {
    const [tipIndex, setTipIndex] = useState(0);
    const tips = [
        "Did you know? Crop rotation can improve soil fertility by up to 20%.",
        "Drip irrigation saves 30-50% water compared to flood irrigation.",
        "Soil testing helps reduce fertilizer costs by optimizing application.",
        "Market prices fluctuate daily; checking trends helps in better selling.",
        "Mulching reduces weed growth and retains soil moisture effectively.",
        "Healthy soil contains billions of beneficial microbes per teaspoon.",
        "Leguminous crops fix atmospheric nitrogen into the soil.",
        "Integrated Pest Management reduces chemical use and saves money."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex((prev) => (prev + 1) % tips.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 space-y-6">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <SparklesIcon className="w-6 h-6 text-emerald-600 animate-pulse" />
                </div>
            </div>
            <div className="text-center max-w-md px-4">
                <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 animate-pulse mb-2 uppercase tracking-widest text-sm">
                    Consulting Expert AI...
                </h3>
                <div className="h-16 flex items-center justify-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic font-bold">
                        "{tips[tipIndex]}"
                    </p>
                </div>
            </div>
        </div>
    );
};

const DeepDiveModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    context: string; 
    title: string; 
    language: string; 
    t: (key: string) => string; 
}> = ({ isOpen, onClose, context, title, language, t }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleSend = async (textOverride?: string, isHiddenPrompt: boolean = false) => {
        const userText = textOverride || input;
        if (!userText.trim()) return;

        if (!isHiddenPrompt) {
            const userMsg = { role: 'user' as const, text: userText };
            setMessages(prev => [...prev, userMsg]);
        }
        
        setInput('');
        setLoading(true);

        try {
            const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
            
            const prompt = `
                ${ENGAGING_INSTRUCTION}
                ROLE: Senior Agricultural Business Strategist & Knowledge Architect.
                TOPIC: Expert Deep Dive analysis of the "${title}" section.
                PLAN CONTEXT: "${context.replace(/<[^>]*>/g, '')}".
                USER QUERY: "${userText}"
                
                RULES: Respond strictly in ${language}. Use vibrant HTML tags as instructed in system rules. Ensure all text is high-contrast emerald or teal.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: [{ role: 'user', parts: [{ text: prompt }] }]
            });
            
            const aiText = response.text || "Synchronisation failure. Please retry.";
            
            setMessages(prev => {
                const filtered = prev.filter(m => m.text !== 'Analyzing this section for you...');
                return [...filtered, { role: 'model', text: aiText }];
            });
        } catch (e) {
            setMessages(prev => [...prev, { role: 'model', text: "Node Link Error. Please check data connection." }]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && !hasInitialized.current) {
            hasInitialized.current = true;
            setMessages([{ role: 'model', text: 'Analyzing this section for you...' }]);
            handleSend(`Summarize the strategic importance of "${title}" for my farm ROI in a colorful format.`, true);
        }
        if (!isOpen) {
            hasInitialized.current = false;
            setMessages([]);
        }
    }, [isOpen, title]);

    const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');
    useEffect(() => { if(isListening) setInput(transcript); }, [transcript, isListening]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 z-[100] flex flex-col animate-fade-in">
            <div className="flex-shrink-0 p-6 bg-white dark:bg-slate-900 border-b dark:border-white/10 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <ArrowLeftIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                    </button>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">Knowledge Hub</h3>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Deep Dive: {title}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>
            </div>
            
            <div className="flex-grow overflow-y-auto px-4 py-8 md:px-8 space-y-8 bg-slate-50 dark:bg-slate-950 scrollbar-hide">
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}>
                            <div className={`max-w-[95%] p-6 md:p-8 rounded-[2.5rem] shadow-xl border ${m.role === 'user' ? 'bg-emerald-600 text-white border-emerald-500 rounded-br-none' : 'bg-white dark:bg-slate-900 text-emerald-900 dark:text-emerald-50 border-slate-100 dark:border-white/5 rounded-bl-none'}`}>
                                <div 
                                    className="prose prose-sm md:prose-base dark:prose-invert max-w-none 
                                    [&>h3]:text-emerald-700 [&>h3]:dark:text-emerald-400 [&>h3]:font-black [&>h3]:mb-4 [&>h3]:mt-6
                                    [&>ul]:list-none [&>ul]:pl-0 [&>ul]:space-y-3
                                    [&>li]:flex [&>li]:items-start [&>li]:gap-3
                                    [&>p]:leading-relaxed [&>p]:mb-4" 
                                    dangerouslySetInnerHTML={{ __html: m.text }} 
                                />
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start animate-pulse">
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] rounded-bl-none border border-slate-100 dark:border-white/5 flex items-center gap-4 shadow-lg">
                                <div className="relative">
                                    <div className="w-8 h-8 border-2 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                                    <SparklesIcon className="absolute inset-0 m-auto w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-600/60 dark:text-emerald-400/60">Synthesizing Strategy...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-24" />
                </div>
            </div>

            <div className="flex-shrink-0 p-4 bg-white dark:bg-slate-900 border-t dark:border-white/10 safe-area-bottom">
                <div className="max-w-3xl mx-auto flex gap-3 items-center bg-slate-100 dark:bg-slate-950 p-2 rounded-[2rem] border-2 border-slate-100 dark:border-white/10 shadow-inner group focus-within:border-emerald-500/50 transition-all">
                    <input 
                        value={isListening && !input && !transcript ? t('listening') : input} 
                        onChange={e => setInput(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
                        className={`flex-grow bg-transparent text-sm md:text-base font-bold px-6 py-3 outline-none dark:text-white ${isListening && !transcript ? 'text-emerald-500 italic animate-pulse' : ''}`}
                        placeholder="Ask about costs, risks, or methods..."
                    />
                    <div className="flex items-center gap-1 pr-1">
                        {hasRecognitionSupport && (
                            <button onClick={() => isListening ? stopListening() : startListening()} className={`p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                <MicrophoneIcon className="w-6 h-6"/>
                            </button>
                        )}
                        <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="bg-emerald-600 text-white p-4 rounded-2xl font-bold hover:bg-emerald-700 transition shadow-xl flex-shrink-0 active:scale-90 disabled:opacity-40">
                            <PaperAirplaneIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BusinessPlanScreen: React.FC<BusinessPlanScreenProps> = ({ user, t, language, appMode, onBack }) => {
  const [view, setView] = useState<'list' | 'create' | 'report'>('list');
  const [savedPlans, setSavedPlans] = useState<BusinessPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<BusinessPlan | null>(null);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  const [landSize, setLandSize] = useState(user.farmSize?.toString() || '');
  const [landUnit, setLandUnit] = useState(user.farmSizeUnit || 'acres');
  const [soilType, setSoilType] = useState(user.soilType || '');
  const [animalCount, setAnimalCount] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [budget, setBudget] = useState('');
  const [strategy, setStrategy] = useState<'auto' | 'manual'>('auto');
  const [selectedItems, setSelectedItems] = useState<string>(''); 
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isTranslatingContent, setIsTranslatingContent] = useState(false);
  const [showDeepDive, setShowDeepDive] = useState(false);

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');
  const [activeField, setActiveField] = useState<string | null>(null);
  const baseTextRef = useRef('');

  const { speak, stop: stopSpeak, isSpeaking } = useGenAITTS();

  const reportContentRef = useRef<HTMLDivElement>(null);

  const isCrops = appMode === 'crops';

  useEffect(() => {
    const userId = user.uid || user.phone;
    if (userId) {
      firebaseService.getBusinessPlans(userId).then(setSavedPlans);
    }
  }, [user]);

  // Requirement: Scroll to content when generated/tab changed
  useEffect(() => {
    if (view === 'report' && reportContentRef.current) {
        reportContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTimelineIndex, view]);

  useEffect(() => {
    if (isListening && activeField) {
        if (activeField === 'selectedItems') setSelectedItems(baseTextRef.current + (baseTextRef.current && transcript ? ' ' : '') + transcript);
        if (activeField === 'waterSource') setWaterSource(baseTextRef.current + (baseTextRef.current && transcript ? ' ' : '') + transcript);
        if (activeField === 'budget') setBudget(baseTextRef.current + (baseTextRef.current && transcript ? ' ' : '') + transcript);
    } else if (!isListening) {
        setActiveField(null);
    }
  }, [transcript, isListening, activeField]);

  const handleMicClick = (field: string, currentValue: string) => {
    if (isListening) {
        stopListening();
        setActiveField(null);
    } else {
        setActiveField(field);
        baseTextRef.current = currentValue;
        startListening();
    }
  };

  const handleGenerate = async () => {
    if (!budget && !waterSource) {
        alert("Please provide details like budget or water source for a tailored plan.");
        return;
    }

    setIsGenerating(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setGeneratedImage(null);
    setActiveTimelineIndex(0);
    
    try {
        const details = {
            landSize, landUnit, soilType, waterSource, animalCount, budget,
            location: `${user.location}, ${user.state}, ${user.country}`
        };

        const manualItemsList = selectedItems.split(',').map(s => s.trim()).filter(s => s);
        const report = await generateBusinessPlan(details, appMode, strategy, manualItemsList, language);
        
        const newPlan: BusinessPlan = {
            id: `PLAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            userId: user.uid || user.phone || 'unknown',
            timestamp: new Date().toISOString(),
            mode: appMode,
            details,
            strategy,
            selectedCommodities: manualItemsList,
            report
        };

        setCurrentPlan(newPlan);
        setView('report');
        
        generateImageForQuery(`A professional agricultural business plan cover image for ${report.title}. Realistic, 4k.`).then(url => {
            setGeneratedImage(url);
        }).catch(() => {});

    } catch (error) {
        console.error(error);
        alert("Generation failed. Please retry.");
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!currentPlan) return;
    setIsSavingPlan(true);
    try {
        const planToSave = JSON.parse(JSON.stringify({ 
            ...currentPlan, 
            userId: user.uid || user.phone || 'unknown', 
            imageUrl: generatedImage || currentPlan.imageUrl 
        }));
        await firebaseService.saveBusinessPlan(planToSave);
        setSavedPlans(prev => [planToSave, ...prev.filter(p => p.id !== planToSave.id)]);
        alert("Plan secured in the strategy vault.");
    } catch (e: any) {
        alert("Securing failed. Check connection.");
    } finally {
        setIsSavingPlan(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
      if(window.confirm("Delete this strategic plan?")) {
          await firebaseService.deleteBusinessPlan(id);
          setSavedPlans(prev => prev.filter(p => p.id !== id));
          if (currentPlan?.id === id) { setView('list'); setCurrentPlan(null); }
      }
  };

  const rawActiveContent = useMemo(() => {
    if (!currentPlan) return '';
    const report = currentPlan.report as any;
    const isDynamic = Array.isArray(report.timeline);
    
    if (isDynamic) {
         const timelineLength = report.timeline.length;
         if (activeTimelineIndex < timelineLength) {
             return report.timeline[activeTimelineIndex]?.content || '';
         } else {
             const longTermOffset = activeTimelineIndex - timelineLength;
             if (longTermOffset === 0) return report.longTerm?.year1 || '';
             if (longTermOffset === 1) return report.longTerm?.year3 || '';
             if (longTermOffset === 2) return report.longTerm?.year5 || '';
         }
    }
    return report[['quarterly', 'semiAnnual', 'annual', 'year3', 'year5'][activeTimelineIndex]] || '';
  }, [currentPlan, activeTimelineIndex]);

  useEffect(() => {
      let isMounted = true;
      const runTranslation = async () => {
          if (!rawActiveContent) return;
          if (language === 'English') { setTranslatedContent(rawActiveContent); return; }
          setIsTranslatingContent(true);
          try {
              const result = await translateText(rawActiveContent, language);
              if (isMounted) setTranslatedContent(result);
          } catch(e) {
              if (isMounted) setTranslatedContent(rawActiveContent);
          } finally { if (isMounted) setIsTranslatingContent(false); }
      };
      runTranslation();
      return () => { isMounted = false; };
  }, [rawActiveContent, language]);

  const handleReadAloud = (text: string) => {
      const clean = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      speak(clean, language);
  };

  const renderInputForm = () => {
    const btnGradient = isCrops 
        ? 'from-emerald-800 to-teal-700 hover:from-emerald-700 hover:to-teal-600 shadow-emerald-900/30' 
        : 'from-rose-800 to-pink-700 hover:from-rose-700 hover:to-pink-600 shadow-rose-900/30';
    const titleGradient = isCrops ? 'from-emerald-800 to-teal-500 dark:from-emerald-400 dark:to-teal-300' : 'from-rose-600 to-pink-500 dark:from-rose-400 dark:to-pink-300';
    const inputClass = "w-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-slate-300 dark:border-white/10 rounded-2xl px-5 py-3.5 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm font-bold text-sm";
    const labelClass = "block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1";

    return (
        <div className="max-w-3xl mx-auto animate-fade-in pb-20">
            <div className="text-center mb-10">
                 <h2 className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${titleGradient} tracking-tighter`}>Strategic Roadmap</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">AI-Powered Business Intelligence</p>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 p-6 md:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {appMode === 'crops' ? (
                        <>
                            <div className="space-y-2">
                                <label className={labelClass}>Land Area</label>
                                <div className="flex gap-2">
                                    <input type="number" value={landSize} onChange={e => setLandSize(e.target.value)} className={inputClass} placeholder="5" />
                                    <select value={landUnit} onChange={e => setLandUnit(e.target.value as any)} className={`${inputClass} w-32`}>
                                        <option value="acres">Acres</option>
                                        <option value="hectares">Hectares</option>
                                        <option value="bigha">Bigha</option>
                                        <option value="katha">Katha</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className={labelClass}>Soil Profile</label>
                                <select value={soilType} onChange={e => setSoilType(e.target.value)} className={inputClass}>
                                    <option value="">Identify Soil</option>
                                    <option value="alluvial">Alluvial (Loamy)</option>
                                    <option value="black">Black (Regur)</option>
                                    <option value="red">Red & Yellow</option>
                                    <option value="laterite">Laterite</option>
                                    <option value="arid">Arid / Desert</option>
                                    <option value="saline">Saline / Alkaline</option>
                                    <option value="peaty">Peaty / Marshy</option>
                                    <option value="forest">Mountain / Forest</option>
                                    <option value="clayey">Clayey</option>
                                    <option value="sandy">Sandy</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <div className="md:col-span-2 space-y-2">
                            <label className={labelClass}>Livestock Headcount</label>
                            <input type="number" value={animalCount} onChange={e => setAnimalCount(e.target.value)} className={inputClass} placeholder="e.g. 15 Cows" />
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className={labelClass}>Infrastructure & Resources</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={isListening && activeField === 'waterSource' && !transcript ? t('listening') : waterSource} 
                            onChange={e => setWaterSource(e.target.value)} 
                            className={`${inputClass} pr-14 ${isListening && activeField === 'waterSource' && !transcript ? 'text-emerald-500 italic animate-pulse' : ''}`} 
                            placeholder="e.g. Borewell, Drip System, Modern Shed" 
                        />
                        {hasRecognitionSupport && (
                            <button onClick={() => handleMicClick('waterSource', waterSource)} className={`absolute top-1/2 -translate-y-1/2 right-2 p-2.5 rounded-full transition-all ${isListening && activeField === 'waterSource' ? 'bg-red-500 text-white shadow-xl scale-110' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                <MicrophoneIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={labelClass}>Working Capital / Budget</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={isListening && activeField === 'budget' && !transcript ? t('listening') : budget} 
                            onChange={e => setBudget(e.target.value)} 
                            className={`${inputClass} pr-14 ${isListening && activeField === 'budget' && !transcript ? 'text-emerald-500 italic animate-pulse' : ''}`} 
                            placeholder="e.g. 10 Lakhs" 
                        />
                         {hasRecognitionSupport && (
                            <button onClick={() => handleMicClick('budget', budget)} className={`absolute top-1/2 -translate-y-1/2 right-2 p-2.5 rounded-full transition-all ${isListening && activeField === 'budget' ? 'bg-red-500 text-white shadow-xl scale-110' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                <MicrophoneIcon className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className={labelClass}>Planning Strategy</label>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setStrategy('auto')} className={`relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 text-left group ${strategy === 'auto' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 shadow-xl' : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40'}`}>
                            <SparklesIcon className={`w-8 h-8 mb-3 transition-colors ${strategy === 'auto' ? 'text-emerald-600' : 'text-slate-400'}`} />
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">AI Optimization</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Full Sugessted Model</p>
                        </button>
                        <button onClick={() => setStrategy('manual')} className={`relative overflow-hidden p-6 rounded-3xl border-2 transition-all duration-500 text-left group ${strategy === 'manual' ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-xl' : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-800/40'}`}>
                            <PencilSquareIcon className={`w-8 h-8 mb-3 transition-colors ${strategy === 'manual' ? 'text-blue-600' : 'text-slate-400'}`} />
                            <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">Manual Pilot</h4>
                            <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">Direct Specification</p>
                        </button>
                    </div>
                </div>

                {strategy === 'manual' && (
                     <div className="space-y-2 animate-fade-in-up">
                        <label className={labelClass}>Commodities to Analyze</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={isListening && activeField === 'selectedItems' && !transcript ? t('listening') : selectedItems} 
                                onChange={e => setSelectedItems(e.target.value)} 
                                className={`${inputClass} pr-14 ${isListening && activeField === 'selectedItems' && !transcript ? 'text-emerald-500 italic animate-pulse' : ''}`} 
                                placeholder="e.g. Wheat, Basmati, Chickpeas" 
                            />
                             {hasRecognitionSupport && (
                                <button onClick={() => handleMicClick('selectedItems', selectedItems)} className={`absolute top-1/2 -translate-y-1/2 right-2 p-2.5 rounded-full transition-all ${isListening && activeField === 'selectedItems' ? 'bg-red-500 text-white shadow-xl scale-110' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                                    <MicrophoneIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                <button onClick={handleGenerate} disabled={isGenerating} className={`w-full bg-gradient-to-r ${btnGradient} text-white font-black uppercase tracking-[0.2em] py-5 rounded-3xl shadow-2xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex justify-center items-center gap-4 text-sm`}>
                    {isGenerating ? <><Spinner /> Synchronizing...</> : <><SparklesIcon className="w-6 h-6" /> Architect Plan</>}
                </button>
            </div>
        </div>
    );
  };

  const renderList = () => {
    const repoGradient = isCrops ? 'from-emerald-600 to-teal-400' : 'from-rose-600 to-pink-400';
    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-32">
            <div className="flex items-center gap-6">
              <button onClick={onBack} className="p-3 rounded-full bg-white dark:bg-slate-900 shadow-xl border dark:border-white/5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-all"><ArrowLeftIcon className="w-6 h-6" /></button>
              <div>
                  <h2 className={`text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${repoGradient}`}>Plan Repository</h2>
                  <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mt-1">Archived Intelligence & Roadmaps</p>
              </div>
            </div>

            <button onClick={() => setView('create')} className="w-full group relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-1.5 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] hover:shadow-emerald-500/20 transition-all duration-700 hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-r ${isCrops ? 'from-emerald-800 to-teal-700' : 'from-rose-800 to-pink-700'} opacity-40 group-hover:opacity-60 transition-opacity`}></div>
                <div className="relative h-full bg-slate-950/40 backdrop-blur-xl rounded-[2.2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-left">
                      <h3 className="text-3xl font-black text-white tracking-tighter mb-2">Architect New Strategy</h3>
                      <p className="text-emerald-200/60 font-bold uppercase tracking-widest text-[10px]">Deploy Generative AI for Growth Simulation</p>
                    </div>
                    <div className="bg-white text-slate-900 rounded-full w-20 h-20 flex items-center justify-center font-black text-4xl shadow-[0_0_40px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-500">+</div>
                </div>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedPlans.length === 0 ? (
                    <div className="col-span-full py-32 text-center bg-white/20 dark:bg-slate-900/30 backdrop-blur-md rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-white/5">
                        <span className="text-7xl block mb-6 opacity-20">📡</span>
                        <h3 className="text-2xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Repository Empty</h3>
                        <p className="text-slate-500 dark:text-slate-600 mt-2 font-bold">Initiate Plan Generation to populate data nodes.</p>
                    </div>
                ) : (
                    savedPlans.map(plan => (
                        <div key={plan.id} className="glass-card rounded-[2.5rem] shadow-2xl overflow-hidden hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 cursor-pointer group flex flex-col h-full" onClick={() => { setCurrentPlan(plan); setGeneratedImage(plan.imageUrl || null); setView('report'); }}>
                            <div className="h-56 relative overflow-hidden">
                                {plan.imageUrl ? <img src={plan.imageUrl} alt="Plan" className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" /> : <div className="w-full h-full bg-emerald-950 flex items-center justify-center opacity-40"><span className="text-6xl">📊</span></div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                                <div className="absolute bottom-5 left-5 right-5">
                                    <h3 className="font-black text-white text-xl tracking-tight leading-tight line-clamp-2">{plan.report.title}</h3>
                                </div>
                                <div className="absolute top-5 right-5"><span className="text-[8px] font-black uppercase tracking-widest px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-full">{plan.mode}</span></div>
                            </div>
                            <div className="p-6 flex-grow">
                                <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                    <span>{new Date(plan.timestamp).toLocaleDateString()}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span className="truncate">{plan.details.location}</span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-3 leading-relaxed">{plan.report.executiveSummary.replace(/<[^>]*>/g, '').substring(0, 120)}...</p>
                            </div>
                            <div className="p-5 border-t border-white/10 dark:border-white/5 flex justify-between items-center bg-white/10 dark:bg-slate-800/20">
                                 <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Deploy Strategy &rarr;</span>
                                 <button onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }} className="text-slate-300 hover:text-red-500 transition-colors p-2"><TrashIcon className="w-5 h-5"/></button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
  };

  const renderReport = () => {
      if (!currentPlan) return null;
      const report = currentPlan.report as any;
      const isDynamic = Array.isArray(report.timeline);
      
      let timelineItems: any[] = [];
      if (isDynamic) {
          timelineItems = report.timeline.map((item: any) => ({ label: item.title, duration: item.duration }));
          timelineItems.push({ label: 'Year 1' }, { label: 'Year 3' }, { label: 'Year 5' });
      } else {
          timelineItems = [{ label: 'Q1' }, { label: 'Q2' }, { label: 'Year 1' }, { label: 'Year 3' }, { label: 'Year 5' }];
      }

      const sectionHeaderColor = isCrops ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400';

      return (
          <div className="max-w-5xl mx-auto pb-32 animate-fade-in printable-content">
              <style>{`
                @media print {
                    body * { visibility: hidden; }
                    .printable-content, .printable-content * { visibility: visible; }
                    .printable-content { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                    .print-only { display: block !important; }
                    .content-section { page-break-inside: avoid; margin-bottom: 40px; }
                    * { -webkit-print-color-adjust: exact !important; }
                }
                .print-only { display: none; }
              `}</style>
              
              <DeepDiveModal isOpen={showDeepDive} onClose={() => setShowDeepDive(false)} context={translatedContent} title={timelineItems[activeTimelineIndex]?.label || 'Section'} language={language} t={t} />

              {/* INTERACTIVE CONTROLS - HIDDEN ON PRINT */}
              <div className="flex justify-between items-center mb-8 no-print px-2">
                  <button onClick={() => setView('list')} className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors group">
                      <ArrowLeftIcon className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Vault
                  </button>
                  <div className="flex gap-3">
                     <button 
                        onClick={handleSavePlan} 
                        disabled={isSavingPlan}
                        className="bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 border dark:border-white/10 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition shadow-sm disabled:opacity-50 flex items-center gap-2"
                     >
                        {isSavingPlan ? <Spinner appMode="crops" /> : 'Secure Plan'}
                     </button>
                     <button onClick={() => window.print()} className="bg-emerald-800 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95">PDF Export (Full Plan)</button>
                  </div>
              </div>

              {/* COVER PAGE / HEADER SECTION */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] mb-12 bg-slate-900 text-white min-h-[450px] group border-4 border-white/5 content-section">
                  {generatedImage ? <img src={generatedImage} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[5s]" /> : <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="relative p-10 md:p-16 z-10 flex flex-col h-full justify-end">
                      <span className="inline-block px-4 py-1.5 bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full mb-6 w-fit">Validated Strategy</span>
                      <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none tracking-tighter drop-shadow-2xl">{currentPlan.report.title}</h1>
                      <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest text-slate-300">
                          <span className="flex items-center gap-2">📍 {user.location}</span>
                          <span className="flex items-center gap-2">📅 {new Date(currentPlan.timestamp).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-10 p-8 bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl max-w-4xl print:bg-white print:text-black">
                          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-emerald-400 flex items-center gap-3"><SparklesIcon className="w-4 h-4"/> Executive Insight</h3>
                          <div className="text-sm md:text-lg leading-relaxed text-emerald-50 print:text-emerald-900 font-bold opacity-90 drop-shadow-sm" dangerouslySetInnerHTML={{ __html: currentPlan.report.executiveSummary }} />
                      </div>
                  </div>
              </div>

              {/* TIMELINE TABS - HIDDEN ON PRINT */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12 no-print py-4">
                  {timelineItems.map((tf: any, index: number) => {
                      const isActive = activeTimelineIndex === index;
                      const colors = ['bg-blue-600', 'bg-indigo-600', 'bg-purple-600', 'bg-pink-600', 'bg-emerald-600'];
                      const color = colors[index % colors.length];
                      return (
                      <button key={index} onClick={() => { setActiveTimelineIndex(index); stopSpeak(); }} className={`relative w-24 h-24 md:w-32 md:h-32 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 ${isActive ? `${color} text-white scale-110 shadow-2xl ring-4 ring-offset-4 ring-offset-slate-50 dark:ring-offset-slate-950` : 'bg-white dark:bg-slate-900 text-slate-500 hover:scale-105 border border-slate-100 dark:border-white/5 shadow-lg'}`}>
                          <span className="text-[10px] font-black uppercase tracking-widest text-center px-2 z-10">{tf.label}</span>
                          {isActive && <div className="absolute inset-0 bg-white/20 rounded-[2rem] animate-pulse"></div>}
                      </button>
                  )})}
              </div>

              {/* INTERACTIVE REPORT VIEW - HIDDEN ON PRINT */}
              <div className="glass-card rounded-[3rem] shadow-2xl overflow-hidden min-h-[600px] relative no-print">
                  <div className={`h-2.5 w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent animate-shimmer opacity-50`}></div>
                  <div ref={reportContentRef} className="px-8 py-10 md:px-14 md:py-12 border-b border-white/10 dark:border-white/5 flex justify-between items-center bg-white/10 dark:bg-slate-800/20 scroll-mt-24">
                      <div>
                        <h2 className={`text-3xl font-black ${sectionHeaderColor} tracking-tighter uppercase`}>{timelineItems[activeTimelineIndex]?.label}</h2>
                        {timelineItems[activeTimelineIndex]?.duration && <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{timelineItems[activeTimelineIndex].duration} Window</p>}
                      </div>
                      <div className="flex gap-4">
                           {!isSpeaking ? <button onClick={() => handleReadAloud(translatedContent)} className="p-4 rounded-full glass-btn shadow-xl hover:scale-110 transition-transform active:scale-95"><SpeakerWaveIcon className="w-6 h-6 text-slate-700 dark:text-emerald-400"/></button> : <button onClick={stopSpeak} className="p-4 rounded-full bg-red-600 shadow-xl animate-pulse"><StopIcon className="w-6 h-6 text-white"/></button>}
                      </div>
                  </div>
                  
                  <div className="p-8 md:p-14 overflow-hidden">
                    {isTranslatingContent ? (
                        <div className="flex flex-col items-center justify-center py-32">
                            <Spinner />
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-6">Decoding Node...</p>
                        </div>
                    ) : (
                        <div 
                            key={activeTimelineIndex} 
                            className="prose prose-lg max-w-none text-emerald-950 dark:text-emerald-50 animate-fade-in break-words overflow-visible
                                [&>h3]:text-2xl [&>h3]:font-black [&>h3]:mt-10 [&>h3]:mb-6 [&>h3]:uppercase [&>h3]:tracking-wider
                                [&>h3]:text-emerald-700 [&>h3]:dark:text-emerald-300
                                [&>ul]:space-y-4 [&>ul]:my-8 [&>ul]:list-none [&>ul]:p-0
                                [&>li]:flex [&>li]:flex-col sm:[&>li]:flex-row [&>li]:items-start [&>li]:gap-4 [&>li]:bg-emerald-50/30 [&>li]:dark:bg-emerald-950/20 [&>li]:p-5 sm:[&>li]:p-6 [&>li]:rounded-3xl [&>li]:border [&>li]:border-emerald-100/50 [&>li]:dark:border-emerald-500/10 [&>li]:overflow-hidden [&>li]:break-words
                                [&>p]:leading-relaxed [&>p]:mb-6 [&>p]:font-bold [&>p]:text-emerald-900 [&>p]:dark:text-emerald-100 [&>p]:break-words
                                [&>strong]:text-blue-700 [&>strong]:dark:text-blue-400 [&>strong]:font-black
                                [&>table]:block [&>table]:w-full [&>table]:overflow-x-auto [&>table]:border-collapse [&>table]:my-10 [&>table]:rounded-[1.5rem] [&>table]:bg-white [&>table]:dark:bg-slate-950 [&>table]:shadow-2xl
                                [&>table>thead]:bg-emerald-600 [&>table>thead]:dark:bg-emerald-800 [&>table>thead>tr>th]:p-5 [&>table>thead>tr>th]:font-black [&>table>thead>tr>th]:uppercase [&>table>thead>tr>th]:text-[10px] [&>table>thead>tr>th]:tracking-widest [&>table>thead>tr>th]:text-white
                                [&>table>tbody>tr>td]:p-5 [&>table>tbody>tr>td]:border-b [&>table>tbody>tr>td]:dark:border-white/5 [&>table>tbody>tr>td]:text-sm [&>table>tbody>tr>td]:font-black [&>table>tbody>tr>td]:text-emerald-900 [&>table>tbody>tr>td]:dark:text-emerald-100
                            " 
                            dangerouslySetInnerHTML={{ __html: translatedContent }} 
                        />
                    )}
                    <button onClick={() => setShowDeepDive(true)} className="mt-12 w-full py-6 rounded-3xl border-4 border-dashed border-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all no-print shadow-inner">Insight Deep Dive</button>
                  </div>
              </div>

              {/* FULL COMPREHENSIVE VIEW - VISIBLE ONLY ON PRINT */}
              <div className="print-only">
                  <div className="space-y-16">
                      {report.timeline?.map((phase: any, idx: number) => (
                          <div key={idx} className="content-section p-10 bg-slate-50 rounded-[3rem] border-2 border-slate-200">
                              <h2 className="text-4xl font-black text-emerald-800 uppercase tracking-tighter mb-8 border-b-4 border-emerald-500 pb-4">{phase.title}</h2>
                              <div className="prose prose-xl max-w-none text-emerald-950
                                    [&>h3]:text-2xl [&>h3]:font-black [&>h3]:mt-10 [&>h3]:mb-6 [&>h3]:uppercase
                                    [&>ul]:space-y-4 [&>ul]:my-8 [&>ul]:list-none [&>ul]:p-0
                                    [&>li]:bg-white [&>li]:p-6 [&>li]:rounded-3xl [&>li]:border [&>li]:border-emerald-100
                                    [&>p]:font-bold [&>p]:text-emerald-900
                                    [&>table]:w-full [&>table]:border-collapse [&>table]:my-10 [&>table]:rounded-[1.5rem] [&>table]:bg-white
                                    [&>table>thead]:bg-emerald-600 [&>table>thead>tr>th]:p-5 [&>table>thead>tr>th]:text-white
                              " dangerouslySetInnerHTML={{ __html: phase.content }} />
                          </div>
                      ))}
                      
                      {report.longTerm && (
                          <div className="content-section p-10 bg-blue-50 rounded-[3rem] border-2 border-blue-200">
                               <h2 className="text-4xl font-black text-blue-800 uppercase tracking-tighter mb-8 border-b-4 border-blue-500 pb-4">Long Term Milestones</h2>
                               <div className="grid grid-cols-1 gap-10">
                                   <div className="p-8 bg-white rounded-3xl border border-blue-100">
                                       <h3 className="text-xl font-black text-blue-600 uppercase mb-4">12 Month Target</h3>
                                       <div className="prose text-blue-900" dangerouslySetInnerHTML={{ __html: report.longTerm.year1 }} />
                                   </div>
                                   <div className="p-8 bg-white rounded-3xl border border-blue-100">
                                       <h3 className="text-xl font-black text-blue-600 uppercase mb-4">36 Month Target</h3>
                                       <div className="prose text-blue-900" dangerouslySetInnerHTML={{ __html: report.longTerm.year3 }} />
                                   </div>
                                   <div className="p-8 bg-white rounded-3xl border border-blue-100">
                                       <h3 className="text-xl font-black text-blue-600 uppercase mb-4">60 Month Target</h3>
                                       <div className="prose text-blue-900" dangerouslySetInnerHTML={{ __html: report.longTerm.year5 }} />
                                   </div>
                               </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans text-slate-900 dark:text-slate-100">
        <div className="container mx-auto px-4 py-8">
            {view === 'list' && renderList()}
            {view === 'create' && (
                <>
                    <button onClick={() => setView('list')} className="mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center transition-colors"><ArrowLeftIcon className="w-4 h-4 mr-2"/> Return to Vault</button>
                    {isGenerating ? <EngagingLoader t={t} /> : renderInputForm()}
                </>
            )}
            {view === 'report' && renderReport()}
        </div>
    </div>
  );
};

export default BusinessPlanScreen;
