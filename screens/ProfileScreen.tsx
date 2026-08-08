
import React, { useState, useEffect, useRef } from 'react';
import { User, Screen, ConsultationRequest } from '../types';
import Card, { Certificate } from '../components/Card';
import { regionData } from '../utils/regionData';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { certificationData } from '../certificationData';
import { fileToBase64 } from '../utils/fileUtils';
import { LocationMarkerIcon } from '../components/icons/LocationMarkerIcon';
import KnowUsSection from '../components/KnowUsSection';
import { ShieldCheckIcon } from '../components/icons/ShieldCheckIcon';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { languageConfig } from '../utils/countryLanguages';
import { MicrophoneIcon } from '../components/icons/MicrophoneIcon';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';

interface ProfileScreenProps {
  user: User;
  onUpdateUser: (user: User) => void;
  t: (key: string) => string;
  setActiveScreen: (screen: Screen) => void;
  freeConsultationsCount: number;
  setLanguage: (lang: string) => void;
  language: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onUpdateUser, t, setActiveScreen, freeConsultationsCount, setLanguage, language }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);
  const [statesList, setStatesList] = useState<string[]>([]);
  const [viewingCertificate, setViewingCertificate] = useState<(typeof certificationData.agronomist[0]) | null>(null);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [locationMessage, setLocationMessage] = useState('');

  // Speech Recognition
  const { transcript, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition(languageConfig[language]?.code || 'en-US');
  const [activeField, setActiveField] = useState<string | null>(null);
  const baseTextRef = useRef('');

  useEffect(() => {
    if (isListening && activeField) {
        setFormData(prev => {
            return { ...prev, [activeField]: baseTextRef.current + (baseTextRef.current && transcript ? ' ' : '') + transcript };
        });
    } else if (!isListening) {
        setActiveField(null);
    }
  }, [transcript, isListening]); 

  const handleMicClick = (field: string) => {
      if (isListening) {
          stopListening();
          setActiveField(null);
      } else {
          setActiveField(field);
          baseTextRef.current = (formData[field as keyof User] as string) || '';
          startListening();
      }
  };


  useEffect(() => {
    setFormData(user);
    // Hardcoded to India states
    const countryData = regionData["India"];
    setStatesList(countryData?.states || []);
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === 'profilePictureUrl') {
        const file = files[0];
        const base64 = await fileToBase64(file);
        setFormData(prev => ({ ...prev, profilePictureUrl: `data:${file.type};base64,${base64}` }));
    } else if (name === 'experienceCertificateUrls') {
        const fileArray = Array.from(files);
        const base64Promises = fileArray.map(async (file: File) => {
            const base64 = await fileToBase64(file);
            return `data:${file.type};base64,${base64}`;
        });
        const base64Urls = await Promise.all(base64Promises);
        setFormData(prev => ({ ...prev, experienceCertificateUrls: [...(prev.experienceCertificateUrls || []), ...base64Urls] }));
    }
  };

  const handleDegreeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        try {
            const base64 = await fileToBase64(file);
            const dataUrl = `data:${file.type};base64,${base64}`;
            const updatedUser = {
                ...user,
                degreeCertificateUrl: dataUrl,
                degreeVerificationStatus: 'pending' as const
            };
            onUpdateUser(updatedUser);
        } catch (error) {
            console.error("Failed to upload degree", error);
            alert("Failed to upload degree certificate. Please try again.");
        }
    }
  };


  const handleLocationUpdate = () => {
    setLocationMessage('Getting location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, latitude, longitude }));
        setLocationMessage('Location updated!');
        setTimeout(() => setLocationMessage(''), 3000);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationMessage('Could not get location. Please enable permissions.');
        setTimeout(() => setLocationMessage(''), 5000);
      }
    );
  };

  const handleSave = () => {
    onUpdateUser(formData);
    setIsEditing(false);
  };

  const renderValue = (value: string | number | undefined, placeholder: string = t('notSet')) => (
    <p className="text-gray-800 dark:text-gray-300 capitalize">{value || placeholder}</p>
  );

  const inputClasses = "mt-1 block w-full rounded-xl glass-input p-3 shadow-inner text-gray-900 dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0 focus:outline-none";
  const isFarmer = user.role === 'farmer';

  return (
    <>
      {viewingCertificate && (
        <Certificate userName={user.name} certificationName={t(viewingCertificate.titleKey as any)} issueDate={t('certifiedStatus')} t={t} onClose={() => setViewingCertificate(null)} />
      )}
      {viewingImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" onClick={() => setViewingImage(null)}>
              <img src={viewingImage} alt="Certificate preview" className="max-w-full max-h-full rounded-lg"/>
          </div>
      )}
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button onClick={() => setActiveScreen(Screen.DIAGNOSE)} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('back')}>
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">{t('myProfile')}</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{t('manageProfile')}</p>
            </div>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700">{t('editProfile')}</button>
          ) : (
            <div className="space-y-2 sm:space-y-0 sm:space-x-2">
              <button onClick={() => { setIsEditing(false); setFormData(user); }} className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">{t('cancel')}</button>
              <button onClick={handleSave} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">{t('saveChanges')}</button>
            </div>
          )}
        </div>

        <Card title={t('personalDetails')}>
          <div className="space-y-4">
             {/* Profile Picture Upload - Centered Content */}
             <div className="text-center mb-4">
                {isEditing ? (
                    <div className="flex flex-col items-center">
                       <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {formData.profilePictureUrl ? (
                            <img src={formData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            /* Fix: UserCircleIcon was not imported */
                            <UserCircleIcon className="w-16 h-16 text-gray-400" />
                          )}
                       </div>
                       <label htmlFor="profile-pic-upload" className="cursor-pointer text-sm font-semibold text-green-600 hover:underline">{t('uploadMedia')}</label>
                       <input id="profile-pic-upload" type="file" name="profilePictureUrl" accept="image/*" onChange={handleFileChange} className="sr-only" />
                    </div>
                ) : (
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                       {user.profilePictureUrl ? (
                         <img src={user.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                       ) : (
                         /* Fix: UserCircleIcon was not imported */
                         <UserCircleIcon className="w-16 h-16 text-gray-400" />
                       )}
                    </div>
                )}
             </div>

            {isFarmer ? (
                 <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('farmerFreeConsultationsLeft')}</label>
                    <p className="text-green-600 dark:text-green-400 font-bold text-lg">{freeConsultationsCount}</p>
                 </div>
            ) : (
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('freeConsultationsRemaining')}</label>
                  <p className="text-green-600 dark:text-green-400 font-bold text-lg">{freeConsultationsCount}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('fullName')}</label>
              {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClasses} /> : renderValue(formData.name)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('phoneNumber')}</label>
              {isEditing ? <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClasses} /> : renderValue(formData.phone)}
            </div>
             <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('age')}</label>
              {isEditing ? <input type="number" name="age" value={formData.age || ''} onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value === '' ? undefined : Number(e.target.value) }))} className={inputClasses} /> : renderValue(formData.age)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('gender')}</label>
              {isEditing ? (
                  <select name="gender" value={formData.gender || ''} onChange={handleChange} className={inputClasses}>
                      <option value="">{t('selectGender')}</option>
                      <option value="male">{t('male')}</option>
                      <option value="female">{t('female')}</option>
                      <option value="other">{t('other')}</option>
                  </select>
              ) : renderValue(formData.gender ? t(formData.gender as any) : undefined)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('country')}</label>
              <input type="text" value="India" disabled className={`${inputClasses} bg-gray-100 dark:bg-gray-800/50 cursor-not-allowed`} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('stateProvince')}</label>
              {isEditing ? (statesList.length > 0 ? <select name="state" value={formData.state || ''} onChange={handleChange} className={inputClasses}><option value="">{t('selectStateProvince')}</option>{statesList.map(s => <option key={s} value={s}>{s}</option>)}</select> : <input type="text" name="state" value={formData.state || ''} onChange={handleChange} className={inputClasses} placeholder={t('stateProvincePlaceholder')} />) : renderValue(formData.state)}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('cityTown')}</label>
              {isEditing ? <input type="text" name="location" value={formData.location} onChange={handleChange} className={inputClasses} /> : renderValue(formData.location)}
            </div>
            {!isFarmer && (
                 <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('locationGPS')}</label>
                    {isEditing ? (
                      <div className="space-y-2 mt-1">
                        <div className="flex items-center space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-700/50">
                          <LocationMarkerIcon className="w-5 h-5 text-gray-400" />
                          <p className="text-sm text-gray-800 dark:text-gray-300">
                            Lat: {formData.latitude?.toFixed(4) || t('notSet')}, Lon: {formData.longitude?.toFixed(4) || t('notSet')}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleLocationUpdate}
                          className="w-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/80 transition"
                        >
                          {t('useMyCurrentLocation')}
                        </button>
                        {locationMessage && <p className="text-xs text-center text-gray-500">{locationMessage}</p>}
                      </div>
                    ) : (
                      renderValue(formData.latitude && formData.longitude ? `Lat: ${formData.latitude.toFixed(4)}, Lon: ${formData.longitude.toFixed(4)}` : undefined)
                    )}
                  </div>
            )}
          </div>
        </Card>

        {isFarmer ? (
          <Card title={t('farmDetails')}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('farmSize')}</label>
                  {isEditing ? <div className="flex items-center space-x-2 mt-1"><input type="number" name="farmSize" value={formData.farmSize || ''} onChange={handleChange} className={inputClasses} /><select name="farmSizeUnit" value={formData.farmSizeUnit || 'acres'} onChange={handleChange} className={`${inputClasses} w-auto`}><option value="acres">{t('acres')}</option><option value="bigha">{t('bigha')}</option><option value="hectares">{t('hectares')}</option></select></div> : renderValue(`${formData.farmSize || ''} ${t((formData.farmSizeUnit as any) || '')}`.trim() || t('notSet'))}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('soilType')}</label>
                  {isEditing ? <select name="soilType" value={formData.soilType || ''} onChange={handleChange} className={inputClasses}><option value="">{t('selectSoilType')}</option><option value="loamy">Loamy</option><option value="sandy">Sandy</option><option value="clay">Clay</option><option value="silt">Silt</option><option value="peat">Peat</option></select> : renderValue(formData.soilType)}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('primaryCrops')}</label>
                  <div className="relative">
                      {isEditing ? (
                          <>
                            <textarea 
                                name="primaryCrops" 
                                value={isListening && activeField === 'primaryCrops' && !transcript ? t('listening') : (formData.primaryCrops || '')}
                                onChange={handleChange} 
                                rows={2} 
                                className={`${inputClasses} ${isListening && activeField === 'primaryCrops' && !transcript ? 'text-green-500 italic animate-pulse' : ''}`} 
                                placeholder={t('primaryCropsPlaceholder')}
                            ></textarea>
                            {hasRecognitionSupport && (
                                <button
                                    type="button"
                                    onClick={() => handleMicClick('primaryCrops')}
                                    title={t('voiceInput')}
                                    className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-colors ${
                                        isListening && activeField === 'primaryCrops'
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                >
                                    <MicrophoneIcon className="h-5 w-5" />
                                </button>
                            )}
                          </>
                      ) : (
                          renderValue(formData.primaryCrops)
                      )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('primaryLivestock')}</label>
                  <div className="relative">
                      {isEditing ? (
                          <>
                            <textarea 
                                name="primaryLivestock" 
                                value={isListening && activeField === 'primaryLivestock' && !transcript ? t('listening') : (formData.primaryLivestock || '')}
                                onChange={handleChange} 
                                rows={2} 
                                className={`${inputClasses} ${isListening && activeField === 'primaryLivestock' && !transcript ? 'text-green-500 italic animate-pulse' : ''}`}
                                placeholder={t('primaryLivestockPlaceholder')}
                            ></textarea>
                            {hasRecognitionSupport && (
                                <button
                                    type="button"
                                    onClick={() => handleMicClick('primaryLivestock')}
                                    title={t('voiceInput')}
                                    className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-colors ${
                                        isListening && activeField === 'primaryLivestock'
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                >
                                    <MicrophoneIcon className="h-5 w-5" />
                                </button>
                            )}
                          </>
                      ) : (
                          renderValue(formData.primaryLivestock)
                      )}
                  </div>
                </div>
              </div>
          </Card>
        ) : (
          <>
            <Card title={t('degreeVerification')}>
               {user.degreeVerificationStatus === 'verified' ? (
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <ShieldCheckIcon className="w-12 h-12 text-green-500 mx-auto mb-2" />
                  <p className="font-bold text-green-800 dark:text-green-300">{t('verificationComplete')}</p>
                </div>
              ) : user.degreeVerificationStatus === 'pending' ? (
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="font-semibold text-yellow-800 dark:text-yellow-400">{t('verificationPending')}</p>
                  {user.degreeCertificateUrl && (
                    <a href={user.degreeCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">View Uploaded Document</a>
                  )}
                </div>
              ) : ( 
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('uploadDegreeMessage')}</p>
                  <p className="text-xs text-center text-gray-500 dark:text-gray-400 -mt-2">{t('degreeVerificationPrivacy')}</p>
                  <label htmlFor="degree-upload" className="w-full cursor-pointer text-center block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300">
                    <span>{t('uploadDegree')}</span>
                    <input id="degree-upload" type="file" name="degreeCertificateUrl" accept="image/*,.pdf" onChange={handleDegreeUpload} className="sr-only" />
                  </label>
                </div>
              )}
            </Card>
            <Card title={t('professionalProfile')}>
              <div className="space-y-4">
                 <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('specialty')}</label>
                  <p className="text-gray-800 dark:text-gray-300 font-semibold">{t(user.consultantType as any)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('consultationPrice')}</label>
                  {isEditing ? (
                    <div className="flex items-center space-x-2 mt-1">
                      <input type="number" name="consultationPrice" value={formData.consultationPrice || ''} onChange={handleChange} className={inputClasses} placeholder="e.g., 500" />
                      <select name="priceCurrency" value={formData.priceCurrency || 'INR'} onChange={handleChange} className={`${inputClasses} w-auto`}>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  ) : (
                    renderValue(formData.consultationPrice ? `${formData.priceCurrency === 'INR' ? '₹' : '$'}${formData.consultationPrice}` : t('notSet'))
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('enableNegotiation')}</label>
                  {isEditing ? (
                    <div className="mt-2">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="negotiationEnabled"
                          checked={!!formData.negotiationEnabled}
                          onChange={(e) => setFormData(prev => ({...prev, negotiationEnabled: e.target.checked}))}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  ) : (
                    renderValue(formData.negotiationEnabled ? t('yes') : t('no'))
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('yearsOfExperience')}</label>
                  {isEditing ? <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience || ''} onChange={handleChange} className={inputClasses} /> : renderValue(formData.yearsOfExperience)}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('professionalBio')}</label>
                  <div className="relative">
                      {isEditing ? (
                          <>
                            <textarea 
                                name="bio" 
                                value={isListening && activeField === 'bio' && !transcript ? t('listening') : (formData.bio || '')} 
                                onChange={handleChange} 
                                rows={4} 
                                className={`${inputClasses} ${isListening && activeField === 'bio' && !transcript ? 'text-green-500 italic animate-pulse' : ''}`}
                            ></textarea>
                            {hasRecognitionSupport && (
                                <button
                                    type="button"
                                    onClick={() => handleMicClick('bio')}
                                    title={t('voiceInput')}
                                    className={`absolute bottom-2 right-2 p-1.5 rounded-full transition-colors ${
                                        isListening && activeField === 'bio'
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                >
                                    <MicrophoneIcon className="h-5 w-5" />
                                </button>
                            )}
                          </>
                      ) : (
                          renderValue(formData.bio)
                      )}
                  </div>
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('experienceCertificates')}</label>
                    {isEditing ? (
                      <div className="mt-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{t('uploadExperienceMessage')}</p>
                        <label htmlFor="cert-upload" className="cursor-pointer text-sm font-semibold text-green-600 hover:underline">{t('uploadMedia')}</label>
                        <input id="cert-upload" type="file" name="experienceCertificateUrls" accept="image/*" multiple onChange={handleFileChange} className="sr-only" />
                      </div>
                    ) : (
                        (user.experienceCertificateUrls || []).length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {(user.experienceCertificateUrls || []).map((url, i) => (
                                <button key={i} onClick={() => setViewingImage(url)}>
                                    <img src={url} alt={`Certificate ${i+1}`} className="w-20 h-20 object-cover rounded-md border-2 dark:border-gray-600 hover:opacity-80 transition"/>
                                </button>
                            ))}
                          </div>
                        ) : <p className="text-gray-500 dark:text-gray-400 mt-1">No certificates uploaded.</p>
                    )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('completedCertifications')}</label>
                  {(user.completedCertifications || []).filter(c => c !== 'expert_onboarding').length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {(user.completedCertifications || []).filter(c => c !== 'expert_onboarding').map(certId => {
                        const allCourses = [...certificationData.agronomist, ...certificationData.veterinarian];
                        const certDetails = allCourses.find(c => c.id === certId);
                        if (!certDetails) return null;
                        return (
                          <div key={certId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{t(certDetails.titleKey as any)}</p>
                            <button onClick={() => setViewingCertificate(certDetails)} className="text-sm font-semibold text-green-600 dark:text-green-400 hover:underline">{t('viewCertificate')}</button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{t('noCertificationsYet')}</p>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:border dark:border-gray-700 overflow-hidden w-full">
            <details className="faq-accordion">
                <summary className="p-4 md:p-6 text-lg font-semibold text-gray-800 dark:text-gray-200 cursor-pointer flex justify-between items-center">
                    {t('knowOurTeam')}
                    <span className="plus-icon text-green-500 text-2xl font-light transition-transform duration-300 transform">+</span>
                </summary>
                <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700">
                    <KnowUsSection t={t} />
                </div>
            </details>
        </div>

        <Card title={t('aboutAgriLink')}>
            <div className="flex justify-center">
                <button onClick={() => setActiveScreen(Screen.ABOUT)} className="w-full max-w-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">{t('learnMoreAboutUs')}</button>
            </div>
        </Card>
      </div>
    </>
  );
};

export default ProfileScreen;
