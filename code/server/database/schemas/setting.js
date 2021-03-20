const mongoose = require('mongoose')

const securityHelpers = require(global.$dir + '/libraries/security/main.js')

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
        required: false,
        minlength: 1
    },
    twilioPhoneNumber: {
        type: String,
        required: false,
        minlength: phoneNumberWithOneDigitCountryCode,
        maxlength: phoneNumberWithOnlyTwoDigitCountryCode
    },
    textAllowed: {
        type: Boolean,
        required: false,
        default: false
    },
    autoConfirmRegistration: {
        type: Boolean,
        required: true
    }
})

setting.methods.decrypt = function() {
    try {
        if (this.twilioKey)
            this.twilioKey = securityHelpers.decrypt(this.twilioKey)
        if (this.twilioUser)
            this.twilioUser = securityHelpers.decrypt(this.twilioUser)
    } catch(err) {
        console.log(err)
        console.log(`Couldn't unencrypt settings`)
    }
    return this
}

setting.pre('save', function(next) {
    try {
        this.twilioKey = securityHelpers.encrypt(this.twilioKey)
        this.twilioUser = securityHelpers.encrypt(this.twilioUser)
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
            data.twilioUser = securityHelpers.encrypt(data.twilioUser)
        if (data.twilioKey)
            data.twilioKey = securityHelpers.encrypt(data.twilioKey)
        this.update({}, data).exec()
        return next()
    } catch(err) {
        console.log(err)
        next(err)
    }
})

module.exports = setting