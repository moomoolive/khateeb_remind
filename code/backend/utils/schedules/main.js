import helpers from './helpers.js'
import $dbModels from '../../database/models.js'

export default {
    fetchCurrentSchedule() {
        const scheduleKey = helpers.createScheduleKey()
        return new Promise((resolve, reject) => {
            $dbModels.monthlySchedules.findOne({ month: scheduleKey }, (err, schedule) => {
                if (err) {
                    console.log(err)
                    reject()
                } else resolve(schedule)
            })
        })
    }
}