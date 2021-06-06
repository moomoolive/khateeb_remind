const mongoose = require('mongoose')

const unavailableDate = new mongoose.Schema({
    vCalendarId: {
        type: String,
        required: true
    }, 
    date: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const userScheduleRestriction = new mongoose.Schema({
    institution: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'institution'
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    availableTimings: {
        type: [{ type: mongoose.Types.ObjectId, ref: 'timing' }],
        required: false,
        default: () => [] 
    },
    unavailableDates: {
        type: [unavailableDate],
        required: false,
        default: () => []
    }
}, { timestamps: true })

module.exports = mongoose.model('userScheduleRestriction', userScheduleRestriction)