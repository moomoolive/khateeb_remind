const pwaNotifications = require(global.$dir + '/libraries/pwaNotifications/main.js')

module.exports = class NotificationConstructor {

    constructor(userInfo, tag='none', options={}, PWAMessages=false) {
        this.setRecipents(userInfo)
        this.msgInfo = options.msgInfo || userInfo,
        this.tag = tag
        this.meta = options.meta || {}
        this.additionalInfo = options
        this.PWAMessages = PWAMessages
    }

    setRecipents(recipents) {
        if (!Array.isArray(recipents))
            recipents = [recipents]
        this.userInfo = recipents
    }

    async create() {
        const msgsInfo = []
        for (let i = 0; i < this.userInfo.length; i++) {
            const savedNotification = await this.saveNotificationToDatabase(this.compileNotificationInfo(this.userInfo[i]))
            msgsInfo.push(savedNotification)
            if (this.PWAMessages && this.pwaMsgObject()) {
                const pwaRes = await this.executePWANotifications(this.userInfo[i]._id.toString())
                msgsInfo.push(pwaRes)
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
        if (!info)
            return []
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
            return data.subscriptions.filter(s => s.active)
        } catch(err) {
            console.log(err)
            return []
        }
    }

}