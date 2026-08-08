
import React from 'react';
import { NotificationItem, User } from '../types';
import { XCircleIcon } from './icons/XCircleIcon';
import { LeafIcon } from './icons/LeafIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface NotificationDetailModalProps {
  item: NotificationItem;
  user: User;
  onClose: () => void;
  t: (key: string) => string;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({ item, user, onClose, t }) => {
  const getIconForType = (type: NotificationItem['type']) => {
    switch(type) {
      case 'crop_pest': return <LeafIcon className="w-5 h-5" />;
      case 'animal_disease': return <HeartIcon className="w-5 h-5" />;
      default: return <SparklesIcon className="w-5 h-5" />;
    }
  };

  const isHigh = item.severity === 'high';
  const headerBg = isHigh ? 'bg-rose-50 dark:bg-rose-950/20' : 'bg-blue-50 dark:bg-blue-950/20';

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div className="w-full max-w-xl h-full max-h-[85dvh] flex flex-col relative animate-pop-in shadow-2xl rounded-[2.5rem] bg-white dark:bg-slate-900 overflow-hidden border-4 border-white dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all z-30 p-2 rounded-full hover:bg-black/5 active:scale-90"><XCircleIcon className="w-8 h-8" /></button>
        
        <div className={`p-8 md:p-10 border-b dark:border-white/5 flex-shrink-0 ${headerBg}`}>
          <div className="flex items-center gap-3 mb-5">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${isHigh ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
              {getIconForType(item.type)}
              {item.type.replace('_', ' ')}
            </div>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Live'}</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter pr-12">{item.title}</h3>
          <p className="text-[10px] text-slate-500 font-black mt-4 flex items-center gap-2 uppercase tracking-widest">📍 {item.location || user.state}</p>
        </div>

        <div className="flex-grow overflow-y-auto p-8 md:p-10 bg-white dark:bg-slate-900 no-scrollbar">
          <div 
            className="prose prose-sm md:prose-base max-w-none dark:prose-invert text-slate-900 dark:text-white
            [&>h3]:text-xl [&>h3]:font-black [&>h3]:mb-6 [&>h3]:mt-10 [&>h3]:text-slate-900 [&>h3]:dark:text-white [&>h3]:uppercase [&>h3]:tracking-widest
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-4 [&>ul]:mb-8
            [&>p]:leading-relaxed [&>p]:text-slate-800 [&>p]:dark:text-slate-100 [&>p]:mb-6 [&>p]:text-base [&>p]:font-medium
            [&>table]:w-full [&>table]:border-collapse [&>table]:my-6 [&>table>thead]:bg-slate-50 [&>table>thead>tr>th]:p-3 [&>table>tbody>tr>td]:p-3 [&>table>tbody>tr>td]:border-t" 
            dangerouslySetInnerHTML={{ __html: item.fullContent || item.summary }} 
          />
        </div>

        <div className="p-6 md:p-8 border-t dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30 flex justify-center flex-shrink-0">
          <button onClick={onClose} className="w-full max-w-xs bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl transition-all active:scale-95 transform hover:-translate-y-1">{t('gotIt')}</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationDetailModal;
