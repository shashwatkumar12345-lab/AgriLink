import { auth } from '../config/firebase';
import { User, ConsultationRequest, Harvest, Animal, Rating, BusinessPlan, NotificationItem, MarketPriceData } from '../types';

export { auth };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  console.error('Local Storage Error: ', error);
  throw error;
}

export const dataURLtoBlob = async (dataurl: string): Promise<Blob> => {
    return new Promise((resolve) => {
        resolve(new Blob());
    });
};

const getLocal = (key: string) => JSON.parse(localStorage.getItem(key) || '[]');
const setLocal = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

// Shared Notifications
export const getSharedNotifications = async (scope: 'state' | 'national', location: string, language: string): Promise<NotificationItem[]> => {
    return getLocal(`notifications_${scope}_${location}_${language}`);
};

export const saveSharedNotifications = async (scope: 'state' | 'national', location: string, language: string, notifications: NotificationItem[]) => {
    setLocal(`notifications_${scope}_${location}_${language}`, notifications);
};

// Auth overrides for app login
export const registerUser = async (email: string, pass: string, name: string) => {
    const uid = 'local_user_' + Date.now();
    const user = { uid, email, name, role: 'farmer' };
    auth.updateCurrentUser(user);
    return { user };
};

export const loginUser = async (email: string, pass: string) => {
    const user = getLocal('users').find((u: any) => u.email === email) || { uid: 'local_user_' + Date.now(), email };
    auth.updateCurrentUser(user);
    return { user };
};

export const loginWithGoogle = async (): Promise<any> => {
    const user = { uid: 'google_user_' + Date.now(), email: 'google@example.com' };
    auth.updateCurrentUser(user);
    return { user };
};

export const loginWithFacebook = async (): Promise<any> => {
    const user = { uid: 'facebook_user_' + Date.now(), email: 'facebook@example.com' };
    auth.updateCurrentUser(user);
    return { user };
};

export const loginAnonymously = async (): Promise<any> => {
    const user = { uid: 'anon_user_' + Date.now(), isAnonymous: true };
    auth.updateCurrentUser(user);
    return { user };
};

export const loginOrRegisterDemoUser = async (email: string, pass: string, name: string): Promise<any> => {
    return registerUser(email, pass, name);
};

export const logoutUser = async () => {
    auth.updateCurrentUser(null);
};

// Users
export const createUserProfile = async (uid: string, userData: User) => {
    const users = getLocal('users');
    const existingIndex = users.findIndex((u: any) => u.uid === uid);
    if (existingIndex > -1) {
        users[existingIndex] = { ...users[existingIndex], ...userData, uid };
    } else {
        users.push({ ...userData, uid });
    }
    setLocal('users', users);
};

export const getUserProfile = async (uid: string): Promise<User | null> => {
    const users = getLocal('users');
    return users.find((u: any) => u.uid === uid) || null;
};

export const updateUserProfile = async (uid: string, data: Partial<User>) => {
    const users = getLocal('users');
    const existingIndex = users.findIndex((u: any) => u.uid === uid);
    if (existingIndex > -1) {
        users[existingIndex] = { ...users[existingIndex], ...data };
        setLocal('users', users);
    }
};

// Harvests
export const getHarvests = async (userId: string): Promise<Harvest[]> => {
    return getLocal('harvests').filter((h: any) => h.userId === userId).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const saveHarvest = async (userId: string, harvest: Harvest) => {
    const harvests = getLocal('harvests');
    const existingIndex = harvests.findIndex((h: any) => h.id === harvest.id);
    if (existingIndex > -1) {
        harvests[existingIndex] = { ...harvest, userId };
    } else {
        harvests.push({ ...harvest, userId });
    }
    setLocal('harvests', harvests);
};

export const deleteHarvestDoc = async (harvestId: string) => {
    const harvests = getLocal('harvests').filter((h: any) => h.id !== harvestId);
    setLocal('harvests', harvests);
};

// Animals
export const getAnimals = async (userId: string): Promise<Animal[]> => {
    return getLocal('animals').filter((a: any) => a.userId === userId).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const saveAnimal = async (userId: string, animal: Animal) => {
    const animals = getLocal('animals');
    const existingIndex = animals.findIndex((a: any) => a.id === animal.id);
    if (existingIndex > -1) {
        animals[existingIndex] = { ...animal, userId };
    } else {
        animals.push({ ...animal, userId });
    }
    setLocal('animals', animals);
};

export const deleteAnimalDoc = async (animalId: string) => {
    const animals = getLocal('animals').filter((a: any) => a.id !== animalId);
    setLocal('animals', animals);
};

// Consultations
export const getConsultationRequests = async (userRole: 'farmer' | 'consultant' | 'trainee', userId: string): Promise<ConsultationRequest[]> => {
    return getLocal('consultations').filter((c: any) => userRole === 'farmer' ? c.farmerId === userId : c.consultantId === userId).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const createConsultationRequest = async (request: ConsultationRequest) => {
    const consultations = getLocal('consultations');
    consultations.push(request);
    setLocal('consultations', consultations);
};

export const updateConsultationStatus = async (requestId: string, status: ConsultationRequest['status'], updates?: Partial<ConsultationRequest>) => {
    const consultations = getLocal('consultations');
    const existingIndex = consultations.findIndex((c: any) => c.id === requestId);
    if (existingIndex > -1) {
        consultations[existingIndex] = { ...consultations[existingIndex], status, ...updates };
        setLocal('consultations', consultations);
    }
};

export const deleteConsultationRequest = async (requestId: string) => {
    const consultations = getLocal('consultations').filter((c: any) => c.id !== requestId);
    setLocal('consultations', consultations);
};

// Business Plans
export const saveBusinessPlan = async (plan: BusinessPlan) => {
    const plans = getLocal('business_plans');
    const existingIndex = plans.findIndex((p: any) => p.id === plan.id);
    if (existingIndex > -1) {
        plans[existingIndex] = plan;
    } else {
        plans.push(plan);
    }
    setLocal('business_plans', plans);
};

export const getBusinessPlans = async (userId: string): Promise<BusinessPlan[]> => {
    return getLocal('business_plans').filter((p: any) => p.userId === userId).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const deleteBusinessPlan = async (planId: string) => {
    const plans = getLocal('business_plans').filter((p: any) => p.id !== planId);
    setLocal('business_plans', plans);
};

// Market Price Index
export const getStoredMarketPrice = async (itemName: string, state: string, date: string): Promise<MarketPriceData | null> => {
    const normalizedItem = itemName.trim().toLowerCase();
    const safeState = (state || 'national').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const docId = `price_${safeState}_${normalizedItem}_${date}`;
    return getLocal(docId) || null;
};

export const saveStoredMarketPrice = async (itemName: string, state: string, date: string, priceData: MarketPriceData) => {
    const normalizedItem = itemName.trim().toLowerCase();
    const safeState = (state || 'national').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const docId = `price_${safeState}_${normalizedItem}_${date}`;
    setLocal(docId, priceData);
};

// Cache & Global Persistence
export const getGlobalTranslations = async (language: string): Promise<Record<string, string>> => {
    return getLocal(`translations_${language}`) || {};
};

export const updateGlobalTranslations = async (language: string, newTranslations: Record<string, string>) => {
    setLocal(`translations_${language}`, newTranslations);
};

export const getCachedImage = async (collectionName: string, key: string): Promise<string | null> => {
    return localStorage.getItem(`${collectionName}_${key}`) || null;
};

export const saveCachedImage = async (collectionName: string, key: string, dataUrl: string): Promise<string> => {
    try {
        localStorage.setItem(`${collectionName}_${key}`, dataUrl);
    } catch(e) {
        // quota exceeded
    }
    return dataUrl;
};

export const getModuleImage = (moduleId: string) => getCachedImage('module_images', moduleId);
export const saveModuleImage = (moduleId: string, dataUrl: string) => saveCachedImage('module_images', moduleId, dataUrl);
export const getChatImage = (query: string) => getCachedImage('chat_images', query);
export const saveChatImage = (query: string, dataUrl: string) => saveCachedImage('chat_images', query, dataUrl);
export const getLearnImage = (query: string) => getCachedImage('learn_images', query);
export const saveLearnImage = (query: string, dataUrl: string) => saveCachedImage('learn_images', query, dataUrl);

export const syncOfflineData = async () => {};
export const saveOfflineAction = (type: any, userId: any, data: any) => {};
export const markTutorialComplete = async (uid: string) => {
    await updateUserProfile(uid, { hasSeenTutorial: true });
};

export const getAllExperts = async (): Promise<User[]> => {
    return getLocal('users').filter((u: any) => ['consultant', 'trainee'].includes(u.role));
};

export const addExpertRating = async (consultantId: string, rating: Rating) => {
    const users = getLocal('users');
    const existingIndex = users.findIndex((u: any) => u.consultantId === consultantId);
    if (existingIndex > -1) {
        const expertData = users[existingIndex];
        const currentRatings = expertData.ratings || [];
        const newRatings = [...currentRatings, rating];
        const totalStars = newRatings.reduce((sum: number, r: Rating) => sum + r.rating, 0);
        const averageRating = totalStars / newRatings.length;
        users[existingIndex] = { ...expertData, ratings: newRatings, averageRating };
        setLocal('users', users);
    }
};

export const getDailyNotifications = async (state: string, language: string): Promise<NotificationItem[]> => { 
    return getSharedNotifications('state', state, language);
};

export const saveDailyNotifications = async (state: string, language: string, items: NotificationItem[]) => { 
    return saveSharedNotifications('state', state, language, items);
};
