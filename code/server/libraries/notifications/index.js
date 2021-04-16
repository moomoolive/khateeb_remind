const WelcomeNotificationConstructor = require('./constructors/welcomeConstructor.js')
const KhateebSignupNotificationConstructor = require('./constructors/khateebSignupConstructor.js')
const JummahReminderNotificationConstructor = require('./constructors/jummahReminderConstructor.js')
const khateebJummahSignupConstructor = require('./constructors/khateebJummahSignupConstructor.js')
const DateAvailabilityChangeConstructor = require('./constructors/dateAvailabilityChangeContstructor.js')
const TimingAvailabilityChangeConstructor = require('./constructors/timingAvailabilityChangeConstructor.js')

module.exports = {
    WelcomeNotificationConstructor,
    KhateebSignupNotificationConstructor,
    JummahReminderNotificationConstructor,
    khateebJummahSignupConstructor,
    DateAvailabilityChangeConstructor,
    TimingAvailabilityChangeConstructor
}