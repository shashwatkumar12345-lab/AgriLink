
import { useState, useEffect } from 'react';

// Extend Window interface to include deferredPrompt
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Check if running in standalone mode (already installed)
    const mq = window.matchMedia('(display-mode: standalone)');
    setIsStandalone(mq.matches);
    const changeHandler = (evt: any) => setIsStandalone(evt.matches);
    mq.addEventListener('change', changeHandler);

    // 2. Check if device is iOS (iPhone/iPad/iPod)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // 3. Check for existing global event (captured in index.html)
    if (window.deferredPrompt) {
      setDeferredPrompt(window.deferredPrompt);
    }

    // 4. Listen for the native install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // Prevent mini-infobar
      window.deferredPrompt = e;
      setDeferredPrompt(e);
      console.log('usePWAInstall: beforeinstallprompt event captured');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 5. Polling check (Fallback for late-firing events)
    const checkInterval = setInterval(() => {
        if (window.deferredPrompt && !deferredPrompt) {
            setDeferredPrompt(window.deferredPrompt);
            console.log('usePWAInstall: Found prompt via polling');
        }
    }, 1000);

    // Stop polling after 5 seconds to save resources
    const timeout = setTimeout(() => {
        clearInterval(checkInterval);
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      mq.removeEventListener('change', changeHandler);
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  const install = async () => {
    // Prioritize the state, then fallback to global window object
    const promptEvent = deferredPrompt || window.deferredPrompt;

    if (promptEvent) {
      promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        window.deferredPrompt = null;
        setDeferredPrompt(null);
      }
    } else {
        // Fallback for when the prompt isn't ready or supported (e.g., iOS, some desktop browsers)
        if (isIOS) {
            alert("To install AgriLink on your iPhone/iPad:\n1. Tap the 'Share' button (square with arrow).\n2. Scroll down and select 'Add to Home Screen'.");
        } else {
            alert("To install AgriLink:\n\nAndroid: Tap the browser menu (⋮) -> 'Install App' or 'Add to Home Screen'.\n\nDesktop: Click the install icon in the address bar or browser menu.\n\nNote: If you don't see the option, the app might already be installed or your browser doesn't support automatic installation.");
        }
    }
  };

  // Show the button if the app is NOT already installed.
  // We prioritize showing it even if the native prompt isn't ready (fallback instructions will show).
  const isInstallable = !isStandalone;

  return { 
      isInstallable, 
      install, 
      platform: isIOS ? 'ios' : 'native' 
  };
};
