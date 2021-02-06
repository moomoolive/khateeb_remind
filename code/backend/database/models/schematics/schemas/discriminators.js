const mongoose = require('mongoose')

module.exports = {
    khateeb: new mongoose.Schema({
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
        availableTimings: [String]
    }),
    rootInstitutionAdmin: new mongoose.Schema({

    }),
    institutionAdmin: new mongoose.Schema({

    }),
    root: new mongoose.Schema({

    }),
    sysAdmin: new mongoose.Schema({
        
    }),
    generalNotification: new mongoose.Schema({
        
    }),
    actionNotification: new mongoose.Schema({
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
}