import helpers from './helpers.js'

import Config from '@/App.config.js'

const subscribeUserToPushNotifications = async (serviceWorkerReg={}) => {
    try {
        const pushSubscription = await serviceWorkerReg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: helpers.urlB64ToUint8Array(Config.securityConfig.vapidPublicKey)
        })
        return pushSubscription
    } catch(err) {
        console.log(err)
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
        console.log(`Couldn't get service worker registration. `, err)
        return null
    }
}

export default {
    subscribeUserToPushNotifications,
    getServiceWorkerRegistration
}