const { cronWrapper } = require(global.$dir + '/libraries/cron/main.js')
const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')
const jummahHelpers = require(global.$dir + '/libraries/jummahs/main.js')

const job = async () => {
    try {
        const institutions = await $db.institutions.find({ confirmed: true }).exec()
        const upcomingFriday = scheduleHelpers.findUpcomingFridayDBFormat()
        for (let i = 0; i < institutions.length; i++) {
            const targetInstitution = institutions[i]
            const activeTimings = await $db.timings.find().activeTimings(targetInstitution._id).exec()
            const scheduledUpcomingJummahs = await $db.jummahPreferences.find().upcomingJummahsForInstitution(upcomingFriday, targetInstitution._id).exec()
            for (let x = 0; x < activeTimings.length; x++) {
                const targetTiming = activeTimings[x]
                const khateebsScheduledForThisTiming = scheduledUpcomingJummahs.filter(j => j.timingID === targetTiming._id.toString())
                if (khateebsScheduledForThisTiming.length < 1)
                    continue
                let mainKhateeb = khateebsScheduledForThisTiming.find(k => k.isGivingKhutbah)
                if (!mainKhateeb)
                    mainKhateeb = await $db.jummahPreferences.findOneAndUpdate({ _id: khateebsScheduledForThisTiming[0]._id.toString() }, { isGivingKhutbah: true }, { new: true })
                cronWrapper({ 
                    time: '00 00 6 * * 3', // hardcoded right now, every wednesday at 6AM
                    timeZone: targetInstitution.timezone, 
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
module.exports = cronWrapper({ time: '00 00 6 * * 0', syncWithTimezone: true, job })