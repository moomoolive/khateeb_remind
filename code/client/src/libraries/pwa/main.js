import helpers from './helpers.js'

import Config from '$config'

const subscribeUserToPushNotifications = async (serviceWorkerReg={}) => {
    try {
        const pushSubscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: helpers.urlB64ToUint8Array(Config.securityConfig.vapidPublicKey)
        })
        return pushSubscription
    } catch {
        return null
    }
}

const getServiceWorkerRegistration = async () => {
    try {
        if ('serviceWorker' in window.navigator) {
            const registration = await window.navigator.serviceWorker.getRegistration()
            return registration
        }
        return null     
    } catch(err) {
        // eslint-disable-next-line
        console.log(`Couldn't get service worker registration. `, err)
        return null
    }
}

export default {
    subscribeUserToPushNotifications,
    getServiceWorkerRegistration
}