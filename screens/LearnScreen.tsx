
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { LessonTopic, LearnResponse, AppMode } from '../types';
import { generateImageForQuery, translateText, ENGAGING_INSTRUCTION } from '../services/geminiService';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { CameraIcon } from '../components/icons/CameraIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { SpeakerWaveIcon } from '../components/icons/SpeakerWaveIcon';
import { StopIcon } from '../components/icons/StopIcon';
import { useGenAITTS } from '../hooks/useGenAITTS';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { learnContentData, TopicDetail, QuizQuestion } from '../utils/learnContentData';
import { fileToBase64 } from '../utils/fileUtils';
import * as firebaseService from '../services/firebaseService';

interface LearnScreenProps {
    language: string;
    locationName: string;
    userContext: string;
    t: (key: string) => string;
    appMode: AppMode;
}

const cropTopics: LessonTopic[] = [
    { id: 'soil', title: 'Soil Health', emoji: '🌱', interactive: true },
    { id: 'pest', title: 'Pest Control', emoji: '🐛', interactive: true },
    { id: 'water', title: 'Watering Tips', emoji: '💧', interactive: false },
    { id: 'harvest', title: 'Harvesting', emoji: '🌾', interactive: false },
];

const animalTopics: LessonTopic[] = [
    { id: 'nutrition', title: 'Animal Nutrition', emoji: '🥣', interactive: true },
    { id: 'breeding', title: 'Breeding', emoji: '🧬', interactive: false },
    { id: 'disease', title: 'Animal Disease Prevention', emoji: '🛡️', interactive: true },
    { id: 'shelter', title: 'Shelter Management', emoji: '🏠', interactive: false },
];

const ScannerOverlay = ({ mode }: { mode: AppMode }) => (
    <div className={`absolute inset-0 z-10 pointer-events-none rounded-3xl overflow-hidden border-2 ${mode === 'crops' ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${mode === 'crops' ? 'bg-emerald-400' : 'bg-rose-400'} shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan`}></div>
        <div className={`absolute inset-0 ${mode === 'crops' ? 'bg-emerald-950/20' : 'bg-rose-950/20'} animate-pulse`}></div>
        <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="inline-block bg-black/60 text-white text-[8px] px-3 py-1 rounded-full backdrop-blur-sm animate-bounce font-black uppercase tracking-widest">Expert Synthesis</span>
        </div>
    </div>
);

const LearnScreen: React.FC<LearnScreenProps> = ({ language, locationName, userContext, t, appMode }) => {
    const isCropsMode = appMode === 'crops';
    const topics = isCropsMode ? cropTopics : animalTopics;
    
    const primaryBtnClass = isCropsMode ? 'bg-emerald-800 hover:bg-emerald-700' : 'bg-rose-800 hover:bg-rose-700';
    const linkTextClass = isCropsMode ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400';
    const quizSelectedClass = isCropsMode ? 'bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500' : 'bg-rose-950/40 border-rose-500 ring-2 ring-rose-500';
    const quizIconColor = isCropsMode ? 'text-emerald-500' : 'text-pink-500';
    const speakerBgClass = isCropsMode ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-800 hover:bg-rose-100 dark:bg-rose-950 dark:text-rose-400';
    const sendBtnClass = isCropsMode ? 'bg-emerald-700 hover:bg-emerald-600' : 'bg-rose-700 hover:bg-rose-600';
    const placeholderColor = isCropsMode ? 'placeholder-emerald-300 text-emerald-500' : 'placeholder-rose-300 text-rose-500';

    const [activeTopic, setActiveTopic] = useState<LessonTopic | null>(null);
    const [topicIntro, setTopicIntro] = useState<{ why: string; how: string; example: string } | null>(null);
    const [isTranslatingIntro, setIsTranslatingIntro] = useState(false);

    const [isQuestionLoading, setIsQuestionLoading] = useState<boolean>(false);
    const [isVisualLoading, setIsVisualLoading] = useState<boolean>(false);
    const [question, setQuestion] = useState('');
    const [learnResponse, setLearnResponse] = useState<(LearnResponse & { isRelevant?: boolean; isHealthy?: boolean }) | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    
    const [showQuiz, setShowQuiz] = useState(false);
    const [isQuizTransitioning, setIsQuizTransitioning] = useState(false);
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);
    
    const { speak, stop: stopSpeak, isSpeaking } = useGenAITTS();
    const resultRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Requirement: Scroll to generated content
    useEffect(() => {
        if (learnResponse && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [learnResponse]);

    // Requirement: Scroll to top when entering a topic
    useEffect(() => {
        if (activeTopic) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [activeTopic]);

    useEffect(() => {
        if (activeTopic) {
            const data = learnContentData[activeTopic.id];
            if (!data) return;

            const runTranslation = async () => {
                if (language === 'English') {
                    setTopicIntro(data.intro);
                    setQuizQuestions(data.quiz);
                    return;
                }
                
                setIsTranslatingIntro(true);
                try {
                    const [why, how, example] = await Promise.all([
                        translateText(data.intro.why, language),
                        translateText(data.intro.how, language),
                        translateText(data.intro.example, language)
                    ]);
                    setTopicIntro({ why, how, example });
                    setQuizQuestions(data.quiz);
                } catch (e) {
                    setTopicIntro(data.intro);
                    setQuizQuestions(data.quiz);
                } finally {
                    setIsTranslatingIntro(false);
                }
            };
            runTranslation();
        }
    }, [activeTopic, language]);

    const handleTopicClick = (topic: LessonTopic) => {
        setActiveTopic(topic);
        handleRemoveMedia();
    };

    const handleBackToTopics = () => {
        setActiveTopic(null);
        setTopicIntro(null);
        setLearnResponse(null);
        setShowQuiz(false);
        stopSpeak();
        handleRemoveMedia();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setMediaFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setMediaPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveMedia = () => {
        setMediaFile(null);
        setMediaPreview(null);
        setLearnResponse(null);
        setGeneratedImage(null);
        setIsVisualLoading(false);
    };

    const getLearnAdvice = useCallback(async () => {
        if (!question.trim() && !mediaFile) return;
        setIsQuestionLoading(true);
        setLearnResponse(null);
        setGeneratedImage(null);
        stopSpeak();
        
        try {
            const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
            const schema = {
                type: Type.OBJECT,
                properties: {
                    isRelevant: { type: Type.BOOLEAN },
                    isHealthy: { type: Type.BOOLEAN },
                    brief: { type: Type.STRING },
                    detailed: { type: Type.STRING },
                    imageQuery: { type: Type.STRING },
                },
                required: ['brief', 'detailed', 'isRelevant', 'isHealthy'],
            };
            
            const parts: any[] = [];
            
            if (mediaFile) {
                const base64Data = await fileToBase64(mediaFile);
                parts.push({ inlineData: { mimeType: mediaFile.type, data: base64Data } });
            }

            const promptText = `
                ${ENGAGING_INSTRUCTION}
                ROLE: Advanced Agricultural AI Tutor. 
                TOPIC: Teaching about "${activeTopic?.title}". 
                CONTEXT: User query: "${question || 'Analyze visual status.'}". 
                
                MANDATORY RULES:
                1. FORMAT: "detailed" MUST be VIBRANT RICH HTML.
                2. QUALITY: Provide actionable technical knowledge.
                Language: ${language}.
            `;
            
            parts.push({ text: promptText });

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: { parts: parts },
                config: { responseMimeType: 'application/json', responseSchema: schema },
            });

            const responseData = JSON.parse(response.text.trim()) as LearnResponse & { isRelevant: boolean; isHealthy: boolean };
            setLearnResponse(responseData);

            if (responseData.isRelevant && responseData.imageQuery && !mediaFile) {
                setIsVisualLoading(true);
                const processVisual = async (query: string) => {
                    const cached = await firebaseService.getLearnImage(query);
                    if (cached) {
                        setGeneratedImage(cached);
                        setIsVisualLoading(false);
                        return;
                    }

                    try {
                        const base64 = await generateImageForQuery(query);
                        if (base64) {
                            const publicUrl = await firebaseService.saveLearnImage(query, base64);
                            setGeneratedImage(publicUrl);
                        }
                    } catch (e) {
                        console.error("Visual synthesis failed", e);
                    } finally {
                        setIsVisualLoading(false);
                    }
                };
                processVisual(responseData.imageQuery);
            }
        } catch (e) {
            console.error("Learn advice generation failed:", e);
        } finally {
            setIsQuestionLoading(false);
        }
    }, [question, activeTopic, language, mediaFile, stopSpeak]);

    const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(
        languageConfig[language]?.code || 'en-US', 
        () => getLearnAdvice()
    ); 

    useEffect(() => {
        if (isListening) setQuestion(transcript);
    }, [transcript, isListening]);

    useEffect(() => {
        if (mediaFile && !isQuestionLoading && !learnResponse) {
            getLearnAdvice();
        }
    }, [mediaFile]);

    const handleMicClick = () => {
        if (isListening) stopListening();
        else startListening();
    };

    const handleOpenQuiz = () => {
        setIsQuizTransitioning(true);
        setTimeout(() => {
            setShowQuiz(true);
            setIsQuizTransitioning(false);
            setCurrentQuestionIndex(0);
            setUserAnswers({});
            setQuizResult(null);
        }, 150);
    };

    const renderQuiz = () => {
        if (quizResult) {
            const isPassed = quizResult.score / quizResult.total >= 0.7;
            return (
                <Card className="animate-pop-in border-4 border-dashed border-emerald-500/30">
                    <div className="text-center py-8 space-y-4">
                        {isPassed ? <CheckCircleIcon className={`w-20 h-20 ${quizIconColor} mx-auto`} /> : <XCircleIcon className="w-16 h-16 text-red-500 mx-auto" />}
                        <h3 className="text-2xl font-black uppercase tracking-tight">{t('quizResultTitle')}</h3>
                        <p className="font-bold text-lg">{t('quizScore').replace('{score}', String(quizResult.score)).replace('{total}', String(quizResult.total))}</p>
                        <button onClick={() => {setShowQuiz(false); setQuizResult(null);}} className="bg-slate-100 dark:bg-slate-800 font-black uppercase text-[10px] py-3 px-8 rounded-xl transition-colors">{t('backToLesson')}</button>
                    </div>
                </Card>
            );
        }
        const currentQuestion = quizQuestions[currentQuestionIndex];
        return (
            <Card title={`${t('quiz')} - ${t(activeTopic?.title as any)}`}>
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    </div>
                    <p className="font-black text-xl leading-tight text-slate-800 dark:text-slate-100">{t(currentQuestion.question)}</p>
                    <div className="space-y-3">
                        {currentQuestion.options.map(option => (
                            <button 
                                key={option} 
                                onClick={() => setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }))} 
                                className={`w-full text-left p-5 rounded-2xl border-2 transition-all ${userAnswers[currentQuestionIndex] === option ? quizSelectedClass : 'glass-card border-slate-100 dark:border-white/5 shadow-sm'}`}
                            >
                                <span className={`font-bold ${userAnswers[currentQuestionIndex] === option ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{t(option)}</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => { 
                        if (currentQuestionIndex < quizQuestions.length - 1) {
                            setCurrentQuestionIndex(prev => prev + 1);
                        } else { 
                            let score = 0; 
                            quizQuestions.forEach((q, i) => { 
                                if (userAnswers[i]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
                                    score++;
                                }
                            }); 
                            setQuizResult({ score, total: quizQuestions.length }); 
                        } 
                    }} disabled={!userAnswers[currentQuestionIndex]} className={`w-full ${primaryBtnClass} text-white font-black uppercase py-4 rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50`}>
                        {currentQuestionIndex < quizQuestions.length - 1 ? t('nextQuestion') : t('finishQuiz')}
                    </button>
                </div>
            </Card>
        );
    };

    const renderTopicContent = () => {
        if (!activeTopic) return null;
        if (showQuiz) return ( <div className="space-y-6 animate-fade-in-up"><button onClick={() => setShowQuiz(false)} className={`text-[10px] font-black uppercase tracking-widest ${linkTextClass} hover:underline flex items-center gap-1`}><ArrowLeftIcon className="w-4 h-4" />{t('backToLesson')}</button>{renderQuiz()}</div> );

        return (
            <div className="space-y-8 animate-fade-in-up">
                <button onClick={handleBackToTopics} className={`text-[10px] font-black uppercase tracking-widest ${linkTextClass} hover:underline flex items-center gap-1 transition-transform hover:-translate-x-1`}><ArrowLeftIcon className="w-4 h-4" />{t('backToTopics')}</button>
                
                <div className="text-center">
                    <div className="text-7xl mb-2 drop-shadow-2xl">{activeTopic.emoji}</div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t(activeTopic.title as any)}</h2>
                </div>

                <Card className={`border-t-8 ${isCropsMode ? 'border-emerald-600' : 'border-rose-600'} dark:bg-slate-900/60 dark:border-white/5 relative overflow-hidden`}>
                    <div className="flex items-center gap-2 mb-4">
                        <SparklesIcon className={`w-5 h-5 ${isCropsMode ? 'text-emerald-500' : 'text-rose-500'} animate-pulse`}/><h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isCropsMode ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-800 dark:text-rose-400'}`}>Expert Introduction</h3>
                    </div>
                    {isTranslatingIntro ? <div className="py-12 flex flex-col items-center justify-center gap-2"><Spinner /><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Translating Lesson...</p></div> : topicIntro && (
                        <div className="space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Core Insight</h4>
                                <p className="text-lg font-bold text-slate-700 dark:text-slate-200 leading-relaxed">{topicIntro.why}</p>
                            </div>
                            <div className={`${isCropsMode ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/30' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/30'} p-5 rounded-2xl border`}>
                                <h4 className={`text-[10px] font-black uppercase ${isCropsMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'} mb-2 tracking-widest`}>Real World Example</h4>
                                <p className={`text-xl font-black italic ${isCropsMode ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>"{topicIntro.example}"</p>
                            </div>
                            <div className="flex flex-col sm:flex-row justify-start gap-4 pt-4">
                                {!isSpeaking ? <button onClick={() => speak(`${topicIntro.why} ${topicIntro.how}. Example: ${topicIntro.example}`, language)} className={`flex items-center gap-2 px-6 py-3 rounded-full ${speakerBgClass} transition-colors font-black uppercase text-[10px] shadow-sm`}><SpeakerWaveIcon className="w-4 h-4" /><span>Listen Intro</span></button> : <button onClick={stopSpeak} className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-100 text-red-600 animate-pulse font-black uppercase text-[10px] shadow-sm"><StopIcon className="w-4 h-4" /><span>Stop</span></button>}
                                <button 
                                    onClick={handleOpenQuiz} 
                                    className={`bg-blue-600 text-white font-black uppercase text-[10px] px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95`}
                                >
                                    🎓 Test Knowledge
                                </button>
                            </div>
                        </div>
                    )}
                </Card>

                {activeTopic.interactive && (
                    <div className="flex flex-col items-center justify-center p-8 glass-card rounded-[3rem] shadow-2xl relative overflow-hidden min-h-[380px] w-full">
                        {mediaPreview ? (
                            <div className="relative group w-full flex justify-center px-6">
                                {isQuestionLoading && <ScannerOverlay mode={appMode} />}
                                <img src={mediaPreview} alt="Interactive Source" className={`h-64 rounded-[2rem] shadow-2xl object-cover border-4 ${isCropsMode ? 'border-emerald-500/30' : 'border-rose-500/30'}`} />
                                <button onClick={handleRemoveMedia} className="absolute -top-4 -right-4 bg-red-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-90 z-20"><XCircleIcon className="w-8 h-8"/></button>
                            </div>
                        ) : (
                            <div className="w-full max-w-xs text-center space-y-6 animate-fade-in-up">
                                <div className="flex justify-center">
                                    <div className="p-6 bg-white/20 dark:bg-slate-800/20 rounded-full border border-white/10 dark:border-white/5">
                                        <CameraIcon className="w-20 h-20 text-slate-400 dark:text-slate-500" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`w-full ${isCropsMode ? 'bg-[#10b981] hover:bg-[#059669]' : 'bg-[#e11d48] hover:bg-[#be123c]'} text-white font-black py-4 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm`}
                                    >
                                        UPLOAD PHOTO
                                    </button>
                                    <input type="file" ref={fileInputRef} className="sr-only" accept="image/*" onChange={handleFileChange} />

                                    <button 
                                        onClick={() => cameraInputRef.current?.click()}
                                        className="w-full glass-btn text-slate-800 dark:text-white font-black py-4 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm"
                                    >
                                        TAKE PHOTO
                                    </button>
                                    <input type="file" ref={cameraInputRef} className="sr-only" accept="image/*" capture="environment" onChange={handleFileChange} />
                                </div>

                                <p className="text-[#334155]/60 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] leading-relaxed">
                                    {activeTopic.id === 'soil' ? t('soilPhotoPrompt') : 
                                    activeTopic.id === 'pest' ? t('pestPhotoPrompt') :
                                    activeTopic.id === 'nutrition' ? t('nutritionPhotoPrompt') :
                                    t('diseasePhotoPrompt')}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <Card title={t('askAQuestion')} className="dark:bg-slate-900/60 dark:border-white/5">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-white/10 shadow-inner relative">
                        <div className="flex-grow relative">
                            <input
                                type="text"
                                value={isListening && !transcript ? t('listening') : question}
                                onChange={(e) => setQuestion(e.target.value)}
                                className={`w-full rounded-full pl-4 pr-12 py-3.5 bg-transparent outline-none text-sm font-black dark:text-white ${isListening && !transcript ? `italic animate-pulse ${placeholderColor}` : ''}`}
                                placeholder={activeTopic.id === 'soil' ? t('soilQuestionPlaceholder') : 
                                             activeTopic.id === 'pest' ? t('pestQuestionPlaceholder') :
                                             activeTopic.id === 'water' ? t('waterQuestionPlaceholder') :
                                             t('harvestQuestionPlaceholder')}
                                disabled={isQuestionLoading}
                            />
                             {hasRecognitionSupport && (
                                <button
                                    onClick={handleMicClick}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all shadow-md ${
                                        isListening
                                        ? 'bg-red-600 text-white animate-pulse scale-110'
                                        : 'bg-white dark:bg-slate-800 text-slate-500'
                                    }`}
                                >
                                    <MicrophoneIcon className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                        <button onClick={getLearnAdvice} disabled={isQuestionLoading || (!question.trim() && !mediaFile)} className={`${sendBtnClass} text-white p-3 rounded-xl shadow-xl transition-all active:scale-95 flex-shrink-0`}>
                            {isQuestionLoading ? <Spinner /> : <PaperAirplaneIcon className="w-6 h-6"/>}
                        </button>
                    </div>

                    {learnResponse && (
                        <div ref={resultRef} className="mt-6 animate-fade-in-up scroll-mt-24">
                            {learnResponse.isRelevant === false ? (
                                <div className="text-center py-10 px-6 bg-red-50 dark:bg-red-950/20 rounded-[2rem] border-2 border-dashed border-red-500/30">
                                    <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                    <h4 className="text-lg font-black text-red-700 dark:text-red-400 uppercase tracking-tight mb-2">Subject Mismatch</h4>
                                    <p className="text-sm text-red-600/70 dark:text-red-300/70 font-medium mb-8">The visual data provided does not match the topic "${t(activeTopic.title as any)}". Please re-upload a reliable photo for accurate analysis.</p>
                                    <button onClick={handleRemoveMedia} className="bg-red-600 text-white px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Retry Upload</button>
                                </div>
                            ) : (
                                <div className={`p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl overflow-hidden relative border-t-8 ${isCropsMode ? 'border-t-emerald-500' : 'border-t-rose-500'}`}>
                                    {isVisualLoading ? (
                                        <div className="w-full h-56 bg-slate-100 dark:bg-slate-900 rounded-3xl mb-8 flex flex-col items-center justify-center animate-pulse border-2 border-dashed border-slate-200 dark:border-white/5">
                                            <Spinner />
                                            <span className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Synthesizing Visual...</span>
                                        </div>
                                    ) : generatedImage && (
                                        <img src={generatedImage} alt="Visual Aid" className="w-full h-56 object-cover rounded-3xl mb-8 shadow-md" />
                                    )}
                                    
                                    <div className="flex flex-wrap gap-4 mb-8">
                                        <div className={`px-5 py-3 rounded-2xl border shadow-inner flex flex-col ${learnResponse.isHealthy ? 'bg-green-50 border-green-100 dark:bg-emerald-950/60' : 'bg-red-50 border-red-100 dark:bg-red-950/40'}`}>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Vitality status</span>
                                            <span className={`text-xl font-black ${learnResponse.isHealthy ? 'text-emerald-700' : 'text-red-700'}`}>{learnResponse.isHealthy ? 'Perfectly Healthy' : 'Observation Detected'}</span>
                                        </div>
                                    </div>

                                    <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed 
                                        [&>h3]:text-lg [&>h3]:font-black [&>h3]:uppercase [&>h3]:tracking-wider [&>h3]:mt-6
                                        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2" 
                                        dangerouslySetInnerHTML={{ __html: t(learnResponse.detailed) }} 
                                    />
                                    
                                    <div className="mt-8 pt-6 border-t dark:border-white/10 flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${isCropsMode ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`}></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Verified Insights</span>
                                        </div>
                                        {!isSpeaking ? (
                                            <button onClick={() => speak(t(learnResponse.brief) + ' ' + t(learnResponse.detailed).replace(/<[^>]*>/g, ' '), language)} className={`p-3 rounded-full ${speakerBgClass} transition-transform active:scale-90 shadow-sm`}>
                                                <SpeakerWaveIcon className="w-5 h-5" />
                                            </button>
                                        ) : (
                                            <button onClick={stopSpeak} className="p-3 rounded-full bg-red-600 text-white animate-pulse shadow-xl active:scale-90">
                                                <StopIcon className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        )
    };

    return (
        <div className="max-w-4xl mx-auto pb-48 px-2">
            {activeTopic ? renderTopicContent() : (
                <div className="space-y-8 animate-fade-in">
                    <div className="text-center">
                        <h2 className={`text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${isCropsMode ? 'from-emerald-700 to-teal-500' : 'from-rose-700 to-pink-500'}`}>
                          {t(isCropsMode ? 'learn' : 'husbandry')}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">{t(isCropsMode ? 'learnSubtitle' : 'husbandrySubtitle')}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {topics.map((topic) => (
                            <button key={topic.id} onClick={() => handleTopicClick(topic)} className="group glass-card p-8 rounded-[2.5rem] shadow-lg text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 active:scale-95 space-y-4 relative overflow-hidden flex flex-col items-center">
                                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${isCropsMode ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <span className="text-6xl block transform group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">{topic.emoji}</span>
                                <p className="font-black text-lg text-slate-900 dark:text-white leading-tight tracking-tighter">{t(topic.title as any)}</p>
                                <div className={`h-1.5 w-12 mx-auto rounded-full transition-all duration-500 ${isCropsMode ? 'bg-emerald-500 group-hover:w-20' : 'bg-rose-500 group-hover:w-20'}`}></div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearnScreen;
