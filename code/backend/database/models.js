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
        options: mongoose.Schema.Types.Mixed,
        savedOn: Date
    }),
    locationInfo: new mongoose.Schema({
        info: Object,
        timings: Array
    }),
    locationMeta: new mongoose.Schema({
        name: String,
        address: String
    }),
    timingTemplate: new mongoose.Schema({
        hour: String,
        minutes: String,
        AMorPM: String
    }),
    location: new mongoose.Schema({
        info: Object,
        timings: Array,
        monthlySchedule: Object
    }),
    prayerSlot: new mongoose.Schema({
        _id: String,
        firstName: String,
        lastName: String,
        savedOn: Date
    }),
    admin: new mongoose.Schema({
        firstName: String,
        lastName: String,
        phoneNumber: String,
        email: String,
        savedOn: Date
    })
 }

 const models = {
    settings: mongoose.model('setting', schemas.setting),
    announcements: mongoose.model('announcement', schemas.announcement),
    monthlySchedules: mongoose.model('monthlySchedule', schemas.scheduleEntry),
    khateebs: mongoose.model('khateeb', schemas.khateeb),
    locationDetails: mongoose.model('locationDetail', schemas.locationInfo),
    timingTemplates: mongoose.model('timingTemplate', schemas.timingTemplate),
    locationMetas: mongoose.model('locationMeta', schemas.locationMeta),
    locationTemplate: mongoose.model('template', schemas.location),
    prayerSlot: mongoose.model('prayerSlot', schemas.prayerSlot),
    admin: mongoose.model('admin', schemas.admin),
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
    },
    emptySchema(schemaName, mixed = {}) {
        const fullSchemaParams = this[schemaName].schema.paths
        let schema = {}
        for (let param in fullSchemaParams) {
            let paramObject = fullSchemaParams[param]
            switch(paramObject.instance) {
                case 'String':
                    schema[param] = ''
                    break;
                case 'Number':
                    if (param !== '__v') schema[param] = '0'
                    break;
                case 'Mixed':
                    schema[param] = mixed
                    break;
                case 'Array':
                    schema[param] = []
                    break;
            }
        }
        return schema
    }
}

 export default models