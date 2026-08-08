
import React, { useState, useEffect, useRef } from 'react';
import { Harvest, HarvestQuality } from '../types';
import Card from './Card';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface LogHarvestFormProps {
  onSave: (formData: Pick<Harvest, 'crop' | 'quantity' | 'quality' | 'status'>) => void;
  onClose: () => void;
  t: (key: string) => string;
  harvestToEdit?: Harvest | null;
  language: string;
}

const allStatuses: Harvest['status'][] = ['Harvested', 'Pending', 'In Transit', 'Delivered'];

const LogHarvestForm: React.FC<LogHarvestFormProps> = ({ onSave, onClose, t, harvestToEdit, language }) => {
  const [crop, setCrop] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [quality, setQuality] = useState<HarvestQuality>('Grade A');
  const [status, setStatus] = useState<Harvest['status']>('Harvested');
  const [error, setError] = useState('');

  const isEditing = !!harvestToEdit;
  const inputClasses = "mt-1 block w-full rounded-xl glass-input p-3 shadow-inner text-gray-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none";

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');

  useEffect(() => {
    if (isListening) setCrop(transcript);
  }, [transcript, isListening]);

  useEffect(() => {
    if (harvestToEdit) {
      setCrop(harvestToEdit.crop);
      setQuantity(harvestToEdit.quantity);
      setQuality(harvestToEdit.quality);
      setStatus(harvestToEdit.status);
    }
  }, [harvestToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crop || !quantity) {
      setError(t('cropRequired'));
      return;
    }
    onSave({ crop, quantity: Number(quantity), quality, status });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 flex justify-center items-center p-4">
      <Card title={t(isEditing ? 'editHarvest' : 'logNewHarvest')} className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('cropName')}</label>
            <div className="relative">
                <input
                  type="text"
                  value={isListening && !transcript ? t('listening') : crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className={`${inputClasses} pr-10`}
                  placeholder={t('tomatoesPlaceholder')}
                />
                {hasRecognitionSupport && (
                  <button type="button" onClick={() => isListening ? stopListening() : startListening()} className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white' : 'text-gray-400 hover:text-emerald-600'}`}>
                    <MicrophoneIcon className="w-5 h-5"/>
                  </button>
                )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('quantityInKg')}</label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} className={inputClasses} placeholder={t('quantityPlaceholder')} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('qualityGrade')}</label>
            <select value={quality} onChange={(e) => setQuality(e.target.value as HarvestQuality)} className={inputClasses}>
              <option value="Grade A">Grade A</option>
              <option value="Grade B">Grade B</option>
              <option value="Grade C">Grade C</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('status')}</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as Harvest['status'])} className={inputClasses}>
              {allStatuses.map(s => (<option key={s} value={s}>{t(s === 'Harvested' ? 'statusHarvested' : (s === 'Pending' ? 'statusPending' : (s === 'In Transit' ? 'statusInTransit' : 'statusDelivered')))}</option>))}
            </select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end space-x-2 pt-2">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg">{t('cancel')}</button>
            <button type="submit" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg">{t(isEditing ? 'saveChanges' : 'saveHarvest')}</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LogHarvestForm;
