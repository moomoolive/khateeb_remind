const mongoose = require('mongoose')

const subDocs = require($rootDir + '/database/subDocuments/main.js')
const scripts = require($rootDir + '/libraries/scripts/index.js')

const khateeb = new mongoose.Schema({
    title: {
        type: String,
        default: 'none',
        minLength: 1
    },
    availableTimings: [String],
    unavailableDates: [subDocs.unavailableDate]
})

khateeb.query.safelyFindOne = function(_id='none') {
    if (!_id || _id.toLocaleLowerCase() === $config.consts.nullId)
        throw TypeError('Please provide a valid khateeb id')
    return this.where({ _id })
}

const root = new mongoose.Schema({
    confirmed: {
        type: Boolean,
        required: false,
        default: true
    },
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

const rootInstitutionAdmin = new mongoose.Schema({})
const institutionAdmin = new mongoose.Schema({})
const sysAdmin = new mongoose.Schema({})

module.exports = {
    khateeb,  
    rootInstitutionAdmin,
    institutionAdmin,
    root,
    sysAdmin
}