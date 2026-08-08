
import React, { useState, useEffect, useRef } from 'react';
import { Animal } from '../types';
import Card from './Card';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface LogAnimalFormProps {
  onSave: (formData: Pick<Animal, 'name' | 'quantity' | 'breed' | 'weight'>) => void;
  onClose: () => void;
  t: (key: string) => string;
  animalToEdit?: Animal | null;
  language: string;
}

const LogAnimalForm: React.FC<LogAnimalFormProps> = ({ onSave, onClose, t, animalToEdit, language }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [breed, setBreed] = useState('');
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<'name' | 'breed' | 'weight' | null>(null);

  const isEditing = !!animalToEdit;

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');

  useEffect(() => {
    if (isListening && activeField === 'name') setName(transcript);
    if (isListening && activeField === 'breed') setBreed(transcript);
    if (isListening && activeField === 'weight') {
        const val = parseInt(transcript.replace(/[^0-9]/g, ''));
        if (!isNaN(val)) setWeight(val);
    }
  }, [transcript, isListening, activeField]);

  const handleMicClick = (field: 'name' | 'breed' | 'weight') => {
    if (isListening && activeField === field) {
        stopListening();
        setActiveField(null);
    } else {
        setActiveField(field);
        startListening();
    }
  };

  useEffect(() => {
    if (animalToEdit) {
      setName(animalToEdit.name);
      setQuantity(animalToEdit.quantity);
      setBreed(animalToEdit.breed || '');
      setWeight(animalToEdit.weight || '');
    }
  }, [animalToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !quantity) {
      setError(t('animalRequired'));
      return;
    }
    onSave({ name, quantity: Number(quantity), breed, weight: weight ? Number(weight) : undefined });
  };

  const inputClasses = "mt-1 block w-full rounded-xl glass-input p-3 shadow-inner text-gray-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 flex justify-center items-center p-4">
      <Card title={t(isEditing ? 'editAnimal' : 'logNewAnimal')} className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('animalName')}</label>
            <div className="relative">
                <input
                  type="text"
                  value={isListening && activeField === 'name' && !transcript ? t('listening') : name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClasses}
                  placeholder={t('animalNamePlaceholder')}
                />
                {hasRecognitionSupport && (
                  <button type="button" onClick={() => handleMicClick('name')} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening && activeField === 'name' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-pink-600'}`}>
                    <MicrophoneIcon className="w-5 h-5"/>
                  </button>
                )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('breed')}</label>
                <div className="relative">
                    <input
                      type="text"
                      value={isListening && activeField === 'breed' && !transcript ? t('listening') : breed}
                      onChange={(e) => setBreed(e.target.value)}
                      className={inputClasses}
                      placeholder={t('breedPlaceholder')}
                    />
                    {hasRecognitionSupport && (
                      <button type="button" onClick={() => handleMicClick('breed')} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening && activeField === 'breed' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-pink-600'}`}>
                        <MicrophoneIcon className="w-5 h-5"/>
                      </button>
                    )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('weightInKg')}</label>
                <div className="relative">
                    <input
                      type="number"
                      value={isListening && activeField === 'weight' && !transcript ? '' : weight}
                      onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                      className={inputClasses}
                      placeholder={t('animalWeightPlaceholder')}
                    />
                    {hasRecognitionSupport && (
                      <button type="button" onClick={() => handleMicClick('weight')} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening && activeField === 'weight' ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-pink-600'}`}>
                        <MicrophoneIcon className="w-5 h-5"/>
                      </button>
                    )}
                </div>
              </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('quantity')}</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} className={inputClasses} placeholder={t('animalQuantityPlaceholder')} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg">{t('cancel')}</button>
            <button type="submit" className="bg-pink-600 text-white font-bold py-2 px-4 rounded-lg">{t(isEditing ? 'saveChanges' : 'saveAnimal')}</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LogAnimalForm;
