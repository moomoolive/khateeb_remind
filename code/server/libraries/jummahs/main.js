const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')
const scheduleHelpers = require($rootDir + '/libraries/schedules/main.js')

const { jummahPreferences, users } = require($rootDir + "/database/public.js")

const cronNotificationTiming = (upcomingFriday=new Date(), chronTimingInfo={}, timezone="America/Edmonton") => {
    const targetDayOfWeek = scheduleHelpers.findDayOfWeek(
        upcomingFriday,
        chronTimingInfo.dayOfWeek,
        false
    )    
    return scheduleHelpers.getSpecificDateInTimezone({
        timezone,
        year: targetDayOfWeek.getFullYear(),
        month: targetDayOfWeek.getMonth(),
        date: targetDayOfWeek.getDate(),
        hour: chronTimingInfo.hour,
        minute: chronTimingInfo.minute,
        second: 0,
        millisecond: 0
    })
}

const jummahPreferenceNotifier = (initPreferenceInfo={}, isTargetPreference=true) => {
    let preferenceInfo = initPreferenceInfo
    const targetPreference = isTargetPreference
    const upsertType = !!initPreferenceInfo.upsert

    const createAndOverwritePreference = async () => {
        const toBeSavedPreference = $utils.deepCopy(preferenceInfo)
        if (toBeSavedPreference._id) {
            delete toBeSavedPreference._id
        }
        try {
            const databaseLoggedPreference = await jummahPreferences.createEntry({ entry: toBeSavedPreference })
            if (typeof databaseLoggedPreference !== 'object')
                throw TypeError(`Database responded with invalid type`)
            return databaseLoggedPreference
        } catch(err) {
            console.error(err)
            return preferenceInfo
        }
    }
    const gatherJummahInfo = async () => {
        try {
            // this assumes that all preferences that reach this point are
            // mongoose documents and have access to the methods defined there
            const jummahInfo = await preferenceInfo.gatherMeta()
            if (!jummahInfo || !jummahInfo.location || !jummahInfo.timing)
                throw TypeError(`Database responded with incorrect type of jummah information`)
            else
                return jummahInfo
        } catch(err) {
            console.error(err)
            return null
        }
    }
    const findJummahKhateebInfo = async () => {
        try {
            const khateeb = await users.query({ filter: { _id: preferenceInfo.khateebID } })
            if (!khateeb) {
                throw TypeError(`Database responded with incorrect type of khateeb info`)
            } else {
                return khateeb
            }
        } catch(err) {
            console.log(err)
            return null
        }
    }
    const updateJummahStatus = async (updates={}) => {
        try {
            const updated = await jummahPreferences.updateEntry({
                filter: { _id: preferenceInfo._id.toString() },
                updates: { 
                    isGivingKhutbah: targetPreference,
                    $inc: { loopRunCount: 1 },
                    ...updates 
                },
                returnOptions: { new: true }
            })
            if (!updated) {
                throw TypeError(`Database didn't correctly update jummah`)
            } else {
                return updated
            }
        } catch(err) {
            console.error(err)
            return null
        }
    }
    const createJummahNotification = async (khateeb={}, jummahInfo={ location: {}, timing: {} } ) => {
        try {
            const constructorRes = await new notificationConstructors.JummahReminderNotificationConstructor(khateeb, preferenceInfo, jummahInfo ).create()
            // notifications can create the same type of notification
            // for multiple users so this is why we do this convoluted
            // step of check - as it could be invalid at any of these steps  
            if (constructorRes && constructorRes[0] && constructorRes[0]._id)
                return constructorRes[0]._id.toString()
            else
                return $config.consts.nullId
        } catch(err) {
            console.log(err)
            return $config.consts.nullId
        }
    }

    const canBeMessaged = () => !!preferenceInfo && preferenceInfo._id !== $config.consts.nullId && !preferenceInfo.notified
    const isUpsertable = () => preferenceInfo.upsert === true
    const setPreferenceInfo = (value={}) => preferenceInfo = value
    const returnPreferenceInfo = () => {
        const returnVal = $utils.deepCopy(preferenceInfo)
        // upsert type is here because it will push it onto the preferences
        // array on the frontend instead of replacing if it was 'upserted'
        if (upsertType)
            returnVal.upsert = true
        return returnVal
    }
    const upsertAndOverwritePreference = async () => {
        const updatedPreference = await createAndOverwritePreference()
        setPreferenceInfo(updatedPreference)
    }
    const updateJummahStatusAndSet = async (updates={}) => {
        const updatedPreference = await updateJummahStatus(updates)
        if (!updatedPreference)
            return
        else 
            return setPreferenceInfo(updatedPreference)
    }
    
    return {
        async sendNotification() {
            if (isUpsertable())
                await upsertAndOverwritePreference()

            if (!canBeMessaged())
                return returnPreferenceInfo()
            
            const jummahInfo = await gatherJummahInfo()
            if (!jummahInfo)
                return returnPreferenceInfo()
            
            const khateeb = await findJummahKhateebInfo()
            if (!khateeb)
                return returnPreferenceInfo()
            
            let updates = {}
            if (targetPreference) {
                const notificationID = await createJummahNotification(khateeb, jummahInfo)
                updates = { notified: true, notificationID }
            }

            await updateJummahStatusAndSet(updates)
            return returnPreferenceInfo()
        }
    }
}


module.exports = {
    cronNotificationTiming,
    jummahPreferenceNotifier
}