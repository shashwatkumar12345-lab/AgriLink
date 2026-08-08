

import React, { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { GoogleGenAI, Content, Type } from '@google/genai';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { AppMode, ChatMessage } from '../types';
import { generateImageForQuery, ENGAGING_INSTRUCTION } from '../services/geminiService';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { SpeakerWaveIcon } from '../components/icons/SpeakerWaveIcon';
import { StopIcon } from '../components/icons/StopIcon';
import { useGenAITTS } from '../hooks/useGenAITTS';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';
import * as firebaseService from '../services/firebaseService';

interface AskScreenProps {
  language: string;
  locationName: string;
  userContext: string;
  t: (key: string) => string;
  appMode: AppMode;
  initialQuery?: { text: string; timestamp: number } | null;
}

const AskScreen: React.FC<AskScreenProps> = ({ language, locationName, userContext, t, appMode, initialQuery }) => {
  const isCropsMode = appMode === 'crops';
  const sendBtnClass = isCropsMode ? 'bg-green-600 hover:bg-green-700' : 'bg-pink-600 hover:bg-pink-700';
  const placeholderColor = isCropsMode ? 'placeholder-green-300' : 'placeholder-pink-300';
  const activeColor = isCropsMode ? 'text-green-500' : 'text-pink-500';

  const [cropsHistory, setCropsHistory] = useState<ChatMessage[]>([]);
  const [animalsHistory, setAnimalsHistory] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const handledInitialQueryTimestamp = useRef<number | null>(null);
  const activeHistory = isCropsMode ? cropsHistory : animalsHistory;

  const updateActiveHistory = useCallback((updater: (prev: ChatMessage[]) => ChatMessage[]) => {
    if (isCropsMode) setCropsHistory(updater);
    else setAnimalsHistory(updater);
  }, [isCropsMode]);

  const { speak, stop: stopSpeak, isSpeaking } = useGenAITTS();
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);

  const scrollToLastMessage = (behavior: ScrollBehavior = 'smooth') => {
    if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior, block: 'start' });
    }
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
        const { scrollHeight, clientHeight } = scrollContainerRef.current;
        scrollContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior });
    }
  };

  useLayoutEffect(() => {
    if (activeHistory.length > 0) {
        const lastMsg = activeHistory[activeHistory.length - 1];
        if (lastMsg.role === 'model') {
            scrollToLastMessage('smooth');
        } else {
            scrollToBottom('smooth');
        }
    }
  }, [activeHistory, isLoading]);

  const sendMessage = useCallback(async (textOverride?: string) => {
    const textToSend = textOverride || userInput;
    if (!textToSend.trim() || isLoading) return;

    updateActiveHistory(prev => [...prev, { role: 'user', text: textToSend }]);
    setUserInput('');
    setIsLoading(true);
    setError('');
    stopSpeak();

    try {
      const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
      const systemRole = isCropsMode ? `Senior Agronomist and Growth Strategist.` : `Lead Veterinarian and Herd Specialist.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...activeHistory.map(m => ({ role: m.role, parts: [{ text: m.text }] })), { role: 'user', parts: [{ text: textToSend }] }],
        config: { 
            systemInstruction: `
                ${systemRole} 
                ${ENGAGING_INSTRUCTION} 
                Language: ${language}. 
                Location: ${locationName}.
                
                BEHAVIOR:
                1. If the user asks for a "Guide", "Roadmap", or "Plan", provide a comprehensive multi-step technical manual with exact timings and dosages.
                2. Use rich visual containers, tables for costs/schedules, and bold headers.
                3. Maintain extreme scientific accuracy for ${locationName}.
                4. Return strictly valid JSON: { "text": "Rich HTML content", "imageQuery": "A descriptive prompt for an image" }
            `,
            responseMimeType: 'application/json' 
        },
      });

      const responseData = JSON.parse(response.text?.trim() || '{"text": "Data sync issue. Please retry."}');
      updateActiveHistory(prev => [...prev, { role: 'model', text: responseData.text, imageQuery: responseData.imageQuery, isImageLoading: !!responseData.imageQuery }]);

      if (responseData.imageQuery) {
        const processImage = async (query: string) => {
            // 1. Check Global Cache
            const cachedUrl = await firebaseService.getChatImage(query);
            if (cachedUrl) {
                updateActiveHistory(prev => prev.map(m => m.imageQuery === query ? { ...m, imageUrl: cachedUrl, isImageLoading: false } : m));
                return;
            }

            // 2. Generate if missing
            try {
                const base64 = await generateImageForQuery(query);
                if (base64) {
                    // 3. Secure for future users
                    const publicUrl = await firebaseService.saveChatImage(query, base64);
                    updateActiveHistory(prev => prev.map(m => m.imageQuery === query ? { ...m, imageUrl: publicUrl, isImageLoading: false } : m));
                } else {
                    throw new Error("Gen failed");
                }
            } catch (err) {
                updateActiveHistory(prev => prev.map(m => m.imageQuery === query ? { ...m, isImageLoading: false } : m));
            }
        };
        processImage(responseData.imageQuery);
      }
    } catch (e) {
      setError('Connection link dropped. Re-transmitting...');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [userInput, activeHistory, updateActiveHistory, language, locationName, isCropsMode, isLoading, stopSpeak]);

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(
    languageConfig[language]?.code || 'en-US', 
    () => sendMessage()
  ); 

  useEffect(() => { if (isListening) setUserInput(transcript); }, [transcript, isListening]);
  
  useEffect(() => { 
    if (activeHistory.length === 0) {
        updateActiveHistory(() => [{ role: 'model', text: t(isCropsMode ? 'agriHelperWelcome' : 'agriVetWelcome') }]);
    }
  }, [appMode, t, isCropsMode, updateActiveHistory, activeHistory.length]);

  useEffect(() => { 
    if (initialQuery && initialQuery.timestamp !== handledInitialQueryTimestamp.current) { 
        handledInitialQueryTimestamp.current = initialQuery.timestamp; 
        sendMessage(initialQuery.text); 
    } 
  }, [initialQuery, sendMessage]);

  return (
    <div className="flex flex-col h-[calc(100dvh-12rem)] w-full max-w-2xl mx-auto overflow-hidden animate-fade-in">
       <div className="text-center flex-shrink-0 mb-4">
        <h2 className={`text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r ${isCropsMode ? 'from-emerald-500 to-teal-500' : 'from-fuchsia-500 to-pink-500'}`}>
            {t(isCropsMode ? 'askAgriHelper' : 'askAgriVet')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-bold uppercase tracking-widest">{t(isCropsMode ? 'askAgriHelperSubtitle' : 'askAgriVetSubtitle')}</p>
      </div>
      <div className="flex-grow flex flex-col min-h-0 bg-white/50 dark:bg-gray-800/50 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700 relative overflow-hidden">
        <div ref={scrollContainerRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 no-scrollbar">
          {activeHistory.map((message, index) => (
            <div 
              key={index} 
              ref={index === activeHistory.length - 1 ? lastMessageRef : null}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-pop-in`}
            >
              <div className={`rounded-2xl px-5 py-3.5 max-w-[85%] shadow-md text-sm md:text-base leading-relaxed ${message.role === 'user' ? `${sendBtnClass} text-white rounded-br-none` : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none border dark:border-gray-600'}`}>
                {message.imageUrl && <img src={message.imageUrl} alt="AI" className="mb-3 rounded-lg w-full object-cover shadow-sm animate-fade-in" />}
                {message.isImageLoading && <div className="flex items-center justify-center p-4 bg-black/5 rounded-lg mb-3"><Spinner /><span className="text-xs ml-2 opacity-60 font-bold uppercase tracking-widest">Visualizing...</span></div>}
                {message.role === 'model' ? (
                    <div className="space-y-2">
                        <div className="[&>p]:mb-2 [&>ul]:mb-2 [&>h3]:text-lg [&>h3]:font-black [&>h3]:mt-4" dangerouslySetInnerHTML={{ __html: message.text }} />
                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-600 flex justify-start">
                             <button onClick={() => {
                                 if (isSpeaking && speakingMessageId === index) {
                                     stopSpeak();
                                 } else {
                                     setSpeakingMessageId(index);
                                     speak(message.text.replace(/<[^>]*>/g, ''), language);
                                 }
                             }} className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 text-gray-600 dark:text-gray-300 transition-colors text-xs font-black uppercase tracking-widest">
                                {isSpeaking && speakingMessageId === index ? <StopIcon className="w-3 h-3 text-red-500" /> : <SpeakerWaveIcon className="w-3 h-3" />} {isSpeaking && speakingMessageId === index ? 'Stop' : 'Listen'}
                             </button>
                        </div>
                    </div>
                ) : <p className="font-bold">{message.text}</p>}
              </div>
            </div>
          ))}
          {isLoading && <div className="flex justify-start animate-pulse"><div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-none px-5 py-3 shadow-sm border dark:border-gray-600 flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div></div></div>}
          {error && <div className="text-red-500 text-xs text-center font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">{error}</div>}
        </div>
        <div className="p-4 border-t dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md">
           <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900/50 p-1.5 rounded-full border border-gray-200 dark:border-gray-600 shadow-inner relative">
                <div className="flex-grow relative">
                    <input type="text" value={isListening && !userInput && transcript ? transcript : (isListening && !transcript ? t('listening') : userInput)} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder={t(isCropsMode ? 'askAnythingFarming' : 'askAnythingAnimals')} className={`w-full rounded-full pl-5 pr-12 py-3 bg-transparent outline-none ${isListening && !transcript ? `italic animate-pulse ${placeholderColor} ${activeColor}` : 'text-gray-900 dark:text-white font-bold'}`} disabled={isLoading} />
                    {hasRecognitionSupport && (
                        <button onClick={() => isListening ? stopListening() : startListening()} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse scale-110' : 'bg-white dark:bg-gray-600 text-gray-500 hover:text-green-600'}`}><MicrophoneIcon className="h-5 w-5" /></button>
                    )}
                </div>
                <button onClick={() => sendMessage()} disabled={isLoading || !userInput.trim()} className={`${sendBtnClass} text-white p-3 rounded-full shadow-lg active:scale-95 disabled:opacity-50 transition-all flex-shrink-0`}><PaperAirplaneIcon className="w-6 h-6"/></button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AskScreen;
