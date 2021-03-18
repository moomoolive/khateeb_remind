module.exports = class NotificationConstructor {

    constructor(userInfo, tag='none', options={}) {
        this.setRecipents(userInfo)
        this.msgInfo = options.msgInfo || userInfo,
        this.tag = tag
        this.meta = options.meta || {}
        this.additionalInfo = options
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

}