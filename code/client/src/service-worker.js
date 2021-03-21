workbox.core.setCacheNameDetails({ prefix: "khateebRemind" });

self.__precacheManifest = [].concat(self.__precacheManifest || [])
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener("message", msg => {
  console.log(msg)
  if (msg.data.action === 'skipWaiting') {
    self.skipWaiting()
  }
})