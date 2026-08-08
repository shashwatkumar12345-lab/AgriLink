
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { User, AppMode } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import Spinner from './Spinner';
import { GoogleGenAI, Type } from '@google/genai';
import { SearchIcon } from './icons/SearchIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface FAQModalProps {
  isOpen: boolean;
  user: User;
  appMode: AppMode;
  t: (key: string) => string;
  language: string;
  onClose: () => void;
}

interface FAQResponse {
  brief: string;
  detailed: string;
}

const FAQModal: React.FC<FAQModalProps> = ({ isOpen, user, appMode, t, language, onClose }) => {
  const isFarmer = user.role === 'farmer';
  const [searchTerm, setSearchTerm] = useState('');
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<FAQResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');

  useEffect(() => {
    if (isListening) setUserInput(transcript);
  }, [transcript, isListening]);

  useEffect(() => {
    if (isOpen && !hasBeenOpened) {
      setHasBeenOpened(true);
    }
  }, [isOpen, hasBeenOpened]);

  const handleAskQuestion = useCallback(async () => {
    if (!userInput.trim()) return;
    setIsLoading(true); setAiResponse(null); setIsExpanded(false); setError('');
    try {
      const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
      const prompt = `AgriLink FAQ. Q: "${userInput}". Lang: ${language}. Return JSON {brief, detailed (HTML)}. Minimal overhead. Simple language.`;
      const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
          config: { 
            responseMimeType: 'application/json', 
            thinkingConfig: { thinkingBudget: 0 },
            responseSchema: { 
              type: Type.OBJECT, 
              properties: { brief: { type: Type.STRING }, detailed: { type: Type.STRING } }, 
              required: ['brief', 'detailed'] 
            } 
          }
      });
      setAiResponse(JSON.parse(response.text.trim()));
      setTimeout(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, 100);
    } catch (e) { setError('Sync jitter.'); } finally { setIsLoading(false); }
  }, [userInput, language]);

  if (!hasBeenOpened && !isOpen) return null;

  const farmerFaqs = [
    { category: 'faqCategoryGettingStarted', questions: [{ q: 'faq_f_q5', a: 'faq_f_a5' }, { q: 'faq_f_q7', a: 'faq_f_a7' }] },
    { category: 'faqCategoryAIFeatures', questions: [{ q: 'faq_f_q1', a: 'faq_f_a1' }, { q: 'faq_f_q3', a: 'faq_f_a3' }, { q: 'faq_f_q6', a: 'faq_f_a6' }, { q: 'faq_f_q8', a: 'faq_f_a8' }] },
    { category: 'faqCategoryExpertConsultation', questions: [{ q: 'faq_f_q2', a: 'faq_f_a2' }] },
    { category: 'faqCategoryAccount', questions: [{ q: 'faq_f_q4', a: 'faq_f_a4' }] }
  ];

  const consultantFaqs = [
    { category: 'faqCategoryCertifications', questions: [{ q: 'faq_c_q1', a: 'faq_c_a1' }, { q: 'faq_c_q2', a: 'faq_c_a2' }, { q: 'faq_c_q6', a: 'faq_c_a6' }, { q: 'faq_c_q7', a: 'faq_c_a7' }, { q: 'faq_c_q8', a: 'faq_c_a8' }] },
    { category: 'faqCategoryDashboard', questions: [{ q: 'faq_c_q3', a: 'faq_c_a3' }, { q: 'faq_c_q4', a: 'faq_c_a4' }, { q: 'faq_c_q5', a: 'faq_c_a5' }] }
  ];

  const allFaqs = isFarmer ? farmerFaqs : consultantFaqs;
  const filteredFaqs = allFaqs.map(category => ({
      ...category,
      questions: category.questions.filter(item => t(item.q).toLowerCase().includes(searchTerm.toLowerCase()) || t(item.a).toLowerCase().includes(searchTerm.toLowerCase())),
    })).filter(category => category.questions.length > 0);

  return (
    <>
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed top-0 right-0 w-full max-w-lg h-full bg-white dark:bg-gray-950 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b dark:border-white/10 bg-white dark:bg-gray-950 z-10">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest text-sm">{t('faqTitle')}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"><XCircleIcon className="w-6 h-6 text-gray-500"/></button>
        </div>
        <div ref={scrollRef} className="overflow-y-auto p-4 md:p-6 flex-grow bg-slate-50 dark:bg-slate-950/50 no-scrollbar">
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">{t(isFarmer ? 'faqFarmerTitle' : 'faqConsultantTitle')}</h3>
          <div className="relative mb-6">
            <input type="text" placeholder={t('faqSearchPlaceholder')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium shadow-sm" />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon className="w-5 h-5 text-slate-400" /></div>
          </div>
          <div className="space-y-6">
            {filteredFaqs.map(category => (
              <div key={category.category}>
                <h4 className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-3">{t(category.category)}</h4>
                <div className="space-y-3">
                  {category.questions.map(({ q, a }) => (
                    <details key={q} className="group bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-300">
                      <summary className="p-4 font-bold text-slate-800 dark:text-slate-200 cursor-pointer flex justify-between items-center select-none group-open:bg-slate-50 dark:group-open:bg-slate-800/50">
                        <span className="pr-4">{t(q)}</span><span className="text-emerald-500 transition-transform group-open:rotate-45 text-2xl font-light leading-none">+</span>
                      </summary>
                      <div className="px-4 pb-4 pt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {a === 'faq_f_a4' ? t(a).replace('{userName}', user.name) : a === 'faq_f_a8' ? t(a).replace('{userLocation}', `${user.location}, ${user.state}`).replace('{userSoilType}', user.soilType || t('notSet')).replace('{userCrops}', user.primaryCrops || t('notSet')) : t(a)}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {(aiResponse || isLoading || error) && (
              <div className="mt-8 pt-6 border-t dark:border-white/10 animate-fade-in pb-12">
                  <div className="flex items-center gap-2 mb-4"><SparklesIcon className="w-5 h-5 text-yellow-500 animate-pulse" /><h4 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.3em]">Rapid Support AI</h4></div>
                  {isLoading ? (<div className="flex justify-center p-8"><Spinner /></div>) : error ? (<div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl text-red-600 text-[10px] font-black uppercase text-center">{error}</div>) : aiResponse ? (
                      <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 shadow-md overflow-hidden animate-pop-in">
                          <div className="p-5"><p className="font-black text-slate-800 dark:text-emerald-100 leading-tight">{aiResponse.brief}</p></div>
                          <div className="bg-white/50 dark:bg-white/5 border-t border-emerald-100 dark:border-white/5">
                              <button onClick={() => setIsExpanded(!isExpanded)} className="w-full p-4 flex items-center justify-between text-emerald-700 dark:text-emerald-400 font-black uppercase tracking-widest text-[9px] hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                  <span>{isExpanded ? 'Hide Details' : 'View Breakdown'}</span><ChevronDownIcon className={`w-4 h-4 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                              {isExpanded && (<div className="p-5 pt-0 text-sm text-slate-600 dark:text-slate-300 animate-fade-in-down prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: aiResponse.detailed }} />)}
                          </div>
                      </div>
                  ) : null}
              </div>
          )}
        </div>
        <div className="p-4 border-t dark:border-white/10 bg-white dark:bg-gray-950 shadow-2xl">
            <div className="relative group flex gap-2">
              <textarea value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAskQuestion())} placeholder="Quick question..." rows={1} className="flex-grow rounded-2xl border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 p-4 resize-none text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium dark:text-white" disabled={isLoading} />
              {hasRecognitionSupport && (
                  <button onClick={() => isListening ? stopListening() : startListening()} className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-emerald-600'}`}>
                      <MicrophoneIcon className="w-5 h-5"/>
                  </button>
              )}
              <button onClick={handleAskQuestion} disabled={isLoading || !userInput.trim()} className="p-4 bg-emerald-600 text-white rounded-2xl active:scale-90 transition-all shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
              </button>
            </div>
        </div>
      </div>
    </>
  );
};

export default FAQModal;
