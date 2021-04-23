const mongoose = require('mongoose')

const subDocs = require(global.$dir + "/database/subDocuments/main.js")

const timing = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: global.CONFIG.consts.mongooseIdLength,
        maxLength: global.CONFIG.consts.mongooseIdLength,
        ref: 'institution'
    },
    locationID: {
        type: String,
        required: true,
        minLength: global.CONFIG.consts.mongooseIdLength,
        maxLength: global.CONFIG.consts.mongooseIdLength,
        ref: 'location'
    },
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    minute: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    defaultKhateebs: {
        type: [subDocs.defaultKhateebForWeek],
        required: false,
        default: () => [
            { mainKhateeb: 'none', backup: 'none' },
            { mainKhateeb: 'none', backup: 'none' },
            { mainKhateeb: 'none', backup: 'none' },
            { mainKhateeb: 'none', backup: 'none' },
            { mainKhateeb: 'none', backup: 'none' },
        ],
        validate: {
            validator: function(t) {
                return t.length === 5
            },
            message: t => `Default khateebs array must have five entries. Got ${t.length}`
        }
    }
}, { timestamps: true })


timing.methods.deleteDependants = async function() {
    const res = {}
    try {
        const timingID = this._id.toString()
        const khateebs = await $db.khateebs.find({ institutionID: this.institutionID }).exec()
        for (let i = 0; i < khateebs.length; i++) {
            const khateeb = khateebs[i]
            const availableTimings = khateeb.availableTimings.filter(timing => timing !== timingID)
            const khateebTimingRes = await $db.khateebs.updateOne({ _id: khateeb._id.toString() }, { availableTimings })
            if (!res.khateebs)
                res.khateebs = khateebTimingRes
            else
                res.khateebs.n++; res.khateebs.nModified++;
        }
        if (!res.khateebs)
            res.khateebs = `None modified`
    } catch(err) {
        console.log(err)
        console.log(`Couldn't delete dependant data structures`)
    }
    return res
}

timing.query.activeTimings = function(institutionID='none') {
    institutionID = institutionID.toString()
    if (!institutionID || institutionID.toLowerCase() === 'none')
        throw TypeError(`please provide a valid institution id`)
    return this.where({ active: true, institutionID })
}

module.exports = timing