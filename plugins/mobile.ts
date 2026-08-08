import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Preferences } from '@capacitor/preferences';

// --- Camera Wrapper ---
export const takePicture = async () => {
  try {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt // Asks user for Camera or Photos
    });
    return `data:image/${image.format};base64,${image.base64String}`;
  } catch (error) {
    console.error('Camera error:', error);
    return null;
  }
};

// --- Geolocation Wrapper ---
export const getCurrentLocation = async () => {
  try {
    const permissionStatus = await Geolocation.checkPermissions();
    
    if (permissionStatus.location !== 'granted') {
      const request = await Geolocation.requestPermissions();
      if (request.location !== 'granted') {
        throw new Error('Location permission denied');
      }
    }

    const position = await Geolocation.getCurrentPosition();
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return null;
  }
};

// --- Storage Wrapper (Preferences) ---
// Note: This is asynchronous, unlike localStorage. 
// Use this for persisting data on native devices reliably.

export const storageSet = async (key: string, value: string) => {
  await Preferences.set({
    key: key,
    value: value,
  });
};

export const storageGet = async (key: string) => {
  const { value } = await Preferences.get({ key: key });
  return value;
};

export const storageRemove = async (key: string) => {
  await Preferences.remove({ key: key });
};

export const storageClear = async () => {
  await Preferences.clear();
};