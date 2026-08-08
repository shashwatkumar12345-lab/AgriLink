
import { useState, useEffect, useCallback, useRef } from 'react';
import { translations } from '../translations';
import { translateBatch } from '../services/translationService';
import { getGlobalTranslations, updateGlobalTranslations } from '../services/firebaseService';

export const useDynamicTranslation = (selectedLanguage: string) => {
  const [dynamicTranslations, setDynamicTranslations] = useState<Record<string, string>>({});
  const [isFirebaseSynced, setIsFirebaseSynced] = useState(false);
  
  const missingKeysRef = useRef<Set<string>>(new Set());
  const processingKeysRef = useRef<Set<string>>(new Set());
  const processTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Tiered Cache Initialization: LocalStorage -> Firestore -> State
  useEffect(() => {
    const initTranslations = async () => {
      setIsFirebaseSynced(false);
      missingKeysRef.current.clear();
      processingKeysRef.current.clear();

      if (selectedLanguage === 'English') {
        setDynamicTranslations({});
        return;
      }

      // 1. Instant UI: Load LocalStorage
      const localKey = `agriLinkTranslations_${selectedLanguage}`;
      const saved = localStorage.getItem(localKey);
      let localCache: Record<string, string> = {};
      if (saved) {
        try {
          localCache = JSON.parse(saved);
          setDynamicTranslations(localCache);
        } catch (e) {
          localCache = {};
        }
      }

      // 2. Global Sync: Fetch from Cloud (covers mobile/desktop sharing)
      try {
        const globalCache = await getGlobalTranslations(selectedLanguage);
        const mergedCache = { ...globalCache, ...localCache };
        
        setDynamicTranslations(mergedCache);
        localStorage.setItem(localKey, JSON.stringify(mergedCache));
        setIsFirebaseSynced(true);
      } catch (err) {
        console.error("Firebase translation sync failed", err);
        setIsFirebaseSynced(true); 
      }
    };

    initTranslations();
  }, [selectedLanguage]);

  const processQueue = useCallback(async () => {
    if (missingKeysRef.current.size === 0) return;

    const allMissingKeys: string[] = Array.from(missingKeysRef.current);
    const keysToTranslate = allMissingKeys.filter(k => !processingKeysRef.current.has(k));
    
    if (keysToTranslate.length === 0) return;
    
    keysToTranslate.forEach(k => processingKeysRef.current.add(k));
    
    const CHUNK_SIZE = 15;
    const chunks: string[][] = [];
    for (let i = 0; i < keysToTranslate.length; i += CHUNK_SIZE) {
        chunks.push(keysToTranslate.slice(i, i + CHUNK_SIZE));
    }
    
    const englishSource = (translations.English || {}) as unknown as Record<string, string>;

    await Promise.all(chunks.map(async (batchKeys) => {
        const textsToTranslate: Record<string, string> = {};
        
        batchKeys.forEach((key) => {
          textsToTranslate[key] = englishSource[key] || key;
        });

        if (Object.keys(textsToTranslate).length === 0) {
             batchKeys.forEach(k => {
                processingKeysRef.current.delete(k);
                missingKeysRef.current.delete(k);
            });
            return;
        }

        try {
            const newlyTranslated = await translateBatch(textsToTranslate, selectedLanguage);

            setDynamicTranslations(prev => {
              const next = { ...prev, ...newlyTranslated };
              localStorage.setItem(`agriLinkTranslations_${selectedLanguage}`, JSON.stringify(next));
              // Save to global cloud cache for others
              updateGlobalTranslations(selectedLanguage, newlyTranslated);
              return next;
            });
            
            batchKeys.forEach(k => {
                processingKeysRef.current.delete(k);
                missingKeysRef.current.delete(k);
            });
        } catch (err) {
            batchKeys.forEach(k => processingKeysRef.current.delete(k));
        }
    }));
  }, [selectedLanguage]);

  const scheduleProcessing = useCallback(() => {
    if (processTimeoutRef.current) return;
    processTimeoutRef.current = setTimeout(() => {
        processQueue();
        processTimeoutRef.current = null;
    }, 200);
  }, [processQueue]);

  const t = useCallback((key: string): string => {
    if (!key) return '';
    
    if (selectedLanguage === 'English') return (translations.English as any)[key] || key;
    const staticSet = (translations as any)[selectedLanguage];
    if (staticSet && staticSet[key]) return staticSet[key];
    
    if (dynamicTranslations[key]) return dynamicTranslations[key];

    const englishSource = (translations.English as any)[key];
    const isTranslatable = key.length > 0 && key.length < 5000;

    if (!missingKeysRef.current.has(key) && !processingKeysRef.current.has(key)) {
       if (isFirebaseSynced && (englishSource || isTranslatable)) {
           missingKeysRef.current.add(key);
           scheduleProcessing();
       }
    }
    
    return englishSource || key;
  }, [selectedLanguage, dynamicTranslations, scheduleProcessing, isFirebaseSynced]);

  return t;
};
