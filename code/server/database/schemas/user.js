const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')

const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')
const typeCheckingHelpers = require(global.$dir + '/libraries/typeChecking/main.js')

const user = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        minLength: global.APP_CONFIG.consts.mongooseIdLength,
        maxLength: global.APP_CONFIG.consts.mongooseIdLength,
        ref: 'institution'
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 6
    },
    password: {
        type: String,
        default: 'password',
        minLength: 6
    },
    confirmed: {
        type: Boolean,
        required: false,
        default: false
    },
    handle: {
        type: String,
        required: false,
        default: "__NO-HANDLE__",
        minLength: 1,
        validate: {
            validator: (val) => val[0] !== "@",
            message: "Illegal 'at' symbol in position 0"
        }
    },
    firstName: {
        type: String,
        required: true,
        minLength: 1
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1
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
    },
    active: {
        type: Boolean,
        required: false,
        default: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: typeCheckingHelpers.isEmail,
            message: "incorrect email format"
        }
    },
    settings: {
        recieveEmailNotifications: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    statuses: {
        lastEmailWasBounced: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}, { timestamps: true })

user.pre('save', function(next) {
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

user.post('save', async function(user, next) {
    try {
        await notificationConstructors.WelcomeNotificationConstructor(user)
        return next()
    } catch(err) {
        console.log(err)
    }
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

user.methods.deleteNotifications = async function() {
    const res = {}
    try {
        res.notifications = await $db.notifications.deleteMany({ userID: this._id.toString() }) 
    } catch(err) {
        console.log(err)
    }
    return res
}

module.exports = user