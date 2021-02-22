const mongoose = require('mongoose')

const timing = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    locationID: {
        type: String,
        required: true
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
    }
}, { timestamps: true })


timing.methods.deleteDependants = async function() {
    const res = {}
    try {
        const timingID = this._id.toString()
        res.jummah = await $db.models.jummahs.deleteMany({ timingID }).futureEntries()
        const khateebs = await $db.models.khateebs.find({ institutionID: this.institutionID }).exec()
        for (let i = 0; i < khateebs.length; i++) {
            const khateeb = khateebs[i]
            const availableTimings = khateeb.availableTimings.filter(timing => timing !== timingID)
            const khateebTimingRes = await $db.models.khateebs.updateOne({ _id: khateeb._id.toString() }, { availableTimings })
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

module.exports = timing