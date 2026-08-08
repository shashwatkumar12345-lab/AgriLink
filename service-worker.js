const CACHE_NAME = 'agrilink-global-cache-v3';
const OFFLINE_URL = '/index.html';

const isDev = self.location.hostname === 'localhost' || 
              self.location.hostname === '127.0.0.1' || 
              self.location.hostname.includes('ais-dev') || 
              self.location.hostname.includes('ais-pre') || 
              self.location.hostname.includes('run.app');

// Install: Cache the offline page immediately
self.addEventListener('install', (event) => {
  if (isDev) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add(OFFLINE_URL);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME || isDev) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first for API, Stale-while-revalidate for assets, Cache-first for navigation
self.addEventListener('fetch', (event) => {
  if (isDev) {
    // Bypass cache completely in dev mode
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle Navigation (HTML) - Return cached index.html if offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // Handle Assets (JS, CSS, Images, Fonts)
  if (event.request.destination === 'script' || 
      event.request.destination === 'style' || 
      event.request.destination === 'image' ||
      event.request.destination === 'font') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache with new version
          if (networkResponse && networkResponse.status === 200) {
             const responseToCache = networkResponse.clone();
             caches.open(CACHE_NAME).then((cache) => {
               cache.put(event.request, responseToCache);
             });
          }
          return networkResponse;
        });
        // Return cached response immediately if available, else wait for network
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default: Network falling back to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});