import mongoose from 'mongoose'

const schemas = {
    setting: new mongoose.Schema({
        options: mongoose.Schema.Types.Mixed,
        savedOn: Date
    })
}

export default {
    settings: mongoose.model('setting', schemas.setting)
}