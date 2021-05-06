const NotificationConstructor = require('./notificationConstructor.js')

class DateAvailabilityChangeConstructor extends NotificationConstructor {
    constructor(institutionID="1234", options={}) {
        super(
            [], 
            'khateebs', 
            { 
                meta: { ...options.change, khateebID: options.khateebID, urgent: true }, 
                msgInfo: options.msg,
                institutionID
            }
        )
    }

    msg() {
        return this.msgInfo
    }
}

module.exports = DateAvailabilityChangeConstructor