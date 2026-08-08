
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { User } from '../types';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { translations } from '../translations';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';

interface VeterinarianCertificationsScreenProps {
  user: User;
  t: (key: string) => string;
  language: string;
}

interface VetTopic {
  id: string;
  titleKey: keyof typeof translations.English;
}

const vetTopics: VetTopic[] = [
    { id: 'bovineRespiratory', titleKey: 'bovineRespiratory' },
    { id: 'poultryVaccination', titleKey: 'poultryVaccination' },
    { id: 'equineColic', titleKey: 'equineColic' },
    { id: 'smallRuminantParasitology', titleKey: 'smallRuminantParasitology' },
];

const VeterinarianCertificationsScreen: React.FC<VeterinarianCertificationsScreenProps> = ({ user, t, language }) => {
  const [activeTopic, setActiveTopic] = useState<VetTopic | null>(null);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleTopicClick = (topic: VetTopic) => {
    setActiveTopic(topic);
    setQuestion('');
    setAiResponse('');
    setError('');
  };

  const handleBackToTopics = () => {
    setActiveTopic(null);
  };

  const getExpertAnswer = useCallback(async () => {
    if (!question.trim() || !activeTopic) return;
    setIsLoading(true);
    setError('');
    setAiResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
      const prompt = `
        You are a specialized AI providing continuing education material for a licensed veterinarian in ${user.country}. 
        The current topic is "${t(activeTopic.titleKey)}".
        The veterinarian's question is: "${question}".

        Provide a detailed, technical, and accurate answer suitable for a professional. 
        Use current scientific knowledge, terminology, and cite common practices or drug names relevant to the region if possible.
        
        CRITICAL LANGUAGE RULE: Respond strictly in ${language} unless user asks otherwise.
        
        VISUAL ENGAGEMENT: Use Rich HTML. Include <h3> headers with emojis. Use <ul> and <li> for points. 
        Use <strong style="color: #db2777;"> to highlight key technical terms.
        
        Structure the answer clearly, using paragraphs and bullet points if helpful.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setAiResponse(response.text);

    } catch (e) {
      console.error(e);
      setError('Failed to get a response from the AI. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [question, activeTopic, language, t, user.country]);

  // Speech Recognition
  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');

  useEffect(() => {
    if (isListening) setQuestion(transcript);
  }, [transcript, isListening]);

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  if (activeTopic) {
    return (
      <div className="space-y-6">
        <button onClick={handleBackToTopics} className="text-sm font-semibold text-blue-700 dark:text-blue-400 hover:underline">&larr; {t('backToTopics')}</button>
        <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t(activeTopic.titleKey)}</h3>
        </div>
        <Card>
            <div className="space-y-4">
                {/* Standardized Input */}
                <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm relative">
                     <div className="flex-grow relative">
                        <textarea
                            value={isListening && !question && transcript ? transcript : (isListening && !transcript ? t('listening') : question)}
                            onChange={(e) => setQuestion(e.target.value)}
                            rows={1}
                            className={`w-full rounded-full pl-4 pr-10 py-3 bg-transparent outline-none resize-none ${isListening && !transcript ? 'text-blue-500 italic animate-pulse placeholder-blue-300' : 'text-gray-900 dark:text-white'}`}
                            placeholder={t('askCertificationQuestion')}
                            disabled={isLoading}
                        />
                        {hasRecognitionSupport && (
                            <button
                                onClick={handleMicClick}
                                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all shadow-sm ${
                                    isListening
                                    ? 'bg-red-500 text-white animate-pulse shadow-md scale-110'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-blue-600'
                                }`}
                            >
                                <MicrophoneIcon className="h-5 w-5" />
                            </button>
                        )}
                     </div>
                     <button onClick={getExpertAnswer} disabled={isLoading || !question.trim()} className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full disabled:bg-gray-300 dark:disabled:bg-gray-700 shadow-md transition-transform active:scale-95 flex-shrink-0">
                         {isLoading ? <Spinner /> : <PaperAirplaneIcon className="w-5 h-5"/>}
                     </button>
                </div>
            </div>
        </Card>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                {error}
            </div>
        )}

        {aiResponse && (
            <Card title={t('expertAiResponse')}>
                <div className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>h3]:mt-4 [&>ul]:list-disc [&>ul]:pl-5 [&>li]:mb-1" dangerouslySetInnerHTML={{ __html: aiResponse }} />
            </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{t('vetCertificationsTitle')}</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{t('vetCertificationsSubtitle')}</p>
        <p className="text-gray-500 dark:text-gray-500 mt-4 text-sm font-semibold">{t('selectTopic')}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vetTopics.map((topic) => (
          <button 
            key={topic.id} 
            onClick={() => handleTopicClick(topic)} 
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md text-left rtl:text-right hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 focus:outline-none focus:ring-2 ring-transparent focus:ring-blue-500 dark:border dark:border-gray-700 dark:hover:border-gray-600"
          >
            <p className="font-semibold text-gray-700 dark:text-gray-300">{t(topic.titleKey)}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VeterinarianCertificationsScreen;
