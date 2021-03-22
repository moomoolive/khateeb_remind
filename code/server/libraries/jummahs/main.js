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

const sendNotificationToTargetPreference = async (targetPreference={}) => {
    try {
        if (targetPreference.notified)
            throw RangeError(`Preference already notified`)
        const khateeb = await $db.khateebs.find().safelyFindOne(targetPreference.khateebID ).exec()
        if (!khateeb)
            throw TypeError(`Khateeb does not exist`)
        const meta = await targetPreference.gatherMeta()
        const constructorRes = await new notificationConstructors.JummahReminderNotificationConstructor(khateeb, targetPreference, meta).create()
        targetPreference.notificationID = constructorRes[0]._id.toString()
        console.log('after update', targetPreference)
        return targetPreference
    } catch(err) {
        console.log(err)
    }
}

const runNotificationLoop = async (targetPreference={}, otherPreference={}) => {
    try {
        targetPreference = await sendNotificationToTargetPreference(targetPreference)
        targetPreference = await $db.jummahPreferences.findOneAndUpdate({ _id: targetPreference._id }, { notified: true, isGivingKhutbah: true }, { new: true }) 
    } catch(err) {
        console.log(err)
    }
    if (otherPreference._id && otherPreference._id.toLowerCase() !== 'none') {
        try {
            otherPreference = await $db.jummahPreferences.findOneAndUpdate({ _id: otherPreference._id }, { isGivingKhutbah: false }, { new: true })
        } catch(err) {
            console.log(err)
        }
    }
    return { targetPreference, otherPreference }
}

const chronNotificationLoop = async (targetPreference={}, institution={}, timing={}) => {
    const res = await runNotificationLoop(targetPreference)
    console.log(`send notification for institution ${institution.name} (id: ${institution._id}), timing: ${timing._id}`)
    return res
}

module.exports = {
    oneMonthInThePast,
    twoMonthsAhead,
    runNotificationLoop,
    chronNotificationLoop
}