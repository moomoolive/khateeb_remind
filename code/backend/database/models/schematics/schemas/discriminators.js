const mongoose = require('mongoose')

module.exports = {
    khateeb: new mongoose.Schema({
        title: {
            type: String,
            default: 'none'
        },
        active: {
            type: Boolean,
            default: true
        },
        dropouts: {
            type: Number,
            default: 0
        },
        preferredTimings: [String]
    }),
    institutionAdmin: new mongoose.Schema({

    }),
    sysAdmin: new mongoose.Schema({

    })
}