import mongoose from 'mongoose'

// validation checks to be changed here

const schemas = {   
    scheduleEntry: new mongoose.Schema({
        month: String,
        data: Object,
        savedOn: Date
    }),
    khateeb: new mongoose.Schema({
        firstName: String,
        lastName: String,
        phoneNumber: String,
        active: String,
        email: String,
        dropouts: String,
        comments: String,
        savedOn: Date
    }),
    announcement: new mongoose.Schema({
        headline: String,
        content: String,
        important: String,
        urgent: String,
        savedOn: Date
    }),
    setting: new mongoose.Schema({
        name: String,
        options: Object,
        savedOn: Date
    })
 }

 const models = {
    settings: mongoose.model('setting', schemas.setting),
    announcements: mongoose.model('announcement', schemas.announcement),
    monthlySchedules: mongoose.model('monthlySchedule', schemas.scheduleEntry),
    khateebs: mongoose.model('khateeb', schemas.khateeb),
    schemaParams(schemaName, full=false) {
        const fullSchemaParams = Object.keys(this[schemaName].schema.paths)
        if (!full) {
            for (let param in fullSchemaParams) {
                let x = fullSchemaParams[param]
                if (x == '__v' || x == 'savedOn') {
                    fullSchemaParams.splice(param, 1)
                }
            }
            const IDParam = fullSchemaParams.pop()
        }
        return fullSchemaParams
    }
}

 export default models