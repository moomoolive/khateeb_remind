const NotificationConstructor = require('./notificationConstructor.js')
const helpers = require('./helpers.js')

module.exports = class KhateebSignupNotificationConstructor extends NotificationConstructor {
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
        return helpers.khateebName(this.msgInfo)
    }
}