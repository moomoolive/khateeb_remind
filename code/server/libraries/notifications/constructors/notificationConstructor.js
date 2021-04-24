const pwaNotifications = require($rootDir + '/libraries/pwaNotifications/main.js')
const externalNotificationHelpers = require($rootDir + '/libraries/externalNotifications/main.js')

module.exports = class NotificationConstructor {

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
            const rootAdmin = await $db.rootInstitutionAdmins.findOne({ institutionID }).exec()
            const otherAdmins = await $db.institutionAdmins.find({ institutionID }).exec()
            return [rootAdmin, ...otherAdmins]
        } catch(err) {
            console.log(err)
            return []
        }
    }

    compileNotificationInfo(user) {
        return {
            userID: user._id.toString(),
            institutionID: user.institutionID.toString(),
            tag: this.tag,
            msg: this.msg(user),
            meta: this.meta,
            ...this.additionalInfo
        }
    }

    async saveNotificationToDatabase(info) {
        try {
            const note = await new $db.notifications(info).save()
            return note
        } catch(err) {
            console.log(err)
            console.log(`Couldn't create notification`)
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
            const data = await $db.pwaSubscriptions.findOne({ userID }).exec()
            if (!data)
                return []
            else
                return data.subscriptions.filter(s => s.active)
        } catch(err) {
            console.log(err)
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