
import React from 'react';
import { NotificationItem } from '../types';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';

interface HighSeverityAlertProps {
  alert: NotificationItem;
  onClose: () => void;
  onViewDetails: (item: NotificationItem) => void;
}

const HighSeverityAlert: React.FC<HighSeverityAlertProps> = ({ alert, onClose, onViewDetails }) => {
  if (!alert) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-sm border-4 border-rose-600 relative overflow-hidden animate-pop-in" onClick={(e) => e.stopPropagation()}>
        <div className="absolute top-0 left-0 w-full h-2 bg-rose-600 animate-pulse"></div>
        
        <div className="p-10 text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full animate-ping"></div>
              <div className="relative w-full h-full bg-rose-600 rounded-full flex items-center justify-center shadow-xl">
                <ExclamationTriangleIcon className="w-12 h-12 text-white" />
              </div>
          </div>
          
          <h2 className="text-[10px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.4em] mb-2">Priority Alert</h2>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">{alert.title}</h3>
          
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: alert.summary }} />

          <div className="space-y-4">
            <button 
              onClick={() => onViewDetails(alert)}
              className="w-full bg-rose-600 text-white font-black uppercase tracking-[0.2em] py-5 rounded-[1.5rem] shadow-xl hover:bg-rose-700 transition active:scale-95 flex items-center justify-center gap-3 text-xs"
            >
              Read Full Update
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
            <button onClick={onClose} className="w-full text-slate-400 hover:text-slate-600 font-black py-2 text-[10px] uppercase tracking-widest transition">Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HighSeverityAlert;
