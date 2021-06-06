const mongoose = require('mongoose')
const bcyrpt = require('bcrypt')

const typeCheckingHelpers = require($rootDir + '/libraries/typeChecking/main.js')

const notifications = require($rootDir + "/database/models/notifications.js")
const pwaSubscriptions = require($rootDir + "/database/models/pwaSubscriptions.js")
const userScheduleRestrictions = require($rootDir + "/database/models/userScheduleRestrictions.js")

const authorization = new mongoose.Schema({
    authId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'authorization'
    },
    confirmed: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true })

const user = new mongoose.Schema({
    username: {
        type: String,
        // The username field should be required, but I have checks across the
        // front end and backend to ensure that any new user must submit
        // a username. I've left it false because when a user deletes their
        // account I want the user to still be in the database, so that
        // 'jummahPreferences' that included the user as a khateeb 
        // will still be able to render correctly.
        //
        // So in order to free up the 'username' namespace in the database
        // when a user is deleted this field is simply erased from their
        // document.
        required: false,
        unique: true,
        minLength: 6
    },
    password: {
        type: String,
        default: 'password',
        minLength: 6
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
    title: {
        type: String,
        default: $config.consts.nullId,
        minLength: 1
    },
    authorizations:{
        type: [authorization],
        required: false,
        default: () => []
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
    },
    scheduleRestrictions: {
        type: [{ type: mongoose.Types.ObjectId, ref: 'userScheduleRestriction' }],
        required: false,
        default: () => []
    }
}, { timestamps: true })

user.blah = {
    type: Boolean,
    required: false,
    default: true
}

const model = mongoose.model('user', user)

user.query.safelyFindOne = function(_id='none') {
    if (!_id || _id.toLocaleLowerCase() === $config.consts.nullId)
        throw TypeError('Please provide a valid khateeb id')
    return this.where({ _id })
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
        await new notifications({
            tag: 'welcome',
            msg: `Asalam aliakoum ${user.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. If you ever need help take a look at the tutorials in your navigation!`,
            userID: this._id
        }).save()
        return next()
    } catch(err) {
        console.error(err)
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
        console.error('There was a problem verifying password', err)
        return null
    }
}

user.methods.deactivateAccount = async function () {
    const dependants = await this.deleteDependencies()
    const userRes = await this.setAccountToInactive()
    return { userRes, dependants }
}

user.methods.setAccountToInactive = async function() {
    let res = {}
    try {
        res = await model.update(
            { _id: this._id },
            { 
                active: false , 
                scheduleRestrictions: [],
                // remove username - refer to explanation in schema section
                // above
                $unset: { username: "" } 
            }
        )
    } catch(err) {
        console.error(err)
    }
    return res
}

user.methods.deleteDependencies = async function() {
    const responses = {}
    responses.notifications = await this.deleteNotifications()
    responses.pwaSubscriptions = await this.deletePwaSubscriptions()
    responses.scheduleRestrictions = await this.deleteScheduleRestrictions()
    return responses
}

user.methods.deleteScheduleRestrictions = async function() {
    let res = {}
    try {
        res = await userScheduleRestrictions.deleteMany({ user: this._id }) 
    } catch(err) {
        console.error(err)
    }
    return res
}

user.methods.deletePwaSubscriptions = async function() {
    let res = {}
    try {
        res = await pwaSubscriptions.deleteMany({ userID: this._id }) 
    } catch(err) {
        console.error(err)
    }
    return res
}

user.methods.deleteNotifications = async function() {
    let res = {}
    try {
        res = await notifications.deleteMany({ userID: this._id })
    } catch(err) {
        console.error(err)
    }
    return res
}

module.exports = model