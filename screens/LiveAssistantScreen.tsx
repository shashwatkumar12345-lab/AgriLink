import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { User, LiveChatMessage, AppMode, DiagnosisContext, WeatherData } from '../types';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { PlayIcon } from '../components/icons/PlayIcon';
import { PauseIcon } from '../components/icons/PauseIcon';
import { audioUtils } from '../utils/audioUtils';

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

interface LiveAssistantScreenProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  t: (key: string) => string;
  language: string;
  userContext: string;
  appMode: AppMode;
  recentDiagnosis: DiagnosisContext | null;
  weatherData?: WeatherData | null;
}

type AssistantStatus = 'connecting' | 'listening' | 'thinking' | 'error';

const LiveAssistantScreen: React.FC<LiveAssistantScreenProps> = ({
  isOpen,
  onClose,
  user,
  t,
  language,
  userContext,
  appMode,
  recentDiagnosis,
  weatherData,
}) => {
  const [status, setStatus] = useState<AssistantStatus>('connecting');
  const [transcriptHistory, setTranscriptHistory] = useState<LiveChatMessage[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
  
  const sessionRef = useRef<any | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const outputGainNodeRef = useRef<GainNode | null>(null);

  const isCrops = appMode === 'crops';
  const userBubbleClass = isCrops ? 'bg-gradient-to-r from-emerald-600 to-teal-600' : 'bg-gradient-to-r from-pink-600 to-rose-600';
  const pulseClass = isCrops ? 'bg-emerald-500/20' : 'bg-pink-500/20';
  const micBgClass = isCrops ? 'bg-emerald-500' : 'bg-pink-500';

  const handleClose = () => {
    if (sessionRef.current) sessionRef.current.close();
    if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
    sourcesRef.current.forEach(source => source.stop());
    sourcesRef.current.clear();
    onClose();
  };

  const handleTogglePause = useCallback(async () => {
    if (isPaused) {
      if (inputAudioContextRef.current?.state === 'suspended') await inputAudioContextRef.current.resume();
      if (outputAudioContextRef.current?.state === 'suspended') await outputAudioContextRef.current.resume();
      setIsPaused(false);
    } else {
      if (inputAudioContextRef.current?.state === 'running') await inputAudioContextRef.current.suspend();
      if (outputAudioContextRef.current?.state === 'running') await outputAudioContextRef.current.suspend();
      setIsPaused(true);
    }
  }, [isPaused]);

  useEffect(() => {
    if (status === 'listening' && !isPaused && isOpen) {
      const timer = setTimeout(() => {
        handleTogglePause();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [status, isPaused, transcriptHistory, isOpen, handleTogglePause]);

  const initialize = async () => {
    if (!isOpen) return;
    setStatus('connecting');
    setIsPaused(false);
    nextStartTimeRef.current = 0;
    
    try {
      const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });

      inputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
      
      outputGainNodeRef.current = outputAudioContextRef.current.createGain();
      outputGainNodeRef.current.connect(outputAudioContextRef.current.destination);

      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
          sampleRate: 16000
        } 
      });

      const weatherContextString = weatherData 
        ? `Weather: ${weatherData.current.temp}°C, ${weatherData.current.condition}.` 
        : "";

      let instruction = `You are the AgriLink Lead Scientist. 
      CRITICAL OPERATIONAL RULES:
      1. LANGUAGE MIRRORING: YOU MUST RESPOND EXCLUSIVELY IN THE LANGUAGE SPOKEN BY THE USER.
      2. SPEAKER ISOLATION: Listen ONLY to the primary, loudest human voice.
      3. SCIENTIFIC ACCURACY: Provide specific, technical, and scientifically sound agricultural data.
      4. SPEED: Do not use fillers. Be technical and direct. 
      Context: ${userContext} ${weatherContextString} ${recentDiagnosis ? `Recent Diagnosis: ${recentDiagnosis.name} has ${recentDiagnosis.issue}. Analysis: ${recentDiagnosis.analysis.substring(0, 200)}.` : ''}`;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            if (!inputAudioContextRef.current || !mediaStreamRef.current) return;
            setStatus('listening');
            setErrorCount(0);

            const source = inputAudioContextRef.current.createMediaStreamSource(mediaStreamRef.current);
            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
              if (isPaused) return;
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const pcmBlob = audioUtils.createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              }).catch(() => {});
            };
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
              const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
              if (outputAudioContextRef.current && outputGainNodeRef.current) {
                const currentTime = outputAudioContextRef.current.currentTime;
                nextStartTimeRef.current = Math.max(nextStartTimeRef.current, currentTime);

                const audioBuffer = await audioUtils.decodeAudioData(
                  audioUtils.decode(base64Audio),
                  outputAudioContextRef.current,
                  24000,
                  1
                );
                const source = outputAudioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputGainNodeRef.current);
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) setStatus('listening');
                });
                setStatus('thinking');
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                sourcesRef.current.add(source);
              }
            }
            
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              sourcesRef.current.forEach(source => source.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setStatus('listening');
            }

            if (message.serverContent?.outputTranscription?.text) {
              const text = message.serverContent.outputTranscription.text;
              setTranscriptHistory(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'model') return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                return [...prev, { id: Date.now(), role: 'model', text }];
              });
            } else if (message.serverContent?.inputTranscription?.text) {
              const text = message.serverContent.inputTranscription.text;
              setTranscriptHistory(prev => {
                const last = prev[prev.length - 1];
                if (last && last.role === 'user') return [...prev.slice(0, -1), { ...last, text: last.text + text }];
                return [...prev, { id: Date.now(), role: 'user', text }];
              });
            }
          },
          onerror: (e: any) => {
            console.error('Live session error:', e);
            setStatus('error');
            if (errorCount < 2) {
                setErrorCount(prev => prev + 1);
                setTimeout(initialize, 1000);
            }
          },
          onclose: () => {
            console.log('Live session closed.');
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          thinkingConfig: { thinkingBudget: 0 }, 
          systemInstruction: instruction,
        },
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Assistant Init Error:', err);
      setStatus('error');
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTranscriptHistory([{ id: Date.now(), role: 'model', text: t('assistantWelcome') }]);
      initialize();
      return () => handleClose();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcriptHistory]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex flex-col justify-end p-4" role="dialog" aria-modal="true">
        <div className="absolute top-4 right-4 z-10">
            <button onClick={handleClose} className="text-white/60 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <XCircleIcon className="w-8 h-8"/>
            </button>
        </div>
        <div className="w-full max-w-lg mx-auto flex flex-col h-full justify-between pt-12">
          <div className="flex-grow overflow-y-auto mb-6 space-y-6 px-2 no-scrollbar">
            {transcriptHistory.map((msg) => (
               <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                  <div className={`rounded-2xl px-5 py-3 max-w-[85%] text-base leading-relaxed shadow-lg ${
                      msg.role === 'user' 
                      ? `${userBubbleClass} text-white rounded-br-none` 
                      : 'bg-white/10 text-white/90 backdrop-blur-sm border border-white/10 rounded-bl-none'
                  }`}>
                      {msg.text || '...'}
                  </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex-shrink-0 text-center pb-8">
            <div className="mb-6 h-6">
                <p className={`font-black text-xs uppercase tracking-[0.3em] transition-colors duration-500 animate-pulse ${status === 'listening' ? 'text-emerald-400' : 'text-purple-400'}`}>
                    {isPaused ? 'Paused' : (status === 'listening' ? 'Listening' : (status === 'thinking' ? 'Thinking' : 'Connecting'))}
                </p>
            </div>
            <div className="flex items-center justify-center gap-8 relative">
                <button 
                    onClick={handleTogglePause}
                    className={`p-4 rounded-full transition-all duration-300 shadow-xl border border-white/10 ${isPaused ? 'bg-white text-emerald-600 scale-110' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    disabled={status === 'connecting'}
                >
                    {isPaused ? <PlayIcon className="w-6 h-6" /> : <PauseIcon className="w-6 h-6" />}
                </button>
                <div className={`relative w-28 h-28 flex items-center justify-center rounded-full transition-all duration-500`}>
                    <div className={`absolute inset-0 rounded-full ${pulseClass} ${status === 'listening' && !isPaused ? 'animate-ping-slow opacity-75' : 'opacity-0'} duration-1000`}></div>
                    <div className={`absolute inset-2 rounded-full ${pulseClass} ${status === 'thinking' ? 'animate-pulse opacity-100' : 'opacity-0'} duration-500`}></div>
                    <div className={`relative w-20 h-20 flex items-center justify-center rounded-full ${micBgClass} shadow-[0_0_30px_rgba(0,0,0,0.3)] z-10 border-4 border-black/20`}>
                        <MicrophoneIcon className={`w-10 h-10 text-white ${status === 'listening' && !isPaused ? 'animate-bounce-subtle' : ''}`} />
                    </div>
                </div>
                <div className="w-14"></div> 
            </div>
            <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-8">Voice Tracking Active • Noise Suppressed</p>
          </div>
        </div>
    </div>
  );
};

export default LiveAssistantScreen;
