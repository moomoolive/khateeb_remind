import mongoose from 'mongoose'

export default {
    scheduleEntry: new mongoose.Schema({
        month: String,
        data: Object
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
    settings: new mongoose.Schema({
        name: String,
        options: Object
    })
}