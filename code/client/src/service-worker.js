workbox.core.setCacheNameDetails({ prefix: "khateebRemind" })
self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// cache all images
const thirtyDaysInSeconds = 30 * 24 * 60 * 60
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 60,
        maxAgeSeconds: thirtyDaysInSeconds,
      }),
    ],
  })
)

// cache font imported from Google Fonts
workbox.routing.registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'google-fonts-stylesheet',
  })
)

const oneYearInSeconds = 30 * 24 * 60 * 60
workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://fonts.gstatic.com',
  new workbox.strategies.CacheFirst({
    cacheName: 'google-fonts-webfont',
    plugins: [
      new workbox.expiration.Plugin({
        maxEntries: 30,
        maxAgeSeconds: oneYearInSeconds,
      }),
    ],
  })
)

// cache all javascript and css files
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script' ||
                  request.destination === 'style',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
)

// Allow new service worker to take control on 'skipWaiting' event
// emitted in "registerServiceWorker.js"
self.addEventListener("message", function (msg) {
  if (msg.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})

// Push notification events
var clickOpenUrl = ''
self.addEventListener('push', function(e) {
  var pushMessage = e.data.json()
  clickOpenUrl = pushMessage.notification.url
  e.waitUntil(self.registration.showNotification(pushMessage.notification.title, {
      body: pushMessage.notification.body,
      icon: pushMessage.notification.icon,
      vibrate: pushMessage.notification.vibrate,
      image: pushMessage.notification.image,
      tag: pushMessage.notification.tag
    })
  ) 
})

self.addEventListener('notificationclick', function(e) {
  var clickedNotificaiton = e.notification
  clickedNotificaiton.close()
  if (clickOpenUrl) {
    var promiseChain = clients.openWindow(clickOpenUrl)
    e.waitUntil(promiseChain)
    clickOpenUrl = ''
  }
})