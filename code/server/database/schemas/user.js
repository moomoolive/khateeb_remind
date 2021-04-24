const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')

const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')
const typeCheckingHelpers = require($rootDir + '/libraries/typeChecking/main.js')

const user = new mongoose.Schema({
    institutionID: {
        type: String,
        required: true,
        validate: {
            validator: val => val === 'root' || val.length === $config.consts.mongooseIdLength,
            message: "Invalid institution id"
        }
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
            validator: val => val[0] !== "@",
            message: "Illegal symbol '@' in position 0"
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
        // default external notification is email
        // but can be swapped out by replacing the externalNotifications
        // library logic
        // and then replacing the email field above on both the server and client
        // side, replacing it with whatever you want such as phone number, 
        // or any other way you want khateeb remind to communicate with the 
        // outside world
        recieveExternalNotification: {
            type: Boolean,
            required: false,
            default: true
        },
        recievePWAPush: {
            type: Boolean,
            required: false,
            default: true
        },
    },
    statuses: {
        lastEmailWasBounced: {
            type: Boolean,
            required: false,
            default: false
        }
    }
}, { timestamps: true })

user.blah = {
    type: Boolean,
    required: false,
    default: true
}

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