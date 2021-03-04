const NotificationConstructor = require('./notificationConstructor.js')

module.exports = class JummahReminderNotificationConstructor extends NotificationConstructor {
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