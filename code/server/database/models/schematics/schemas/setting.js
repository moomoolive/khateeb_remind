const mongoose = require('mongoose')

const phoneNumberWithOneDigitCountryCode = 12
const phoneNumberWithOnlyTwoDigitCountryCode = 13

const setting = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minlength: 1
    },
    twilioUser: {
        type: String,
        required: true,
        minlength: 1
    },
    twilioKey: {
        type: String,
        required: true,
        minlength: 1
    },
    twilioPhoneNumber: {
        type: String,
        required: true,
        minlength: phoneNumberWithOneDigitCountryCode,
        maxlength: phoneNumberWithOnlyTwoDigitCountryCode
    },
    textAllowed: {
        type: Boolean,
        required: true,
    },
    autoConfirmRegistration: {
        type: Boolean,
        required: true
    }
})

setting.methods.decrypt = function() {
    try {
        if (this.twilioKey)
            this.twilioKey = $db.funcs.decrypt(this.twilioKey)
        if (this.twilioUser)
            this.twilioUser = $db.funcs.decrypt(this.twilioUser)
    } catch(err) {
        console.log(err)
        console.log(`Couldn't unencrypt settings`)
    }
    return this
}

setting.pre('save', function(next) {
    try {
        this.twilioKey = $db.funcs.encrypt(this.twilioKey)
        this.twilioUser = $db.funcs.encrypt(this.twilioUser)
        next()
    } catch(err) {
        console.log('There was a problem encrypting settings')
        console.log(err)
        next(err)
    }
})

setting.pre('updateOne', function(next) {
    try {
        const data = this.getUpdate()
        if (!data.twilioUser && !data.twilioKey) {
            this.update({}, data).exec()
            return next()
        }
        if (data.twilioUser)
            data.twilioUser = $db.funcs.encrypt(data.twilioUser)
        if (data.twilioKey)
            data.twilioKey = $db.funcs.encrypt(data.twilioKey)
        this.update({}, data).exec()
        return next()
    } catch(err) {
        console.log(err)
        next(err)
    }
})

module.exports = setting