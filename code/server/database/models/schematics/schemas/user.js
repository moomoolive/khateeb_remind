const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')

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

user.methods.deleteNotifications = async function() {
    const res = {}
    try {
        res.notifications = await $db.models.notifications.deleteMany({ userID: this._id.toString() }) 
    } catch(err) {
        console.log(err)
    }
    return res
}

module.exports = user