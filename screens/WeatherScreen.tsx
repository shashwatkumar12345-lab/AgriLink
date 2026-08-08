import React, { useState, useEffect, useRef } from 'react';
import { WeatherData } from '../types';
import Card from '../components/Card';
import { WeatherIcon } from '../components/icons/WeatherIcon';
import { DropletIcon } from '../components/icons/DropletIcon';
import WeatherSkeleton from '../components/WeatherSkeleton';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';
import { GoogleGenAI } from '@google/genai';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import Spinner from '../components/Spinner';

interface WeatherScreenProps {
  locationName: string;
  t: (key: string) => string;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string;
  weatherLastUpdated: number | null;
  onOpenAssistant: () => void;
  onManualRefresh: () => void;
}

const AtmosScanner = () => (
    <div className="absolute inset-0 z-20 pointer-events-none rounded-3xl overflow-hidden backdrop-blur-[1px]">
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-scan"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 dark:bg-slate-900/90 px-4 py-2 rounded-full shadow-2xl border border-blue-100 dark:border-white/10 flex items-center gap-3 animate-bounce">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400">Syncing Atmosphere...</span>
            </div>
        </div>
    </div>
);

const WeatherScreen: React.FC<WeatherScreenProps> = ({ 
  locationName, t, weatherData, isLoading, error, weatherLastUpdated, onOpenAssistant, onManualRefresh 
}) => {
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const answerRef = useRef<HTMLDivElement>(null);

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition('en-US');

  useEffect(() => { if (isListening) setQuestion(transcript); }, [transcript, isListening]);

  useEffect(() => {
    if (answer && answerRef.current) {
        answerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [answer]);

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return '';
    const last = new Date(timestamp);
    const now = new Date();
    const diffSeconds = Math.round((now.getTime() - last.getTime()) / 1000);
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.round(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    return last.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleAskWeatherAi = async () => {
    if (!question.trim()) return;
    setIsAiLoading(true); setAnswer('');
    try {
        const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
        const prompt = `Location: ${locationName || 'Unknown'}. User Question: "${question}". Current Weather: ${weatherData?.current?.temp || 'N/A'}°C, ${weatherData?.current?.condition || 'N/A'}. Provide a helpful, short, engaging response in HTML with emojis.`;
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        setAnswer(response.text || "");
    } catch (e) { setAnswer("Error connecting to Climate Intel."); } finally { setIsAiLoading(false); }
  };

  if (isLoading && !weatherData) return <WeatherSkeleton />;
  
  const safeLocation = (locationName === "Sync Pending" || !locationName) ? "Locating..." : locationName;
  
  const getSafeTemp = (temp: any) => {
      const val = Number(temp);
      return isNaN(val) ? '--' : Math.round(val);
  };

  return (
    <div className="space-y-6 pb-32 animate-fade-in max-w-2xl mx-auto relative">
      <div className="text-center relative">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-300 tracking-tighter">Climate Center</h2>
        <p className={`mt-1 font-black text-sm uppercase tracking-[0.2em] ${safeLocation === 'Locating...' ? 'text-blue-500 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`}>
            {safeLocation}
        </p>
        
        <div className="flex items-center justify-center gap-3 mt-5">
            <div className={`bg-slate-100 dark:bg-slate-900 border dark:border-white/5 px-5 py-2 rounded-full flex items-center gap-3 shadow-inner min-w-[140px] justify-center transition-all ${isLoading ? 'ring-2 ring-blue-500/20' : ''}`}>
                {isLoading ? (
                    <>
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Syncing...</span>
                    </>
                ) : (
                    <>
                        <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)] ${safeLocation === 'Locating...' ? 'bg-blue-300' : 'bg-emerald-500'}`}></span>
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest">{formatTimestamp(weatherLastUpdated) || 'Pending'}</span>
                    </>
                )}
            </div>
            {!isLoading && (
                <button 
                  onClick={onManualRefresh} 
                  className="text-[10px] font-black uppercase tracking-[0.2em] transition-all px-5 py-2 rounded-full shadow-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:text-blue-500 active:scale-[0.98]"
                >
                    Refresh
                </button>
            )}
        </div>
      </div>
      
      {error && !weatherData && (
          <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-[2rem] border-2 border-dashed border-red-200 dark:border-red-900/40 text-center shadow-xl">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-red-600"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.008v.008H12v-.008z" /></svg>
              </div>
              <p className="text-red-700 dark:text-red-400 font-black uppercase text-xs tracking-widest mb-2">{error}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-6 font-medium">Poor signal or location timeout. Check your connection.</p>
              <button onClick={onManualRefresh} className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">Try Sync Again</button>
          </div>
      )}

      {weatherData?.current && (
        <Card className="overflow-hidden relative bg-gradient-to-br from-blue-50/50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-blue-100 dark:border-white/5 shadow-2xl dark:shadow-indigo-500/10 rounded-[2.5rem]">
          {isLoading && <AtmosScanner />}
          
          <div className="flex flex-col md:flex-row items-center justify-between p-2">
            <div className="flex items-center">
              <WeatherIcon iconName={weatherData.current.icon || 'cloudy'} className="w-36 h-36 drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] animate-float" />
              <div className="ml-6">
                <p className="text-8xl font-black text-slate-900 dark:text-white tracking-tighter drop-shadow-md">{getSafeTemp(weatherData.current.temp)}°</p>
                <p className="text-xl text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mt-1">{weatherData.current.condition || 'Atmosphere Syncing'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-8 md:mt-0 bg-white/40 dark:bg-white/5 p-6 rounded-[2rem] backdrop-blur-xl border border-white/20 dark:border-white/5 shadow-inner min-w-[220px]">
              <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 whitespace-nowrap">Humidity</span>
                  <span className="font-black text-3xl dark:text-white">{weatherData.current.humidity || '--'}%</span>
              </div>
              <div className="flex flex-col">
                  <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1 whitespace-nowrap">Wind Speed</span>
                  <span className="font-black text-3xl dark:text-white tabular-nums">{weatherData.current.windSpeed || '--'}<span className="text-[10px] ml-1 opacity-50 font-bold uppercase">kph</span></span>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t dark:border-white/5">
              <div className="flex items-center gap-3 bg-white/20 dark:bg-slate-950/20 backdrop-blur-md p-2 rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl relative">
                  <div className="flex-grow relative">
                      <input 
                        type="text" 
                        value={isListening && !transcript ? t('listening') : question} 
                        onChange={(e) => setQuestion(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleAskWeatherAi()} 
                        placeholder="Ask Climate AI..." 
                        className="w-full text-sm font-bold pl-5 pr-12 py-4 bg-transparent outline-none dark:text-white placeholder-slate-600" 
                      />
                      {hasRecognitionSupport && (
                          <button 
                            onClick={() => isListening ? stopListening() : startListening()} 
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-full transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse shadow-md scale-110' : 'glass-btn text-gray-500 hover:text-blue-600'}`}
                          >
                              <MicrophoneIcon className="h-5 w-5" />
                          </button>
                      )}
                  </div>
                  <button onClick={handleAskWeatherAi} className="bg-gradient-to-br from-blue-500 to-indigo-700 text-white rounded-2xl p-4 shadow-lg active:scale-90 transition-transform flex items-center justify-center">
                    {isAiLoading ? <Spinner appMode="crops" /> : <PaperAirplaneIcon className="w-5 h-5"/>}
                  </button>
              </div>
              {answer && <div ref={answerRef} className="mt-6 p-6 bg-blue-50/50 dark:bg-indigo-500/5 rounded-3xl text-sm leading-relaxed border border-blue-100 dark:border-indigo-500/10 shadow-inner animate-fade-in-up prose prose-sm dark:prose-invert max-w-none scroll-mt-24" dangerouslySetInnerHTML={{ __html: answer }} />}
          </div>
        </Card>
      )}

      {weatherData?.hourly && weatherData.hourly.length > 0 && (
        <Card title="Next 24 Hours" className="dark:bg-slate-900/20 border-transparent overflow-visible">
          <div className="flex overflow-x-auto space-x-5 pb-6 no-scrollbar scroll-smooth">
            {weatherData.hourly.slice(0, 24).map((hour, index) => (
              <div key={index} className="flex flex-col items-center p-6 rounded-3xl glass-card flex-shrink-0 w-28 text-center transition-all shadow-sm hover:shadow-xl group">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 group-hover:text-blue-500 transition-colors">{hour.time || '--'}</p>
                <WeatherIcon iconName={hour.icon || 'cloudy'} className="w-12 h-12 mb-4 drop-shadow-lg transform group-hover:scale-110 transition-transform" />
                <p className="font-black text-2xl dark:text-white tabular-nums">{getSafeTemp(hour.temp)}°</p>
                <div className="mt-4 text-[9px] font-black text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20 px-3 py-1 rounded-full uppercase">{hour.precipChance || '0'}%</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {weatherData?.forecast && weatherData.forecast.length > 0 && (
        <div className="space-y-4">
          <h3 className="px-2 text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">7-Day Outlook</h3>
          {weatherData.forecast.slice(0, 7).map((day, index) => (
            <div key={index} className={`glass-card rounded-[2rem] transition-all duration-500 ${expandedDay === index ? 'ring-2 ring-blue-500/20 shadow-2xl border-blue-500/30' : ''}`}>
              <div className="p-6 cursor-pointer flex items-center justify-between" onClick={() => setExpandedDay(expandedDay === index ? null : index)}>
                <div className="flex items-center gap-6">
                  <WeatherIcon iconName={day.icon || 'cloudy'} className="w-14 h-14 drop-shadow-xl" />
                  <div><p className="font-black text-xl dark:text-white tracking-tighter">{day.day || '--'}</p><p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest">{day.date || '--'}</p></div>
                </div>
                <div className="flex items-center gap-6">
                   <div className="text-right flex flex-col">
                        <span className="text-2xl font-black dark:text-white tabular-nums">{getSafeTemp(day.high)}°</span>
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 opacity-60">/{getSafeTemp(day.low)}°</span>
                   </div>
                   <div className={`p-2 rounded-xl bg-white/20 dark:bg-white/5 transition-all duration-500 ${expandedDay === index ? 'rotate-180 bg-blue-500/20' : ''}`}><ChevronDownIcon className="w-4 h-4 text-slate-400" /></div>
                </div>
              </div>
              {expandedDay === index && (
                <div className="px-6 pb-8 pt-2 animate-fade-in-down">
                  <div className="bg-white/10 dark:bg-black/20 p-5 rounded-2xl border-l-4 border-blue-500">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-bold italic">"{day.summary || 'Summary not available.'}"</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherScreen;
