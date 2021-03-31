const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')
const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const objectSupport = require('dayjs/plugin/objectSupport')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)

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
        targetPreference.notified = true
        console.log('after update', targetPreference)
        return targetPreference
    } catch(err) {
        console.log(err)
    }
}

const createJummahPreferenceAndReturn = async (preference={}) => {
    try {
        if (preference._id)
            delete preference._id
        const createdPreference = await new $db.jummahPreferences(preference).save()
        return createdPreference
    } catch(err) {
        console.log(err)
        throw new Error(err)
    }
}

const runNotificationLoop = async (targetPreference={}, otherPreference={}) => {
    try {
        let targetUpsert = false
        if (targetPreference.upsert) {
            targetPreference = await createJummahPreferenceAndReturn(targetPreference)
            targetUpsert = true
        }
        targetPreference = await sendNotificationToTargetPreference(targetPreference)
        targetPreference = await $db.jummahPreferences.findOneAndUpdate({ _id: targetPreference._id }, { notified: true, isGivingKhutbah: true }, { new: true })
        if (targetUpsert) {
            targetPreference = global.utils.deepCopy(targetPreference)
            targetPreference.upsert = true 
        }
    } catch(err) {
        console.log(err)
    }
    if (otherPreference._id && (otherPreference._id.toLowerCase() !== 'none' || otherPreference.upsert)) {
        try {
            let OtherUpserted = false
            if (otherPreference.upsert) {
                otherPreference = await createJummahPreferenceAndReturn(otherPreference)
                OtherUpserted = true
            }
            otherPreference = await $db.jummahPreferences.findOneAndUpdate({ _id: otherPreference._id }, { isGivingKhutbah: false }, { new: true })
            if (OtherUpserted) {
                otherPreference = global.utils.deepCopy(otherPreference)
                otherPreference.upsert = true
            }
        } catch(err) {
            console.log(err)
        }
    }
    return { targetPreference, otherPreference }
}

const chronNotificationLoop = async (targetPreference={}, institution={}, timing={}) => {
    const res = await runNotificationLoop(targetPreference)
    console.log(`sent notification for institution ${institution.name} (id: ${institution._id}), timing: ${timing._id}`)
    return res
}

const cronNotificationTiming = (upcomingFriday=new Date(), chronTimingInfo={}, timezone="America/Edmonton") => {
    const targetDayOfWeek = scheduleHelpers.findDayOfWeek(
        upcomingFriday,
        chronTimingInfo.dayOfWeek,
        false
    )
    const targetDate = dayjs()
        .tz(timezone)
        .year(targetDayOfWeek.getFullYear())
        .month(targetDayOfWeek.getMonth())
        .date(targetDayOfWeek.getDate())
        .hour(chronTimingInfo.hour)
        .minute(chronTimingInfo.minute)
        .second(0)
        .millisecond(0)
    return new Date(targetDate.toISOString())
}

module.exports = {
    oneMonthInThePast,
    twoMonthsAhead,
    runNotificationLoop,
    chronNotificationLoop,
    cronNotificationTiming
}