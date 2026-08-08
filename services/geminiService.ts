import { InitialLocationData, MarketPriceData, BusinessPlan, NotificationItem, CurrentWeather } from '../types';
import * as firebaseService from './firebaseService';
import { GoogleGenAI } from '../utils/geminiClient';

const ai = new GoogleGenAI({ apiKey: 'dummy', httpOptions: { baseUrl: window.location.origin + '/api/gemini' } });

export const getInitialLocationData = async (lat: number, lon: number, targetLanguage: string = 'English'): Promise<InitialLocationData> => {
    try {
        const prompt = `latitude: ${lat}, longitude: ${lon}, language: ${targetLanguage}. 
Generate a realistic agricultural weather forecast. Return a JSON object with the following exact structure:
{
  "locationName": "City, Region",
  "suggestedLanguage": "${targetLanguage}",
  "weatherData": {
    "current": { "temp": 28, "condition": "Sunny", "humidity": 60, "windSpeed": 10, "icon": "clear-day" },
    "forecast": [
       // EXACTLY 7 items for the next 7 days
       { "day": "Today", "date": "Oct 12", "high": 30, "low": 20, "condition": "Sunny", "icon": "clear-day", "summary": "Good for sowing.", "humidity": 50, "windSpeed": 12 }
    ],
    "hourly": [
       // EXACTLY 24 items for the next 24 hours
       { "time": "09:00 AM", "temp": 25, "precipChance": 0, "icon": "clear-day" }
    ]
  }
}
CRITICAL: You MUST provide EXACTLY 7 items in the 'forecast' array and EXACTLY 24 items in the 'hourly' array. Use valid weather icons like 'clear-day', 'partly-cloudy-day', 'rain', 'clear-night'.`;
        const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
        return JSON.parse(res.text || '{}') as InitialLocationData;
    } catch(e) {
        return {
            locationName: "Local Area",
            suggestedLanguage: targetLanguage,
            weatherData: {
                current: { temp: 28, condition: "Sunny", humidity: 60, windSpeed: 10, icon: "☀️" },
                forecast: Array.from({ length: 7 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    return {
                        day: i === 0 ? "Today" : d.toLocaleDateString('en-US', { weekday: 'short' }),
                        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        high: 30 + Math.floor(Math.random() * 5),
                        low: 20 + Math.floor(Math.random() * 5),
                        condition: i % 2 === 0 ? "Sunny" : "Cloudy",
                        icon: i % 2 === 0 ? "clear-day" : "partly-cloudy-day",
                        summary: "Mock weather summary.",
                        humidity: 50 + i * 2,
                        windSpeed: 10 + i
                    };
                }),
                hourly: Array.from({ length: 24 }).map((_, i) => {
                    return {
                        time: `${i}:00`,
                        temp: 25 + Math.floor(Math.random() * 5),
                        precipChance: i % 3 === 0 ? 10 : 0,
                        icon: i > 6 && i < 18 ? "clear-day" : "clear-night"
                    };
                })
            }
        };
    }
};

export const performDiagnosis = async (mediaUrl: string, mediaType: 'image' | 'video', context: { mode: 'crops' | 'animals', details: string }, language: string): Promise<any> => {
    try {
        const extraKeywords = context.mode === 'crops' ? 'plant photo plantname indian senior agricultural consultant' : 'veterinarian livestock health animaltype';
        const prompt = `diagnose ${context.mode}. Context: ${context.details}. language: ${language}. Keywords: ${extraKeywords}`;
        const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
        return JSON.parse(res.text || '{}');
    } catch(e) {
        return {
            issue: "Mock Diagnosis",
            analysis: "<p>This is a mock diagnosis running without an API.</p>",
            symptoms: ["Symptom 1", "Symptom 2"],
            confidence: 90
        };
    }
};

export const getMarketPrice = async (itemName: string, itemType: string, itemBreed: string | undefined, user: any): Promise<any> => {
    try {
        const prompt = `market price for commodity: ${itemName}, type: ${itemType}, breed: ${itemBreed}, user state: ${user?.state}`;
        const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
        return JSON.parse(res.text || '{}');
    } catch(e) {
        return {
            regional: { price: "₹2,500/quintal", value: 2500, unit: "quintal", date: new Date().toISOString(), currency: "INR", location: user?.state || "Local", quantity_for_price: 1 },
            national: { price: "₹2,400/quintal", value: 2400, unit: "quintal", date: new Date().toISOString(), currency: "INR", location: "National Average", quantity_for_price: 1 }
        };
    }
};

export const findNearbyPlaces = async (lat: number | undefined, lon: number | undefined, locName: string, query: string): Promise<string> => {
    try {
        const prompt = `nearby googlemaps places for ${query} near ${locName}`;
        const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text || '';
    } catch(e) {
        return `<ul><li><b>Mock Store 1</b> (⭐ 4.5) - Local Address</li></ul>`;
    }
};

export const generateImageForQuery = async (imageQuery: string): Promise<string> => {
    return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWNlY2VjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY2NiIgZHk9Ii4zZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiPk1vY2sgSW1hZ2U8L3RleHQ+PC9zdmc+";
};

export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
        const prompt = `Translate to ${targetLanguage}: ${text}`;
        const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text || text;
    } catch(e) {
        return text;
    }
};

export const generateBusinessPlan = async (details: BusinessPlan['details'], mode: 'crops' | 'animals', strategy: 'auto' | 'manual', selectedItems: string[] | undefined, language: string): Promise<BusinessPlan['report']> => {
    try {
        const prompt = `strategic business plan for ${mode} using ${strategy} strategy with details: ${JSON.stringify(details)}. Language: ${language}.`;
        const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
        return JSON.parse(res.text || '{}');
    } catch(e) {
        return {
            title: "Mock Business Plan",
            executiveSummary: "This is a mock business plan generated locally without an API.",
            timeline: [],
            longTerm: { year1: "", year3: "", year5: "" }
        };
    }
};

export const fetchFarmerNotifications = async (state: string, country: string, language: string): Promise<NotificationItem[]> => {
    try {
        const prompt = `farmer notifications and outbreaks for ${state}, ${country}. Language: ${language}`;
        const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: 'application/json' } });
        const parsed = JSON.parse(res.text || '{}');
        return parsed.notifications || [];
    } catch(e) {
        return [];
    }
};

export const ENGAGING_INSTRUCTION = `CRITICAL INSTRUCTION FOR VISUAL ENGAGEMENT & INTERACTIVITY:
You are an "Agri-Visionary" — a world-class Agricultural Consultant who uses RICH HTML to communicate complex ideas.`;

