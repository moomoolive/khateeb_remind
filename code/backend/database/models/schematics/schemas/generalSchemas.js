const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')

const subDocs = require('./subDocs')

const jummah = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    month: {
        type: Number,
        required: true,
        min: 0,
        max: 11
    },
    year: {
        type: Number,
        required: true,
        min: 2021
    },
    weekOf: {
        type: Number,
        required: true,
        min: 1,
        max: 31
    },
    confirmed: {
        type: Boolean,
        required: true
    },
    locationID: {
        type: String,
        required: true
    },
    timingID: {
        type: String,
        required: true
    },
    khateebPreference: [subDocs.prayerSlot]
}, { timestamps: true })

const institution = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    abbreviatedName: {
        type: String,
        required: false,
        default: '__NO-ABBREVIATED-NAME__'
    },
    timezone: {
        type: String,
        required: true,
        minlength: 1
    },
    confirmed: {
        type: Boolean,
        required: false,
        default: false
    },
    country: {
        type: String,
        required: true,
        minlength: 1
    },
    state: {
        type: String,
        required: false,
        minlength: 1
    }
},
{ timestamps: true })

const location = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 1
    },
    address: {
        type: String,
        required: true,
        minlength: 1
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    }
}, { timestamps: true })

const timing = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    locationID: {
        type: String,
        required: true
    },
    hour: {
        type: Number,
        required: true,
        min: 0,
        max: 23
    },
    minute: {
        type: Number,
        required: true,
        min: 0,
        max: 59
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    }
}, { timestamps: true })

const user = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    password: {
        type: String,
        default: 'password',
        minlength: 6
    },
    confirmed: {
        type: Boolean,
        default: false
    },
    handle: {
        type: String,
        required: false,
        default: "__NO-HANDLE__",
        minlength: 1,
        validate: {
            validator: (val) => val[0] !== "@",
            message: "Illegal 'at' symbol in position 0"
        }
    },
    firstName: {
        type: String,
        required: true,
        minlength: 1
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1
    },
    phoneNumber: {
        type: Number,
        required: true,
        min: 100_000_0000,
        max: 999_999_9999
    },
    lastLogin: {
        type: Date,
        required: false,
        default: new Date()
    }
},
{ timestamps: true })

user.pre('save', function (next) {
    const user = this
    if (!this.isModified('password'))
        return next()
    
    const saltFactor = 9
    bcyrpt.genSalt(saltFactor, (err, salt) => {
        if (err)
            return next(err)
        bcyrpt.hash(user.password, salt, (err, hash) => {
            if (err)
                return next(err)
            user.password = hash
            next()
        })
    })
})

user.pre('updateOne', function (next) {
    try {
        const data = this.getUpdate()
        if (!data.password) {
            this.update({}, data).exec()
            return next()
        }
        const saltFactor = 9
        const salt = bcyrpt.genSaltSync(saltFactor)
        const hash = bcyrpt.hashSync(data.password, salt)
        data.password = hash
        this.update({}, data).exec()
        next()
    } catch(err) {
        console.log(err)
        next(err)
    }
})

user.methods.comparePassword = async function (submittedPassword) {
    try {
        const isMatched = await bcyrpt.compare(submittedPassword, this.password)
        return isMatched
    } catch(err) {
        console.log('There was a problem verifying password')
        console.log(err)
        return null
    }
}

const announcement = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
    },
    headline: {
        type: String,
        required: true,
        minlength: 1
    },
    content: {
        type: String,
        default: 'no content',
        minlength: 1
    },
    important: {
        type: Boolean,
        default: false
    },
    urgent: {
        type: Boolean,
        default: false
    },
}, { timestamps: true })

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
        minlength: 12
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

setting.pre('save', function(next) {
    try {
        const setting = this
        setting.twilioKey = $db.funcs.encrypt(setting.twilioKey)
        setting.twilioUser = $db.funcs.encrypt(setting.twilioUser)
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
        next()
    } catch(err) {
        console.log(err)
        next(err)
    }
})

const notification = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true,
        minlength: 1
    },
    msg: {
        type: String,
        required: true,
        minlength: 1
    },
    seen: {
        type: Boolean,
        default: false
    },
    seenAt: {
        type: Date,
        required: false
    },
    tag: {
        type: String,
        required: true
    },
    meta: {
        type: Object,
        required: true
    }
}, { timestamps: true })

module.exports = {
    jummah,
    announcement,
    timing,
    location,
    institution,
    user,
    setting,
    notification
}