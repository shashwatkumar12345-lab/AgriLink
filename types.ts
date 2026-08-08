export type AppMode = 'crops' | 'animals';
export type Theme = 'light' | 'dark';
export type UserRole = 'farmer' | 'consultant' | 'trainee';
export type ConsultantType = 'agronomist' | 'veterinarian';

export enum Screen {
  TRACE = 'Trace',
  DIAGNOSE = 'Diagnose',
  CONSULT = 'Consult',
  LEARN = 'Learn',
  WEATHER = 'Weather',
  ASK = 'Ask',
  PROFILE = 'Profile',
  ABOUT = 'About',
  BUSINESS_PLAN = 'BusinessPlan',
}

export interface Rating {
    farmerName: string;
    rating: number; // 1-5
    comment?: string;
    timestamp: string;
}

export interface DiagnosisContext {
  type: 'Crop' | 'Animal';
  name: string;
  issue: string;
  symptoms: string;
  analysis: string; 
  timestamp: number;
}

export interface BusinessPlan {
  id: string;
  userId: string;
  timestamp: string;
  mode: AppMode;
  details: {
    landSize?: string;
    landUnit?: string;
    soilType?: string; 
    waterSource?: string;
    animalCount?: string;
    budget?: string;
    location: string;
  };
  strategy: 'auto' | 'manual';
  selectedCommodities?: string[];
  report: {
    title: string;
    executiveSummary: string;
    comparison?: string;
    timeline?: Array<{ title: string; duration?: string; content: string }>;
    longTerm?: {
        year1: string;
        year3: string;
        year5: string;
    };
  };
  imageUrl?: string;
}

export interface User {
  uid?: string;
  name: string;
  phone: string;
  location: string; 
  state: string;
  country: string;
  role: 'farmer' | 'consultant';
  consultantType?: ConsultantType;
  completedCertifications: string[]; 
  farmSize?: number;
  farmSizeUnit?: 'acres' | 'bigha' | 'hectares';
  soilType?: 'loamy' | 'sandy' | 'clay' | 'silt' | 'peat';
  primaryCrops?: string;
  primaryLivestock?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  consultantId?: string;
  bio?: string;
  yearsOfExperience?: number;
  profilePictureUrl?: string; 
  experienceCertificateUrls?: string[]; 
  ratings?: Rating[];
  averageRating?: number;
  consultationPrice?: number;
  priceCurrency?: string;
  negotiationEnabled?: boolean;
  signupRole?: UserRole;
  agronomistRole?: 'consultant' | 'trainee';
  veterinarianRole?: 'consultant' | 'trainee';
  latitude?: number;
  longitude?: number;
  degreeCertificateUrl?: string; 
  degreeVerificationStatus?: 'not_uploaded' | 'pending' | 'verified' | 'rejected';
  languagePreference?: string;
  hasSeenTutorial?: boolean;
  hasSeenWelcome?: boolean;
  hasAcceptedFarmerAgreement?: boolean;
  hasAcceptedExpertAgreement?: boolean;
}

export type HarvestQuality = 'Grade A' | 'Grade B' | 'Grade C';

export interface Diagnosis {
  timestamp: string;
  issue: string;
  analysis: string;
  mediaUrl: string; 
}

export interface Harvest {
  id: string;
  crop: string;
  quantity: number;
  quality: HarvestQuality;
  status: 'Harvested' | 'Pending' | 'In Transit' | 'Delivered';
  timestamp: string;
  diagnoses?: Diagnosis[];
}

export interface Animal {
    id: string;
    name: string;
    quantity: number;
    weight?: number;
    breed?: string;
    timestamp: string;
    diagnoses?: Diagnosis[];
}

export interface ConsultationRequest {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  type: AppMode;
  description: string;
  media: {
    dataUrl: string;
    type: 'image' | 'video';
  };
  urgency: 'Low' | 'Medium' | 'High';
  timestamp: string;
  status: 'Pending' | 'In Negotiation' | 'Accepted' | 'Responded' | 'Declined';
  category: string; 
  farmerId: string;
  consultantId?: string;
  isRated?: boolean;
  isFree?: boolean;
  price?: number; 
  negotiationHistory?: Array<{ author: 'farmer' | 'expert'; price: number; timestamp: string }>;
  finalPrice?: number;
  farmerLatitude?: number;
  farmerLongitude?: number;
}

export interface LessonTopic {
    id: string;
    title: string;
    emoji: string;
    interactive: boolean;
}

export interface LearnResponse {
    brief: string;
    detailed: string;
    imageQuery?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  imageQuery?: string;
  imageUrl?: string;
  isImageLoading?: boolean;
}

export interface LiveChatMessage {
  id: number;
  role: 'user' | 'model';
  text: string;
}

export interface CurrentWeather {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export interface ForecastDay {
  day: string;
  date: string; 
  high: number;
  low: number;
  condition: string;
  icon: string;
  summary: string; 
  humidity: number; 
  windSpeed: number; 
}

export interface ForecastHour {
  time: string; 
  temp: number;
  precipChance: number; 
  icon: string;
}

export interface WeatherData {
    current: CurrentWeather;
    forecast: ForecastDay[];
    hourly: ForecastHour[];
}

export interface InitialLocationData {
    locationName: string;
    suggestedLanguage: string;
    weatherData: WeatherData;
}

export interface PriceInfo {
    price: string; 
    value: number; 
    currency: 'INR' | 'USD' | string; 
    unit: 'kg' | 'quintal' | 'ton' | 'lb' | 'head' | 'each' | 'bird' | string; 
    quantity_for_price: number; 
    location: string;
    date?: string; 
}

export interface MarketPriceData {
    regional?: PriceInfo;
    national?: PriceInfo;
}

export interface NotificationItem {
    id: string;
    title: string;
    summary: string;
    fullContent: string; 
    type: 'crop_pest' | 'animal_disease' | 'news' | 'scheme' | 'market';
    scope: 'state' | 'national';
    severity: 'low' | 'medium' | 'high'; 
    timestamp: string;
    location?: string; 
}