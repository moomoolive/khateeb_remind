const mongoose = require('mongoose')

const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')

const location = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    address: {
        type: String,
        required: true,
        minlength: 1
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

location.methods.createAssociatedTiming = async function() {
    try {
        const saved = await $db.timings({
            institutionID: this.institutionID,
            locationID: this._id.toString(),
            // Randomly intiatized hour and minute, I just chose 12 30
            hour: 12,
            minute: 30
        }).save()
        await  scheduleHelpers.createJummahsForTiming(this._id.toString(), saved._id.toString(), this.institutionID)
        return saved
    } catch(err) {
        console.log(`${err}\nCouldn't create assoicated timing`)
    }
}

module.exports = location