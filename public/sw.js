// EdgeUp AI Service Worker
const CACHE_NAME = 'edgeup-ai-v1';
const STATIC_CACHE_NAME = 'edgeup-static-v1';
const DYNAMIC_CACHE_NAME = 'edgeup-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/login',
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/Logo.png',
  // Add other critical assets
];

// API endpoints to cache
const CACHEABLE_APIS = [
  '/api/auth/me',
  '/api/courses',
  '/api/analytics/user-analytics',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME &&
                     (cacheName.startsWith('edgeup-') || cacheName.startsWith('workbox-'));
            })
            .map((cacheName) => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin && !url.origin.includes('localhost')) {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Handle different types of requests
    if (url.pathname.startsWith('/api/')) {
      return await handleApiRequest(request);
    } else if (url.pathname.includes('.')) {
      return await handleStaticAsset(request);
    } else {
      return await handlePageRequest(request);
    }
  } catch (error) {
    console.error('Fetch handler error:', error);
    return await handleOfflineFallback(request);
  }
}

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Try network first
    const response = await fetch(request);
    
    // Cache successful responses for specific endpoints
    if (response.ok && CACHEABLE_APIS.some(api => url.pathname.startsWith(api))) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for critical APIs
    if (url.pathname === '/api/auth/me') {
      return new Response(JSON.stringify({
        success: false,
        error: 'Offline mode - please check your connection'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Return placeholder for images
    if (request.destination === 'image') {
      return new Response(
        '<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" text-anchor="middle" fill="#9ca3af">Image Offline</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    
    throw error;
  }
}

// Handle page requests with stale-while-revalidate strategy
async function handlePageRequest(request) {
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return await handleOfflineFallback(request);
  }
}

// Handle offline fallback
async function handleOfflineFallback(request) {
  // For navigation requests, return cached home page or offline page
  if (request.mode === 'navigate') {
    const cachedHome = await caches.match('/');
    if (cachedHome) {
      return cachedHome;
    }
    
    // Return basic offline page
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EdgeUp AI - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #094d88, #10ac8b);
            color: white;
            text-align: center;
            padding: 2rem;
          }
          .logo {
            width: 120px;
            height: 120px;
            background: white;
            border-radius: 50%;
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            color: #094d88;
          }
          h1 { margin-bottom: 1rem; }
          p { margin-bottom: 2rem; opacity: 0.9; }
          button {
            background: white;
            color: #094d88;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
          }
          button:hover { transform: translateY(-2px); }
        </style>
      </head>
      <body>
        <div class="logo">🎓</div>
        <h1>You're Offline</h1>
        <p>EdgeUp AI needs an internet connection to provide the best learning experience.</p>
        <button onclick="location.reload()">Try Again</button>
        <script>
          // Auto-retry when connection is restored
          window.addEventListener('online', () => {
            location.reload();
          });
        </script>
      </body>
      </html>
    `, {
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // For other requests, return a generic error
  return new Response('Offline', { status: 503 });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log('Background sync triggered');
  
  // Get offline actions from IndexedDB and sync them
  // This would involve syncing study progress, test results, etc.
  try {
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      await syncAction(action);
    }
    
    await clearOfflineActions();
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New update from EdgeUp AI',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/icons/action-explore.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ],
    requireInteraction: true,
    silent: false
  };
  
  event.waitUntil(
    self.registration.showNotification('EdgeUp AI', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Placeholder functions for offline storage
async function getOfflineActions() {
  // Implement IndexedDB retrieval
  return [];
}

async function syncAction(action) {
  // Implement action sync logic
  console.log('Syncing action:', action);
}

async function clearOfflineActions() {
  // Implement IndexedDB cleanup
  console.log('Clearing offline actions');
}