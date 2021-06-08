const mongoose = require('mongoose')

const timings = require($rootDir + "/database/models/timings.js")

const location = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: $config.consts.mongooseIdLength,
        maxLength: $config.consts.mongooseIdLength,
        ref: 'institution'
    },
    name: {
        type: String,
        required: true,
        minLength: 1
    },
    address: {
        type: String,
        required: true,
        minLength: 1
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    }
}, { timestamps: true })

location.methods.findTimings = async function(options) {
    try {
        const ts = await timings.find({ locationID: this._id, ...options })
        return ts
    } catch(err) {
        console.error(`Couldn't find associated timings`, err)
    }
}

location.methods.deleteDependants = async function () {
    let res = {}
    try {
        const timings = await this.findTimings()
        for (let i = 0; i < timings.length; i++) {
            const thisTimingRes = await timings[i].deleteDependants()
            const deletedTiming = await timings.updateEntry({
                filter: { _id: timings[i]._id },
                updates: { active: false }
            })
            res[`timing-${timings[i]._id.toString()}`] = { ...thisTimingRes, timing: deletedTiming}
        }
    } catch(err) {
        console.error(`Couldn't delete location dependants`, err)
    }
    return res
}

location.methods.createAssociatedTiming = async function(minute=30, hour=12) {
    try {
        const saved = await timings({
            institutionID: this.institutionID,
            locationID: this._id.toString(),
            hour,
            minute
        }).save()
        return saved
    } catch(err) {
        console.error(`${err}\nCouldn't create assoicated timing`)
    }
}

location.post('save', async function(newLocation={}) {
    try {
        await newLocation.createAssociatedTiming()
    } catch(err) {
        console.error(err)
    }
})

module.exports = mongoose.model('location', location)