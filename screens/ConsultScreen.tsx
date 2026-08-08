
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import { AppMode, User, ConsultationRequest, Rating } from '../types';
import Spinner from '../components/Spinner';
import { certificationData } from '../certificationData';
import { StarIcon } from '../components/icons/StarIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import { getDistance } from '../utils/locationUtils';
import { MapIcon } from '../components/icons/MapIcon';
import { ListBulletIcon } from '../components/icons/ListBulletIcon';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';
import InitialNoticeModal from '../components/InitialNoticeModal';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { getCurrencySymbol } from '../utils/currencyUtils';
import { fileToBase64 } from '../utils/fileUtils';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { LocationMarkerIcon } from '../components/icons/LocationMarkerIcon';
import { PencilIcon } from '../components/icons/PencilIcon';
import { TrashIcon } from '../components/icons/TrashIcon';
import { GoogleGenAI } from "@google/genai";
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { PaperAirplaneIcon } from '../components/icons/PaperAirplaneIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import * as firebaseService from '../services/firebaseService';

interface ConsultScreenProps {
  t: (key: string) => string;
  appMode: AppMode;
  user: User | null;
  language: string;
  prefillData?: Partial<ConsultationRequest> | null;
}

const ExpertMapView: React.FC<{
  consultants: (User & { distance: number })[];
  user: User;
  onViewProfile: (expert: User) => void;
  t: (key: string) => string;
  appMode: AppMode;
}> = ({ consultants, user, onViewProfile, t, appMode }) => {
  const [activeExpert, setActiveExpert] = useState<User | null>(null);
  const isCrops = appMode === 'crops';
  const pinColor = isCrops ? 'text-emerald-500' : 'text-pink-500';
  const linkColor = isCrops ? 'text-emerald-600 dark:text-emerald-400' : 'text-pink-600 dark:text-pink-400';
  const placeholderColor = isCrops ? 'text-emerald-200' : 'text-pink-200';

  const points = useMemo(() => {
    const allPoints: (User & { type: 'expert' | 'user' })[] = [];
    if (user.latitude && user.longitude) {
      allPoints.push({ ...user, type: 'user' });
    }
    consultants.forEach(c => {
      if (c.latitude && c.longitude) {
        allPoints.push({ ...c, type: 'expert' });
      }
    });
    return allPoints;
  }, [consultants, user]);

  const bounds = useMemo(() => {
    if (points.length < 1) return null;
    const lats = points.map(p => p.latitude!);
    const lons = points.map(p => p.longitude!);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const latPadding = (maxLat - minLat) * 0.1 || 0.1;
    const lonPadding = (maxLon - minLon) * 0.1 || 0.1;
    return {
      minLat: minLat - latPadding,
      maxLat: maxLat + latPadding,
      minLon: minLon - lonPadding,
      maxLon: maxLon + lonPadding,
    };
  }, [points]);

  if (!bounds) {
    return (
      <Card>
        <p className="text-center text-gray-500">{t('locationDataMissing')}</p>
      </Card>
    );
  }

  const getPosition = (lat: number, lon: number) => {
    const latRange = bounds.maxLat - bounds.minLat;
    const lonRange = bounds.maxLon - bounds.minLon;
    const top = latRange > 0 ? ((bounds.maxLat - lat) / latRange) * 100 : 50;
    const left = lonRange > 0 ? ((lon - bounds.minLon) / lonRange) * 100 : 50;
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <Card className="!p-0 overflow-hidden rounded-[2rem] border-2 border-slate-100 dark:border-white/5">
      <div className="relative w-full h-80 sm:h-96 bg-slate-50 dark:bg-slate-900 overflow-hidden shadow-inner">
        {points.map((point, index) => {
          if (!point.latitude || !point.longitude) return null;
          const { top, left } = getPosition(point.latitude, point.longitude);
          if (point.type === 'user') {
            return (
              <div key="user-location" className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ top, left, zIndex: 5 }}>
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-8 h-8 bg-blue-500 rounded-full animate-ping opacity-40"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900 shadow-xl"></div>
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap uppercase tracking-widest">{t('you')}</span>
              </div>
            );
          }
          return (
            <div key={point.consultantId || index} className="absolute transform -translate-x-1/2 -translate-y-full" style={{ top, left, zIndex: activeExpert?.consultantId === point.consultantId ? 10 : 1 }}>
              <button onClick={() => setActiveExpert(point === activeExpert ? null : point)} className="focus:outline-none transition-all active:scale-90 hover:scale-110">
                <LocationMarkerIcon className={`w-8 h-8 ${pinColor} drop-shadow-[0_0_8px_rgba(0,0,0,0.2)]`} />
              </button>
              {activeExpert?.consultantId === point.consultantId && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 sm:w-64 bg-white dark:bg-slate-800 rounded-[1.5rem] shadow-2xl p-4 z-20 border dark:border-white/10 animate-pop-in">
                    <button onClick={() => setActiveExpert(null)} className="absolute -top-2 -right-2 text-slate-400 bg-white dark:bg-slate-800 rounded-full shadow-md hover:text-slate-600 active:scale-90"><XCircleIcon className="w-6 h-6"/></button>
                    <div className="flex items-start gap-4">
                        {point.profilePictureUrl ? ( <img src={point.profilePictureUrl} alt={point.name} className="w-10 h-10 rounded-2xl object-cover shadow-sm"/> ) : ( <UserCircleIcon className={`w-10 h-10 ${placeholderColor}`}/> )}
                        <div className="flex-grow">
                            <p className="font-black text-slate-900 dark:text-white text-xs leading-tight mb-1">{point.name}</p>
                            <div className="flex items-center gap-1 mb-2">
                                <StarIcon className="w-3 h-3 text-amber-400" filled={true}/>
                                <span className="text-[9px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{point.averageRating?.toFixed(1) || 'New'}</span>
                            </div>
                            <button onClick={() => onViewProfile(point)} className={`text-[9px] font-black uppercase tracking-[0.15em] ${linkColor} hover:underline`}>{t('viewProfile')}</button>
                        </div>
                    </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const RequestCard: React.FC<{
    request: ConsultationRequest, 
    t:(key:string)=>string, 
    onRate:()=>void, 
    onAction: (req: ConsultationRequest, action: 'accept' | 'decline' | 'negotiate', counterPrice?: number) => void, 
    onNegotiate:()=>void,
    onEdit: (req: ConsultationRequest) => void,
    onDelete: (id: string) => void,
    appMode: AppMode
}> = ({ request, t, onRate, onAction, onNegotiate, onEdit, onDelete, appMode }) => {
    const expertOffer = request.negotiationHistory?.slice().reverse().find(h => h.author === 'expert');
    const currencySymbol = getCurrencySymbol(request.farmerLocation);
    const isCrops = appMode === 'crops';
    const accentColor = isCrops ? 'border-emerald-500' : 'border-rose-500';
    const acceptBtnClass = isCrops ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700';

    const getStatusUI = () => {
        switch (request.status) {
            case 'Responded': return <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm">{t('responded')}</span>;
            case 'Declined': return <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-sm">{t('requestDeclined')}</span>;
            case 'Accepted': return <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-sm">{t('offerAccepted')}</span>;
            case 'In Negotiation': return <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-sm">{t('waitingForFarmer')}</span>;
            default: return <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-sm">{t('statusPending')}</span>;
        }
    };
    
    return (
        <Card className={`group hover:shadow-2xl transition-all duration-500 border-l-8 ${accentColor} !p-0 overflow-hidden rounded-[2.5rem]`}>
            <div className="relative p-5 md:p-8">
                <div className="absolute top-4 right-4 flex gap-2 z-30">
                    {request.status === 'Pending' && (
                        <button type="button" onClick={() => onEdit(request)} className="text-slate-400 hover:text-blue-600 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors active:scale-90">
                            <PencilIcon className="w-5 h-5" />
                        </button>
                    )}
                    <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(request.id); }} className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-90">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-lg aspect-square md:aspect-auto md:h-full group-hover:scale-[1.02] transition-transform duration-500">
                            {request.media.type === 'image' && <img src={request.media.dataUrl} alt="Consultation" className="object-cover w-full h-full" />}
                            {request.media.type === 'video' && <video src={request.media.dataUrl} controls className="w-full h-full object-cover" />}
                        </div>
                    </div>
                    <div className="md:col-span-8 lg:col-span-9 flex flex-col justify-between">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pr-12 md:pr-0">
                                <div className="space-y-1">
                                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{t('problemDescription')}</h4>
                                    <p className="text-sm md:text-base text-slate-800 dark:text-slate-100 font-bold leading-relaxed line-clamp-3">{request.description}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-x-6 gap-y-4 pt-2">
                                <div className="space-y-1">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">{t('status')}</h4>
                                    {getStatusUI()}
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Timestamp</h4>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{new Date(request.timestamp).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4">
                            {expertOffer && request.status === 'In Negotiation' && (
                                <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-[1.25rem] border border-amber-100 dark:border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-pop-in">
                                    <p className="font-black text-amber-800 dark:text-amber-300 text-xs tracking-tight">{t('expertCounterOffer').replace('{price}', `${currencySymbol}${expertOffer.price}`)}</p>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button onClick={() => onAction(request, 'accept')} className={`flex-1 px-4 py-2 text-white text-[8px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 ${acceptBtnClass}`}>{t('accept')}</button>
                                        <button onClick={onNegotiate} className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[8px] font-black uppercase tracking-widest rounded-xl hover:bg-amber-50 transition-all active:scale-95">{t('negotiate')}</button>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex flex-wrap gap-3">
                                {request.status === 'Responded' && !request.isRated && (
                                    <button onClick={onRate} className="w-full bg-amber-400 text-amber-900 font-black uppercase tracking-widest text-xs py-3.5 rounded-2xl hover:bg-amber-500 transition shadow-xl flex items-center justify-center gap-3 active:scale-95">
                                        <StarIcon className="w-5 h-5"/>
                                        {t('rateYourConsultation')}
                                    </button>
                                )}
                                {request.status === 'Pending' && (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full">
                                        <button onClick={() => onAction(request, 'accept', request.price)} className={`col-span-2 lg:col-span-2 text-white font-black uppercase tracking-widest text-[9px] py-3.5 rounded-2xl shadow-xl transition-all active:scale-95 ${acceptBtnClass}`}>{t('acceptAndContact')}</button>
                                        <button onClick={onNegotiate} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black uppercase tracking-widest text-[9px] py-3.5 rounded-2xl hover:bg-slate-50 transition shadow-md active:scale-95">{t('counterOffer')}</button>
                                        <button onClick={() => onAction(request, 'decline')} className="text-red-600 font-black uppercase tracking-widest text-[9px] py-3.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95">{t('decline')}</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ExpertCard: React.FC<{
    expert: User & {distance: number}, 
    t:(key:string)=>string, 
    onSelect:()=>void, 
    onViewProfile:()=>void,
    appMode: AppMode
}> = ({ expert, t, onSelect, onViewProfile, appMode }) => {
    const currencySymbol = expert.priceCurrency ? getCurrencySymbol(expert.country || 'India') : '₹';
    const isCrops = appMode === 'crops';
    const btnClass = isCrops ? 'bg-[#16a34a] hover:bg-[#15803d]' : 'bg-[#db2777] hover:bg-[#be185d]';
    const badgeColor = isCrops ? 'text-[#16a34a]' : 'text-[#db2777]';
    const initial = expert.name.charAt(0).toUpperCase();

    return (
        <Card className="!p-0 group overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-slate-100 dark:border-white/5 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
            <div className="flex flex-row items-stretch h-full">
                {/* Left Side: Scaled Image/Placeholder */}
                <div className="w-24 sm:w-1/3 min-w-[96px] bg-[#4a342e] flex items-center justify-center relative overflow-hidden flex-shrink-0">
                    {expert.profilePictureUrl ? (
                        <img src={expert.profilePictureUrl} alt={expert.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[5s]" />
                    ) : (
                        <span className="text-white text-4xl sm:text-7xl font-black opacity-40">{initial}</span>
                    )}
                </div>

                {/* Right Side: Tighter Details */}
                <div className="flex-grow p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <div className="min-w-0 flex-grow">
                                <h3 className="font-black text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight truncate">{expert.name}</h3>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${badgeColor}`}>{t(expert.consultantType as any)}</span>
                                    <div className="flex items-center gap-1">
                                        <StarIcon className="w-3 h-3 text-amber-400" filled={true}/>
                                        <span className="text-[10px] font-black text-amber-500 uppercase">New</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <LocationMarkerIcon className="w-3 h-3 mr-1 opacity-50"/>
                            <span className="truncate">{expert.distance !== Infinity ? `${Math.round(expert.distance)} KM AWAY` : expert.location.toUpperCase()}</span>
                        </div>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed italic pr-2">
                            "{expert.bio || `Professional consultant dedicated to...`}"
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 sm:pt-6 border-t dark:border-white/5 mt-auto">
                        <div className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tabular-nums">{currencySymbol}{expert.consultationPrice || 'N/A'}</span>
                            <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-widest text-slate-400">FIXED</span>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            <button onClick={onViewProfile} className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${badgeColor} hover:underline transition-all`}>DETAILS</button>
                            <button onClick={onSelect} className={`text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-xl transition-all active:scale-95 ${btnClass}`}>REQUEST</button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ViewProfileModal: React.FC<{expert: User, t:(key:string)=>string, onClose:()=>void, appMode: AppMode}> = ({ expert, t, onClose, appMode }) => {
    const allCourses = [...certificationData.agronomist, ...certificationData.veterinarian];
    const currencySymbol = expert.priceCurrency ? getCurrencySymbol(expert.country || 'India') : '₹';
    const isCrops = appMode === 'crops';
    const headerBg = isCrops ? 'from-emerald-800 to-emerald-950' : 'from-pink-800 to-pink-950';

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl dark:border dark:border-white/10 overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col animate-pop-in border-4 border-white dark:border-slate-800">
                <div className={`p-6 sm:p-10 relative flex-shrink-0 bg-gradient-to-br ${headerBg} text-white`}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"><XCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" /></button>
                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                        <div className="relative">
                            {expert.profilePictureUrl ? (
                                <img src={expert.profilePictureUrl} alt={expert.name} className="w-24 h-24 sm:w-36 sm:h-36 rounded-[2rem] object-cover border-4 border-white/20 shadow-2xl" />
                            ) : (
                                <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-[2rem] bg-white/10 backdrop-blur-md flex items-center justify-center border-2 border-white/10"><UserCircleIcon className="w-14 h-14 sm:w-20 sm:h-20 text-white/40" /></div>
                            )}
                            {expert.degreeVerificationStatus === 'verified' && (
                                <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white rounded-full p-1.5 sm:p-2 shadow-xl border-2 sm:border-4 border-emerald-500">
                                    <ShieldCheckIcon className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />
                                </div>
                            )}
                        </div>
                        <div className="text-center sm:text-left space-y-1 sm:space-y-2 min-w-0">
                            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter leading-none break-words px-2 sm:px-0">{expert.name}</h2>
                            <p className="text-white/60 font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs">{t(expert.consultantType as any)}</p>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1 sm:pt-2">
                                <span className="bg-white/10 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5"><LocationMarkerIcon className="w-3 h-3"/> {expert.location}</span>
                                <span className="bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg flex items-center gap-1"><StarIcon className="w-3 h-3" filled/> {expert.averageRating?.toFixed(1) || 'New'}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="overflow-y-auto p-6 sm:p-10 space-y-8 sm:space-y-10 no-scrollbar">
                    <div className="grid grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center p-3 sm:p-5 bg-slate-50 dark:bg-white/5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-white/5">
                            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('reviews')}</p>
                            <p className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tabular-nums">{expert.ratings?.length || 0}</p>
                        </div>
                        <div className="text-center p-3 sm:p-5 bg-slate-50 dark:bg-white/5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-white/5">
                            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Exp.</p>
                            <p className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tabular-nums">{expert.yearsOfExperience || '0'}<span className="text-[7px] sm:text-[8px] ml-0.5">Yrs</span></p>
                        </div>
                        <div className="text-center p-3 sm:p-5 bg-slate-50 dark:bg-white/5 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-white/5">
                            <p className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('price')}</p>
                            <p className="font-black text-lg sm:text-xl text-slate-900 dark:text-white tabular-nums">{currencySymbol}{expert.consultationPrice || '0'}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-1">{t('professionalBio')}</h4>
                        <div className="bg-slate-50 dark:bg-white/5 p-5 rounded-[1.5rem] sm:rounded-[2rem] text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic font-medium">
                            "{expert.bio || 'Dedicating expertise to empower the agricultural community and ensure sustainable growth.'}"
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-1">{t('completedCertifications')}</h4>
                        {(expert.completedCertifications || []).filter(c => c !== 'expert_onboarding').length > 0 ? (
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {(expert.completedCertifications || []).filter(c => c !== 'expert_onboarding').map(certId => {
                                const certDetails = allCourses.find(c => c.id === certId);
                                return (
                                    <div key={certId} className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl sm:rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                                        <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 flex-shrink-0"/>
                                        <span className="text-[10px] sm:text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tighter">{certDetails ? t(certDetails.titleKey as any) : certId}</span>
                                    </div>
                                );
                            })}
                           </div>
                        ) : <p className="text-[10px] italic text-slate-400 ml-1">{t('noCertificationsYet')}</p>}
                    </div>

                    <div className="space-y-3 pb-6">
                        <h4 className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] ml-1">{t('reviews')}</h4>
                        {expert.ratings && expert.ratings.length > 0 ? (
                            <div className="space-y-3">
                                {expert.ratings.slice(0, 3).map((rating, index) => (
                                    <div key={index} className="glass-card p-4 rounded-2xl shadow-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-black text-xs text-slate-900 dark:text-white tracking-tight">{rating.farmerName}</p>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} className={`w-2.5 h-2.5 ${i < rating.rating ? 'text-amber-400' : 'text-slate-200 dark:text-slate-700'}`} filled={i < rating.rating} />
                                                ))}
                                            </div>
                                        </div>
                                        {rating.comment && <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">"{rating.comment}"</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[10px] italic text-slate-400 ml-1">{t('noReviewsYet')}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const RateConsultationModal: React.FC<{request: ConsultationRequest, expert: User, t:(key:string)=>string, onClose:()=>void, onSubmit:(rating: number, comment: string)=>void, isLoading: boolean, language: string, appMode: AppMode}> = ({ request, expert, t, onClose, onSubmit, isLoading, language, appMode}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const isCrops = appMode === 'crops';
    const accentColor = isCrops ? 'text-emerald-500' : 'text-pink-500';
    const btnClass = isCrops ? 'bg-[#16a34a] hover:bg-[#15803d]' : 'bg-[#db2777] hover:bg-[#be185d]';

    const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');
    const baseCommentRef = useRef('');

    useEffect(() => {
        if (isListening) {
            setComment(baseCommentRef.current + (baseCommentRef.current && transcript ? ' ' : '') + transcript);
        }
    }, [transcript, isListening]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            baseCommentRef.current = comment;
            startListening();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
            <Card className="max-w-md w-full animate-pop-in rounded-[2rem] !p-6 sm:!p-8 shadow-2xl border-4 border-white dark:border-slate-800">
                <div className="text-center space-y-5">
                    <div className="relative inline-block">
                         <StarIcon className={`w-16 h-16 sm:w-20 sm:h-20 ${accentColor} mx-auto animate-pulse`}/>
                         <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="text-xl sm:text-2xl font-black tracking-tighter uppercase leading-tight">{t('rateYourConsultation')}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium" dangerouslySetInnerHTML={{__html: t('howWasYourExperience').replace('{expertName}', `<strong class="text-slate-900 dark:text-white">${expert.name}</strong>`)}} />
                    </div>
                    
                    <div className="flex justify-center gap-1.5 sm:gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button key={star} onClick={() => setRating(star)} className="transform transition-all active:scale-90 hover:scale-110">
                                <StarIcon className={`w-8 h-8 sm:w-10 sm:h-10 ${rating >= star ? 'text-amber-400 drop-shadow-xl' : 'text-slate-200 dark:text-slate-700'}`} filled={rating >= star} />
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder={t('addAComment')} className="w-full rounded-2xl sm:rounded-3xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-900 p-4 sm:p-5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner font-bold dark:text-white" />
                        {hasRecognitionSupport && (
                            <button onClick={handleMicClick} className={`absolute bottom-3 right-3 sm:bottom-4 sm:right-4 p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg scale-110' : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
                                <MicrophoneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 py-3 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-slate-600 transition-colors">{t('cancel')}</button>
                        <button onClick={() => onSubmit(rating, comment)} disabled={rating === 0 || isLoading} className={`flex-[2] text-white font-black uppercase tracking-widest text-[9px] py-3 rounded-xl sm:rounded-2xl disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 shadow-xl transition-all active:scale-95 ${btnClass}`}>
                            {isLoading ? <Spinner appMode={appMode}/> : t('submitRating')}
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    )
};

const CounterOfferModal: React.FC<{request: ConsultationRequest, t:(key:string)=>string, onAction: (req: ConsultationRequest, action: 'negotiate', counterPrice: number) => void, onClose:()=>void, appMode: AppMode}> = ({ request, t, onAction, onClose, appMode }) => {
    const [counterPrice, setCounterPrice] = useState<number | ''>('');
    const expertOffer = request.negotiationHistory?.slice().reverse().find(h => h.author === 'expert');

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4">
            <Card className="max-w-sm w-full animate-pop-in rounded-[2rem] !p-6 sm:!p-8 shadow-2xl border-4 border-white dark:border-slate-800">
                <div className="text-center space-y-6">
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                        <p className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em] mb-1">{t('expertOffer')}</p>
                        <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tabular-nums">₹{expertOffer?.price}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest text-left ml-2">{t('yourOffer')}:</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm sm:text-base">₹</span>
                            <input type="number" value={counterPrice} onChange={e => setCounterPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl sm:rounded-3xl pl-8 pr-4 py-3 sm:pl-10 sm:pr-6 sm:py-4 text-lg sm:text-xl font-black outline-none focus:ring-2 focus:ring-blue-500 shadow-inner dark:text-white" placeholder="0" autoFocus />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 text-slate-400 font-black uppercase tracking-widest text-[9px] hover:text-slate-600 transition-colors">{t('cancel')}</button>
                        <button onClick={() => onAction(request, 'negotiate', Number(counterPrice))} disabled={!counterPrice} className="flex-[2] bg-blue-600 text-white font-black uppercase tracking-widest text-[9px] py-3 rounded-xl sm:rounded-2xl shadow-xl transition-all active:scale-95 hover:bg-blue-700">{t('submitCounterOffer')}</button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

const ConsultScreen: React.FC<ConsultScreenProps> = ({ t, appMode, user, language, prefillData }) => {
  const [activeTab, setActiveTab] = useState<'findExpert' | 'request' | 'myRequests'>('findExpert');
  const [consultants, setConsultants] = useState<User[]>([]);
  const [selectedConsultant, setSelectedConsultant] = useState<User | null>(null);
  const [requestToRate, setRequestToRate] = useState<ConsultationRequest | null>(null);
  const [counterOfferRequest, setCounterOfferRequest] = useState<ConsultationRequest | null>(null);
  const [chosenExpert, setChosenExpert] = useState<User | null>(null);
  const [requestSubmittedNotice, setRequestSubmittedNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'price_asc' | 'price_desc' | 'rating'>('distance');
  const [editingRequest, setEditingRequest] = useState<ConsultationRequest | null>(null);

  const [description, setDescription] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState<ConsultationRequest['urgency']>('Medium');
  const [price, setPrice] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [myRequests, setMyRequests] = useState<ConsultationRequest[]>([]);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  
  const [isFreeConsultation, setIsFreeConsultation] = useState(false);
  const [freeConsultationsCount, setFreeConsultationsCount] = useState(0);
  const [showLocationWarning, setShowLocationWarning] = useState(false);

  const isCrops = appMode === 'crops';
  const headerColor = isCrops ? 'text-[#16a34a]' : 'text-[#db2777]';
  const headerTitle = isCrops ? 'EXPERT CROP CONSULTATION' : 'EXPERT VET-CONSULTATION';
  const primaryBtnClass = isCrops ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700';

  const categories = appMode === 'crops' ? certificationData.agronomist : certificationData.veterinarian;

  const sortedConsultants = useMemo(() => {
    const filtered = consultants.filter(c => c.consultantType === (appMode === 'crops' ? 'agronomist' : 'veterinarian'));
    const consultantsWithDistance = filtered.map(c => ({
        ...c,
        distance: (user?.latitude && user.longitude && c.latitude && c.longitude) ? getDistance(user.latitude, user.longitude, c.latitude, c.longitude) : Infinity
      }));

    return consultantsWithDistance.sort((a, b) => {
        switch(sortBy) {
          case 'rating': return (b.averageRating || 0) - (a.averageRating || 0);
          case 'price_asc': return (a.consultationPrice || Infinity) - (b.consultationPrice || Infinity);
          case 'price_desc': return (b.consultationPrice || 0) - (a.consultationPrice || 0);
          case 'distance':
          default: return a.distance - b.distance;
        }
      });
  }, [consultants, appMode, user, sortBy]);

  useEffect(() => {
      if (prefillData) {
          setDescription(prefillData.description || '');
          setCategory(prefillData.category || '');
          if (prefillData.media?.dataUrl) {
              setMediaPreview(prefillData.media.dataUrl);
              setMediaType(prefillData.media.type || 'image');
          }
          setActiveTab('request');
      }
  }, [prefillData]);

  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');
  
  const baseDescriptionRef = useRef('');
  useEffect(() => {
      if (isListening) {
          setDescription(baseDescriptionRef.current + (baseDescriptionRef.current && transcript ? ' ' : '') + transcript);
      }
  }, [transcript, isListening]);

  const handleMicClick = () => {
      if (isListening) {
          stopListening();
      } else {
          baseDescriptionRef.current = description;
          startListening();
      }
  };

  const fetchExperts = async () => {
        const experts = await firebaseService.getAllExperts();
        setConsultants(experts);
  };

  useEffect(() => { fetchExperts(); }, []);

  useEffect(() => {
    if (!user) return;
    const fetchRequests = async () => {
        const allRequests = await firebaseService.getConsultationRequests('farmer', user.phone);
        const userRequests = allRequests.filter(r => r.farmerId === user.phone);
        setMyRequests(userRequests);
        const freeUsed = userRequests.filter(r => r.isFree).length;
        setFreeConsultationsCount(Math.max(0, 3 - freeUsed));
        setIsFreeConsultation(3 - freeUsed > 0);
    };
    fetchRequests();
  }, [user, activeTab, requestSubmittedNotice]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaType(file.type.startsWith('image') ? 'image' : 'video');
      const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
      });
      setMediaPreview(dataUrl);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !description || !mediaPreview || !urgency || (!isFreeConsultation && price === '')) {
      setError(t('formIncompleteError'));
      return;
    }
    setIsLoading(true);
    setError('');

    try {
        const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
        const base64Data = mediaPreview.split(',')[1];
        const mimeType = mediaPreview.split(';')[0].split(':')[1];
        const validationPrompt = `Validator for AgriLink. Mode: '${appMode}'. Rules: Crops mode requires plants/soil/farm. Animals mode requires livestock/feed. Return JSON { "isValid": boolean, "message": string }.`;
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ inlineData: { mimeType: mimeType, data: base64Data } }, { text: validationPrompt }] },
            config: { responseMimeType: 'application/json' }
        });
        const validationResult = JSON.parse(response.text.trim());
        if (!validationResult.isValid) {
            setError(validationResult.message || "Invalid image for this section.");
            setIsLoading(false);
            return; 
        }

        const newRequest: ConsultationRequest = {
            id: editingRequest ? editingRequest.id : `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            farmerName: user!.name,
            farmerPhone: user!.phone,
            farmerLocation: user!.location,
            type: appMode,
            description,
            media: { dataUrl: mediaPreview!, type: mediaType! },
            urgency,
            timestamp: new Date().toISOString(),
            status: 'Pending',
            category,
            farmerId: user!.phone,
            isFree: isFreeConsultation,
            price: isFreeConsultation ? 0 : Number(price),
            consultantId: chosenExpert?.consultantId,
            farmerLatitude: user?.latitude,
            farmerLongitude: user?.longitude,
            negotiationHistory: (price && !isFreeConsultation) ? [{ author: 'farmer', price: Number(price), timestamp: new Date().toISOString() }] : []
        };

        if (editingRequest) {
             await firebaseService.updateConsultationStatus(editingRequest.id, 'Pending', newRequest);
             setRequestSubmittedNotice(t('requestUpdated'));
        } else {
             await firebaseService.createConsultationRequest(newRequest);
             const notice = chosenExpert 
                ? t('requestSubmittedToExpertMessage').replace('{expertName}', chosenExpert.name).replace('{phone}', user!.phone)
                : t('requestSubmittedMessage').replace('{phone}', user!.phone);
             setRequestSubmittedNotice(notice);
        }
        cancelEdit();
        setChosenExpert(null);
    } catch (err) {
        setError("Failed to submit request. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRatingSubmit = async (rating: number, comment: string) => {
      if (!requestToRate || !requestToRate.consultantId) return;
        setIsSubmittingRating(true);
        try {
            const ratingData: Rating = { farmerName: user?.name || 'Anonymous', rating: rating, comment: comment, timestamp: new Date().toISOString() };
            await firebaseService.addExpertRating(requestToRate.consultantId, ratingData);
            setMyRequests(prev => prev.map(r => r.id === requestToRate.id ? { ...r, isRated: true } : r));
            await fetchExperts();
            alert(t('ratingSubmitted'));
        } catch (error) {
            alert("Failed to submit rating.");
        } finally {
            setIsSubmittingRating(false);
            setRequestToRate(null);
        }
  };

  const handleRequestAction = async (req: ConsultationRequest, action: 'accept' | 'decline' | 'negotiate', counterPrice?: number) => {
      const expertOffer = req.negotiationHistory?.slice().reverse().find(h => h.author === 'expert');
      let newStatus: ConsultationRequest['status'] = req.status;
      let updates: Partial<ConsultationRequest> = {};
      if (action === 'accept' && expertOffer) { newStatus = 'Accepted'; updates.finalPrice = expertOffer!.price; } 
      else if (action === 'decline') { newStatus = 'Declined'; } 
      else if (action === 'negotiate' && counterPrice) { updates.negotiationHistory = [...(req.negotiationHistory || []), { author: 'farmer', price: counterPrice, timestamp: new Date().toISOString() }]; }
      await firebaseService.updateConsultationStatus(req.id, newStatus, updates);
      setMyRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: newStatus, ...updates } : r));
      setCounterOfferRequest(null);
  };
  
  const handleDeleteRequest = async (id: string) => {
    if (window.confirm(t('confirmDeleteRequest'))) {
        await firebaseService.deleteConsultationRequest(id);
        setMyRequests(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEditRequest = (req: ConsultationRequest) => {
    setEditingRequest(req);
    setDescription(req.description);
    setCategory(req.category);
    setUrgency(req.urgency);
    setPrice(req.price || '');
    setMediaPreview(req.media.dataUrl);
    setMediaType(req.media.type);
    setActiveTab('request');
  };

  const cancelEdit = () => {
    setEditingRequest(null);
    setDescription('');
    setCategory('');
    setUrgency('Medium');
    setPrice('');
    setMediaPreview(null);
    setMediaFile(null);
  };

  const renderTabs = () => (
    <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-[2rem] shadow-inner border border-slate-200 dark:border-white/5 max-w-lg mx-auto mb-8 sm:mb-10 overflow-x-auto scrollbar-hide">
      <button onClick={() => { setActiveTab('findExpert'); cancelEdit(); }} className={`flex-1 py-3 px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 whitespace-nowrap ${activeTab === 'findExpert' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
        {t('findAnExpert')}
      </button>
      <button onClick={() => setActiveTab('request')} className={`flex-1 py-3 px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 whitespace-nowrap ${activeTab === 'request' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
        {editingRequest ? t('editingRequest') : t('requestHelp')}
      </button>
      <button onClick={() => { setActiveTab('myRequests'); cancelEdit(); }} className={`flex-1 py-3 px-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all duration-300 whitespace-nowrap ${activeTab === 'myRequests' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
        {t('myRequests')}
      </button>
    </div>
  );

  return (
    <>
      {requestToRate && <RateConsultationModal t={t} request={requestToRate} expert={consultants.find(c => c.consultantId === requestToRate.consultantId)!} onClose={() => setRequestToRate(null)} onSubmit={handleRatingSubmit} isLoading={isSubmittingRating} language={language} appMode={appMode} />}
      {selectedConsultant && <ViewProfileModal t={t} expert={selectedConsultant} onClose={() => setSelectedConsultant(null)} appMode={appMode} />}
      {showLocationWarning && <InitialNoticeModal notice={{ title: "Location Needed", message: "To sort experts by distance, enable location access in profile." }} onClose={() => setShowLocationWarning(false)} t={t} appMode={appMode} />}
      {requestSubmittedNotice && <InitialNoticeModal notice={{ title: editingRequest ? t('requestUpdated') : t('requestSubmitted'), message: requestSubmittedNotice }} onClose={() => { setRequestSubmittedNotice(null); setActiveTab('myRequests'); }} t={t} appMode={appMode} />}
      {counterOfferRequest && <CounterOfferModal request={counterOfferRequest} t={t} onAction={handleRequestAction} onClose={() => setCounterOfferRequest(null)} appMode={appMode} />}

      <div className="space-y-6 max-w-4xl mx-auto animate-fade-in px-2">
        <div className="text-center mb-8 sm:mb-10 px-2">
          <h2 className={`text-[5.8vw] xs:text-4xl sm:text-5xl font-black uppercase tracking-tighter leading-tight whitespace-nowrap overflow-hidden ${headerColor}`}>
            {headerTitle}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em]">CONNECT WITH CERTIFIED SPECIALISTS</p>
        </div>

        {renderTabs()}

        {activeTab === 'request' && (
           <div className="animate-fade-in-up">
            <Card className="rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5 !p-6 sm:!p-8 md:!p-12 shadow-2xl dark:bg-slate-900/60">
                {chosenExpert && !editingRequest && (
                    <div className={`mb-8 p-4 sm:p-5 rounded-[1.5rem] flex items-center justify-between border-2 border-dashed ${isCrops ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300'}`}>
                        <div className="flex items-center gap-4">
                            <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                            <p className="font-bold text-xs sm:text-sm" dangerouslySetInnerHTML={{ __html: t('requestingHelpFrom').replace('{expertName}', `<strong class="uppercase tracking-wide">${chosenExpert.name}</strong>`)}} />
                        </div>
                        <button type="button" onClick={() => setChosenExpert(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors active:scale-90 flex-shrink-0"><XCircleIcon className="w-5 h-5"/></button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    {editingRequest && (
                        <div className="flex justify-between items-center bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                            <span className="text-[9px] sm:text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 tracking-widest">{t('editingRequest')}</span>
                            <button type="button" onClick={cancelEdit} className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">{t('cancelEdit')}</button>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">{t('problemCategory')}</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl px-5 sm:px-6 py-3.5 sm:py-4 font-bold text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none shadow-inner">
                                <option value="">{t('selectCategory')}</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{t(cat.titleKey as any)}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">{t('urgencyLevel')}</label>
                            <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl flex border border-slate-200 dark:border-white/10 shadow-inner">
                                {(['Low', 'Medium', 'High'] as const).map(level => (
                                    <button type="button" key={level} onClick={() => setUrgency(level)} className={`flex-1 py-2.5 sm:py-3 text-[8px] sm:text-[9px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${urgency === level ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{t(level.toLowerCase() as any)}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">{t('problemDescription')}</label>
                        <div className="relative group">
                            <textarea value={isListening && !description && transcript ? transcript : (isListening && !transcript ? t('listening') : description)} onChange={e => setDescription(e.target.value)} rows={5} className={`w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[1.5rem] sm:rounded-[2rem] px-5 sm:px-6 py-4 sm:py-5 font-bold text-sm text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-inner resize-none ${isListening && !transcript ? 'animate-pulse italic opacity-60' : ''}`} placeholder={t(appMode === 'crops' ? 'problemDescriptionPlaceholderCrops' : 'problemDescriptionPlaceholderAnimals')} />
                            {hasRecognitionSupport && (
                                <button type="button" onClick={handleMicClick} className={`absolute bottom-4 right-4 sm:bottom-5 sm:right-5 p-3 sm:p-4 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse shadow-xl scale-110' : 'bg-white dark:bg-slate-800 text-slate-400 hover:text-emerald-600 shadow-md active:scale-90'}`}>
                                    <MicrophoneIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        <div className="space-y-2">
                            <label className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">{t('uploadEvidence')}</label>
                            {mediaPreview ? (
                                <div className="relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden group shadow-2xl aspect-video bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-4 border-white dark:border-slate-800">
                                    {mediaType === 'image' && <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />}
                                    {mediaType === 'video' && <video src={mediaPreview} controls className="w-full h-full object-cover" />}
                                    <button type="button" onClick={handleRemoveMedia} className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-red-600 text-white p-2.5 sm:p-3 rounded-full shadow-xl hover:scale-110 transition-transform active:scale-90 z-20"><XCircleIcon className="w-5 h-5 sm:w-6 sm:h-6"/></button>
                                </div>
                            ) : (
                                <label htmlFor="consult-file-upload" className="flex flex-col items-center justify-center w-full aspect-video rounded-[1.5rem] sm:rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/40 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-950 transition-all group overflow-hidden relative">
                                    <div className="flex flex-col items-center justify-center p-4 sm:p-6 space-y-3 sm:space-y-4">
                                        <div className="p-3 sm:p-4 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-xl transition-all group-hover:scale-110"><PaperAirplaneIcon className={`w-6 h-6 sm:w-8 sm:h-8 ${headerColor} rotate-90`} /></div>
                                        <div className="text-center">
                                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white mb-1">{t('uploadMedia')}</p>
                                            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-tighter text-slate-400">Images or Videos</p>
                                        </div>
                                    </div>
                                    <input id="consult-file-upload" type="file" className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                                </label>
                            )}
                        </div>

                        <div className="space-y-6">
                            {!isFreeConsultation ? (
                                <div className="space-y-2">
                                    <label className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">{t('proposeAPrice')}</label>
                                    <div className="relative">
                                        <span className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg sm:text-xl">₹</span>
                                        <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[1.25rem] sm:rounded-[1.5rem] pl-10 sm:pl-12 pr-4 sm:pr-6 py-4 sm:py-5 text-xl sm:text-2xl font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner" placeholder={String(chosenExpert?.consultationPrice || '500')} />
                                    </div>
                                    <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mt-2">Negotiation is enabled by default</p>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col justify-center">
                                    <div className="p-6 sm:p-8 bg-blue-50 dark:bg-blue-950/40 rounded-[1.5rem] sm:rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30 text-center space-y-2 sm:space-y-3 shadow-inner">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white dark:bg-blue-900 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto shadow-lg"><CheckCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" /></div>
                                        <p className="text-[9px] sm:text-[10px] font-black text-blue-700 dark:text-blue-300 uppercase tracking-[0.2em]">{t('freeConsultationsLeftNotice').replace('{count}', String(freeConsultationsCount))}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-950/20 rounded-xl sm:rounded-2xl text-red-600 text-[9px] sm:text-[10px] font-black uppercase text-center border border-red-100 dark:border-red-900/30 animate-shake">{error}</div>}
                    
                    <button type="submit" disabled={isLoading} className={`w-full py-5 sm:py-6 rounded-[1.5rem] sm:rounded-[2rem] text-white font-black uppercase tracking-[0.25em] text-[10px] sm:text-xs shadow-xl transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-3 sm:gap-4 ${primaryBtnClass}`}>
                        {isLoading ? <Spinner /> : <><PaperAirplaneIcon className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" /> {editingRequest ? t('updateRequest') : t('requestConsultation')}</>}
                    </button>
                </form>
            </Card>
           </div>
        )}
        
        {activeTab === 'myRequests' && (
           <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
            {myRequests.length === 0 ? (
                <div className="py-20 sm:py-24 text-center bg-white/30 dark:bg-slate-900/30 backdrop-blur-md rounded-[3rem] sm:rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-white/5">
                    <span className="text-6xl sm:text-7xl block mb-4 sm:mb-6 opacity-20">📭</span>
                    <h3 className="text-lg sm:text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{t('noRequestsYet')}</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-600 mt-2 font-bold">Start a new consultation to get help.</p>
                </div>
            ) : myRequests.map((req, idx) => <RequestCard key={req.id} request={req} t={t} onRate={() => setRequestToRate(req)} onAction={handleRequestAction} onNegotiate={() => setCounterOfferRequest(req)} onEdit={handleEditRequest} onDelete={handleDeleteRequest} appMode={appMode} />)}
           </div>
        )}

        {activeTab === 'findExpert' && (
           <div className="space-y-8 sm:space-y-10 animate-fade-in-up pb-20">
             <div className="glass-card p-5 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl space-y-5 sm:space-y-6">
               <div className="flex items-center justify-center p-1.5 bg-white/20 dark:bg-slate-950/40 backdrop-blur-md rounded-full shadow-inner border border-white/20 dark:border-white/5 w-fit mx-auto">
                 <button onClick={() => setViewMode('list')} className={`p-2.5 sm:p-3 rounded-full transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                    <ListBulletIcon className="w-5 h-5" />
                 </button>
                 <button onClick={() => setViewMode('map')} className={`p-2.5 sm:p-3 rounded-full transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                    <MapIcon className="w-5 h-5" />
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="flex items-center gap-3 justify-center sm:justify-start">
                    <span className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest">SORT BY</span>
                    <select id="sort-experts" value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="bg-white/40 dark:bg-slate-950/40 border border-white/20 dark:border-white/10 rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-[10px] sm:text-xs font-black text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm appearance-none min-w-[140px] backdrop-blur-md">
                        <option value="distance">{t('distance').toUpperCase()}</option>
                        <option value="rating">{t('rating').toUpperCase()}</option>
                        <option value="price_asc">{t('priceLowToHigh').toUpperCase()}</option>
                        <option value="price_desc">{t('priceHighToLow').toUpperCase()}</option>
                    </select>
                  </div>
               </div>
             </div>

             {viewMode === 'list' && (sortedConsultants.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:gap-10">
                    {sortedConsultants.map(expert => (
                        <ExpertCard key={expert.consultantId} expert={expert} t={t} onSelect={() => { setChosenExpert(expert); setActiveTab('request'); }} onViewProfile={() => setSelectedConsultant(expert)} appMode={appMode} />
                    ))}
                </div>
             ) : (
                <div className="py-20 sm:py-24 text-center bg-white/10 dark:bg-slate-900/30 rounded-[3rem] sm:rounded-[4rem] border-4 border-dashed border-slate-300 dark:border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 to-transparent pointer-events-none"></div>
                    <div className="relative z-10 px-4">
                        <h3 className="text-base sm:text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em]">{t('noExpertsFound').toUpperCase()}</h3>
                    </div>
                </div>
             ))}
             {viewMode === 'map' && user && ( <ExpertMapView consultants={sortedConsultants} user={user} onViewProfile={setSelectedConsultant} t={t} appMode={appMode} /> )}
           </div>
        )}
      </div>
    </>
  );
};

export default ConsultScreen;
