const mongoose = require('mongoose')

const schemas = {
    setting: new mongoose.Schema({
        options: mongoose.Schema.Types.Mixed,
        savedOn: Date
    })
}

module.exports = {
    settings: mongoose.model('setting', schemas.setting)
}