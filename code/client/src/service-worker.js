workbox.core.setCacheNameDetails({ prefix: "khateebRemind" });

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener("message", function (msg) {
  if (msg.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})

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