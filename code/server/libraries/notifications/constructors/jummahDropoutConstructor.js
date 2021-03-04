const NotificationConstructor = require('./notificationConstructor.js')
const helpers = require('./helpers.js')

module.exports = class JummahDropoutNotificationConstructor extends NotificationConstructor {
    constructor(khateeb) {
        super({}, 'generalNotifications', 'khateebs', khateeb, { dropout: true })
    }
    msg() {
        return `${this.khateebName} has canceled his assigned jummah this week! Khateeb Remind will be messaging other backups by Thursday morning insha'Allah if applicable.`
    }
    get khateebName() {
        return helpers.khateebName(this.msgInfo)
    }
}