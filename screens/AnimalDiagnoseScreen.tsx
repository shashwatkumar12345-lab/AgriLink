
import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { GoogleGenAI, Type } from '../utils/geminiClient';
import { fileToBase64 } from '../utils/fileUtils';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { Animal, Diagnosis, ConsultationRequest, DiagnosisContext, Screen, AppMode } from '../types';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { useGenAITTS } from '../hooks/useGenAITTS';
import { CameraIcon } from '../components/icons/CameraIcon';
import { translateText, ENGAGING_INSTRUCTION } from '../services/geminiService';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';
import { ExclamationTriangleIcon } from '../components/icons/ExclamationTriangleIcon';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

interface AnimalDiagnoseScreenProps {
  language: string;
  locationName: string;
  userContext: string;
  t: (key: string) => string;
  animals: Animal[];
  onLinkDiagnosis: (itemId: string, itemType: 'animal', diagnosis: Diagnosis) => void;
  onAddAnimalAndLink?: (animal: Omit<Animal, 'id' | 'timestamp'>, diagnosis: Diagnosis) => void;
  onNavigateToConsult: (prefillData: Partial<ConsultationRequest>) => void;
  onNavigateToAsk: (query: string) => void;
  onSetDiagnosisContext: (context: DiagnosisContext) => void;
  user: any; 
  activeScreen?: Screen;
  appMode?: AppMode;
}

interface AnimalAnalysisResponse {
  isRelevant: boolean;
  isHealthy: boolean;
  animalType: { commonName: string; breed: string; scientificName: string; };
  issue: string;
  causes: string[];
  analysis: string;
  medicines: { name: string; price: string; dosage: string; }[];
  homemadeRemedies: string[];
}

const ScannerOverlay = () => (
    <div className="absolute inset-0 z-10 pointer-events-none rounded-md overflow-hidden border-2 border-rose-500/50">
        <div className="absolute top-0 left-0 w-full h-1 bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-scan"></div>
        <div className="absolute inset-0 bg-rose-950/20 animate-pulse"></div>
    </div>
);

const AnimalDiagnoseScreen: React.FC<AnimalDiagnoseScreenProps> = ({ 
    language, 
    locationName, 
    userContext, 
    t, 
    animals, 
    onLinkDiagnosis, 
    onAddAnimalAndLink,
    onNavigateToConsult, 
    onNavigateToAsk,
    onSetDiagnosisContext, 
    user,
    activeScreen,
    appMode
}) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<AnimalAnalysisResponse | null>(null);
  const [error, setError] = useState<string>('');
  
  const [traceQuantity, setTraceQuantity] = useState<string>('');
  const [isTraceSyncing, setIsTraceSyncing] = useState(false);
  const [showTraceInputs, setShowTraceInputs] = useState(false);

  const { stop: stopSpeak } = useGenAITTS();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const analysisHeadingRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Requirement: Scroll to top (0,0) when screen focused, unless results are visible
  useEffect(() => {
    const isAnimalDiagnose = activeScreen === Screen.DIAGNOSE && appMode === 'animals';
    if (isAnimalDiagnose && !aiResponse) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeScreen, appMode, aiResponse]);

  useEffect(() => {
    if (aiResponse && resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [aiResponse]);

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
            isHealthy: { type: Type.BOOLEAN },
            animalType: { type: Type.OBJECT, properties: { commonName: { type: Type.STRING }, breed: { type: Type.STRING }, scientificName: { type: Type.STRING } }, required: ['commonName', 'breed', 'scientificName'] },
            issue: { type: Type.STRING },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            analysis: { type: Type.STRING, description: 'Very simple language health report for a farmer.' },
            medicines: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        price: { type: Type.STRING, description: 'Estimated INR price' },
                        dosage: { type: Type.STRING }
                    },
                    required: ['name', 'price', 'dosage']
                }
            },
            homemadeRemedies: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['isRelevant', 'isHealthy', 'animalType', 'issue', 'causes', 'analysis', 'medicines', 'homemadeRemedies'],
      };

      const fullPrompt = `Expert AI Veterinarian. Analyze livestock health. 
      RULES:
      1. USE EXTREMELY SIMPLE LANGUAGE.
      2. Identify animal and health issue.
      3. PROVIDE HOMEMADE/TRADITIONAL REMEDIES.
      4. PROVIDE CORRECT MEDICINES WITH ESTIMATED INDIAN PRICES (INR). NO WRONG MEDICATIONS.
      Location: ${locationName}. Context: ${userContext}. Language: ${language}.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [mediaPart, { text: fullPrompt }] },
        config: { responseMimeType: 'application/json', responseSchema: schema },
      });

      const responseData = JSON.parse(response.text.trim()) as AnimalAnalysisResponse;
      setAiResponse(responseData);
      if (responseData.isRelevant && !responseData.isHealthy) {
          onSetDiagnosisContext({ 
              type: 'Animal', 
              name: responseData.animalType.commonName, 
              issue: responseData.issue, 
              symptoms: responseData.causes.join(', '), 
              analysis: responseData.analysis, 
              timestamp: Date.now() 
          });
      }
    } catch (e) { setError('Failed to get vet advice. Try again.'); } finally { setIsLoading(false); }
  }, [mediaFile, language, userContext, onSetDiagnosisContext, locationName]);

  useEffect(() => { if (mediaFile && !isLoading && !aiResponse) handleSubmit(); }, [mediaFile]);

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

  const existingAnimal = useMemo(() => {
      if (!aiResponse) return null;
      return animals.find(a => a.name.toLowerCase() === aiResponse.animalType.commonName.toLowerCase());
  }, [aiResponse, animals]);

  const handleTraceAction = async () => {
      if (!aiResponse) return;

      const diagnosis: Diagnosis = {
          timestamp: new Date().toISOString(),
          issue: aiResponse.isHealthy ? 'Healthy Checkout' : aiResponse.issue,
          analysis: aiResponse.analysis,
          mediaUrl: mediaPreview || ''
      };

      setIsTraceSyncing(true);

      try {
          if (existingAnimal) {
              onLinkDiagnosis(existingAnimal.id, 'animal', diagnosis);
              alert(`${t('diagnosisLinked')} to existing ${existingAnimal.name} group`);
          } else {
              if (!traceQuantity) {
                  setShowTraceInputs(true);
                  setIsTraceSyncing(false);
                  return;
              }
              if (onAddAnimalAndLink) {
                  onAddAnimalAndLink({
                      name: aiResponse.animalType.commonName,
                      quantity: Number(traceQuantity),
                      breed: aiResponse.animalType.breed
                  }, diagnosis);
                  alert(`${aiResponse.animalType.commonName} added to Trace Ledger.`);
              }
          }
          handleRemoveMedia();
      } catch (e) {
          alert("Failed to sync with ledger.");
      } finally {
          setIsTraceSyncing(false);
      }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20 animate-fade-in px-2">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-pink-600 to-orange-400 tracking-tighter uppercase leading-none">Diagnose</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-black uppercase tracking-widest text-[10px]">identify livestock diseases and health issues instantly</p>
      </div>

      <div ref={analysisHeadingRef} className="text-center mt-16 mb-8 px-2 scroll-mt-24">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 dark:from-rose-400 dark:to-pink-200 tracking-tighter uppercase leading-none">ANIMAL HEALTH ANALYSIS</h2>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest mt-3">identify issues and get care tips</p>
      </div>

      <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden min-h-[380px]">
        {mediaPreview ? (
          <div className="relative group w-full flex justify-center">
            {isLoading && <ScannerOverlay />}
            <img src={mediaPreview} alt="Animal" className="h-64 rounded-[2rem] shadow-2xl object-cover" />
            <button onClick={handleRemoveMedia} className="absolute -top-4 -right-4 bg-red-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform active:scale-[0.98] z-20"><XCircleIcon className="w-8 h-8"/></button>
          </div>
        ) : (
          <div className="w-full max-w-xs text-center space-y-6 animate-fade-in-up">
            <div className="flex justify-center">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full">
                    <CameraIcon className="w-20 h-20 text-slate-200 dark:text-slate-700" />
                </div>
            </div>
            <div className="space-y-3">
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-black py-4 rounded-[2rem] shadow-[0_10px_30px_rgba(225,29,72,0.3)] active:scale-[0.98] transition-all uppercase tracking-widest text-sm">UPLOAD MEDIA</button>
                <input type="file" ref={fileInputRef} className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                <button onClick={() => cameraInputRef.current?.click()} className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white font-black py-4 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest text-sm">TAKE PHOTO</button>
                <input type="file" ref={cameraInputRef} className="sr-only" accept="image/*" capture="environment" onChange={handleFileChange} />
            </div>
            <p className="text-[#334155]/60 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.15em] leading-relaxed">
                upload a clear photo or video of the animal or affected area
            </p>
          </div>
        )}
      </div>

      {aiResponse && (
        <div ref={resultRef} className="animate-fade-in-up space-y-8 scroll-mt-24">
        {!aiResponse.isRelevant ? (
            <Card className="border-t-4 border-red-600 dark:bg-slate-900/60 text-center py-10 rounded-[2.5rem]">
                <p className="text-red-600 font-black uppercase tracking-wider mb-2">Subject Not Recognized</p>
                <p className="text-slate-600 dark:text-slate-400 px-10">Please upload a clear photo of your livestock.</p>
                <button onClick={handleRemoveMedia} className="mt-8 bg-slate-100 dark:bg-slate-800 px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest dark:text-white transition-colors shadow-sm active:scale-[0.98]">Try Another Photo</button>
            </Card>
        ) : (
            <div className="space-y-8">
                <Card className="border-t-8 border-rose-600 dark:bg-slate-900/60 !p-8 overflow-hidden rounded-[2.5rem] shadow-2xl">
                    <div className="space-y-8">
                        <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border dark:border-rose-900/30 shadow-inner">
                            <h4 className="text-[10px] font-black text-rose-800 dark:text-rose-400 uppercase tracking-[0.2em] mb-3">Animal Identification</h4>
                            <div className="flex flex-col gap-1">
                                <p className="font-black text-3xl dark:text-white tracking-tighter leading-none">{aiResponse.animalType.commonName}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide bg-white dark:bg-slate-800 px-2 py-1 rounded-md border dark:border-white/5">{aiResponse.animalType.breed}</span>
                                    <span className="text-xs font-bold italic text-rose-600 dark:text-rose-400 px-2 py-1 rounded-md bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800">{aiResponse.animalType.scientificName}</span>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-3xl border shadow-inner ${aiResponse.isHealthy ? 'bg-green-50 border-green-100 dark:bg-emerald-950/60' : 'bg-red-50 border-red-100 dark:bg-red-950/40'}`}>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-slate-400">Veterinary Status</h4>
                            <div className="flex items-center gap-4">
                                {aiResponse.isHealthy ? <CheckCircleIcon className="w-8 h-8 text-emerald-600" /> : <ExclamationTriangleIcon className="w-8 h-8 text-red-600 animate-pulse" />}
                                <div>
                                    <p className={`font-black text-2xl tracking-tighter leading-none uppercase ${aiResponse.isHealthy ? 'text-emerald-700' : 'text-red-700'}`}>{aiResponse.isHealthy ? 'HEALTHY' : 'DISEASED'}</p>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mt-1">{aiResponse.isHealthy ? 'No clinical abnormalities detected.' : aiResponse.issue}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-1">Professional Analysis (Simple Language)</h4>
                            <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{aiResponse.analysis}</p>
                            </div>
                        </div>

                        {!aiResponse.isHealthy && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-rose-600 uppercase tracking-[0.4em] ml-1">Homemade Remedies</h4>
                                    <div className="space-y-3">
                                        {aiResponse.homemadeRemedies.map((rem, i) => (
                                            <div key={i} className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl border border-rose-100 dark:border-rose-900/30 flex gap-3">
                                                <span className="text-rose-500">🏠</span>
                                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{rem}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] ml-1">Suggested Medicine</h4>
                                    <div className="space-y-3">
                                        {aiResponse.medicines.map((med, i) => (
                                            <div key={i} className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h5 className="font-black text-blue-800 dark:text-blue-300 text-xs uppercase tracking-tight">{med.name}</h5>
                                                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md shadow-sm">{med.price}</span>
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-relaxed">{med.dosage}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-dashed dark:border-white/10 pt-8 mt-4">
                            <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-6">Livestock Ledger Integration</h4>
                            {existingAnimal ? (
                                <div className="p-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-[2rem] border border-indigo-100 dark:border-indigo-800 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="font-black text-indigo-900 dark:text-indigo-200 uppercase">Recognized Group</p>
                                        <p className="text-xs font-bold text-indigo-600/70 mt-1">Existing record for <span className="uppercase">{existingAnimal.name}</span> found.</p>
                                    </div>
                                    <button 
                                        onClick={handleTraceAction}
                                        disabled={isTraceSyncing}
                                        className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {isTraceSyncing ? <Spinner /> : 'Link to Current Group'}
                                    </button>
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[2rem] border border-slate-100 dark:border-white/5 space-y-6">
                                    {!showTraceInputs ? (
                                        <div className="flex flex-col items-center gap-4 py-4">
                                            <p className="text-xs font-bold text-slate-500 text-center">New livestock? Register this group to track its health history and vaccinations.</p>
                                            <button 
                                                onClick={() => setShowTraceInputs(true)}
                                                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
                                            >
                                                Add to Trace Ledger
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="animate-pop-in space-y-6">
                                            <div className="text-center md:text-left">
                                                <p className="font-black text-slate-800 dark:text-white uppercase tracking-tight">Register Livestock Group</p>
                                                <p className="text-xs font-bold text-slate-400 mt-1">Add <span className="text-rose-600 uppercase">{aiResponse.animalType.commonName}</span> to Trace section with this analysis.</p>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Group Count / Headcount</label>
                                                <input 
                                                    type="number" 
                                                    value={traceQuantity}
                                                    onChange={e => setTraceQuantity(e.target.value)}
                                                    placeholder="e.g. 10"
                                                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl px-5 py-3.5 text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => setShowTraceInputs(false)} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">Cancel</button>
                                                <button 
                                                    onClick={handleTraceAction}
                                                    disabled={isTraceSyncing || !traceQuantity}
                                                    className="flex-[2] bg-indigo-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-30 disabled:grayscale"
                                                >
                                                    {isTraceSyncing ? <Spinner /> : 'Confirm and Log'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t dark:border-white/5 flex flex-col sm:flex-row gap-4">
                            {!aiResponse.isHealthy && (
                                <button 
                                    onClick={() => onNavigateToAsk(`What are the immediate care steps for ${aiResponse.issue} in ${aiResponse.animalType.commonName}?`)} 
                                    className="flex-1 bg-rose-950 text-white font-black uppercase tracking-widest text-[9px] py-5 rounded-3xl shadow-xl transition-all active:scale-[0.98]"
                                >
                                    Ask AI Care Protocol
                                </button>
                            )}
                            <button 
                                onClick={() => onNavigateToConsult({ 
                                    description: `Veterinary assistance for ${aiResponse.animalType.commonName} (${aiResponse.animalType.breed}). Suspected ${aiResponse.issue}.`,
                                    category: 'vet_cert_2'
                                })} 
                                className="flex-1 bg-rose-800 hover:bg-rose-700 text-white font-black uppercase tracking-widest text-[9px] py-5 rounded-3xl shadow-2xl transition-all active:scale-[0.98]"
                            >
                                Talk to Veterinarian
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        )}
        </div>
      )}
    </div>
  );
};

export default AnimalDiagnoseScreen;
