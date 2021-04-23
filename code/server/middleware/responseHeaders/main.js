const cacheableCustomHeaderKeyName = Object.keys(global.CONFIG.customHeaders.serviceWorkerCache)[0]

// can't seem to get service worker to cache by headers

const routeIsCacheableByServiceWorker = (req, res, next) => {
    res.set("Access-Control-Expose-Headers", cacheableCustomHeaderKeyName)
    res.set(global.CONFIG.customHeaders.serviceWorkerCache)
    return next()
}

module.exports = {
    routeIsCacheableByServiceWorker
}