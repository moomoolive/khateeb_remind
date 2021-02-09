class Notification {
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
            const rootAdmin = await $db.models.rootInstitutionAdmins.findOne({ institutionID }).exec()
            const otherAdmins = await $db.models.institutionAdmins.find({ institutionID }).exec()
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
            const note = await new $db.models[this.type](msg).save()
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
            const shortURL = await new $db.models.shortenedURLs({ longURL: completeURL }).save()
            const textURL = 's.khateebs.com/' + shortURL.shortURLCode
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

class welcome extends Notification {
    constructor(userInfo) {
        super(userInfo, 'generalNotifications', 'welcome')
    }
    msg() {
        return `Asalam aliakoum ${this.msgInfo.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. Feel free to take a look around, and ask your administrator if you need any help!`
    }
}

const khateebName = (msgInfo) => {
    let base = `${msgInfo.firstName} ${msgInfo.lastName}`
    if (msgInfo.title.toLowerCase() !== 'none')
        base = `${msgInfo.title} ` + base
    return base
}

class khateebSignup extends Notification {
    constructor(khateeb, autoConfirm) {
        super({}, 'generalNotifications', 'khateebs', khateeb)
        this.autoConfirm = autoConfirm
    }
    msg() {
        if (this.autoConfirm)
            return `${this.khateebName} is now a khateeb at your institution, if you want khateebs to manual confirm in the future - head to settings and turn off auto-confirm!`
        else
            return `${this.khateebName} wants to be a khateeb at your institution. Confirm him by heading to your Admin Central, pressing khateebs, and then pressing 'confirm registration'.`
    }
    get khateebName() {
        return khateebName(this.msgInfo)
    }
}

class jummahDropout extends Notification {
    constructor(khateeb) {
        super({}, 'generalNotifications', 'khateebs', khateeb, { dropout: true })
    }
    msg() {
        return `${this.khateebName} has canceled his assigned jummah this week! Khateeb Remind will be messaging other backups by Thursday morning insha'Allah if applicable.`
    }
    get khateebName() {
        return khateebName(this.msgInfo)
    }
}

class jummahReminder extends Notification {
    constructor(khateeb ,jummah, jummahMeta, preference) {
        super(khateeb, 'actionNotifications', 'jummah', { jummah, ...jummahMeta })
        this.preference = preference
        this.additonalNotificationInfo = {
            actionLink: `/jummah/confirm/jummah=${jummah._id.toString()}/note=__ID__`,
            buttonText: 'Confirm'
        }
    }
    msg() {
        const base = `to give the ${this.timing} khutbah at ${this.msgInfo.location.name} (${this.msgInfo.location.address}) this week${this.preference > 1 ? '?' : '.'} Click here to confirm your attendance, JAK!`
        const prefix = this.preference > 1 ? 'Are you able ' : 'You are scheduled '
        return prefix + base
    }
    get timing() {
        let militaryhour = this.msgInfo.timing.hour
        const hour = militaryhour > 12 ? militaryhour - 12 : militaryhour
        let min = this.msgInfo.timing.minute
        min = min < 10 ? `0${min}` : min
        const amOrPm = militaryhour > 11 ? 'PM' : 'AM'
        return `${hour}:${min} ${amOrPm}`
    }
}

/*
const createJummahMessage = async (jummah, preference=1) => {
    try {
        const targetPreference = jummah.khateebPreference[preference - 1]
        const khateeb = await $db.models.khateebs.findOne({ _id: targetPreference.khateebID })
        const jummahTiming = await $db.models.timings.findOne({ _id: jummah.timingID }).exec()
        const jummahLocation = await $db.models.locations.findOne({ _id: jummah.locationID }).exec()
        const hour = jummahTiming.hour > 12 ? jummahTiming.hour - 12 : jummahTiming.hour
        const min = jummahTiming.minute
        const amOrPm = jummahTiming.hour > 11 ? 'PM' : 'AM'
        const msgTiming = `${hour}:${min} ${amOrPm}`
        const msgPreference1 = `You're scheduled to give the ${msgTiming} khutbah at ${jummahLocation.name} (${jummahLocation.address}) this week. Click here to confirm your attendance, JAK!`
        const msgPreferenceOver1 = `Are you able to give the ${msgTiming} khutbah at ${jummahLocation.name} (${jummahLocation.address}) this week? Click here to confirm your attendance, JAK!`
        const msg = {
            userID: khateeb._id.toString(),
            institutionID: jummah.institutionID,
            tag: 'jummah',
            msg: preference > 1 ? msgPreferenceOver1 : msgPreference1 ,
            actionPerformed: false,
            actionLink: `/jummah/confirm/jummah=${jummah._id.toString()}/note=__ID__`,
            buttonText: 'Confirm',
            meta: {
                jummahID: jummah._id.toString()
            }
        }
        const saved = await $db.models.actionNotifications(msg).save()
        console.log(saved)
        targetPreference.notified = true
        const savedJummah = await $db.models.jummahs.updateOne({ _id: jummah._id.toString() }, { khateebPreference: jummah.khateebPreference })
    } catch(err) {
        console.log(err)
        return err
    }
}*/

module.exports = {
    welcome,
    khateebSignup,
    jummahDropout,
    jummahReminder
}