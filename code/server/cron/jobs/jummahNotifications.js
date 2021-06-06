const { cronWrapper } = require($rootDir + '/libraries/cron/main.js')
const scheduleHelpers = require($rootDir + '/libraries/schedules/main.js')
const jummahHelpers = require($rootDir + '/libraries/jummahs/main.js')

const { 
    timings: timingsInterfaces, 
    authorizations,
    jummahPreferences,
    users
} = require($rootDir + "/database/public.js")

const findDefaultPreferenceForThisWeek = (defaultKhateebID="12345", khateebs=[], upcomingFriday=new Date(), targetTiming={}, isBackup=true) => {
    const noneScheduled = { _id: $config.consts.nullId }
    if (!defaultKhateebID || defaultKhateebID === $config.consts.nullId)
        return noneScheduled
    const targetKhateeb = khateebs.find(k => k._id.toString() === defaultKhateebID)
    if (!targetKhateeb)
        return noneScheduled
    const isDefaultKhateebUnavailableOnThisDate = targetKhateeb.unavailableDates.find(d => {
        return scheduleHelpers.sameMonthDateAndYear(new Date(d.date), new Date(upcomingFriday))
    })
    if (isDefaultKhateebUnavailableOnThisDate)
        return noneScheduled
    else
        return { 
            khateebID: defaultKhateebID, 
            upsert: true,
            timingID: targetTiming._id.toString(),
            institutionID: targetTiming.institutionID,
            locationID: targetTiming.locationID,
            date: new Date(upcomingFriday),
            isBackup,
            isGivingKhutbah: !isBackup,
            notified: false 
        }
} 

const job = async () => {
    let confirmedInstitutions = []
    try {
        // get all institutions:
        // > Are confirmed
        // > that aren't the root institution (aka "__ROOT__")
        // > and have jummah notifications turned on
        const institutions = await institutions.query({
            filter: {
                confirmed: true,
                name: { $ne: "__ROOT__" },
               "settings.allowJummahNotifications": true 
            }
        })
        if (Array.isArray(institutions)) {
            confirmedInstitutions = institutions
        }
    } catch(err) {
        console.log("Couldn't run notification chron ", err)
        return
    }
    const upcomingFriday = scheduleHelpers.findUpcomingFridayDBFormat()
    const thisIsFridayNumberInCurrentMonth = scheduleHelpers.numberOfJummahThisMonth(upcomingFriday)
    // loop through institutions that fit above criteria
    for (let i = 0; i < confirmedInstitutions.length; i++) {
        const targetInstitution = confirmedInstitutions[i]
        let activeTimings = []
        try {
            const timings = timingsInterfaces.query({
                filter: { 
                    institutionID: targetInstitution._id, 
                    active: true 
                }
            })
            if (Array.isArray(timings)) {
                activeTimings = timings
            }
        } catch(err) {
            console.error(`There was a problem finding timings for ${targetInstitution.name} `, err)
            continue
        }
        // loop through all active timings
        for (let j = 0; j < activeTimings.length; j++) {
            const targetTiming = activeTimings[j]
            // find all jummah entries associated with this timing for the upcoming
            // week
            let targetTimingJummahPreferences = []
            try {
                const jPreferences = await jummahPreferences.query({ 
                   filter: { timingID: targetTiming._id.toString(), date: upcomingFriday } 
                })
                if (Array.isArray(jPreferences)) {
                    targetTimingJummahPreferences = jPreferences
                }
            } catch(err) {
                console.error(`There was a problem finding jummah preferences for timing ${targetTiming._id} at ${targetInstitution.name} `, err)
            }
            // compensate for zero indexing
            const defaultKhateebsForThisWeek = targetTiming.defaultKhateebs[thisIsFridayNumberInCurrentMonth - 1]
            // identify main and backup khateebs
            let mainKhateeb = targetTimingJummahPreferences.find(jp => !jp.isBackup)
            let backupKhateeb = targetTimingJummahPreferences.find(jp => jp.isBackup)
            // if there is no explicitly stated main khateeb or backup
            // check default khateebs
            if (!mainKhateeb || !backupKhateeb) {
                let khateebsAtThisInstitution = []
                try {
                    const khateebAuthorization = await authorizations.query({
                        filter: { 
                            institution: targetInstitution._id,
                            role: 'khateeb' 
                        }
                    })
                    if (!khateebAuthorization) {
                        throw TypeError(`khateeb authorization doesn't exist`)
                    }
                    const khateebs = await users.findKhateebs(
                        targetInstitution._id, 
                        khateebAuthorization, 
                        { active: true }
                    )
                    if (Array.isArray(khateebs)) {
                        khateebsAtThisInstitution = khateebs
                    }
                } catch(err) {
                    console.log(`Couldn't find khateebs at ${targetInstitution.name} `, err)
                }
                if (!mainKhateeb)
                    mainKhateeb = findDefaultPreferenceForThisWeek(
                        defaultKhateebsForThisWeek.mainKhateeb,
                        khateebsAtThisInstitution,
                        upcomingFriday,
                        targetTiming,
                        false
                    )
                if (!backupKhateeb)
                    backupKhateeb = findDefaultPreferenceForThisWeek(
                        defaultKhateebsForThisWeek.backup,
                        khateebsAtThisInstitution,
                        upcomingFriday,
                        targetTiming,
                        true
                    )
            }
            cronWrapper({
                time: jummahHelpers.cronNotificationTiming(
                    upcomingFriday, 
                    targetInstitution.settings.jummahNotificationsTiming, 
                    targetInstitution.timezone
                ),
                job: async () => {
                    try {
                        await jummahHelpers.jummahPreferenceNotifier(mainKhateeb, true).sendNotification()
                        await jummahHelpers.jummahPreferenceNotifier(backupKhateeb, false).sendNotification()
                    } catch(err) {
                        console.log(err)
                    }
                }
            }).start()
        }
    }
}

// every sunday @ 6AM MST
module.exports = cronWrapper({ time: '00 00 6 * * 0' , syncWithTimezone: true, job })