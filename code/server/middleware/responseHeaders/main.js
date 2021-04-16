const cacheableCustomHeaderKeyName = Object.keys(global.APP_CONFIG.customHeaders.serviceWorkerCache)[0]

// can't seem to get service worker to cache by headers

const routeIsCacheableByServiceWorker = (req, res, next) => {
    res.set("Access-Control-Expose-Headers", cacheableCustomHeaderKeyName)
    res.set(global.APP_CONFIG.customHeaders.serviceWorkerCache)
    return next()
}

module.exports = {
    routeIsCacheableByServiceWorker
}