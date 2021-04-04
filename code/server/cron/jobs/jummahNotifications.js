const { cronWrapper } = require(global.$dir + '/libraries/cron/main.js')
const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')
const jummahHelpers = require(global.$dir + '/libraries/jummahs/main.js')

const job = async () => {
    try {
        const institutions = await $db.institutions.find({ confirmed: true }).exec()
        const upcomingFriday = scheduleHelpers.findUpcomingFridayDBFormat()
        for (let i = 0; i < institutions.length; i++) {
            const targetInstitution = institutions[i]
            if (!targetInstitution.settings.allowJummahNotifications)
                continue
            const numberOfJummahThisMonth = scheduleHelpers.numberOfJummahThisMonth(targetInstitution.getLocalTime())
            const activeTimings = await $db.timings.find().activeTimings(targetInstitution._id).exec()
            const scheduledUpcomingJummahs = await $db.jummahPreferences.find().upcomingJummahsForInstitution(upcomingFriday, targetInstitution._id).exec()
            for (let x = 0; x < activeTimings.length; x++) {
                const targetTiming = activeTimings[x]
                let khateebsScheduledForThisTiming = scheduledUpcomingJummahs.filter(j => j.timingID === targetTiming._id.toString())
                let mainKhateeb = khateebsScheduledForThisTiming.find(k => k.isGivingKhutbah)
                let backupKhateeb = khateebsScheduledForThisTiming.find(k => k.isBackup)
                const institutionKhateebs = await $db.khateebs.find({ institutionID: targetInstitution._id.toString() })
                console.log(scheduledUpcomingJummahs)
                if (khateebsScheduledForThisTiming.length < 2) {
                    const defaultKhateebs = targetTiming.defaultKhateebs[numberOfJummahThisMonth - 1]
                    if (!mainKhateeb && defaultKhateebs.mainKhateeb !== 'none') {
                        const mainKhateebObject = institutionKhateebs.find(k => k._id.toString() === defaultKhateebs.mainKhateeb)
                        const mainKhateebIsAbleToGiveKhutbah = !mainKhateebObject.unavailableDates
                            .find(({ date }) => scheduleHelpers.sameMonthDateAndYear(date, upcomingFriday))
                        if (mainKhateebIsAbleToGiveKhutbah) {
                            const defaultMain = await new $db.jummahPreferences({
                                locationID: targetTiming.locationID,
                                institutionID: targetTiming.institutionID,
                                timingID: targetTiming._id.toString(),
                                date: upcomingFriday,
                                khateebID: defaultKhateebs.mainKhateeb,
                                isGivingKhutbah: true,
                                isBackup: false
                            }).save()
                            khateebsScheduledForThisTiming.push(defaultMain)
                        }
                    }
                    if (!backupKhateeb && defaultKhateebs.backup !== 'none') {
                        const backupKhateebObject = institutionKhateebs.find(k => k._id.toString() === defaultKhateebs.mainKhateeb)
                        const backupKhateebIsAbleToGiveKhutbah = !backupKhateebObject.unavailableDates
                            .find(({ date }) => scheduleHelpers.sameMonthDateAndYear(date, upcomingFriday))
                        if (backupKhateebIsAbleToGiveKhutbah) {
                            const defaultBackup = await new $db.jummahPreferences({
                                locationID: targetTiming.locationID,
                                institutionID: targetTiming.institutionID,
                                timingID: targetTiming._id.toString(),
                                date: scheduleHelpers.findUpcomingFridayDBFormat(),
                                khateebID: upcomingFriday,
                                isGivingKhutbah: !khateebsScheduledForThisTiming.find(k => k.isGivingKhutbah),
                                isBackup: true
                            }).save()
                            khateebsScheduledForThisTiming.push(defaultBackup)
                        }
                    } 
                }
                if (khateebsScheduledForThisTiming.length < 1)
                    continue
                mainKhateeb = khateebsScheduledForThisTiming.find(k => k.isGivingKhutbah)
                if (!mainKhateeb && !khateebsScheduledForThisTiming[0].notified )
                    mainKhateeb = await $db.jummahPreferences.findOneAndUpdate({ _id: khateebsScheduledForThisTiming[0]._id.toString() }, { isGivingKhutbah: true }, { new: true })
                console.log('before chron', mainKhateeb)
                if (!mainKhateeb.notified)    
                    cronWrapper({
                        time: jummahHelpers.cronNotificationTiming(
                            upcomingFriday, 
                            targetInstitution.settings.jummahNotificationsTiming, 
                            targetInstitution.timezone
                        ), 
                        job: jummahHelpers.chronNotificationLoop(mainKhateeb, targetInstitution, targetTiming)    
                    }).start()
            }
        }
        console.log(`Set notification cron jobs for institutions!`)
    } catch(err) {
        console.log(err)
        console.log(`Couldn't set notification for all institutions!`)
    }
}

// every sunday @ 6AM
module.exports = cronWrapper({ time: '00 00 6 * * 0' , syncWithTimezone: true, job })