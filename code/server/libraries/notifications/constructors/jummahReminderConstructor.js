const NotificationConstructor = require('./notificationConstructor.js')

module.exports = class JummahReminderNotificationConstructor extends NotificationConstructor {
    
    constructor(khateeb ,jummah, jummahMeta) {
        super(
            khateeb,
            'jummah', 
            { 
                msgInfo: jummahMeta, 
                urgent: true, 
                meta: { jummahRef: jummah._id.toString() } 
            }, 
            true,
            true
        )
    }
    
    msg() {
        return `Just a reminder that you're scheduled to give the ${this.timing} khutbah at ${this.msgInfo.location.name} (${this.msgInfo.location.address}) this week.`
    }

    get timing() {
        const date = new Date()
        date.setHours(this.msgInfo.timing.hour, this.msgInfo.timing.minute, 0, 0)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    pwaMsgObject() {
        return {
            title: `${$utils.capitalize(this.msgInfo.location.name)} khutbah @ ${this.timing}`,
            body: this.msg()
        }
    }

    externalNotificationMsg() {
        return {
            subject: "Your Giving a Khutbah this Week",
            body: this.msg()
        }
    }
}