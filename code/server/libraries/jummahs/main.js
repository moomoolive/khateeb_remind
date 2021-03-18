const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')

const localToUTCEquivalent = (localTimeNow=new Date()) => {
    const localTime = new Date(localTimeNow)
    const date = new Date()
    date.setUTCFullYear(localTime.getFullYear())
    date.setUTCMonth(localTime.getMonth())
    date.setUTCDate(1)
    return date
}

const oneMonthInThePast = (localTimeNow=new Date()) => {
    const date = localToUTCEquivalent(localTimeNow)
    date.setUTCDate(date.getUTCDate() - 1)
    date.setUTCHours(23, 59, 59, 999)
    return date
}

const twoMonthsAhead = (localTimeNow) => {
    const date = localToUTCEquivalent(localTimeNow)
    date.setUTCMonth(date.getUTCMonth() + 2)
    date.setUTCHours(0, 0, 0, 0)
    return date
}

const runNotificationLoop = async (jummah, backup=false) => {
    const meta = await jummah.gatherMeta()
    const preference = jummah.khateebPreference[backup ? 1 : 0]
    const khateeb = await $db.khateebs.findOne({ _id: preference.khateebID.toString() }).exec()
    const note = new notificationConstructors.JummahReminderNotificationConstructor(khateeb, jummah, meta)
    const msgs = await note.create()
    preference.notified = true
    console.log(msgs)
    return $db.jummahs.findOneAndUpdate({ _id: jummah._id }, jummah, { new: true })
}


module.exports = {
    oneMonthInThePast,
    twoMonthsAhead,
    runNotificationLoop
}