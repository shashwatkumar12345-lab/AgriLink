
import { useState, useEffect, useCallback } from 'react';
import { languageConfig } from '../utils/countryLanguages';

export const useGenAITTS = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const speak = useCallback((text: string, language: string) => {
    if (!text) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = languageConfig[language]?.code || 'en-US';
    utterance.lang = langCode;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Voice selection logic: Prefer female-sounding names
    const availableVoices = voices.filter(v => v.lang.startsWith(langCode.split('-')[0]));
    const femaleKeywords = ['female', 'woman', 'zira', 'samantha', 'google'];
    const selectedVoice = availableVoices.find(v => 
      femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
    ) || availableVoices[0];

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};
