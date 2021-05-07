const NotificationConstructor = require('./notificationConstructor.js')
const helpers = require('./helpers.js')

class KhateebSignupNotificationConstructor extends NotificationConstructor {
    
    constructor(khateeb={}, autoConfirm=false, institutionID="1234") {
        super({}, 'khateebs', { msgInfo: khateeb, urgent: true, institutionID })
        this.autoConfirm = autoConfirm
    }
    
    msg() {
        if (this.autoConfirm)
            return `${this.khateebName} is now a khateeb at your institution. If you want khateebs to be manually confirmed in the future, head to settings and turn off 'Auto Confirm Registration'!`
        else
            return `${this.khateebName} wants to be a khateeb at your institution. Confirm him by heading to Admin Central, then navigate to khateebs, and press 'confirm registration'.`
    }
    
    get khateebName() {
        return helpers.khateebName(this.msgInfo)
    }
}

module.exports = KhateebSignupNotificationConstructor