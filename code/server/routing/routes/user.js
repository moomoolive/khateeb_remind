const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const authHelpers = require(global.$dir + '/libraries/auth/main.js')

const router = express.Router()
router.use(authMiddleware.authenticate({ min: 1 }))

router.put(
    '/', 
    validationMiddleware.validateRequest(
        [
            validator.body("password").isLength({ min: 6 }).isString().optional(),
            validator.body("username").isLength({ min: 6 }).isString().optional(),
            validator.body("handle").isLength({ min: 1 }).isString().optional(),
            validator.body("firstName").isLength({ min: 1 }).isString().optional(),
            validator.body("lastName").isLength({ min: 1 }).isString().optional(),
            validator.body("phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }).optional(),
            validator.body("availableTimings").isArray().optional(),
            validator.body("unavailableDates").isArray().optional(),
            validator.body("title").isLength({ min: 1 }).isString().optional()
        ]
    ),
    async (req, res) => {
        try {
            const userType = `${req.headers.usertype}${req.headers.usertype === 'root' ? '' : 's'}`
            const mongooseRes = await $db[userType].updateOne({ _id: req.headers.userid }, req.body)
            // JWT token carries important information needed on the client side
            // so whenever user information is updated, it should be refreshed
            const token = await authHelpers.refreshToken(req.headers.userid)
            return res.json({ token, msg: `Successfully updated`, mongooseRes })
        } catch(err) {
            console.log(err)
            const msg = `Couldn't edit user information`
            console.log(msg)
            return res.json(msg)
        }
    }
)

router.get('/check-in', async(req, res) => {
    try {
        const userPackage = {}
        const user = await $db.users.findOneAndUpdate({ _id: req.headers.userid }, { lastLogin: new Date() })
        userPackage.lastLogin = user.lastLogin
        userPackage.notifications = await $db.notifications.find({ userID: req.headers.userid }).sort('-createdAt').limit(10).exec()
        userPackage.institution = await $db.institutions.findOne({ _id: req.headers.institutionid }).select(["-updatedAt", "-__v", "-settings"]).exec()
        return res.json(userPackage)
    } catch(err) {
        console.log(err)
        res.json(`Check-in failed`)
    }
})

router.put(
    '/notification',
    validationMiddleware.validateRequest(
        [
            validator.body("_id").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
            validator.body("seen").isBoolean().optional(),
            validator.body("actionPerformed").isBoolean().optional(),
            validator.body("meta").optional()
        ]
    ),
    async (req, res) => {
        try {
            const notification = await $db.notifications.findOne({ _id: req.body._id }).exec()
            if (notification.userID !== req.headers.userid)
                return res.status(403).json(`You're not allowed to edit this notification (id: ${req.body._id})`)
            const updated = await $db.notifications.findOneAndUpdate({_id: req.body._id }, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update notification`)
        }
    }
)

router.delete('/', async (req, res) => {
    try {
        const user = await $db.users.findOne({ _id: req.headers.userid }).exec()
        const notificationRes = await user.deleteNotifications()
        await db.models.users.deleteOne({ _id: user._id.toString() })
        return res.json({ msg: 'Successfully deleted account', notificationRes })
    } catch(err) {
        console.log(err)
        return res.json(`Couldn't delete account`)
    }
})

router.get('/pwa-subscription', async (req, res) => {
    try {
        const data = await $db.pwaSubscriptions.findOne({ userID: req.headers.userid }).select(["-subscriptions.browserSubscriptionDetails"]).exec()
        return res.json({ data: data ? data.subscriptions : [] })
    } catch(err) {
        console.log(err)
        return res.json({ data: [], msg: `There was an error retrieving your subscriptions. ${err}` })
    }
})

router.post('/pwa-subscription', async (req, res) => {
    try {
        let subscriptions = await $db.pwaSubscriptions.findOne({ userID: req.headers.userid }).exec()
        if (!subscriptions)
            subscriptions = await new $db.pwaSubscriptions({ userID: req.headers.userid, institutionID: req.headers.institutionid }).save()
        if (subscriptions.subscriptions.find(s => s.deviceId === req.headers.deviceid))
            return res.json({ msg: `This device is already subscribed to notifications` })
        const deviceInfo = {
            deviceId: req.headers.deviceid,
            deviceType: req.headers.devicetype,
            deviceBrand: req.headers.devicebrand,
            browserBrand: req.headers.browserbrand 
        }
        const newSubscriptionsArray = [...subscriptions.subscriptions, { ...deviceInfo, browserSubscriptionDetails: req.body, } ]
        const updated = await $db.pwaSubscriptions.findOneAndUpdate({ _id: subscriptions._id.toString() }, { subscriptions: newSubscriptionsArray }, { new: true })
        return res.json({ data: updated })
    } catch(err) {
        console.log(`Couldn't create subscription`, err)
        return res.json({ data: {}, msg: `Couldn't create subscription. ${err}` })
    }
})

router.put('/pwa-subscription', 
    validationMiddleware.validateRequest(
        [
            validator.body("status").isBoolean(),
            validator.body("deviceId").isString().isLength(global.APP_CONFIG.consts.mongooseIdLength)
        ]
    ),
    async (req, res) => {
        try {
            const data = await $db.pwaSubscriptions.findOneAndUpdate(
                { userID: req.headers.userid, "subscriptions.deviceId": req.body.deviceId },
                { $set: { "subscriptions.$.active": req.body.status } },
                { new: true }
            ).select(["-subscriptions.browserSubscriptionDetails"]) || { subscriptions: [] }
            return res.json({ data: data.subscriptions.find(s => s.deviceId === req.body.deviceId) || {} })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete subscription. ${err}` })
        }
})

module.exports = router