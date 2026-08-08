
import React, { useState, useMemo, useRef } from 'react';
import { User, NotificationItem } from '../types';
import Spinner from './Spinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LeafIcon } from './icons/LeafIcon';
import { HeartIcon } from './icons/HeartIcon';
import { SearchIcon } from './icons/SearchIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    t: (key: string) => string;
    notifications: NotificationItem[]; 
    isLoading: boolean; 
    onRefresh: () => void; 
    onMarkRead: () => void;
    onItemClick: (item: NotificationItem) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ 
    isOpen, onClose, user, t, notifications = [], isLoading, onRefresh, onMarkRead, onItemClick 
}) => {
    const [activeTab, setActiveTab] = useState<'state' | 'national'>('state');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotifications = useMemo(() => {
        const list = Array.isArray(notifications) ? notifications : [];
        return list.filter(n => {
            if (!n) return false;
            // RESILIENT MATCHING: Match scope to tab selection
            const itemScope = n.scope?.toLowerCase() || 'state';
            const matchesTab = itemScope === activeTab;
            
            const title = n.title?.toLowerCase() || '';
            const summary = n.summary?.toLowerCase() || '';
            const search = searchTerm.toLowerCase();
            const matchesSearch = title.includes(search) || summary.includes(search);
            
            return matchesTab && matchesSearch;
        });
    }, [notifications, activeTab, searchTerm]);

    const getIconForType = (type: NotificationItem['type']) => {
        switch(type) {
            case 'crop_pest': return <LeafIcon className="w-4 h-4" />;
            case 'animal_disease': return <HeartIcon className="w-4 h-4" />;
            default: return <SparklesIcon className="w-4 h-4" />;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md transition-all duration-300" onClick={onClose} />
            
            <div className="absolute top-full right-0 mt-3 w-screen max-w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-[110] border border-slate-200 dark:border-white/10 flex flex-col overflow-hidden animate-pop-in origin-top-right">
                
                <div className="p-5 border-b dark:border-white/5 flex justify-between items-center bg-white dark:bg-slate-900">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="Back">
                            <ArrowLeftIcon className="w-5 h-5"/>
                        </button>
                        <div>
                            <h2 className="text-base font-black tracking-tight text-slate-900 dark:text-white uppercase">Updates & Alerts</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Feed Sync</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onMarkRead} className="p-2 text-slate-400 hover:text-emerald-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="Mark all read"><CheckCircleIcon className="w-5 h-5" /></button>
                        <button onClick={onRefresh} disabled={isLoading} className="p-2 text-slate-400 hover:text-blue-500 disabled:opacity-50 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="Refresh">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" title="Close">
                            <XCircleIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>

                <div className="flex px-5 pt-2 bg-white dark:bg-slate-900">
                    <button 
                        onClick={() => setActiveTab('state')} 
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'state' ? 'border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'border-transparent text-slate-400'}`}
                    >
                        {user.state || 'Regional'}
                    </button>
                    <button 
                        onClick={() => setActiveTab('national')} 
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest border-b-4 transition-all ${activeTab === 'national' ? 'border-blue-500 text-blue-700 dark:text-blue-400' : 'border-transparent text-slate-400'}`}
                    >
                        National
                    </button>
                </div>

                <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b dark:border-white/5 space-y-3">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search updates..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pl-10 pr-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 outline-none shadow-inner" 
                        />
                        <SearchIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"/>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-white dark:bg-slate-900 no-scrollbar min-h-[300px]">
                    {isLoading && filteredNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Spinner />
                            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Synchronizing area data...</p>
                        </div>
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((item, idx) => {
                            const isHigh = item.severity?.toLowerCase() === 'high';
                            const accentColor = isHigh ? 'bg-rose-500' : (item.type === 'crop_pest' ? 'bg-emerald-500' : 'bg-blue-500');
                            
                            return (
                                <div 
                                    key={item.id || idx} 
                                    onClick={() => onItemClick(item)} 
                                    className={`group relative p-5 rounded-2xl border transition-all active:scale-[0.98] cursor-pointer hover:shadow-xl ${isHigh ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30' : 'bg-white dark:bg-slate-800/40 border-slate-100 dark:border-white/5 hover:border-slate-200'}`}
                                >
                                    <div className={`absolute left-0 top-6 w-1 h-8 rounded-r-full ${accentColor}`}></div>
                                    <div className="flex justify-between items-center mb-2">
                                        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[8px] font-black tracking-widest uppercase ${isHigh ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                            {getIconForType(item.type)}
                                            {item.type?.replace('_', ' ')}
                                        </div>
                                        <span className="text-[9px] text-slate-400 font-black uppercase font-mono">
                                            {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Today'}
                                        </span>
                                    </div>
                                    <h4 className="font-black text-sm text-slate-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: item.summary }} />
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-20 flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center opacity-30">📡</div>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Signal Quiet</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">No recent {activeTab} alerts found.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default NotificationPanel;
