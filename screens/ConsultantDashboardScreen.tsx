
import React, { useState, useEffect, useMemo } from 'react';
import { User, ConsultationRequest, Screen, UserRole, ConsultantType } from '../types';
import Card from '../components/Card';
import CertificationScreen from './CertificationScreen';
import { certificationData } from '../certificationData';
import CompleteProfileModal from '../components/CompleteProfileModal';
import { LocationMarkerIcon } from '../components/icons/LocationMarkerIcon';
import { XCircleIcon } from '../components/icons/XCircleIcon';
import InitialNoticeModal from '../components/InitialNoticeModal';
import * as firebaseService from '../services/firebaseService';
import { ClipboardListIcon } from '../components/icons/ClipboardListIcon';
import { AcademicCapIcon } from '../components/icons/AcademicCapIcon';
import { SparklesIcon } from '../components/icons/SparklesIcon';
import Spinner from '../components/Spinner';

interface ConsultantDashboardScreenProps {
  user: User;
  t: (key: string) => string;
  onCertificationComplete: (certificationId: string) => void;
  setActiveScreen: (screen: Screen) => void;
  userRole: UserRole;
  activeConsultantType: ConsultantType | null;
}

const MapModal: React.FC<{
  farmerRequest: ConsultationRequest;
  expert: User;
  onClose: () => void;
  t: (key: string) => string;
}> = ({ farmerRequest, expert, onClose, t }) => {
  const { farmerLatitude, farmerLongitude, farmerName } = farmerRequest;
  const { latitude: expertLatitude, longitude: expertLongitude, name: expertName } = expert;

  const mapBounds = useMemo(() => {
    if (!farmerLatitude || !farmerLongitude || !expertLatitude || !expertLongitude) return null;
    const points = [{ lat: farmerLatitude, lon: farmerLongitude }, { lat: expertLatitude, lon: expertLongitude }];
    const lats = points.map(p => p.lat);
    const lons = points.map(p => p.lon);
    return {
        minLat: Math.min(...lats), maxLat: Math.max(...lats),
        minLon: Math.min(...lons), maxLon: Math.max(...lons),
    };
  }, [farmerLatitude, farmerLongitude, expertLatitude, expertLongitude]);

  if (!mapBounds) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
        <Card title={t('locationNotAvailable')} className="max-w-md w-full rounded-[2rem]">
            <p className="text-center text-slate-500 font-bold uppercase tracking-widest text-[10px] py-4">{t('locationDataMissing')}</p>
            <div className="mt-4 flex justify-center">
                <button onClick={onClose} className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase text-[10px] py-3 px-8 rounded-xl">{t('close')}</button>
            </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-md">
      <Card className="max-w-2xl w-full rounded-[2.5rem] !p-0 overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800">
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border-b dark:border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-black uppercase tracking-widest">{t('requestLocation')}: {farmerName}</h3>
            <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors active:scale-90"><XCircleIcon className="w-6 h-6 text-slate-400"/></button>
        </div>
        <div className="relative w-full h-96 bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
           <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center animate-pulse">
                <LocationMarkerIcon className="w-8 h-8 text-blue-600" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Map Node Synchronization Pending</p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900 flex justify-end">
            <button onClick={onClose} className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase text-[10px] py-3 px-8 rounded-xl">{t('close')}</button>
        </div>
      </Card>
    </div>
  );
};


const ConsultantDashboardScreen: React.FC<ConsultantDashboardScreenProps> = ({ user, t, onCertificationComplete, setActiveScreen, userRole, activeConsultantType }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'training'>(userRole === 'consultant' ? 'requests' : 'training');
  const [requests, setRequests] = useState<ConsultationRequest[]>([]);
  const [activeRequestTab, setActiveRequestTab] = useState<'pending' | 'responded'>('pending');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [mapRequest, setMapRequest] = useState<ConsultationRequest | null>(null);
  const [sortRequestsBy, setSortRequestsBy] = useState<'date' | 'price' | 'urgency'>('date');
  const [counterOfferRequest, setCounterOfferRequest] = useState<ConsultationRequest | null>(null);

  const [showTraineeNotice, setShowTraineeNotice] = useState(false);
  const [traineeNotice, setTraineeNotice] = useState<{title: string, message: string} | null>(null);
  const [showTraineeFreebieNotice, setShowTraineeFreebieNotice] = useState(false);
  
  const allCoursesForType = useMemo(() => activeConsultantType === 'agronomist' ? certificationData.agronomist : certificationData.veterinarian, [activeConsultantType]);
  const completedCerts = useMemo(() => (user.completedCertifications || []).filter(c => c !== 'expert_onboarding' && allCoursesForType.some(course => course.id === c)), [user.completedCertifications, allCoursesForType]);

  const canSeeRequests = userRole === 'consultant' || completedCerts.length > 0;
  
  const isAgronomist = activeConsultantType === 'agronomist';
  const btnPrimaryClass = isAgronomist ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/20';
  const textPrimaryClass = isAgronomist ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
  const accentGradient = isAgronomist ? 'from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300' : 'from-rose-600 to-pink-500 dark:from-rose-400 dark:to-pink-300';

  useEffect(() => {
    const fetchRequests = async () => {
        if (!user.consultantId || !canSeeRequests) return;
        const expertRequests = await firebaseService.getConsultationRequests('consultant', user.consultantId);
        setRequests(expertRequests);
    };
    fetchRequests();
  }, [user.consultantId, activeRequestTab, counterOfferRequest, canSeeRequests]);

  useEffect(() => {
    const isProfileIncomplete = !user.bio || !user.yearsOfExperience || !user.profilePictureUrl;
    const hasSeenWarning = sessionStorage.getItem('agriLinkProfileWarningSeen');

    if (isProfileIncomplete && userRole === 'consultant' && !hasSeenWarning) {
      setIsProfileModalOpen(true);
      sessionStorage.setItem('agriLinkProfileWarningSeen', 'true');
    }
  }, [user, userRole]);

  useEffect(() => {
    if (userRole === 'trainee' && completedCerts.length > 0) {
      const hasSeenDashboardNotice = localStorage.getItem(`agriLinkTraineeDashboardSeen_${user.phone}`);
      if (!hasSeenDashboardNotice) {
        const firstCertId = completedCerts[0];
        const firstCertDetails = allCoursesForType.find(c => c.id === firstCertId);
        const certName = firstCertDetails ? t(firstCertDetails.titleKey as any) : '';
        setTraineeNotice({
          title: t('traineeDashboardFirstTimeTitle'),
          message: t('traineeDashboardFirstTimeMessage').replace('{certificationName}', certName),
        });
        setShowTraineeNotice(true);
      } else {
          const hasSeenFreebieNotice = sessionStorage.getItem('agriLinkTraineeFreebieNoticeSeen');
          if (!hasSeenFreebieNotice && completedCerts.length >= 1) {
              setShowTraineeFreebieNotice(true);
          }
      }
    }
  }, [userRole, completedCerts.length, user.phone, t, allCoursesForType]);

  const handleCloseProfileModal = () => setIsProfileModalOpen(false);
  
  const handleCloseTraineeNotice = () => { 
      setShowTraineeNotice(false); 
      localStorage.setItem(`agriLinkTraineeDashboardSeen_${user.phone}`, 'true');
      const hasSeenFreebieNotice = sessionStorage.getItem('agriLinkTraineeFreebieNoticeSeen');
      if (!hasSeenFreebieNotice) setShowTraineeFreebieNotice(true);
  };

  const handleCloseTraineeFreebieNotice = () => {
      setShowTraineeFreebieNotice(false);
      sessionStorage.setItem('agriLinkTraineeFreebieNoticeSeen', 'true');
  };

  const handleGoToProfile = () => { setActiveScreen(Screen.PROFILE); setIsProfileModalOpen(false); };
  
  const updateRequestState = (updatedRequest: ConsultationRequest) => {
    setRequests(prev => prev.map(req => req.id === updatedRequest.id ? updatedRequest : req));
  };
  
  const handleRequestAction = async (req: ConsultationRequest, newStatus: ConsultationRequest['status'], finalPrice?: number) => {
    await firebaseService.updateConsultationStatus(req.id, newStatus, { consultantId: user.consultantId, finalPrice });
    updateRequestState({ ...req, status: newStatus, consultantId: user.consultantId!, finalPrice });
  };
  
  const handleCounterOffer = async (req: ConsultationRequest, counterPrice: number) => {
    const newHistoryEntry = { author: 'expert' as const, price: counterPrice, timestamp: new Date().toISOString() };
    const updatedHistory = [...(req.negotiationHistory || []), newHistoryEntry];
    await firebaseService.updateConsultationStatus(req.id, 'In Negotiation', { consultantId: user.consultantId, negotiationHistory: updatedHistory });
    updateRequestState({ ...req, status: 'In Negotiation', consultantId: user.consultantId!, negotiationHistory: updatedHistory });
    setCounterOfferRequest(null);
  };
  
  const consultantRequestType = activeConsultantType === 'agronomist' ? 'crops' : 'animals';

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
        if (req.type !== consultantRequestType) return false;
        if (userRole === 'trainee' && !req.consultantId && !completedCerts.includes(req.category)) return false;
        if (user.degreeVerificationStatus !== 'verified') {
            const isUrgent = req.urgency === 'High' || req.description.toLowerCase().includes('operation');
            if (isUrgent) return false;
        }
        return true;
    });
  }, [requests, consultantRequestType, completedCerts, user, userRole]);
  
  const sortedAndFilteredRequests = useMemo(() => {
      const urgencyOrder = { 'High': 1, 'Medium': 2, 'Low': 3 };
      return filteredRequests.sort((a, b) => {
          switch (sortRequestsBy) {
              case 'price': return (b.price || 0) - (a.price || 0);
              case 'urgency': return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
              case 'date': default: return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          }
      });
  }, [filteredRequests, sortRequestsBy]);

  const pendingRequests = useMemo(() => sortedAndFilteredRequests.filter(req => ['Pending', 'In Negotiation', 'Accepted'].includes(req.status)), [sortedAndFilteredRequests]);
  const respondedRequests = useMemo(() => sortedAndFilteredRequests.filter(req => ['Responded', 'Declined'].includes(req.status)), [sortedAndFilteredRequests]);

  const UrgencyBadge: React.FC<{ urgency: ConsultationRequest['urgency'] }> = ({ urgency }) => {
    const urgencyClasses = {
      Low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      Medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      High: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-md ${urgencyClasses[urgency]}`}>{t(urgency.toLowerCase() as any)}</span>;
  };
  
  const renderNoticeBanner = () => {
    if (userRole === 'trainee' && completedCerts.length < allCoursesForType.length) {
        const completedCertDetails = allCoursesForType.filter(course => completedCerts.includes(course.id)).map(course => t(course.titleKey as any)).join(', ');
        return (
            <div className="p-5 rounded-[1.5rem] bg-amber-50 dark:bg-amber-950/40 border-2 border-dashed border-amber-500/30 text-amber-800 dark:text-amber-400 text-xs text-center shadow-inner">
                <p className="font-black uppercase tracking-widest mb-1">{t('traineeUpgradeMessage')}</p>
                <p className="font-medium">{t('partialExpertAccess').replace('{categories}', completedCertDetails)}</p>
            </div>
        );
    }
    if (user.degreeVerificationStatus !== 'verified') {
        return (
             <div className="p-5 rounded-[1.5rem] bg-orange-50 dark:bg-orange-950/40 border-2 border-dashed border-orange-500/30 text-orange-800 dark:text-orange-400 text-xs text-center shadow-inner">
                <p className="font-black uppercase tracking-widest">{t('accessRestrictedNotice')}</p>
            </div>
        );
    }
    return null; 
  };
  
    const RequestCard: React.FC<{ request: ConsultationRequest }> = ({ request }) => {
    const farmerOffer = request.negotiationHistory?.find(h => h.author === 'farmer');
    
    const getStatusIndicator = () => {
        if (request.status === 'In Negotiation') return <div className="p-3 text-center bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100 dark:border-blue-900">{t('waitingForFarmer')}</div>;
        if (request.status === 'Responded') return <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-800 border border-emerald-200">{t('responded')}</span>;
        if (request.status === 'Declined') return <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest bg-red-100 text-red-800 border border-red-200">{t('requestDeclined')}</span>;
        return null;
    }

    const renderActionButtons = () => {
        if (request.status === 'Pending') {
            return (
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => handleRequestAction(request, 'Accepted', request.price)} className={`flex-[2] text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl shadow-xl transition-all active:scale-95 ${btnPrimaryClass}`}>{t('acceptAndContact')}</button>
                    <button onClick={() => setCounterOfferRequest(request)} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-slate-50 transition active:scale-95" disabled={!user.negotiationEnabled}>{t('counterOffer')}</button>
                    <button onClick={() => handleRequestAction(request, 'Declined')} className="flex-1 text-red-600 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl hover:bg-red-50 dark:hover:bg-red-950/40 transition active:scale-95">{t('decline')}</button>
                </div>
            );
        }
        if (request.status === 'Accepted') {
             return (
                 <div className="flex flex-col gap-4">
                     <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/30 text-center">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${textPrimaryClass}`}>{t('offerAccepted')}</p>
                     </div>
                     <button onClick={() => handleRequestAction(request, 'Responded')} className={`w-full text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl shadow-xl transition-all active:scale-95 ${btnPrimaryClass}`}>{t('markAsResponded')}</button>
                </div>
             );
        }
        return <div className="pt-2">{getStatusIndicator()}</div>;
    }

    return (
        <Card key={request.id} className="group hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-[2.5rem] !p-0 border border-slate-100 dark:border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                <div className="md:col-span-4 lg:col-span-3 relative overflow-hidden bg-slate-100 dark:bg-slate-900 aspect-square md:aspect-auto">
                    {request.media.type === 'image' && <img src={request.media.dataUrl} alt="Consultation" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[10s]" />}
                    {request.media.type === 'video' && <video src={request.media.dataUrl} controls className="w-full h-full object-cover" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white font-black uppercase tracking-tighter text-lg leading-none">{request.farmerName}</p>
                        <p className="text-white/60 font-bold text-[10px] mt-1">{request.farmerLocation}</p>
                    </div>
                </div>
                <div className="md:col-span-8 lg:col-span-9 p-6 md:p-10 flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('problem')}</h4>
                                <p className="text-slate-800 dark:text-slate-100 font-bold leading-relaxed line-clamp-3 md:text-lg">{request.description}</p>
                            </div>
                            <UrgencyBadge urgency={request.urgency} />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t dark:border-white/5">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('price')}</p>
                                {request.isFree ? (
                                    <span className="text-blue-600 font-black uppercase text-sm">{t('free')}</span>
                                ) : (
                                    <p className="font-black text-slate-900 dark:text-white text-lg tabular-nums">
                                        ₹{request.finalPrice || farmerOffer?.price}
                                        {request.finalPrice && <span className="text-[8px] ml-1 opacity-50">({t('finalPrice')})</span>}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('submittedOn')}</p>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">{new Date(request.timestamp).toLocaleDateString()}</p>
                            </div>
                            <div className="hidden lg:block space-y-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('farmerPhone')}</p>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-tighter">{request.farmerPhone}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 space-y-4">
                        {renderActionButtons()}
                        {request.farmerLatitude && request.farmerLongitude && user?.latitude && user?.longitude && (
                            <button onClick={() => setMapRequest(request)} className="w-full flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors py-2 border border-dashed border-slate-200 dark:border-white/10 rounded-xl">
                                <LocationMarkerIcon className="w-3 h-3"/> {t('viewOnMap')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
  };
  
  const renderRequests = () => (
    <div className="space-y-10 animate-fade-in pb-20">
      {showTraineeNotice && traineeNotice && (<InitialNoticeModal notice={traineeNotice} onClose={handleCloseTraineeNotice} t={t} />)}
      {!showTraineeNotice && showTraineeFreebieNotice && (
          <InitialNoticeModal 
            notice={{
                title: t('congratulations'),
                message: t('traineeFreeConsultationNotice').replace('{count}', '7') 
            }} 
            onClose={handleCloseTraineeFreebieNotice} 
            t={t} 
          />
      )}

      <div className="text-center">
        <h2 className={`text-3xl md:text-5xl font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-r ${accentGradient} leading-tight`}>
          {t('consultantDashboard')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-bold uppercase tracking-[0.25em] text-[10px]">{activeConsultantType === 'agronomist' ? t('reviewCropIssues') : t('reviewAnimalIssues')}</p>
      </div>

      {renderNoticeBanner()}

      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white dark:bg-slate-900/60 p-4 rounded-[2rem] shadow-xl border border-slate-100 dark:border-white/5">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl shadow-inner border border-slate-200 dark:border-white/10">
          <button id="tab-requests-pending" onClick={() => setActiveRequestTab('pending')} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeRequestTab === 'pending' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}>{t('pendingRequests')} ({pendingRequests.length})</button>
          <button onClick={() => setActiveRequestTab('responded')} className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeRequestTab === 'responded' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}>{t('respondedRequests')} ({respondedRequests.length})</button>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
            <label htmlFor="sort-requests" className="text-[10px] font-black uppercase text-slate-400 tracking-widest shrink-0">{t('sortBy')}</label>
            <select id="sort-requests" value={sortRequestsBy} onChange={e => setSortRequestsBy(e.target.value as any)} className="flex-grow sm:flex-grow-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm appearance-none">
                <option value="date">{t('date')}</option>
                <option value="price">{t('price')}</option>
                <option value="urgency">{t('urgency')}</option>
            </select>
        </div>
      </div>

      <div className="space-y-8">
        {activeRequestTab === 'pending' && (
            pendingRequests.length > 0 ? pendingRequests.map(req => <RequestCard key={req.id} request={req} />)
            : (
                <div className="py-24 text-center bg-white/20 dark:bg-slate-900/30 backdrop-blur-md rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-white/5">
                    <span className="text-7xl block mb-6 opacity-20">📥</span>
                    <h3 className="text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{t('noPendingRequests')}</h3>
                </div>
            )
        )}
        {activeRequestTab === 'responded' && (
            respondedRequests.length > 0 ? respondedRequests.map(req => <RequestCard key={req.id} request={req} />)
            : (
                <div className="py-24 text-center bg-white/20 dark:bg-slate-900/30 backdrop-blur-md rounded-[4rem] border-4 border-dashed border-slate-200 dark:border-white/5">
                    <span className="text-7xl block mb-6 opacity-20">✅</span>
                    <h3 className="text-xl font-black text-slate-400 dark:text-slate-600 uppercase tracking-widest">{t('noRespondedRequests')}</h3>
                </div>
            )
        )}
      </div>
    </div>
  );

  const CounterOfferModal: React.FC<{ request: ConsultationRequest, user: User, t: (key: string) => string, onClose: () => void, onSubmit: (req: ConsultationRequest, price: number) => void }> = ({ request, user, t, onClose, onSubmit }) => {
    const [counterPrice, setCounterPrice] = useState<number | ''>(user.consultationPrice || '');
    const farmerOffer = request.negotiationHistory?.find(h => h.author === 'farmer');
    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-md">
            <Card title={t('makeCounterOffer')} className="max-w-md w-full animate-pop-in rounded-[2.5rem] !p-8 shadow-2xl border-4 border-white dark:border-slate-800">
                <div className="space-y-8">
                    <div className="p-5 bg-blue-50 dark:bg-blue-950/40 rounded-3xl border border-blue-100 dark:border-blue-900/30">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{t('farmerOffer')}</p>
                        <p className="text-3xl font-black text-blue-600 dark:text-amber-400 tabular-nums">₹{farmerOffer?.price}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-2">{t('yourCounterOffer')}</label>
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span>
                            <input type="number" value={counterPrice} onChange={e => setCounterPrice(e.target.value === '' ? '' : Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-[1.5rem] pl-12 pr-6 py-5 text-2xl font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 shadow-inner" placeholder="0" />
                        </div>
                    </div>
                     <div className="flex gap-4 pt-2">
                        <button onClick={onClose} className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors">{t('cancel')}</button>
                        <button onClick={() => onSubmit(request, Number(counterPrice))} disabled={!counterPrice} className="flex-[2] bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 rounded-2xl shadow-xl transition-all active:scale-95 hover:bg-blue-700 disabled:opacity-50">{t('submitCounterOffer')}</button>
                    </div>
                </div>
            </Card>
        </div>
    );
  };

  return (
    <>
      {userRole === 'consultant' && <CompleteProfileModal isOpen={isProfileModalOpen} onClose={handleCloseProfileModal} onGoToProfile={handleGoToProfile} t={t} />}
      {counterOfferRequest && <CounterOfferModal request={counterOfferRequest} user={user} t={t} onClose={() => setCounterOfferRequest(null)} onSubmit={handleCounterOffer} />}
      
      <div className="space-y-10">
        {canSeeRequests && (
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[2rem] shadow-inner border border-slate-200 dark:border-white/5 max-w-lg mx-auto overflow-hidden">
                <button 
                  id="tab-requests" 
                  onClick={() => setActiveTab('requests')} 
                  className={`flex-1 py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${activeTab === 'requests' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <ClipboardListIcon className="w-4 h-4" />
                    {t('consultationRequests')}
                </button>
                <button 
                  id="tab-training" 
                  onClick={() => setActiveTab('training')} 
                  className={`flex-1 py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 ${activeTab === 'training' ? 'bg-white dark:bg-slate-800 shadow-xl scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    <AcademicCapIcon className="w-4 h-4 text-blue-500" />
                    <span className={`font-black uppercase tracking-[0.1em] ${activeTab === 'training' ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600' : ''}`}>
                        {t('trainingCenter')}
                    </span>
                </button>
            </div>
        )}
        
        {activeTab === 'requests' && canSeeRequests ? renderRequests() : <CertificationScreen user={user} t={t} onCertificationComplete={onCertificationComplete} userRole={userRole} activeConsultantType={activeConsultantType} />}
      </div>
      {mapRequest && user && <MapModal farmerRequest={mapRequest} expert={user} onClose={() => setMapRequest(null)} t={t} />}
    </>
  );
};

export default ConsultantDashboardScreen;
