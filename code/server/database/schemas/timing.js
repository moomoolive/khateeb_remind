const mongoose = require('mongoose')

const defaultKhateebForWeek = new mongoose.Schema({
    mainKhateeb: {
        type: String,
        required: true,
        minLength: 1
    },
    backup: {
        type: String,
        required: true,
        minLength: 1
    },
}, { timestamps: true })

const defaultKhateebsDefaultValue = new Array(5).fill(
    { mainKhateeb: $config.consts.nullId, backup: $config.consts.nullId }
)

const timing = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'institution'
    },
    locationID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
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
        type: [defaultKhateebForWeek],
        required: false,
        default: () => defaultKhateebsDefaultValue,
        validate: {
            validator: function(t) {
                return t.length === defaultKhateebsDefaultValue.length
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
    if (!institutionID || institutionID.toLowerCase() === $config.consts.nullId)
        throw TypeError(`please provide a valid institution id`)
    return this.where({ active: true, institutionID })
}

module.exports = timing