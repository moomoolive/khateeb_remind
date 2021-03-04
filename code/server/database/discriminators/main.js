const mongoose = require('mongoose')

const subDocs = require(global.$dir + '/database/subDocuments/main.js')

const khateeb = new mongoose.Schema({
    title: {
        type: String,
        default: 'none',
        minlength: 1
    },
    active: {
        type: Boolean,
        default: true
    },
    dropouts: {
        type: Number,
        default: 0,
        min: 0
    },
    availableTimings: [String],
    unavailableDates: [subDocs.unavailableDate]
})

const rootInstitutionAdmin = new mongoose.Schema({})
const institutionAdmin = new mongoose.Schema({})
const root = new mongoose.Schema({})
const sysAdmin = new mongoose.Schema({})

const actionNotification = new mongoose.Schema({
    actionPerformed: {
        type: Boolean,
        required: true,
        default: false
    },
    actionLink: {
        type: String,
        required: true,
        default: 'TBD'
    },
    buttonText: {
        type: String,
        required: true
    }
})

const generalNotification = new mongoose.Schema({})

module.exports = {
    khateeb,  
    rootInstitutionAdmin,
    institutionAdmin,
    root,
    sysAdmin,
    generalNotification,
    actionNotification
}