module.exports = class NotificationConstructor {
    constructor(userInfo, type='none', tag='none', msgInfo=userInfo, meta={}) {
        this.setRecipents([userInfo])
        this.msgInfo = msgInfo,
        this.type = type,
        this.tag = tag
        this.meta = meta
        this.additonalNotificationInfo = {}
    }
    async create(text=false, pwa=false, options={}) {
        const msgsInfo = []
        for (let i = 0; i < this.userInfo.length; i++) {
            const user = this.userInfo[i]
            try {
                const info = await this.init(user)
                const returnObject = { info }
                if (!text && !pwa) {
                    msgsInfo.push(returnObject)
                    continue
                }
                if (info.actionLink)
                    info.actionLink = info.actionLink.replace('__ID__', info._id.toString())
                if (text && options.text.textAllowed) {
                    returnObject.text  = await this.text(options.text, info, user)
                }
                if (pwa) {
                    const pwa = await this.pwa()
                    returnObject.pwa =  `pwa push notification was successfully sent for notification ${info._id.toString()}`
                }
                msgsInfo.push(returnObject) 
            } catch(err) {
                console.log(err)
                console.log(`Couldn't create notification!`)
            }
        }
        return msgsInfo
    }
    async setRecipentsToAdmins(institutionID) {
        try {
            const rootAdmin = await $db.rootInstitutionAdmins.findOne({ institutionID }).exec()
            const otherAdmins = await $db.institutionAdmins.find({ institutionID }).exec()
            otherAdmins.push(rootAdmin)
            this.setRecipents(otherAdmins)
        } catch(err) {
            console.log(err)
            console.log(`Couldn't get institution admins`)
        }
    }
    compileMsg(user) {
        return {
            userID: user._id.toString(),
            institutionID: user.institutionID.toString(),
            tag: this.tag,
            msg: this.msg(user),
            meta: this.meta,
            ...this.additonalNotificationInfo
        }
    }
    async init(user) {
        try {
            const msg = this.compileMsg(user)
            const note = await new $db[this.type](msg).save()
            return note
        } catch(err) {
            console.log(err)
            console.log(`Couldn't create notification`)
        }
    }
    async text(textOptions, notificationInfo, userInfo) {
        try {
            const twilio = require('twilio')(textOptions.twilioUser, textOptions.twilioKey)
            const khateebRemindSignature = `\n\n🤖 Sent from Khateeb Remind Bot`
            let actionLink = ''
            if (notificationInfo.actionLink)
                actionLink = await this.compileTextURL(notificationInfo)
            const textMsg = `${notificationInfo.msg}${actionLink}${khateebRemindSignature}`
            const webhookRes = await twilio.messages.create({
                body: textMsg,
                from: textOptions.twilioPhoneNumber,
                to: `+1${userInfo.phoneNumber}`// canada and US only right now
            })
            return `text was successfully send for notification ${notificationInfo._id.toString()}`
        } catch(err) {
            console.log(err)
            const webHookRespondsWithError = err.status > 399
            if (webHookRespondsWithError)
                return `Error occurred when attempting to send text phone number: ${userInfo.phoneNumber}`
        }
    }
    async compileTextURL(notificationInfo) {
        try {
            const baseURL = 'app.khateebs.com'
            const actionURL = notificationInfo.actionLink
            const completeURL = baseURL + actionURL
            const shortURL = await new $db.shortenedURLs({ longURL: completeURL }).save()
            const textURL = 'khateebs.com/s/' + shortURL.shortURLCode
            return `\n${textURL}`
        } catch(err) {
            console.log(err)
        }
    }
    async pwa() {
        console.log('push notification')
    }
    setRecipents(recipents) {
        this.userInfo = recipents
    }
}