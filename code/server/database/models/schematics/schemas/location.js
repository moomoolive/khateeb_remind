const mongoose = require('mongoose')

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
        const timings = await $db.models.timings.find({ locationID: this._id.toString(), ...options }).exec()
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
        for (let i = 0; i < timings.length; i++)
            res = await timings[i].deleteDependants()
    } catch(err) {
        console.log(err)
        console.log(`Couldn't delete location dependants`)
    }
    return res
}

location.methods.createAssociatedTiming = async function() {
    try {
        const saved = await $db.models.timings({
            institutionID: this.institutionID,
            locationID: this._id.toString(),
            // Randomly intiatized hour and minute, I just chose 12 30
            hour: 12,
            minute: 30
        }).save()
        await  _.schedule.createJummahsForTiming(this._id.toString(), saved._id.toString(), this.institutionID)
        return saved
    } catch(err) {
        console.log(`${err}\nCouldn't create assoicated timing`)
    }
}

module.exports = location