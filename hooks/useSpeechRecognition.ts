
import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionStatic {
  new(): SpeechRecognition;
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic;
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

export const useSpeechRecognition = (lang: string, onSilence?: () => void) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onSilenceRef = useRef(onSilence);

  useEffect(() => {
    onSilenceRef.current = onSilence;
  }, [onSilence]);

  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = lang;
    }
  }, [lang]);

  useEffect(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      if (silenceTimer.current) clearTimeout(silenceTimer.current);

      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) finalTranscript += text;
        else interimTranscript += text;
      }
      
      const normalize = (str: string) => str.replace(/\s+/g, '').toLowerCase();
      const nFinal = normalize(finalTranscript);
      const nInterim = normalize(interimTranscript);
      
      let currentTranscript = '';
      if (nFinal.length > 0 && nInterim.startsWith(nFinal)) {
          currentTranscript = interimTranscript;
      } else {
          currentTranscript = finalTranscript + interimTranscript;
      }
      
      setTranscript(currentTranscript);

      // REQUIREMENT: Trigger auto-generate after exactly 1.6 seconds of silence
      silenceTimer.current = setTimeout(() => {
        if (rec) rec.stop();
        if (onSilenceRef.current && currentTranscript.trim().length > 0) {
            onSilenceRef.current();
        }
      }, 1600);
    };

    rec.onend = () => {
      setIsListening(false);
      if (silenceTimer.current) {
          clearTimeout(silenceTimer.current);
          silenceTimer.current = null;
      }
    };

    rec.onerror = (event: any) => {
        if (event.error !== 'no-speech') {
            setIsListening(false);
        }
    };

    return () => {
      rec.onresult = null;
      rec.onend = null;
      rec.onerror = null;
      if (silenceTimer.current) clearTimeout(silenceTimer.current);
    };
  }, []); 

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript(''); 
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        setIsListening(true);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognitionRef.current,
  };
};
