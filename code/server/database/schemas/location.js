const mongoose = require('mongoose')

const location = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
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
        const timings = await $db.timings.find({ locationID: this._id.toString(), ...options }).exec()
        return timings
    } catch(err) {
        console.log(err)
        console.log(`Couldn't find associated timings`)
    }
}

location.methods.deleteDependants = async function () {
    let res = {}
    try {
        const timings = await this.findTimings()
        for (let i = 0; i < timings.length; i++) {
            const thisTimingRes = await timings[i].deleteDependants()
            const deletedTiming = await $db.timings.update({ _id: timings[i]._id.toString() }, { active: false })
            res[`timing-${timings[i]._id.toString()}`] = { ...thisTimingRes, timing: deletedTiming}
        }
    } catch(err) {
        console.log(err)
        console.log(`Couldn't delete location dependants`)
    }
    return res
}

location.methods.createAssociatedTiming = async function(minute=30, hour=12) {
    try {
        const saved = await $db.timings({
            institutionID: this.institutionID,
            locationID: this._id.toString(),
            hour,
            minute
        }).save()
        return saved
    } catch(err) {
        console.log(`${err}\nCouldn't create assoicated timing`)
    }
}

location.post('save', async function(newLocation={}) {
    try {
        await newLocation.createAssociatedTiming()
    } catch(err) {
        console.log(err)
    }
})

module.exports = location