
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from '../utils/geminiClient';
import { fileToBase64 } from '../utils/fileUtils';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { WeatherData, Harvest, Diagnosis, User, ConsultationRequest, DiagnosisContext, HarvestQuality, Screen, AppMode } from '../types';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import { useGenAITTS } from '../hooks/useGenAITTS';
import { CameraIcon } from '../components/icons/CameraIcon';
import { CloudIcon } from '../components/icons/CloudIcon';
import { SunIcon } from '../components/icons/SunIcon';
import { SnowflakeIcon } from '../components/icons/SnowflakeIcon';
import { ArrowPathIcon } from '../components/icons/ArrowPathIcon';
import { ExclamationTriangleIcon } from '../components/icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

interface AugmentScreenProps {
  language: string;
  locationName: string;
  userContext: string;
  t: (key: string) => string;
  weatherData: WeatherData | null;
  weatherError: string;
  harvests: Harvest[];
  onLinkDiagnosis: (itemId: string, itemType: 'harvest', diagnosis: Diagnosis) => void;
  onAddHarvestAndLink?: (harvest: Omit<Harvest, 'id' | 'timestamp'>, diagnosis: Diagnosis) => void;
  user: User | null;
  onNavigateToAsk: (query: string) => void;
  onNavigateToConsult: (prefillData: Partial<ConsultationRequest>) => void;
  onSetDiagnosisContext: (context: DiagnosisContext) => void;
  activeScreen?: Screen;
  appMode?: AppMode;
}

interface MedicineInfo {
  name: string;
  price: string;
  description: string;
}

interface AnalysisResponse {
  isRelevant: boolean;
  status: 'Healthy' | 'Diseased';
  plantName: { common: string; regional: string; scientific: string; };
  diseaseName: string;
  causes: string[];
  analysis: string;
  medicines: MedicineInfo[];
  organicSolutions: string[];
}

interface CropAdvisorCrop { 
  cropName: string; 
  summary: string; 
  quickTips: string[]; 
}

interface CropAdvisorResponse { 
  mainCrops: CropAdvisorCrop[]; 
  cashCrops: CropAdvisorCrop[]; 
  mixedCrops: CropAdvisorCrop[]; 
}

const ScannerOverlay = () => (
    <div className="absolute inset-0 z-10 pointer-events-none rounded-md overflow-hidden border-2 border-emerald-500/50">
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scan"></div>
        <div className="absolute inset-0 bg-emerald-950/20 animate-pulse"></div>
    </div>
);

const AugmentScreen: React.FC<AugmentScreenProps> = ({ 
  language, 
  locationName, 
  userContext, 
  t, 
  weatherData,
  weatherError,
  harvests, 
  onLinkDiagnosis, 
  onAddHarvestAndLink,
  user, 
  onNavigateToAsk, 
  onNavigateToConsult, 
  onSetDiagnosisContext,
  activeScreen,
  appMode
}) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string>('');

  const [isCropAdvisorLoading, setIsCropAdvisorLoading] = useState<boolean>(false);
  const [cropAdvisorResponse, setCropAdvisorResponse] = useState<CropAdvisorResponse | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [showAdvisorContent, setShowAdvisorContent] = useState<boolean>(false);
  const [advisorError, setAdvisorError] = useState<string | null>(null);
  
  const [traceQuantity, setTraceQuantity] = useState<string>('');
  const [traceGrade, setTraceGrade] = useState<HarvestQuality>('Grade A');
  const [isTraceSyncing, setIsTraceSyncing] = useState(false);
  const [showTraceInputs, setShowTraceInputs] = useState(false);
  
  const { stop: stopSpeak } = useGenAITTS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const advisorHeadingRef = useRef<HTMLDivElement>(null);
  const analysisHeadingRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Requirement: Auto-scroll down to Plant Health Analysis whenfocused or on fresh mount
  useEffect(() => {
    const isCropsDiagnose = activeScreen === Screen.DIAGNOSE && appMode === 'crops';
    if (isCropsDiagnose && !aiResponse) {
        const timer = setTimeout(() => {
            if (analysisHeadingRef.current) {
                analysisHeadingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 800); // Wait for animations and layout to settle
        return () => clearTimeout(timer);
    }
  }, [activeScreen, appMode, aiResponse]);

  useEffect(() => {
    if (showAdvisorContent && advisorHeadingRef.current) {
        advisorHeadingRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showAdvisorContent, cropAdvisorResponse]);

  useEffect(() => {
    if (aiResponse && resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [aiResponse]);

  const cleanJSON = (text: string) => {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      return jsonMatch ? jsonMatch[0] : text.replace(/```json|```/g, '').trim();
    } catch (e) {
      return text;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleRemoveMedia(); 
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setMediaPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMedia = () => {
    setIsLoading(false); setMediaFile(null); setMediaPreview(null); setAiResponse(null); setError('');
    setTraceQuantity('');
    setShowTraceInputs(false);
    stopSpeak();
  };

  const handleSubmit = useCallback(async () => {
    if (!mediaFile) return;
    setIsLoading(true); setAiResponse(null); setError(''); stopSpeak();
    try {
      const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
      const base64Data = await fileToBase64(mediaFile);
      const mediaPart = { inlineData: { mimeType: mediaFile.type, data: base64Data } };

      const schema = {
        type: Type.OBJECT,
        properties: {
            isRelevant: { type: Type.BOOLEAN },
            status: { type: Type.STRING, enum: ['Healthy', 'Diseased'] },
            plantName: { 
                type: Type.OBJECT, 
                properties: { 
                    common: { type: Type.STRING }, 
                    regional: { type: Type.STRING }, 
                    scientific: { type: Type.STRING } 
                }, 
                required: ['common', 'regional', 'scientific'] 
            },
            diseaseName: { type: Type.STRING },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            analysis: { type: Type.STRING, description: 'Analysis in extremely simple language for a rural farmer.' },
            medicines: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        price: { type: Type.STRING, description: 'Estimated market price in Indian Rupees' },
                        description: { type: Type.STRING }
                    },
                    required: ['name', 'price', 'description']
                }
            },
            organicSolutions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['isRelevant', 'status', 'plantName', 'diseaseName', 'causes', 'analysis', 'medicines', 'organicSolutions'],
      };

      const prompt = `Indian Senior Agricultural Consultant. Analyze this plant photo. 
      RULES:
      1. Use VERY SIMPLE LANGUAGE.
      2. Identify plant and disease/pest.
      3. PROVIDE PRACTICAL ORGANIC SOLUTIONS (Home remedies).
      4. PROVIDE ACCURATE MEDICINES (Chemical/Biological) WITH MARKET PRICES (INR).
      Language: ${language}. Location: ${locationName}. Context: ${userContext}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [mediaPart, { text: prompt }] },
        config: { responseMimeType: 'application/json', responseSchema: schema },
      });

      const responseData = JSON.parse(cleanJSON(response.text)) as AnalysisResponse;
      setAiResponse(responseData);
      if (responseData.isRelevant && responseData.status === 'Diseased') {
          onSetDiagnosisContext({ 
              type: 'Crop', 
              name: responseData.plantName.common, 
              issue: responseData.diseaseName, 
              symptoms: responseData.causes.join(', '), 
              analysis: responseData.analysis, 
              timestamp: Date.now() 
          });
      }
    } catch (e) { setError('Sync jitter. Try again.'); } finally { setIsLoading(false); }
  }, [mediaFile, language, userContext, onSetDiagnosisContext, locationName]);
  
  useEffect(() => { if (mediaFile && !isLoading && !aiResponse) handleSubmit(); }, [mediaFile]);

  const getRecommendations = async (season: string, force: boolean = false) => {
    if (!force && selectedSeason === season) {
        setShowAdvisorContent(!showAdvisorContent);
        return;
    }

    const cacheKey = `agriLink_cropAdvisor_v6_${locationName}_${season}_${language}`;
    if (!force) {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setSelectedSeason(season);
        setCropAdvisorResponse(JSON.parse(cached));
        setShowAdvisorContent(true);
        setAdvisorError(null);
        return;
      }
    }

    setSelectedSeason(season);
    setShowAdvisorContent(true);
    setIsCropAdvisorLoading(true);
    setCropAdvisorResponse(null);
    setAdvisorError(null);

    try {
        const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
        const prompt = `
            TASK: Regional Agronomist for ${locationName}. 
            GOAL: Provide localized crop recommendations for the ${season} season. 
            
            OUTPUT RULES (CRITICAL):
            1. Generate EXACTLY 3 crops for EACH category: "mainCrops", "cashCrops", "mixedCrops".
            2. summary: exactly 3 complete sentences. DO NOT use ellipsis (...) or truncate. Provide full, high-value advice. Use <span style="color:#10b981"></span> for growth terms and <span style="color:#f59e0b"></span> for money terms.
            3. quickTips: exactly 3 short points. Use <span style="color:#3b82f6"></span> for technical terms.
            4. Base results strictly on the climate and terrain of ${locationName}, India.
            
            Return strictly valid JSON:
            {
              "mainCrops": [ { "cropName", "summary", "quickTips": ["", "", ""] } ],
              "cashCrops": [ { "cropName", "summary", "quickTips": ["", "", ""] } ],
              "mixedCrops": [ { "cropName", "summary", "quickTips": ["", "", ""] } ]
            }
            Language: ${language}.
        `;

        const response = await ai.models.generateContent({ 
          model: 'gemini-3-flash-preview', 
          contents: prompt, 
          config: { 
            thinkingConfig: { thinkingBudget: 0 },
            responseMimeType: 'application/json' 
          } 
        });

        const cleanedText = cleanJSON(response.text);
        const data = JSON.parse(cleanedText);
        
        setCropAdvisorResponse(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch(e) { 
        console.error("Advisor load failed", e);
        setAdvisorError("Cloud sync failed. Please check your data connection and retry.");
    } finally { 
        setIsCropAdvisorLoading(false); 
    }
  };

  const existingHarvest = useMemo(() => {
      if (!aiResponse) return null;
      return harvests.find(h => h.crop.toLowerCase() === aiResponse.plantName.common.toLowerCase());
  }, [aiResponse, harvests]);

  const handleTraceAction = async () => {
      if (!aiResponse) return;
      
      const diagnosis: Diagnosis = {
          timestamp: new Date().toISOString(),
          issue: aiResponse.status === 'Healthy' ? 'Routine Check' : aiResponse.diseaseName,
          analysis: aiResponse.analysis,
          mediaUrl: mediaPreview || ''
      };

      setIsTraceSyncing(true);

      try {
          if (existingHarvest) {
              onLinkDiagnosis(existingHarvest.id, 'harvest', diagnosis);
              alert(`${t('diagnosisLinked')} to ${existingHarvest.crop}`);
          } else {
              if (!traceQuantity) {
                  setShowTraceInputs(true);
                  setIsTraceSyncing(false);
                  return;
              }
              if (onAddHarvestAndLink) {
                  onAddHarvestAndLink({
                      crop: aiResponse.plantName.common,
                      quantity: Number(traceQuantity),
                      quality: traceGrade,
                      status: 'Harvested'
                  }, diagnosis);
                  alert(`${aiResponse.plantName.common} added to Trace Ledger.`);
              }
          }
          handleRemoveMedia();
      } catch (e) {
          alert("Failed to sync with ledger. Try again.");
      } finally {
          setIsTraceSyncing(false);
      }
  };

  const SeasonBucket = ({ label, icon: Icon, glowColor }: { label: string, icon: any, glowColor: string }) => {
    const isActive = selectedSeason === label;
    return (
      <button 
        onClick={() => getRecommendations(label)}
        className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-3xl border-2 transition-all duration-300 group relative overflow-hidden ${
          isActive 
            ? 'bg-white dark:bg-slate-900 border-transparent shadow-xl scale-105' 
            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10 shadow-sm'
        }`}
      >
        {isActive && <div className="absolute inset-0 opacity-10 animate-pulse" style={{ backgroundColor: glowColor }}></div>}
        <div className={`mb-2 transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-lg' : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'}`}>
          <Icon className="w-10 h-10 md:w-12 md:h-12" style={{ color: isActive ? glowColor : 'currentColor' }} />
        </div>
        <p className={`font-black text-[9px] md:text-[10px] uppercase tracking-widest text-center ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>{label}</p>
      </button>
    );
  };

  return (
    <div className="space-y-6 pb-40 animate-fade-in max-w-5xl mx-auto px-2">
      <div className="text-center mb-8 px-2">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-400 dark:to-teal-200 tracking-tighter uppercase">{t('diagnose')}</h2>
        <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">AI tools for your crops</p>
      </div>

      <Card className="dark:bg-slate-900/60 dark:border-white/5 border-t-8 border-emerald-500 rounded-[2.5rem] !p-6 md:!p-10 overflow-hidden shadow-2xl">
        <div ref={advisorHeadingRef} className="text-center mb-8 flex flex-col items-center relative scroll-mt-24">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-[1.2rem] inline-block mb-3 shadow-inner border border-emerald-100 dark:border-emerald-800">
                <SparklesIcon className="w-6 h-6 text-emerald-500 animate-pulse"/>
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 leading-none">SMART CROP ADVISOR</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">select your cultivation season</p>

            {selectedSeason && (
                <button 
                    onClick={(e) => { e.stopPropagation(); getRecommendations(selectedSeason, true); }}
                    className="absolute right-0 top-0 p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:shadow-lg transition-all active:scale-90 border border-slate-100 dark:border-white/5 group"
                    title="Refresh Season"
                >
                    <ArrowPathIcon className={`w-4 h-4 text-emerald-600 dark:text-emerald-400 ${isCropAdvisorLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                </button>
            )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
            <SeasonBucket label={t('kharif')} icon={CloudIcon} glowColor="#3b82f6" />
            <SeasonBucket label={t('rabi')} icon={SnowflakeIcon} glowColor="#0ea5e9" />
            <SeasonBucket label={t('zaid')} icon={SunIcon} glowColor="#f59e0b" />
            <SeasonBucket label={t('yearRound')} icon={ArrowPathIcon} glowColor="#10b981" />
        </div>

        {isCropAdvisorLoading ? (
          <div className="py-24 text-center animate-pulse flex flex-col items-center gap-6">
            <Spinner />
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">Mapping localized agricultural logic...</p>
          </div>
        ) : advisorError ? (
            <div className="py-12 text-center bg-red-50 dark:bg-red-950/20 rounded-[2rem] border-2 border-dashed border-red-200 dark:border-red-900/30">
                <p className="text-red-600 font-black uppercase text-xs tracking-widest mb-4">{advisorError}</p>
                <button 
                    onClick={() => getRecommendations(selectedSeason, true)}
                    className="px-8 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
                >
                    Retry Sync
                </button>
            </div>
        ) : (cropAdvisorResponse && showAdvisorContent) && (
            <div className="space-y-12 animate-fade-in-up">
                {Object.entries(cropAdvisorResponse).map(([key, list]) => (
                    <div key={key} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <h4 className="text-[9px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-[0.3em] px-5 py-2 bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800 rounded-full shadow-sm">{t(key as any)}</h4>
                          <div className="h-px flex-grow bg-slate-100 dark:bg-white/5"></div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {(Array.isArray(list) ? list : []).map((c: CropAdvisorCrop) => (
                                <div key={c.cropName} className="flex flex-col glass-card rounded-[2rem] border-b-4 border-b-emerald-500/20 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-3">
                                            <p className="font-black text-lg text-slate-900 dark:text-white tracking-tighter leading-tight">{c.cropName}</p>
                                            <SparklesIcon className="w-4 h-4 text-emerald-500"/>
                                        </div>
                                        <div className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-5 leading-relaxed" dangerouslySetInnerHTML={{ __html: c.summary }} />
                                        <div className="mt-auto space-y-1.5">
                                            {c.quickTips.map((tip, idx) => (
                                                <div key={idx} className="flex items-center gap-2 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                                                    <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>
                                                    <span className="truncate" dangerouslySetInnerHTML={{ __html: tip }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white/20 dark:bg-slate-900/20 border-t border-white/20 dark:border-white/5">
                                        <button 
                                            onClick={() => onNavigateToAsk(`As an expert agronomist, provide a highly detailed, 5-step master guide for growing ${c.cropName} in ${locationName}, India for the ${selectedSeason} season. Include soil preparation, irrigation schedule, fertilization (organic and chemical options), pest management, and harvest criteria.`)} 
                                            className="w-full py-2 glass-btn text-emerald-700 dark:text-emerald-400 text-[8px] font-black uppercase tracking-widest rounded-xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                                        >
                                            View Roadmap &rarr;
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </Card>

      <div ref={analysisHeadingRef} className="text-center mt-16 mb-8 px-2 scroll-mt-24">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-600 dark:from-emerald-400 dark:to-teal-200 tracking-tighter uppercase leading-none">PLANT HEALTH ANALYSIS</h2>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3">identify pests and diseases instantly</p>
      </div>

      <div className="flex flex-col items-center justify-center p-8 glass-card rounded-[3rem] shadow-2xl relative overflow-hidden min-h-[380px] w-full">
        {mediaPreview ? (
          <div className="relative group w-full flex justify-center px-6">
            {isLoading && <ScannerOverlay />}
            <img src={mediaPreview} alt="Crop" className="h-64 rounded-[2rem] shadow-2xl object-cover" />
            <button onClick={handleRemoveMedia} className="absolute -top-4 -right-4 bg-red-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-[0.98] z-20"><XCircleIcon className="w-8 h-8"/></button>
          </div>
        ) : (
          <div className="w-full max-w-xs text-center space-y-6 animate-fade-in-up">
            <div className="flex justify-center">
                <div className="p-6 bg-white/20 dark:bg-slate-800/20 rounded-full border border-white/10 dark:border-white/5">
                    <CameraIcon className="w-20 h-20 text-slate-400 dark:text-slate-500" />
                </div>
            </div>
            <div className="space-y-3">
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#10b981] hover:bg-[#059669] text-white font-black py-4 rounded-[2rem] shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all uppercase tracking-widest text-sm">UPLOAD MEDIA</button>
                <input type="file" ref={fileInputRef} className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                <button onClick={() => cameraInputRef.current?.click()} className="w-full glass-btn text-slate-800 dark:text-white font-black py-4 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm">TAKE PHOTO</button>
                <input type="file" ref={cameraInputRef} className="sr-only" accept="image/*" capture="environment" onChange={handleFileChange} />
            </div>
            <p className="text-[#334155]/60 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] leading-relaxed">
                upload a clear photo or video of the affected area
            </p>
          </div>
        )}
      </div>
      
      {aiResponse && (
        <div ref={resultRef} className="animate-fade-in-up space-y-8 scroll-mt-24">
        {!aiResponse.isRelevant ? (
            <Card className="border-t-4 border-red-600 dark:bg-slate-900/60 text-center py-10 rounded-[2.5rem]">
                <p className="text-red-600 font-black uppercase tracking-wider mb-2">Subject Invalid</p>
                <p className="text-slate-600 dark:text-slate-400 px-10 mb-8 font-bold">Please retry with a farming-related photo.</p>
                <button onClick={handleRemoveMedia} className="bg-red-600 text-white px-10 py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl active:scale-[0.98] transition-all">Retry</button>
            </Card>
        ) : (
            <>
                <Card className="border-t-8 border-emerald-600 dark:bg-slate-900/60 dark:border-white/5 !p-8 rounded-[2.5rem] shadow-2xl">
                    <div className="space-y-8">
                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border dark:border-emerald-900/30 shadow-inner text-center">
                            <h4 className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-[0.2em] mb-3">Crop Identification</h4>
                            <div className="flex flex-col gap-1">
                                <p className="font-black text-3xl dark:text-white tracking-tighter leading-none uppercase">{aiResponse.plantName.common}</p>
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wide bg-white dark:bg-slate-800 px-3 py-1 rounded-full border dark:border-white/5">{aiResponse.plantName.regional}</span>
                                    <span className="text-[10px] font-black italic text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800 uppercase">{aiResponse.plantName.scientific}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-3xl border shadow-inner transition-colors duration-500 ${aiResponse.status === 'Healthy' ? 'bg-green-50 border-green-100 dark:bg-emerald-950/60' : 'bg-red-50 border-red-100 dark:bg-red-950/40'}`}>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-slate-400">Vitality Status</h4>
                            <div className="flex items-center gap-4">
                                {aiResponse.status === 'Healthy' ? <CheckCircleIcon className="w-10 h-10 text-emerald-600" /> : <ExclamationTriangleIcon className="w-10 h-10 text-red-600 animate-pulse" />}
                                <div>
                                    <p className={`font-black text-2xl tracking-tighter leading-none uppercase ${aiResponse.status === 'Healthy' ? 'text-emerald-700' : 'text-red-700'}`}>{aiResponse.status === 'Healthy' ? 'No Disease Detected' : aiResponse.diseaseName}</p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1 uppercase tracking-widest opacity-60">{aiResponse.status === 'Healthy' ? 'Optimal health profile verified.' : 'Pathogen identified.'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Expert Analysis</h4>
                            <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border dark:border-white/5 shadow-inner">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{aiResponse.analysis}</p>
                            </div>
                        </div>

                        {aiResponse.status === 'Diseased' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] ml-1">Organic Solutions</h4>
                                    <div className="space-y-3">
                                        {aiResponse.organicSolutions.map((solution, idx) => (
                                            <div key={idx} className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 flex gap-3">
                                                <span className="text-emerald-500">🍃</span>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{solution}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] ml-1">Recommended Medicine</h4>
                                    <div className="space-y-3">
                                        {aiResponse.medicines.map((med, idx) => (
                                            <div key={idx} className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-black text-blue-800 dark:text-blue-300 text-xs uppercase tracking-tight">{med.name}</h5>
                                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm">{med.price}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">{med.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-dashed dark:border-white/10 pt-8 mt-4">
                            <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Trace Ledger Integration</h4>
                            {existingHarvest ? (
                                <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-tight">Active Node Found</p>
                                        <p className="text-[10px] font-bold text-indigo-600/70 dark:text-indigo-400/50 mt-1 uppercase tracking-widest">Existing log for {existingHarvest.crop} detected.</p>
                                    </div>
                                    <button 
                                        onClick={handleTraceAction}
                                        disabled={isTraceSyncing}
                                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {isTraceSyncing ? <Spinner /> : 'Link to Current Log'}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-6">
                                    {!showTraceInputs ? (
                                        <div className="flex flex-col items-center gap-4 py-4">
                                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-widest">No active harvest node found for {aiResponse.plantName.common}. Register this check in your ledger to build a health history.</p>
                                            <button 
                                                onClick={() => setShowTraceInputs(true)}
                                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
                                            >
                                                Initiate Harvest Node
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate-pop-in space-y-6">
                                            <div className="text-center md:text-left">
                                                <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Register New Harvest Node</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Add {aiResponse.plantName.common} to your trace timeline with this diagnosis.</p>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block tracking-widest">Estimated Quantity (KG)</label>
                                                    <input 
                                                        type="number" 
                                                        value={traceQuantity}
                                                        onChange={e => setTraceQuantity(e.target.value)}
                                                        placeholder="e.g. 500"
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-indigo-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block tracking-widest">Certified Grade</label>
                                                    <select 
                                                        value={traceGrade}
                                                        onChange={e => setTraceGrade(e.target.value as any)}
                                                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                                    >
                                                        <option value="Grade A">Grade A (Premium)</option>
                                                        <option value="Grade B">Grade B (Standard)</option>
                                                        <option value="Grade C">Grade C (Sub-par)</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setShowTraceInputs(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">Cancel</button>
                                                <button 
                                                    onClick={handleTraceAction}
                                                    disabled={isTraceSyncing || !traceQuantity}
                                                    className="flex-[2] bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
                                                >
                                                    {isTraceSyncing ? <Spinner /> : 'Deploy to Ledger'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t dark:border-white/5">
                            <button 
                                onClick={() => onNavigateToAsk(`As an expert, suggest a 7-day treatment plan for ${aiResponse.diseaseName} in ${aiResponse.plantName.common}. I am located in ${locationName}.`)} 
                                className="flex-1 min-w-[150px] bg-emerald-800 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[9px] py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                            >
                                Get Detailed Recovery Plan
                            </button>
                            <button 
                                onClick={() => onNavigateToConsult({ 
                                    description: `Urgent Diagnosis required for ${aiResponse.plantName.common}. Identified issue: ${aiResponse.diseaseName}. Analysis says: ${aiResponse.analysis.substring(0, 100)}...`,
                                    category: 'IPM'
                                })} 
                                className="flex-1 min-w-[150px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white font-black uppercase tracking-widest text-[9px] py-5 rounded-2xl border dark:border-white/5 hover:bg-slate-200 transition-all active:scale-[0.98]"
                            >
                                Consult Local Specialist
                            </button>
                        </div>
                    </div>
                </Card>
            </>
        )}
        </div>
      )}
    </div>
  );
};

export default AugmentScreen;
