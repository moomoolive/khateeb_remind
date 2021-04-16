const NotificationConstructor = require('./notificationConstructor.js')

class DateAvailabilityChangeConstructor extends NotificationConstructor {
    constructor(options={}) {
        super([], 'khateebs', { 
            meta: { ...options.change, khateebID: options.khateebID, urgent: true }, 
            msgInfo: options.msg 
        })
    }

    msg() {
        return this.msgInfo
    }
}

module.exports = DateAvailabilityChangeConstructor