const webpush = require('web-push')
const { subject, privateKey, publicKey } = require(global.$dir + "/vapidKeys.json")
webpush.setVapidDetails(subject, publicKey, privateKey)
const { nanoid } = require('nanoid')

const sendPushMessage = async (subscription={}, dataToSend={}) => {
    try {
        console.log('sub', subscription)
        const browserAPIRes = await webpush.sendNotification(
            subscription, 
            JSON.stringify({ 
                notification: {
                    vibrate: [500, 100, 500],
                    icon: 'khateebRemind.svg',
                    image: "khateebRemind.svg",
                    url: "https://app.khateebs.com/",
                    ...dataToSend,
                    tag: nanoid(21)
                }
            }))
        return browserAPIRes
    } catch(err) {
        console.log(`Couldn't send web push notifiction`, err)
        return {}
    }
}

const sendPWANotifications = (messageOptions={}, subscription={}) => {
    return sendPushMessage(subscription, {
        title: messageOptions.title || 'default title',
        body: messageOptions.body || 'default body'
    })
}

module.exports = {
    sendPushMessage,
    sendPWANotifications
}