import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for offline capabilities and PWA installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use ./ relative path to avoid root-level fetch issues in some environments.
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        // Suppress specific environment errors regarding origin mismatch (common in previews)
        if (error.message && error.message.includes('origin')) {
           console.warn('ServiceWorker registration skipped due to origin mismatch in preview environment.');
        } else {
           console.error('ServiceWorker registration failed: ', error);
        }
      });
  });
}
