const pwaNotifications = require($rootDir + '/libraries/pwaNotifications/main.js')
const externalNotificationHelpers = require($rootDir + '/libraries/externalNotifications/main.js')

const { 
    notifications, 
    authorizations,
    pwaSubscriptions,
    users 
} = require($rootDir + "/database/public.js")

class NotificationConstructor {

    constructor(userInfo, tag='none', options={}, PWAMessages=false, email=false) {
        this.setRecipents(userInfo)
        this.msgInfo = options.msgInfo || userInfo,
        this.tag = tag
        this.meta = options.meta || {}
        this.additionalInfo = options
        this.sendPWAPush = PWAMessages
        this.sendEmail = email
    }

    setRecipents(recipents) {
        if (!Array.isArray(recipents))
            recipents = [recipents]
        this.userInfo = recipents
    }

    async create() {
        const msgsInfo = []
        for (let i = 0; i < this.userInfo.length; i++) {
            const user = this.userInfo[i]
            const savedNotification = await this.saveNotificationToDatabase(this.compileNotificationInfo(user))
            msgsInfo.push(savedNotification)
            if (this.sendPWAPush && user.settings.recievePWAPush && this.pwaMsgObject) {
                const pwaRes = await this.executePWANotifications(user._id.toString())
                msgsInfo.push(pwaRes)
            }
            if (this.sendEmail && user.settings.recieveExternalNotification && this.externalNotificationMsg) {
                const externalNotificationRes = await this.executeExternalNotification(user)
                msgsInfo.push(externalNotificationRes)
            }
        }
        return msgsInfo
    }

    async setRecipentsToAdmins(institutionID) {
        let recipents = []
        const admins = await this.getInstitutionAdmins(institutionID)
        recipents = admins
        this.setRecipents(recipents)
    }

    async getInstitutionAdmins(institutionID) {
        try {
            const auths = await authorizations.query({ filter: { institution: institutionID } })
            const rootAdminAuthorization = auths.find(a => a.role === 'rootInstitutionAdmin')
            const adminAuthorization = auths.find(a => a.role === 'institutionAdmin')
            const allAdmins = await users.query({
                filter: {
                    "authorizations.authId": { 
                        $in: [rootAdminAuthorization._id, adminAuthorization._id] 
                    } 
                }
            })
            return Array.isArray(allAdmins) ? allAdmins : []
        } catch(err) {
            console.error(err)
            return []
        }
    }

    compileNotificationInfo(user) {
        return {
            userID: user._id,
            tag: this.tag,
            msg: this.msg(user),
            meta: this.meta,
            ...this.additionalInfo
        }
    }

    async saveNotificationToDatabase(info) {
        try {
            const note = await notifications.createEntry({ entry: info })
            return note
        } catch(err) {
            console.error("Couldn't create notification", err)
        }
    }

    async executePWANotifications(userId="1234") {
        const subscriptions = await this.getPWASubscriptions(userId)
        const pwaRes = await this.sendPWANotifications(subscriptions)
        return pwaRes
    } 

    async sendPWANotifications(subscriptions=[]) {
        const messages = []
        for (let i = 0; i < subscriptions.length; i++) {
            try {
                const res = await pwaNotifications.sendPWANotifications(
                    this.pwaMsgObject(),
                    subscriptions[i].browserSubscriptionDetails
                )
                messages.push(res)
            } catch(err) {
                console.log(err)
            }
        }
        return messages
    }

    async getPWASubscriptions(userID="1234") {
        try {
            const data = await pwaSubscriptions.query({ filter: { userID } })
            if (!data) {
                return []
            } else {
                return data.subscriptions.filter(s => s.active)
            }
        } catch(err) {
            console.error(err)
            return []
        }
    }

    // for more pwa message options check the pwaNotifications library
    pwaMsgObject() {
        return {
            title: "default title",
            body: "default body"
        }
    }

    externalNotificationMsg() {
        return {
            subject: "default subject",
            body: "default body"
        }
    }

    async executeExternalNotification(user={}) {
        const res = await externalNotificationHelpers.sendExternalNotificationFromNotificationConstructor(
            user,
            this.externalNotificationMsg()
        )
        return res
    }

}

module.exports = NotificationConstructor