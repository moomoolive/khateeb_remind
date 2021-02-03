const express = require('express')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.use(middleware.auth(1))

const typeChecks = {
    "userPassword": {
        "password": {
            "__type__": "str",
            "required": true
        }
    },
    "userUsername": {
        "username": {
            "__type__": "str",
            "required": true
        }
    },
}

const funcs = {
    modelNames(userType) {
        return userType === 'root' ? userType : userType + 's'
    },
    async getNewToken(userId, updateType) {
        const newToken = await $utils.auth.refreshToken(userId)
        return {
            token: newToken,
            msg: `Successfully updated ${updateType}`
        }
    }
}

router.post('/profile', async (req, res) => {
    try {
        const updated = await $db.models[funcs.modelNames(req.headers.usertype)].updateOne({ _id: req.headers.userid }, req.body)
        const response = await funcs.getNewToken(req.headers.userid, 'user profile')
        res.json(response)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user profile`)
    }
})

router.post('/username', 
    middleware.allowedFields(typeChecks.userUsername),
    async (req, res) => {
    try {
        const userEntry = await $db.models[funcs.modelNames(req.headers.usertype)].updateOne({ _id: req.headers.userid }, req.body)
        const response = await funcs.getNewToken(req.headers.userid, 'username')
        res.json(response)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update username`)
    }
})

router.post('/password',
    middleware.allowedFields(typeChecks.userPassword),
    async (req, res) => {
    console.log(req.body)
    try {
        console.log(req.headers.usertype)
        const userEntry = await $db.models[funcs.modelNames(req.headers.usertype)].updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.get('/check-in', async(req, res) => {
    try {
        const lastLogin = await $db.models.users.findOneAndUpdate({ _id: req.headers.userid }, { lastLogin: new Date() })
        const notifications = await $db.models.notifications.find({ userID: req.headers.userid }).sort('-createdAt').limit(10).exec()
        res.json(notifications)
    } catch(err) {
        console.log(err)
        res.json(`Check-in failed`)
    }
})

router.post('/mark-notification-as-seen', async (req, res) => {
    try {
        const updated = await $db.models.notifications.updateOne(req.body, { seen: true })
        res.json(`Successfully updated notification ${req.body._id}`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update notification status`)
    }
})

module.exports = router