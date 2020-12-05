import mongoose from 'mongoose'

const schemas = {   
    scheduleEntry: new mongoose.Schema({
        month: String,
        data: Object,
        savedOn: Date
    }),
    // validation checks to be changed here
    khateeb: new mongoose.Schema({
        firstName: String,
        lastName: String,
        phoneNumber: String,
        active: String,
        email: String,
        dropouts: String,
        comments: String
    }),
    announcement: new mongoose.Schema({
        headline: String,
        content: String,
        important: String,
        urgent: String,
        date: String
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
    khateebs: mongoose.model('khateeb', schemas.khateeb)
}

 export default models