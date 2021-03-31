const NotificationConstructor = require('./notificationConstructor.js')
const helpers = require('./helpers.js')

class khateebJummahSignupConstructor extends NotificationConstructor {
    constructor(khateeb={}, jummah={}, jummahMeta={}) {
        super({}, 'khateebs', { msgInfo: { khateeb, jummah, ...jummahMeta } })
    }

    msg() {
        return `${this.khateebName} has signed up for the ${this.timing} jummah at ${this.msgInfo.location.name} on ${this.jummahDate}. If you'd like to disable khateeb jummah signups, head to settings and turn off the 'Allow Jummah Signup' setting.`
    }

    get jummahDate() {
        return new Date(this.msgInfo.jummah.date).toLocaleString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
    }

    get timing() {
        const date = new Date()
        date.setHours(this.msgInfo.timing.hour, this.msgInfo.timing.minute, 0, 0)
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit'  })
    }

    get khateebName() {
        return helpers.khateebName(this.msgInfo.khateeb)
    }
}

module.exports = khateebJummahSignupConstructor