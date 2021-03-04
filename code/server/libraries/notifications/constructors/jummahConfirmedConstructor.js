const NotificationConstructor = require('./notificationConstructor.js')

module.exports = class JummahConfirmedNotificationConstructor extends NotificationConstructor {
    constructor(khateeb, jummah) {
        super({}, 'generalNotifications', 'khateebs', { khateeb, jummah })
    }
    msg() {
        return `${this.khateebName} has confirmed his jummah this week for ${jummahInfo()}`
    }
    get khateebName() {
        return khateebName(this.msgInfo.khateeb)
    }
    async jummahInfo() {
        try {
            const info = await this.msgInfo.jummah.gatherMeta()
            return `${info.location.name} @${info.timing.hour}:${info.timing.minute} (military time).`
        } catch(err) {
           console.log(`Couldn't get jummah info`)
        }
    }
}