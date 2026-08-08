
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import { Harvest, Animal, User, MarketPriceData, HarvestQuality, PriceInfo, AppMode } from '../types';
import LogHarvestForm from '../components/LogHarvestForm';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import LogAnimalForm from '../components/LogAnimalForm';
import { getMarketPrice } from '../services/geminiService';
import { getCurrencySymbol } from '../utils/currencyUtils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DocumentTextIcon } from '../components/icons/DocumentTextIcon';
import { LeafIcon } from '../components/icons/LeafIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';

interface TraceScreenProps {
  t: (key: string) => string;
  user: User | null;
  harvests: Harvest[];
  onAddHarvest: (newHarvestData: Omit<Harvest, 'id' | 'timestamp'>) => void;
  onUpdateHarvest: (updatedHarvest: Harvest) => void;
  onDeleteHarvest: (id: string) => void;
  animals: Animal[];
  onAddAnimal: (newAnimalData: Omit<Animal, 'id' | 'timestamp'>) => void;
  onUpdateAnimal: (updatedAnimal: Animal) => void;
  onDeleteAnimal: (id: string) => void;
  language: string;
  appMode: AppMode;
}

// SHARED UTILITY: Ensures identical calculation across the entire screen
const calculateNodeValue = (item: Harvest | Animal, priceData: MarketPriceData | null): number => {
    const priceInfo = (priceData?.regional || priceData?.national) as PriceInfo | undefined;
    if (!priceInfo || !priceInfo.value) return 0;

    const quantityForPrice = Number(priceInfo.quantity_for_price) || 1;
    let pricePerUnit = Number(priceInfo.value) / quantityForPrice;
    
    const unit = priceInfo.unit.toLowerCase();
    // Unit normalization
    if (unit.includes('quintal')) pricePerUnit = pricePerUnit / 100;
    else if (unit.includes('ton')) pricePerUnit = pricePerUnit / 1000;

    // Valuation Logic: 
    // If it's an animal and the market price is per KG, we use the weight.
    // Otherwise, we use the quantity (headcount for animals or kg for crops).
    if (!('crop' in item) && unit === 'kg' && item.weight) {
        return Number(item.weight) * pricePerUnit;
    }
    
    return Number(item.quantity) * pricePerUnit;
};

const StatusBadge: React.FC<{ status: Harvest['status']; t: (key: string) => string }> = ({ status, t }) => {
  const statusClasses: Record<Harvest['status'], string> = {
    Delivered: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    Pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Harvested: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  };
  
  const statusKeyMap: Record<Harvest['status'], string> = {
      Harvested: 'statusHarvested',
      Pending: 'statusPending',
      'In Transit': 'statusInTransit',
      Delivered: 'statusDelivered',
  };

  return <span className={`px-2 py-0.5 text-[9px] uppercase tracking-widest font-black rounded border ${statusClasses[status]} shadow-sm`}>{t(statusKeyMap[status])}</span>;
};

const ItemMarketPriceDisplay: React.FC<{ 
    item: Harvest | Animal, 
    priceData: MarketPriceData | null, 
    isLoading: boolean, 
    user: User, 
    t: (key: string) => string 
}> = ({ item, priceData, isLoading, user, t }) => {
    if (isLoading) return <div className="mt-4 h-4 w-1/3 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-full"></div>;
    if (!priceData || (!priceData.regional && !priceData.national)) return null;

    const currencySymbol = getCurrencySymbol(user.country);
    const calculatedValue = calculateNodeValue(item, priceData);

    return (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5">
            <div className="flex justify-between items-center mb-2">
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"></span>
                    Unified Market Intelligence
                </p>
                {calculatedValue > 0 && (
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                        Node Val: {currencySymbol}{Math.round(calculatedValue).toLocaleString()}
                    </span>
                )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                {priceData.regional && (
                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border dark:border-white/5">
                        <span className="text-[8px] uppercase font-bold text-slate-400 block mb-0.5">{t('regional')} ({user.state})</span>
                        <span className="font-black text-slate-900 dark:text-white text-xs">{priceData.regional.price}</span>
                    </div>
                )}
                {priceData.national && (
                    <div className="bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border dark:border-white/5">
                        <span className="text-[8px] uppercase font-bold text-slate-400 block mb-0.5">{t('national')} (India)</span>
                        <span className="font-black text-slate-900 dark:text-white text-xs">{priceData.national.price}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const FinancialSummary: React.FC<{ 
    items: (Harvest[] | Animal[]), 
    user: User | null, 
    t: (key: string) => string,
    pricesCache: Record<string, { data: MarketPriceData | null, loading: boolean }>
}> = ({ items, user, t, pricesCache }) => {
    const isCrops = items.length > 0 && 'crop' in items[0];
    const currencySymbol = user ? getCurrencySymbol(user.country) : '₹';

    const uniqueItemGroups = useMemo(() => {
        const map = new Map<string, { name: string; totalQuantity: number; totalValue: number; isLoading: boolean }>();
        
        items.forEach(item => {
            const name = 'crop' in item ? (item as Harvest).crop : (item as Animal).name;
            const lowerName = name.trim().toLowerCase();
            
            const existing = map.get(lowerName) || { name, totalQuantity: 0, totalValue: 0, isLoading: false };
            
            existing.totalQuantity += Number(item.quantity);
            
            const priceObj = pricesCache[lowerName];
            if (priceObj) {
                existing.isLoading = priceObj.loading;
                existing.totalValue += calculateNodeValue(item, priceObj.data);
            }
            
            map.set(lowerName, existing);
        });
        
        return Array.from(map.values());
    }, [items, pricesCache]);

    const grandTotal = useMemo(() => {
        return uniqueItemGroups.reduce((sum, item) => sum + item.totalValue, 0);
    }, [uniqueItemGroups]);

    if (!user || items.length === 0) return null;

    const accentColor = isCrops ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400';
    const borderColorClass = isCrops ? 'border-emerald-500' : 'border-rose-500';
    const bgHeaderClass = isCrops ? 'from-emerald-50 to-transparent dark:from-emerald-900/20' : 'from-rose-50 to-transparent dark:from-rose-900/20';

    return (
        <Card className={`border-l-4 ${borderColorClass} overflow-hidden shadow-xl dark:bg-slate-900/60 mt-10 animate-fade-in-up`}>
             <div className={`bg-gradient-to-r ${bgHeaderClass} -mx-6 -mt-6 px-6 py-4 mb-4 border-b border-slate-100 dark:border-white/5`}>
                <h3 className={`text-lg font-black ${accentColor} tracking-tight flex items-center gap-2 uppercase tracking-widest text-[10px]`}>
                    {isCrops ? 'Crop Portfolio Valuation' : 'Livestock Asset Valuation'}
                </h3>
            </div>
            
            <div className="space-y-4">
                {uniqueItemGroups.map(item => (
                    <div key={item.name} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-white/5 last:border-b-0 group">
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-emerald-600 transition-colors uppercase">{item.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">
                                {item.totalQuantity} {isCrops ? 'kg' : 'head'}
                            </p>
                        </div>
                        <div className="text-right">
                            {item.isLoading ? (
                                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                            ) : item.totalValue > 0 ? (
                                <p className={`font-black ${isCrops ? 'text-emerald-600' : 'text-rose-600'} tabular-nums text-sm`}>
                                    {currencySymbol}{Math.round(item.totalValue).toLocaleString()}
                                </p>
                            ) : (
                                <span className="text-slate-400 text-xs">-</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-slate-200 dark:border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Market Potential</span>
                <p className={`text-2xl font-black ${accentColor} animate-pulse tabular-nums`}>
                    {currencySymbol}{Math.round(grandTotal).toLocaleString()}
                </p>
            </div>
        </Card>
    );
};

const BatchDetailsModal: React.FC<{ 
    item: Harvest | Animal; 
    onClose: () => void; 
    onEdit: (item: Harvest | Animal) => void;
    onDelete: (id: string) => void;
    t: (key: string) => string;
}> = ({ item, onClose, onEdit, onDelete, t }) => {
    const isCrop = 'crop' in item;
    const itemName = isCrop ? (item as Harvest).crop : (item as Animal).name;
    const itemQty = item.quantity;
    const itemWeight = !isCrop ? (item as Animal).weight : undefined;
    const itemUnit = isCrop ? 'kg' : 'head';
    const itemGrade = isCrop ? (item as Harvest).quality : 'N/A';
    const timestamp = new Date(item.timestamp).toLocaleString();
    const batchId = item.id.slice(-6).toUpperCase();

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-pop-in flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b dark:border-white/10 flex justify-between items-center bg-white dark:bg-slate-900 z-10">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Batch Ledger Data</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <XCircleIcon className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Node ID</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">#{batchId}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Item Name</span>
                            <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 uppercase">{itemName}</span>
                        </div>
                        <div className="flex justify-between items-center border-t dark:border-white/5 pt-4">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Registered On</span>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{timestamp}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{isCrop ? 'Total Yield' : 'Group Count'}</span>
                            <span className="text-base font-black text-slate-900 dark:text-white tabular-nums">{itemQty} {itemUnit}</span>
                        </div>
                        {!isCrop && itemWeight && (
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Weight</span>
                                <span className="text-base font-black text-slate-900 dark:text-white tabular-nums">{itemWeight} kg</span>
                            </div>
                        )}
                        {isCrop && (
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quality Grade</span>
                                <span className="text-sm font-black text-slate-900 dark:text-white">{itemGrade}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t dark:border-white/5">
                        <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-[0.2em]">Identified Health History</h4>
                        {item.diagnoses && item.diagnoses.length > 0 ? (
                            <div className="space-y-3">
                                {item.diagnoses.map((diag, idx) => (
                                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-white/5">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-black text-xs text-rose-600 dark:text-rose-400 uppercase">{diag.issue}</p>
                                            <span className="text-[8px] font-bold text-slate-400">{new Date(diag.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{diag.analysis}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[10px] text-slate-400 font-bold uppercase py-2 italic">No previous health issues identified.</p>
                        )}
                    </div>

                    <div className="space-y-4 pt-6">
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => onEdit(item)}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl shadow-lg transition-all active:scale-95"
                            >
                                <PencilIcon className="w-4 h-4" />
                                Edit Node
                            </button>
                            <button 
                                onClick={() => { onClose(); onDelete(item.id); }}
                                className="flex items-center justify-center gap-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all active:scale-95"
                            >
                                <TrashIcon className="w-4 h-4" />
                                Wipe Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TraceScreen: React.FC<TraceScreenProps> = ({ 
  t, user, harvests, animals, language, 
  onAddHarvest, onUpdateHarvest, onDeleteHarvest,
  onAddAnimal, onUpdateAnimal, onDeleteAnimal,
  appMode
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddHarvestModal, setShowAddHarvestModal] = useState(false);
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Harvest | Animal | null>(null);
  const [viewingItem, setViewingItem] = useState<Harvest | Animal | null>(null);
  
  // SESSION PERSISTENT CACHE
  const [pricesCache, setPricesCache] = useState<Record<string, { data: MarketPriceData | null, loading: boolean }>>({});

  const isCrops = appMode === 'crops';
  const titleGradient = isCrops ? 'from-emerald-600 via-green-500 to-emerald-800' : 'from-rose-600 via-pink-500 to-rose-800';

  // Reset filter when mode changes to ensure clean view
  useEffect(() => {
    setFilterStatus('All');
  }, [appMode]);

  const filteredItems = useMemo(() => {
      let items: (Harvest | Animal)[] = isCrops ? harvests : animals;
      if (filterStatus !== 'All' && isCrops) {
          items = (items as Harvest[]).filter(h => h.status === filterStatus);
      }
      return items;
  }, [harvests, animals, isCrops, filterStatus]);

  const uniqueItemsToFetch = useMemo(() => {
    const set = new Set<string>();
    // Collect unique names from both lists to populate cache regardless of active tab
    [...harvests, ...animals].forEach(item => {
        const name = 'crop' in item ? item.crop : item.name;
        const lowerName = name.trim().toLowerCase();
        // Skip cow-only logic as requested previously
        if (!('crop' in item) && lowerName.includes('cow') && !lowerName.includes('cowpea')) return;
        set.add(lowerName);
    });
    return Array.from(set);
  }, [harvests, animals]);

  useEffect(() => {
    if (!user) return;
    
    const fetchPrices = async () => {
        const promises = uniqueItemsToFetch.map(async (lowerName) => {
            // Requirement: Don't change price once fetched until refresh
            if (pricesCache[lowerName]?.data || pricesCache[lowerName]?.loading) return;

            const originalItem = [...harvests, ...animals].find(i => ('crop' in i ? (i as Harvest).crop : (i as Animal).name).toLowerCase() === lowerName);
            if (!originalItem) return;
            
            const itemName = 'crop' in originalItem ? (originalItem as Harvest).crop : (originalItem as Animal).name;
            const itemType = 'crop' in originalItem ? 'crop' : 'animal';
            const itemBreed = 'breed' in originalItem ? (originalItem as Animal).breed : undefined;
            
            setPricesCache(prev => ({ ...prev, [lowerName]: { data: null, loading: true } }));
            try {
                const data = await getMarketPrice(itemName, itemType, itemBreed, user);
                setPricesCache(prev => ({ ...prev, [lowerName]: { data, loading: false } }));
            } catch (e) {
                setPricesCache(prev => ({ ...prev, [lowerName]: { data: null, loading: false } }));
            }
        });
        await Promise.all(promises);
    };
    fetchPrices();
  }, [uniqueItemsToFetch, user]);

  const productionChartData = useMemo(() => {
      const totals: Record<string, number> = {};
      filteredItems.forEach(item => {
          const name = isCrops ? (item as Harvest).crop : (item as Animal).name;
          totals[name] = (totals[name] || 0) + Number(item.quantity);
      });
      return Object.entries(totals)
          .map(([name, qty]) => ({ name, qty }))
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 7); 
  }, [filteredItems, isCrops]);

  const chartColors = isCrops 
    ? ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'] 
    : ['#e11d48', '#f43f5e', '#fb7185', '#fda4af', '#fecdd3', '#fff1f2'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-32 animate-fade-in px-2">
      <div className="text-center">
          <h2 className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${titleGradient} tracking-tighter uppercase leading-none`}>{t('traceLedger')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">{isCrops ? 'Track your Harvests' : 'Track your Livestock'}</p>
      </div>

      <div className="flex flex-col gap-6">
        <button 
          onClick={() => isCrops ? setShowAddHarvestModal(true) : setShowAddAnimalModal(true)}
          className={`w-full py-5 rounded-[2rem] text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-4 ${isCrops ? 'bg-gradient-to-r from-emerald-800 to-emerald-600 shadow-emerald-500/20' : 'bg-gradient-to-r from-rose-800 to-rose-600 shadow-rose-900/30'}`}
        >
          <div className="bg-white/20 p-2 rounded-full backdrop-blur-md"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></div>
          {isCrops ? t('logNewHarvest') : t('logNewAnimal')}
        </button>

        {isCrops && (
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
                {['All', 'Harvested', 'In Transit', 'Pending', 'Delivered'].map(status => (
                    <button 
                        key={status} 
                        onClick={() => setFilterStatus(status)}
                        className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap shadow-sm border ${filterStatus === status ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-100 dark:border-white/5 hover:bg-slate-50'}`}
                    >
                        {status === 'All' ? t('all') : t(`status${status.replace(' ', '')}` as any)}
                    </button>
                ))}
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredItems.length > 0 ? (
              filteredItems.map((item, idx) => {
                  const isCropItem = 'crop' in item;
                  const name = isCropItem ? (item as Harvest).crop : (item as Animal).name;
                  const cacheKey = name.trim().toLowerCase();
                  const priceInfo = pricesCache[cacheKey] || { data: null, loading: false };
                  
                  return (
                      <div key={item.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <Card className="group hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-[2.5rem] border border-slate-100 dark:border-white/5 relative h-full flex flex-col">
                              <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 pointer-events-none ${isCrops ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                              
                              <div className="flex justify-between items-start mb-6">
                                  <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isCrops ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'}`}>{isCrops ? 'Crop node' : 'Livestock Node'}</span>
                                          <span className="text-[10px] text-slate-300 font-mono">#{item.id.slice(-6)}</span>
                                      </div>
                                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter group-hover:translate-x-1 transition-transform uppercase">{t(name.toLowerCase()) || name}</h3>
                                      {isCropItem && <StatusBadge status={(item as Harvest).status} t={t} />}
                                  </div>
                                  <div className="text-right">
                                      <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">{item.quantity}<span className="text-[10px] ml-1 opacity-40 font-bold uppercase tracking-widest">{isCrops ? 'kg' : 'head'}</span></p>
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-1">{new Date(item.timestamp).toLocaleDateString()}</p>
                                  </div>
                              </div>

                              {user && <ItemMarketPriceDisplay item={item} priceData={priceInfo.data} isLoading={priceInfo.loading} user={user} t={t} />}
                              
                              <div className="mt-auto pt-6 flex gap-3">
                                  <button onClick={() => setViewingItem(item)} className="flex-grow py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors border border-slate-100 dark:border-white/5">{t('showDetails')}</button>
                                  <button onClick={() => { if(isCrops) onDeleteHarvest(item.id); else onDeleteAnimal(item.id); }} className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 transition-all active:scale-90"><TrashIcon className="w-5 h-5"/></button>
                              </div>
                          </Card>
                      </div>
                  );
              })
          ) : (
              <div className="col-span-full py-24 text-center bg-white/20 dark:bg-slate-900/30 backdrop-blur-md rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-white/5">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse"><span className="text-5xl opacity-20">📊</span></div>
                <h3 className="text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">Repository Empty</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Initiate logging to populate data nodes</p>
              </div>
          )}
      </div>

      <FinancialSummary items={isCrops ? harvests : animals} user={user} t={t} pricesCache={pricesCache} />

      {productionChartData.length > 0 && (
          <Card title={<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-black uppercase tracking-widest text-sm">{isCrops ? t('productionAnalytics') : t('livestockAnalytics')}</span>} className="dark:bg-slate-900/40 rounded-[2.5rem]">
              <div className="h-64 mt-6">
                  <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={productionChartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                          <Tooltip 
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }} 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontWeight: 'bold', fontSize: '12px' }}
                          />
                          <Bar dataKey="qty" radius={[10, 10, 0, 0]} barSize={40}>
                              {productionChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                              ))}
                          </Bar>
                      </BarChart>
                  </ResponsiveContainer>
              </div>
          </Card>
      )}

      {viewingItem && (
          <BatchDetailsModal 
            item={viewingItem} 
            t={t} 
            onClose={() => setViewingItem(null)} 
            onDelete={(id) => isCrops ? onDeleteHarvest(id) : onDeleteAnimal(id)} 
            onEdit={(item) => { setEditingItem(item); setViewingItem(null); if (isCrops) setShowAddHarvestModal(true); else setShowAddAnimalModal(true); }} 
          />
      )}

      {showAddHarvestModal && (
          <LogHarvestForm t={t} language={language} onClose={() => { setShowAddHarvestModal(false); setEditingItem(null); }} harvestToEdit={editingItem as Harvest} onSave={(data) => { if (editingItem) onUpdateHarvest({ ...editingItem, ...data } as Harvest); else onAddHarvest(data); setShowAddHarvestModal(false); setEditingItem(null); }} />
      )}

      {showAddAnimalModal && (
          <LogAnimalForm t={t} language={language} onClose={() => { setShowAddAnimalModal(false); setEditingItem(null); }} animalToEdit={editingItem as Animal} onSave={(data) => { if (editingItem) onUpdateAnimal({ ...editingItem, ...data } as Animal); else onAddAnimal(data); setShowAddAnimalModal(false); setEditingItem(null); }} />
      )}
    </div>
  );
};

export default TraceScreen;
