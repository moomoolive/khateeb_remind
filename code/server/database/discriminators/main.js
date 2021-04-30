const mongoose = require('mongoose')

const scripts = require($rootDir + '/libraries/scripts/index.js')

// legacy structure

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

const khateeb = new mongoose.Schema({
    availableTimings: [String],
    unavailableDates: [unavailableDate]
})

khateeb.query.safelyFindOne = function(_id='none') {
    if (!_id || _id.toLocaleLowerCase() === $config.consts.nullId)
        throw TypeError('Please provide a valid khateeb id')
    return this.where({ _id })
}
// to be phased out

const root = new mongoose.Schema({
    systemSettings: {
        autoConfirmRegistration: {
            type: Boolean,
            required: false,
            default: false
        }
    }
})

root.post("deleteOne", function() {
    const threeSecondsInMilliseconds = 3_000
    global.setTimeout(async () => { await scripts.createRootUser() }, threeSecondsInMilliseconds)
})

// legacy structures
const rootInstitutionAdmin = new mongoose.Schema({})
const institutionAdmin = new mongoose.Schema({})
// to be phased out

const sysAdmin = new mongoose.Schema({})

module.exports = {
    khateeb,  
    rootInstitutionAdmin,
    institutionAdmin,
    root,
    sysAdmin
}