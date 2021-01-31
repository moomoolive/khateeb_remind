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
        
    })
}