const mongoose = require('mongoose')

const subDocs = require(global.$dir + '/database/subDocuments/main.js')

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
    if (!_id || _id.toLocaleLowerCase() === 'none')
        throw TypeError('Please provide a valid khateeb id')
    return this.where({ _id })
}

const rootInstitutionAdmin = new mongoose.Schema({})
const institutionAdmin = new mongoose.Schema({})
const root = new mongoose.Schema({})
const sysAdmin = new mongoose.Schema({})

module.exports = {
    khateeb,  
    rootInstitutionAdmin,
    institutionAdmin,
    root,
    sysAdmin
}