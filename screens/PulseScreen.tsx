
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

interface ConsultScreenProps {
  t: (key: string) => string;
  appMode: AppMode;
  user: User | null;
  language: string;
}


// --- Mock Data and Helper ---
// In a real app, this would come from a backend.
// We store it in localStorage to persist ratings and profile updates for the demo.
const getMockConsultants = (): User[] => {
    const stored = localStorage.getItem('agriLinkMockConsultants');
    if (stored) {
        return JSON.parse(stored);
    }
    const initialConsultants: User[] = [
        {
            name: 'Dr. Anjali Sharma',
            phone: '9876543211',
            location: 'Ludhiana',
            state: 'Punjab',
            country: 'India',
            role: 'consultant',
            consultantType: 'agronomist',
            completedCertifications: ['agro_cert_1', 'agro_cert_2', 'agro_cert_4'],
            consultantId: 'expert-9876543211',
            bio: 'With over 15 years of experience in crop science and soil health, I specialize in sustainable farming practices for wheat and rice. My focus is on Integrated Pest Management and organic farming solutions.',
            yearsOfExperience: 15,
            profilePictureUrl: 'https://images.unsplash.com/photo-1582233479572-1a82a556424b?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ratings: [],
            averageRating: 0,
            latitude: 30.9010, // Ludhiana
            longitude: 75.8573,
            consultationPrice: 500,
            priceCurrency: 'INR',
            negotiationEnabled: true,
            degreeVerificationStatus: 'verified',
        },
        {
            name: 'Dr. Vikram Singh',
            phone: '9876543212',
            location: 'Hisar',
            state: 'Haryana',
            country: 'India',
            role: 'consultant',
            consultantType: 'veterinarian',
            completedCertifications: ['vet_cert_2', 'vet_cert_3'],
            consultantId: 'expert-9876543212',
            bio: 'I am a veterinarian with a focus on dairy cattle management and livestock nutrition. I help farmers improve milk yield and herd health through scientific feeding and breeding practices.',
            yearsOfExperience: 12,
            profilePictureUrl: 'https://images.unsplash.com/photo-1622266848210-ce455f75a6a6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            ratings: [],
            averageRating: 0,
            latitude: 29.1492, // Hisar
            longitude: 75.7217,
            consultationPrice: 750,
            priceCurrency: 'INR',
            negotiationEnabled: false,
            degreeVerificationStatus: 'pending',
        },
    ];
    localStorage.setItem('agriLinkMockConsultants', JSON.stringify(initialConsultants));
    return initialConsultants;
};

// --- NEW MAP VIEW COMPONENT ---
const ExpertMapView: React.FC<{
  consultants: (User & { distance: number })[];
  user: User;
  onViewProfile: (expert: User) => void;
  t: (key: string) => string;
}> = ({ consultants, user, onViewProfile, t }) => {
  const [activeExpert, setActiveExpert] = useState<User | null>(null);

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
    
    // Add padding to prevent points from being on the edge
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
        <p className="text-center text-gray-500">
          {t('locationDataMissing')}
        </p>
      </Card>
    );
  }

  const getPosition = (lat: number, lon: number) => {
    const latRange = bounds.maxLat - bounds.minLat;
    const lonRange = bounds.maxLon - bounds.minLon;
    
    // Invert latitude for correct screen Y positioning
    const top = latRange > 0 ? ((bounds.maxLat - lat) / latRange) * 100 : 50;
    const left = lonRange > 0 ? ((lon - bounds.minLon) / lonRange) * 100 : 50;
    
    return { top: `${top}%`, left: `${left}%` };
  };

  return (
    <Card>
      <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        {points.map((point, index) => {
          if (!point.latitude || !point.longitude) return null;
          const { top, left } = getPosition(point.latitude, point.longitude);
          
          if (point.type === 'user') {
            return (
              <div
                key="user-location"
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ top, left, zIndex: 5 }}
              >
                <div className="relative flex items-center justify-center">
                    <div className="absolute w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-gray-900"></div>
                </div>
                <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow whitespace-nowrap">{t('you')}</span>
              </div>
            );
          }
          
          // It's an expert
          return (
            <div
              key={point.consultantId || index}
              className="absolute transform -translate-x-1/2 -translate-y-full"
              style={{ top, left, zIndex: activeExpert?.consultantId === point.consultantId ? 10 : 1 }}
            >
              <button
                onClick={() => setActiveExpert(point === activeExpert ? null : point)}
                className="focus:outline-none"
                aria-label={`View ${point.name} on map`}
              >
                <LocationMarkerIcon className="w-8 h-8 text-green-500 drop-shadow-lg" />
              </button>
              {activeExpert?.consultantId === point.consultantId && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-2 z-20 border dark:border-gray-700">
                    <button onClick={() => setActiveExpert(null)} className="absolute -top-2 -right-2 text-gray-400 bg-white dark:bg-gray-800 rounded-full"><XCircleIcon className="w-5 h-5"/></button>
                    <div className="flex items-start gap-3">
                        {point.profilePictureUrl ? (
                            <img src={point.profilePictureUrl} alt={point.name} className="w-12 h-12 rounded-full object-cover"/>
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-gray-400"/>
                        )}
                        <div className="flex-grow">
                            <p className="font-bold text-sm">{point.name}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <StarIcon className="w-3 h-3 text-yellow-400" filled={true}/>
                                <span className="text-xs font-bold">{point.averageRating?.toFixed(1) || 'New'}</span>
                            </div>
                            <button onClick={() => onViewProfile(point)} className="text-xs font-semibold text-green-600 dark:text-green-400 hover:underline mt-1">{t('viewProfile')}</button>
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


const ConsultScreen: React.FC<ConsultScreenProps> = ({ t, appMode, user, language }) => {
  const [activeTab, setActiveTab] = useState<'findExpert' | 'request' | 'myRequests'>('findExpert');
  const [consultants, setConsultants] = useState<User[]>(getMockConsultants);
  const [selectedConsultant, setSelectedConsultant] = useState<User | null>(null);
  const [requestToRate, setRequestToRate] = useState<ConsultationRequest | null>(null);
  const [counterOfferRequest, setCounterOfferRequest] = useState<ConsultationRequest | null>(null);
  const [chosenExpert, setChosenExpert] = useState<User | null>(null);
  const [requestSubmittedNotice, setRequestSubmittedNotice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'distance' | 'price_asc' | 'price_desc' | 'rating'>('distance');
  const [editingRequest, setEditingRequest] = useState<ConsultationRequest | null>(null);


  // Form state
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

  // Speech Recognition Hook
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport
  } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');

  // Sync transcript to description when listening
  useEffect(() => {
    if (isListening && transcript) {
        // Simple append strategy: Append new transcript part
        setDescription(prev => {
            // Avoid duplicating the transcript if it's re-emitting the same full string
            // The hook sends cumulative transcript. We just update the value.
            // If user typed 'Hello', then started speaking 'World', transcript becomes 'World'.
            // Result should be 'Hello World'.
            // To handle this cleanly with a cumulative hook, we'd need to store the base text.
            return prev; // We'll handle this via a separate effect or just update on stop?
            // Actually, best pattern for simple hook:
            // 1. Store base text on start.
            // 2. value = base + transcript.
        });
    }
  }, [transcript, isListening]);

  // Ref to store text before listening started
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

  useEffect(() => {
    if (!user) return;
    const allRequests: ConsultationRequest[] = JSON.parse(localStorage.getItem('agriLinkConsultationRequests') || '[]');
    const freeUsed = allRequests.filter(r => r.farmerId === user.phone && r.isFree).length;
    const remaining = 3 - freeUsed;
    setFreeConsultationsCount(remaining);
    setIsFreeConsultation(remaining > 0);
  }, [user, activeTab]);

  useEffect(() => {
    if (!user) return;
    const allRequests: ConsultationRequest[] = JSON.parse(localStorage.getItem('agriLinkConsultationRequests') || '[]');
    const userRequests = allRequests.filter(r => r.farmerId === user.phone).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setMyRequests(userRequests);
  }, [user, activeTab]);
  
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

    // --- AI Image Validation ---
    try {
        const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });
        // mediaPreview is "data:image/jpeg;base64,..."
        const base64Data = mediaPreview.split(',')[1];
        const mimeType = mediaPreview.split(';')[0].split(':')[1];

        // Construct validation prompt based on appMode
        const validationPrompt = `
            You are an automated validator for an agricultural app. The user is in the '${appMode}' section.
            Please analyze the image/video frame.
            
            Validation Rules:
            - If user is in 'crops' mode: The image MUST contain a plant, crop, soil, fruit, vegetable, harvest, farm field, or farming tool.
            - If user is in 'animals' mode: The image MUST contain a farm animal (cow, buffalo, sheep, goat, chicken, etc.), animal feed, or animal shelter/coop.
            
            Return a JSON object with exactly two keys:
            1. "isValid": boolean (true if the image matches the mode, false otherwise).
            2. "message": string (If valid, return "Valid". If invalid, return a short, polite error message in English explaining that the photo does not match the '${appMode}' section and asking them to upload a relevant photo.)
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { inlineData: { mimeType: mimeType, data: base64Data } },
                    { text: validationPrompt }
                ]
            },
            config: { responseMimeType: 'application/json' }
        });

        const validationResult = JSON.parse(response.text.trim());

        if (!validationResult.isValid) {
            setError(validationResult.message || "Invalid image for this section.");
            setIsLoading(false);
            return; 
        }

    } catch (err) {
        console.error("Validation failed", err);
        // Fallback: If AI fails (e.g. network), we block to be safe as per "make sure they dont able to raise"
        setError("Could not verify the image content. Please ensure you have a stable internet connection and try again.");
        setIsLoading(false);
        return;
    }
    // --- End AI Validation ---
    
    // Simulate submission delay after successful validation
    setTimeout(() => {
      const allRequests = JSON.parse(localStorage.getItem('agriLinkConsultationRequests') || '[]');
      
      if (editingRequest) {
          const updatedRequest: ConsultationRequest = {
              ...editingRequest,
              description,
              category,
              urgency,
              media: { dataUrl: mediaPreview!, type: mediaType! },
              price: isFreeConsultation ? 0 : Number(price),
              timestamp: new Date().toISOString() // Update timestamp to bring to top
          };
          const updatedAll = allRequests.map((r: ConsultationRequest) => r.id === editingRequest.id ? updatedRequest : r);
          localStorage.setItem('agriLinkConsultationRequests', JSON.stringify(updatedAll));
          setRequestSubmittedNotice(t('requestUpdated'));
      } else {
          const newRequest: ConsultationRequest = {
            id: `REQ-${Date.now()}`,
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
          };
          if (newRequest.price && !newRequest.isFree) {
              newRequest.negotiationHistory = [{ author: 'farmer', price: newRequest.price, timestamp: new Date().toISOString() }];
          }
          allRequests.push(newRequest);
          localStorage.setItem('agriLinkConsultationRequests', JSON.stringify(allRequests));
          
          const notice = chosenExpert 
            ? t('requestSubmittedToExpertMessage').replace('{expertName}', chosenExpert.name).replace('{phone}', user!.phone)
            : t('requestSubmittedMessage').replace('{phone}', user!.phone);
          setRequestSubmittedNotice(notice);
      }
      
      setIsLoading(false);
      
      // Reset form
      cancelEdit();
      setChosenExpert(null);
    }, 500);
  };
  
  const handleRatingSubmit = (rating: number, comment: string) => {
    if (!requestToRate) return;
    setIsSubmittingRating(true);
    
    // Find the expert and update their ratings
    const expertId = requestToRate.consultantId;
    const updatedConsultants = consultants.map(c => {
        if (c.consultantId === expertId) {
            const newRating: Rating = { farmerName: user!.name, rating, comment, timestamp: new Date().toISOString() };
            const newRatings = [...(c.ratings || []), newRating];
            const avgRating = newRatings.reduce((sum, r) => sum + r.rating, 0) / newRatings.length;
            return { ...c, ratings: newRatings, averageRating: avgRating };
        }
        return c;
    });

    // Update the request to mark it as rated
    const allRequests: ConsultationRequest[] = JSON.parse(localStorage.getItem('agriLinkConsultationRequests') || '[]');
    const allUpdatedRequests = allRequests.map(r => r.id === requestToRate.id ? { ...r, isRated: true } : r);
    
    // Simulate saving
    setTimeout(() => {
        setConsultants(updatedConsultants);
        localStorage.setItem('agriLinkMockConsultants', JSON.stringify(updatedConsultants));
        setMyRequests(allUpdatedRequests.filter(r => r.farmerId === user?.phone).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
        localStorage.setItem('agriLinkConsultationRequests', JSON.stringify(allUpdatedRequests));

        setRequestToRate(null);
        setIsSubmittingRating(false);
        alert(t('ratingSubmitted'));
    }, 1000);
  };

  const handleRequestAction = (req: ConsultationRequest, action: 'accept' | 'decline' | 'negotiate', counterPrice?: number) => {
      const expertOffer = req.negotiationHistory?.slice().reverse().find(h => h.author === 'expert');
      
      let newStatus: ConsultationRequest['status'] = req.status;
      let newHistory = req.negotiationHistory || [];
      let finalPrice = req.finalPrice;

      if (action === 'accept' && expertOffer) {
          newStatus = 'Accepted';
          finalPrice = expertOffer!.price;
      } else if (action === 'decline') {
          newStatus = 'Declined';
      } else if (action === 'negotiate' && counterPrice) {
          newHistory = [...newHistory, { author: 'farmer', price: counterPrice, timestamp: new Date().toISOString() }];
      }

      const updatedReq = { ...req, status: newStatus, negotiationHistory: newHistory, finalPrice };

      const allRequests: ConsultationRequest[] = JSON.parse(localStorage.getItem('agriLinkConsultationRequests') || '[]');
      const updatedAll = allRequests.map(r => r.id === req.id ? updatedReq : r);
      localStorage.setItem('agriLinkConsultationRequests', JSON.stringify(updatedAll));
      setMyRequests(myRequests.map(r => r.id === req.id ? updatedReq : r));
      setCounterOfferRequest(null);
  };
  
  const handleDeleteRequest = (id: string) => {
    if (window.confirm(t('confirmDeleteRequest'))) {
        const allRequests: ConsultationRequest[] = JSON.parse(localStorage.getItem('agriLinkConsultationRequests') || '[]');
        const updatedRequests = allRequests.filter(r => r.id !== id);
        localStorage.setItem('agriLinkConsultationRequests', JSON.stringify(updatedRequests));
        
        // Update local state
        const userRequests = updatedRequests.filter(r => r.farmerId === user?.phone).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setMyRequests(userRequests);
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
    
    // Switch to request tab
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


  const sortedConsultants = useMemo(() => {
    const filtered = consultants.filter(c => c.consultantType === (appMode === 'crops' ? 'agronomist' : 'veterinarian'));
    
    const consultantsWithDistance = filtered
      .map(c => ({
        ...c,
        distance: (user?.latitude && user.longitude && c.latitude && c.longitude) ? getDistance(user.latitude, user.longitude, c.latitude, c.longitude) : Infinity
      }));

    return consultantsWithDistance.sort((a, b) => {
        switch(sortBy) {
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0);
          case 'price_asc':
            return (a.consultationPrice || Infinity) - (b.consultationPrice || Infinity);
          case 'price_desc':
            return (b.consultationPrice || 0) - (a.consultationPrice || 0);
          case 'distance':
          default:
            return a.distance - b.distance;
        }
      });
  }, [consultants, appMode, user, sortBy]);
  
    useEffect(() => {
    if (sortBy === 'distance' && (!user?.latitude || !user.longitude)) {
      setShowLocationWarning(true);
    }
  }, [sortBy, user]);

  const categories = appMode === 'crops' ? certificationData.agronomist : certificationData.veterinarian;

  const renderTabs = () => (
    <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 mb-6">
      <button onClick={() => { setActiveTab('findExpert'); cancelEdit(); }} className={`px-4 py-2 text-sm font-semibold flex items-center space-x-2 ${activeTab === 'findExpert' ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}><span>{t('findAnExpert')}</span></button>
      <button onClick={() => setActiveTab('request')} className={`px-4 py-2 text-sm font-semibold flex items-center space-x-2 ${activeTab === 'request' ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}><span>{editingRequest ? t('editingRequest') : t('requestHelp')}</span></button>
      <button onClick={() => { setActiveTab('myRequests'); cancelEdit(); }} className={`px-4 py-2 text-sm font-semibold flex items-center space-x-2 ${activeTab === 'myRequests' ? 'border-b-2 border-green-600 text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}><span>{t('myRequests')}</span></button>
    </div>
  );

  return (
    <>
      {requestToRate && <RateConsultationModal t={t} request={requestToRate} expert={consultants.find(c => c.consultantId === requestToRate.consultantId)!} onClose={() => setRequestToRate(null)} onSubmit={handleRatingSubmit} isLoading={isSubmittingRating} language={language} />}
      {selectedConsultant && <ViewProfileModal t={t} expert={selectedConsultant} onClose={() => setSelectedConsultant(null)} />}
      {showLocationWarning && <InitialNoticeModal notice={{ title: "Location Needed", message: "To sort experts by distance, please enable location access or update your GPS location in your profile." }} onClose={() => setShowLocationWarning(false)} t={t} />}
      {requestSubmittedNotice && <InitialNoticeModal notice={{ title: editingRequest ? t('requestUpdated') : t('requestSubmitted'), message: requestSubmittedNotice }} onClose={() => { setRequestSubmittedNotice(null); setActiveTab('myRequests'); }} t={t} />}
      {counterOfferRequest && <CounterOfferModal request={counterOfferRequest} t={t} onAction={handleRequestAction} onClose={() => setCounterOfferRequest(null)} />}

      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{appMode === 'crops' ? t('consultTitleCrops') : t('consultTitleAnimals')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{appMode === 'crops' ? t('consultSubtitleCrops') : t('consultSubtitleAnimals')}</p>
        </div>

        {renderTabs()}

        {activeTab === 'request' && (
           <Card>
            {chosenExpert && !editingRequest && <p className="mb-4 text-sm text-center font-semibold bg-green-50 dark:bg-green-900/20 p-2 rounded-md" dangerouslySetInnerHTML={{ __html: t('requestingHelpFrom').replace('{expertName}', `<strong>${chosenExpert.name}</strong>`)}} /> }
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-end space-x-4">
                  {editingRequest && <button type="button" onClick={cancelEdit} className="text-xs font-semibold text-gray-500 hover:underline">{t('cancelEdit')}</button>}
                  {chosenExpert && <button type="button" onClick={() => setChosenExpert(null)} className="text-xs font-semibold text-red-500 hover:underline">{t('clearSelection')}</button>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('problemCategory')}</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500">
                  <option value="">{t('selectCategory')}</option>
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{t(cat.titleKey as any)}</option>)}
                </select>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('problemDescription')}</label>
                <div className="relative">
                    <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        rows={4} 
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500" 
                        placeholder={t(appMode === 'crops' ? 'problemDescriptionPlaceholderCrops' : 'problemDescriptionPlaceholderAnimals')} 
                    />
                    {hasRecognitionSupport && (
                        <button
                            type="button"
                            onClick={handleMicClick}
                            title={t('voiceInput')}
                            className={`absolute bottom-2 right-2 p-2 rounded-full transition-colors ${
                                isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                            }`}
                        >
                            <MicrophoneIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('uploadEvidence')}</label>
                {mediaPreview ? (
                    <div className="mt-2 text-center space-y-2">
                        {mediaType === 'image' && <img src={mediaPreview} alt="Preview" className="mx-auto h-40 w-auto rounded-md" />}
                        {mediaType === 'video' && <video src={mediaPreview} controls className="mx-auto h-40 w-auto rounded-md" />}
                        <button type="button" onClick={handleRemoveMedia} className="text-sm font-medium text-red-600 hover:text-red-500">{t('removeMedia')}</button>
                    </div>
                ) : (
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                        <label htmlFor="consult-file-upload" className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                            <span>{t('uploadMedia')}</span>
                            <input id="consult-file-upload" type="file" className="sr-only" accept="image/*,video/*" onChange={handleFileChange} />
                        </label>
                    </div>
                )}
              </div>
              <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('urgencyLevel')}</label>
                 <div className="mt-2 flex justify-around rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                    {(['Low', 'Medium', 'High'] as const).map(level => (
                      <button type="button" key={level} onClick={() => setUrgency(level)} className={`w-full py-2 text-sm font-semibold rounded-md transition-colors ${urgency === level ? 'bg-white dark:bg-gray-800 shadow' : 'text-gray-600 dark:text-gray-300'}`}>{t(level.toLowerCase() as any)}</button>
                    ))}
                 </div>
              </div>
              {!isFreeConsultation && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('proposeAPrice')}</label>
                    <input type="number" value={price} onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500" placeholder={`₹ ${chosenExpert?.consultationPrice || '500'}`} />
                </div>
              )}
               {isFreeConsultation && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-lg text-center">
                    {t('freeConsultationsLeftNotice').replace('{count}', String(freeConsultationsCount))}
                </div>
               )}
              {error && <p className="text-sm font-semibold text-red-600 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 disabled:bg-gray-400 flex items-center justify-center">
              {isLoading ? <Spinner /> : (editingRequest ? t('updateRequest') : t('requestConsultation'))}
            </button>
            </form>
           </Card>
        )}
        
        {activeTab === 'myRequests' && (
           <div className="space-y-4">
            {myRequests.length === 0 ? <Card><p className="text-center text-gray-500">{t('noRequestsYet')}</p></Card>
             : myRequests.map(req => <RequestCard key={req.id} request={req} t={t} onRate={() => setRequestToRate(req)} onAction={handleRequestAction} onNegotiate={() => setCounterOfferRequest(req)} onEdit={handleEditRequest} onDelete={handleDeleteRequest} />)
            }
           </div>
        )}

        {activeTab === 'findExpert' && (
           <div className="space-y-4">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
               <div className="flex items-center space-x-1 bg-gray-200 dark:bg-gray-700 rounded-full p-1">
                 <button onClick={() => setViewMode('list')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                    <ListBulletIcon className="w-5 h-5" />
                    <span>{t('listView')}</span>
                 </button>
                 <button onClick={() => setViewMode('map')} className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${viewMode === 'map' ? 'bg-white dark:bg-gray-800 shadow text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'}`}>
                    <MapIcon className="w-5 h-5" />
                    <span>{t('mapView')}</span>
                 </button>
               </div>
               <div>
                  <label htmlFor="sort-experts" className="sr-only">{t('sortBy')}</label>
                  <select id="sort-experts" value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="text-sm rounded-md border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500">
                    <option value="distance">{t('distance')}</option>
                    <option value="rating">{t('rating')}</option>
                    <option value="price_asc">{t('priceLowToHigh')}</option>
                    <option value="price_desc">{t('priceHighToLow')}</option>
                  </select>
               </div>
             </div>
             {viewMode === 'list' && (sortedConsultants.length > 0 ? sortedConsultants.map(expert => (
                <ExpertCard key={expert.consultantId} expert={expert} t={t} onSelect={() => { setChosenExpert(expert); setActiveTab('request'); }} onViewProfile={() => setSelectedConsultant(expert)} />
             )) : <Card><p className="text-center text-gray-500">{t('noExpertsFound')}</p></Card>)}
             {viewMode === 'map' && user && (
                <ExpertMapView
                    consultants={sortedConsultants}
                    user={user}
                    onViewProfile={setSelectedConsultant}
                    t={t}
                />
            )}
           </div>
        )}
      </div>
    </>
  );
};


const RequestCard: React.FC<{
    request: ConsultationRequest, 
    t:(key:string)=>string, 
    onRate:()=>void, 
    onAction: (req: ConsultationRequest, action: 'accept' | 'decline'| 'negotiate', counterPrice?: number) => void, 
    onNegotiate:()=>void,
    onEdit: (req: ConsultationRequest) => void,
    onDelete: (id: string) => void
}> = ({ request, t, onRate, onAction, onNegotiate, onEdit, onDelete }) => {
    const expertOffer = request.negotiationHistory?.slice().reverse().find(h => h.author === 'expert');
    const currencySymbol = getCurrencySymbol(request.farmerLocation);

    const getStatusUI = () => {
        switch (request.status) {
            case 'Responded': return <p className="font-semibold text-green-600 dark:text-green-400">{t('responded')}</p>;
            case 'Declined': return <p className="font-semibold text-red-600 dark:text-red-400">{t('requestDeclined')}</p>;
            case 'Accepted': return <p className="font-semibold text-green-700 dark:text-green-300">{t('offerAccepted')}</p>;
            case 'In Negotiation': return <p className="font-semibold text-blue-600 dark:text-blue-400">{t('waitingForFarmer')}</p>;
            default: return <p className="font-semibold text-yellow-600 dark:text-yellow-400">{t('statusPending')}</p>;
        }
    };
    
    return (
        <Card>
            <div className="relative">
                <div className="absolute top-0 right-0 flex gap-2 z-30">
                    {request.status === 'Pending' && (
                        <button type="button" onClick={() => onEdit(request)} className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <PencilIcon className="w-5 h-5 pointer-events-none" />
                        </button>
                    )}
                    <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onDelete(request.id); }} 
                        className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-full p-2 shadow-sm transition-colors" 
                        title={t('delete')}
                    >
                        <TrashIcon className="w-5 h-5 pointer-events-none" />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 md:pt-0"> {/* Added padding top for mobile to avoid overlap with buttons */}
                    <div className="md:col-span-1 space-y-4">
                        {request.media.type === 'image' && <img src={request.media.dataUrl} alt="Consultation Media" className="rounded-lg object-cover w-full" />}
                        {request.media.type === 'video' && <video src={request.media.dataUrl} controls className="rounded-lg w-full" />}
                    </div>
                    <div className="md:col-span-2 space-y-4 flex flex-col">
                        <div>
                            <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">{t('problemDescription')}</h4>
                            <p className="text-gray-700 dark:text-gray-300">{request.description}</p>
                        </div>
                        <div className="flex-grow flex flex-col justify-end space-y-4">
                            <div className="flex justify-between items-center text-sm border-t dark:border-gray-700 pt-2">
                                <div>
                                    <span className="font-semibold text-gray-500 dark:text-gray-400">{t('status')}: </span>
                                    {getStatusUI()}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 text-xs">
                                    {new Date(request.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                            {expertOffer && request.status === 'In Negotiation' && (
                                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg space-y-2">
                                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">{t('expertCounterOffer').replace('{price}', `${currencySymbol}${expertOffer.price}`)}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => onAction(request, 'accept')} className="flex-1 bg-green-600 text-white text-sm font-bold py-1 px-3 rounded-lg">{t('accept')}</button>
                                        <button onClick={onNegotiate} className="flex-1 bg-blue-600 text-white text-sm font-semibold py-1 px-3 rounded-lg">{t('negotiate')}</button>
                                        <button onClick={() => onAction(request, 'decline')} className="flex-1 bg-gray-200 dark:bg-gray-600 text-sm font-semibold py-1 px-3 rounded-lg">{t('decline')}</button>
                                    </div>
                                </div>
                            )}
                            {request.status === 'Responded' && !request.isRated && (
                                <button onClick={onRate} className="w-full bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-600 transition">{t('rateYourConsultation')}</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

const ExpertCard: React.FC<{expert: User & {distance: number}, t:(key:string)=>string, onSelect:()=>void, onViewProfile:()=>void}> = ({ expert, t, onSelect, onViewProfile }) => {
    const currencySymbol = expert.priceCurrency ? getCurrencySymbol(expert.country || 'India') : '₹';
    return (
        <Card className="!p-0">
           <div className="flex items-start p-4 gap-4">
                {expert.profilePictureUrl ? (
                    <img src={expert.profilePictureUrl} alt={expert.name} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                ) : (
                    <UserCircleIcon className="w-16 h-16 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{expert.name}</h3>
                        
                        {expert.degreeVerificationStatus === 'verified' && <span title={t('verifiedExpert')}><ShieldCheckIcon className="w-5 h-5 text-blue-500" /></span>}
                    </div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400 capitalize">{t(expert.consultantType as any)}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-400" filled={true}/>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{expert.averageRating?.toFixed(1) || 'New'}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">({expert.ratings?.length || 0} {t('ratings')})</span>
                    </div>
                     <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {expert.distance !== Infinity ? t('kmAway').replace('{distance}', String(Math.round(expert.distance))) : expert.location}
                    </div>
                </div>
           </div>
           <div className="px-4 pb-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg text-gray-800 dark:text-gray-200">{currencySymbol}{expert.consultationPrice || 'N/A'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{expert.negotiationEnabled ? t('negotiationAvailable') : t('perConsultation')}</p>
              </div>
               <div className="flex items-center space-x-2">
                <button onClick={onViewProfile} className="text-sm font-semibold text-green-700 dark:text-green-400 hover:underline">{t('viewProfile')}</button>
                <button onClick={onSelect} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition">{t('requestHelp')}</button>
               </div>
           </div>
        </Card>
    );
};

const ViewProfileModal: React.FC<{expert: User, t:(key:string)=>string, onClose:()=>void}> = ({ expert, t, onClose }) => {
    const allCourses = [...certificationData.agronomist, ...certificationData.veterinarian];
    const currencySymbol = expert.priceCurrency ? getCurrencySymbol(expert.country || 'India') : '₹';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:border dark:border-gray-700 overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col">
                <div className="p-4 flex justify-between items-center border-b dark:border-gray-700 flex-shrink-0">
                    <h3 className="font-bold text-lg">{t('professionalProfile')}</h3>
                    <button onClick={onClose}><XCircleIcon className="w-7 h-7 text-gray-400 hover:text-gray-600" /></button>
                </div>
                <div className="overflow-y-auto p-6 space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        {expert.profilePictureUrl ? (
                            <img src={expert.profilePictureUrl} alt={expert.name} className="w-24 h-24 rounded-full object-cover flex-shrink-0 border-4 border-white dark:border-gray-800 shadow-md" />
                        ) : (
                            <UserCircleIcon className="w-24 h-24 text-gray-400 flex-shrink-0" />
                        )}
                        <div className="flex-grow text-center sm:text-left">
                            <h2 className="font-bold text-2xl text-gray-900 dark:text-gray-100">{expert.name}</h2>
                            <p className="text-green-600 dark:text-green-400 font-semibold capitalize">{t(expert.consultantType as any)}</p>
                            {expert.degreeVerificationStatus === 'verified' && (
                                <div className="mt-2 inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full">
                                    <ShieldCheckIcon className="w-5 h-5" />
                                    <span>{t('verifiedExpert')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t border-b dark:border-gray-700 py-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('rating')}</p>
                            <div className="flex items-center justify-center gap-1 mt-1">
                                <StarIcon className="w-5 h-5 text-yellow-400" filled={true}/>
                                <p className="font-bold text-xl text-gray-800 dark:text-gray-200">{expert.averageRating ? expert.averageRating.toFixed(1) : t('new')}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('reviews')}</p>
                            <p className="font-bold text-xl text-gray-800 dark:text-gray-200">{expert.ratings?.length || 0}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('yearsOfExperience')}</p>
                            <p className="font-bold text-xl text-gray-800 dark:text-gray-200">{expert.yearsOfExperience || 'N/A'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('price')}</p>
                            <p className="font-bold text-xl text-gray-800 dark:text-gray-200">{currencySymbol}{expert.consultationPrice || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Bio Section */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('professionalBio')}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{expert.bio || t('notSet')}</p>
                    </div>

                    {/* Certifications Section */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('completedCertifications')}</h4>
                        {(expert.completedCertifications || []).filter(c => c !== 'expert_onboarding').length > 0 ? (
                           <ul className="space-y-1 text-sm">
                            {(expert.completedCertifications || []).filter(c => c !== 'expert_onboarding').map(certId => {
                                const certDetails = allCourses.find(c => c.id === certId);
                                return (
                                    <li key={certId} className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0"/>
                                        <span className="text-gray-700 dark:text-gray-300">{certDetails ? t(certDetails.titleKey as any) : certId}</span>
                                    </li>
                                );
                            })}
                           </ul>
                        ) : <p className="text-sm text-gray-500 dark:text-gray-400">{t('noCertificationsYet')}</p>}
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{t('reviews')}</h4>
                        {expert.ratings && expert.ratings.length > 0 ? (
                            <div className="space-y-4">
                                {expert.ratings.slice(0, 3).map((rating, index) => ( // Show latest 3
                                    <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border dark:border-gray-700">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">{rating.farmerName}</p>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon key={i} className={`w-4 h-4 ${i < rating.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} filled={i < rating.rating} />
                                                ))}
                                            </div>
                                        </div>
                                        {rating.comment && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 italic">"{rating.comment}"</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">{t('noReviewsYet')}</p>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

const RateConsultationModal: React.FC<{request: ConsultationRequest, expert: User, t:(key:string)=>string, onClose:()=>void, onSubmit:(rating: number, comment: string)=>void, isLoading: boolean, language: string}> = ({ request, expert, t, onClose, onSubmit, isLoading, language}) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    // Speech Recognition
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
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <Card title={t('rateYourConsultation')} className="max-w-md w-full">
                <p className="text-sm mb-4" dangerouslySetInnerHTML={{__html: t('howWasYourExperience').replace('{expertName}', `<strong>${expert.name}</strong>`)}} />
                <div className="flex justify-center my-4">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => setRating(star)} onMouseOver={() => setRating(star)}>
                            <StarIcon className={`w-10 h-10 transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} filled={rating >= star} />
                        </button>
                    ))}
                </div>
                <div className="relative">
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder={t('addAComment')} className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm" />
                    {hasRecognitionSupport && (
                        <button
                            type="button"
                            onClick={handleMicClick}
                            title={t('voiceInput')}
                            className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-colors ${
                                isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                            }`}
                        >
                            <MicrophoneIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 font-semibold py-2 px-4 rounded-lg">{t('cancel')}</button>
                    <button onClick={() => onSubmit(rating, comment)} disabled={rating === 0 || isLoading} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">{isLoading ? <Spinner/> : t('submitRating')}</button>
                </div>
            </Card>
        </div>
    )
};

const CounterOfferModal: React.FC<{request: ConsultationRequest, t:(key:string)=>string, onAction: (req: ConsultationRequest, action: 'negotiate', counterPrice: number) => void, onClose:()=>void}> = ({ request, t, onAction, onClose }) => {
    const [counterPrice, setCounterPrice] = useState<number | ''>('');
    const expertOffer = request.negotiationHistory?.slice().reverse().find(h => h.author === 'expert');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <Card title={t('makeCounterOffer')} className="max-w-sm w-full">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t('expertOffer')}: ₹{expertOffer?.price}</p>
                <div>
                    <label className="text-sm font-medium">{t('yourOffer')}:</label>
                    <input type="number" value={counterPrice} onChange={e => setCounterPrice(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700" placeholder="₹" />
                </div>
                 <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="bg-gray-200 dark:bg-gray-600 font-semibold py-2 px-4 rounded-lg">{t('cancel')}</button>
                    <button onClick={() => onAction(request, 'negotiate', Number(counterPrice))} disabled={!counterPrice} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">{t('submitCounterOffer')}</button>
                </div>
            </Card>
        </div>
    );
};


export default ConsultScreen;
