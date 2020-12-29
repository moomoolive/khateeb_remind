import mongoose from 'mongoose'

export default {
    scheduleEntry: new mongoose.Schema({
        month: String,
        data: Object,
        savedOn: Date
    }),
    khateeb: new mongoose.Schema({
        firstName: String,
        lastName: String,
        phoneNumber: String,
        active: Boolean,
        email: String,
        dropouts: String,
        savedOn: Date
    }),
    announcement: new mongoose.Schema({
        headline: String,
        content: String,
        important: Boolean,
        urgent: Boolean,
        savedOn: Date
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
}