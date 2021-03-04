const NotificationConstructor = require('./notificationConstructor.js')

module.exports = class WelcomeNotificationConstructor extends NotificationConstructor {
    constructor(userInfo) {
        super(userInfo, 'generalNotifications', 'welcome')
    }
    msg() {
        return `Asalam aliakoum ${this.msgInfo.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. Feel free to take a look around, and ask your administrator if you need any help!`
    }
}


