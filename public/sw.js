/**
 * Service Worker for Physics Legends
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'physics-legends-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/js/main.js',
];

/**
 * Install event - cache assets
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets for offline support');
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn('Some assets failed to cache:', err);
            });
        })
    );
    self.skipWaiting();
});

/**
 * Activate event - clean up old caches
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

/**
 * Fetch event - serve from cache, fallback to network
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(request).then((response) => {
            if (response) {
                // Return cached response
                return response;
            }

            return fetch(request)
                .then((response) => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type === 'error') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache successful responses
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return response;
                })
                .catch((err) => {
                    console.error('Fetch failed:', err);

                    // Return offline page or cached response
                    return caches.match('/index.html');
                });
        })
    );
});

/**
 * Handle push notifications
 */
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Physics Legends',
        icon: '/physics-legends-main/icons/icon-192.png',
        badge: '/physics-legends-main/icons/icon-192.png',
        tag: 'physics-legends',
        requireInteraction: false,
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Physics Legends', options)
    );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Check if game window is already open
            for (let client of clientList) {
                if (client.url === '/' && 'focus' in client) {
                    return client.focus();
                }
            }
            // Open new window if not found
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

/**
 * Periodic background sync (if supported)
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-saves') {
        event.waitUntil(syncSaves());
    }
});

async function syncSaves() {
    try {
        // Implement any background sync logic here
        console.log('Syncing saves in background');
    } catch (err) {
        console.error('Sync failed:', err);
    }
}
