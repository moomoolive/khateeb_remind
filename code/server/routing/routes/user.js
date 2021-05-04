const express = require('express')
const validator = require('express-validator')
const DeviceDetector = require('device-detector-js')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const authHelpers = require($rootDir + '/libraries/auth/main.js')
const requestValidationHelpers = require($rootDir + '/libraries/requestValidation/main.js')
const databaseHelpers = require($rootDir + '/database/helperFunctions/main.js')
const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')

const router = express.Router()
router.use(authMiddleware.authenticate({ min: 1 }))

router.put(
    '/', 
    validationMiddleware.validateRequest(
        [
            validator.body("password").isLength({ min: 6 }).isString().optional(),
            validator.body("username").isLength({ min: 6 }).isString().optional(),
            validator.body("handle").isLength({ min: 1 }).isString().optional(),
            validator.body("email").isEmail().optional(),
            validator.body("firstName").isLength({ min: 1 }).isString().optional(),
            validator.body("lastName").isLength({ min: 1 }).isString().optional(),
            validator.body("title").isLength({ min: 1 }).isString().optional(),
            validator.body("systemSettings.autoConfirmRegistration").isBoolean().optional(),
            validator.body("settings.recieveExternalNotification").isBoolean().optional(),
            validator.body("settings.recievePWAPush").isBoolean().optional(),
        ]
    ),
    async (req, res) => {
        try {
            // the reason why I use updateOne and then findOne instead of
            // findOneAndUpdate is because there are 'pre update' hooks for
            // the user schema that won't work with findOneAndUpdate
            await $db[req.headers.targetusermodel].updateOne({ _id: req.headers.userid }, req.body)
            const mongooseRes = await $db[req.headers.targetusermodel].findOne({ _id: req.headers.userid }).select(["-__v", "-password"]).exec()
            return res.json({ data: mongooseRes, msg: `Successfully updated`, mongooseRes })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: null, msg: `An error occured when updating profile. Err trace: ${err}` })
        }
    }
)

router.get('/authorizations', async (req, res) => {
    try {
        let data = await $db.users
            .findOneAndUpdate({ _id: req.headers.userid }, { lastLogin: new Date() })
            .populate({ 
                path: 'authorizations.authId',
                select: { __v: 0 },
                populate: {
                    path: 'institution',
                    select: {
                        settings: 0,
                        __v: 0
                    }
                }
            })
            .select(["-__v", "-statuses", "-password"])
            .exec()
        if (req.headers.specialStatus) {
            // special status is reserved for the root user
            // and any system administrators
            // rootInstitution isn't a real institution
            // it's just a static value that is passed to the frontend
            // so that the root admin and system administrators function
            // exactly like any normal user
            data = $utils.deepCopy(data)
            data.authorizations.push({
                _id: req.headers.specialStatus,
                confirmed: true,
                authId: {
                    _id: req.headers.specialStatus,
                    role: req.headers.specialStatus,
                    institution: $config.rootInstitution
                }
            })
        }
        return res.json({ data })
    } catch(err) {
        console.error(err)
        return res.status(503).json({ data: [], msg: `There was a problem retrieving authorizations ${err}` })
    }
})

router.get('/notifications', async (req, res) => {
    try {
        const data = await $db.notifications
            .find({ userID: req.headers.userid })
            .populate('institutionID')
            .sort('-createdAt')
            .limit(10)
            .exec()
        return res.json({ data })
    } catch(err) {
        console.error(err)
        return res.json({ data: [], msg: `Couldn't get notifications ${err}` })
    }
})

router.get('/check-in', async(req, res) => {
    try {
        const [userInfo, notifications, institution] = await Promise.all([
            $db.users.findOneAndUpdate({ _id: req.headers.userid }, { lastLogin: new Date() }).select(["-__v", "-password", "-statuses"]).exec(),
            $db.notifications.find({ userID: req.headers.userid }).sort('-createdAt').limit(10).exec(),
            // rootInstitution isn't a real institution
            // it's just a static value that is passed to the frontend
            // so that the root admin and system administrators function
            // exactly like any normal user 
            req.headers.institutionid === 'root' ? 
                Promise.resolve($config.rootInstitution) : 
                $db.institutions.findOne({ _id: req.headers.institutionid }).select(["-updatedAt", "-__v", "-settings"]).exec()
        ])
        return res.json({ userInfo, notifications, institution })
    } catch(err) {
        console.log(err)
        return res.status(503).json({ msg: `An error fetching user package. Err trace: ${err}` })
    }
})

router.post(
    '/upgrade-auth',
    validationMiddleware.validateRequest(
        [
            validator.body("authId").isString().custom(requestValidationHelpers.validInstitutionId),
            validator.body("role").isString().isLength({ min: 1 }),
            validator.body("institutionID").isString().custom(requestValidationHelpers.validInstitutionId)
        ]
    ),
    async (req, res) => {
        try {
            const user = await $db.users.findOne({ _id: req.headers.userid }).exec()
            const userHasRequestedAuthorization = user.authorizations
                .map(a => a.authId)
                .find(id => id.toString() === req.body.authId)
            if (!userHasRequestedAuthorization && !req.headers.specialStatus) {
                return res.status(403).json({ token: null })
            }
            const tokenInfo = {
                institutionID: req.body.institutionID,
                __t: req.headers.specialStatus || req.body.role,
                authId: req.headers.specialStatus || req.body.authId,
                _id: req.headers.userid,
            }
            if (req.headers.specialStatus) {
                tokenInfo.specialStatus = req.headers.specialStatus
            }
            return res.json({ token: authHelpers.createToken(tokenInfo) })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ token: null, msg: `Couldn't upgrade authorization ${err}` })
        }
    }
)

router.get('/downgrade-auth', async (req, res) => {
    try {
        const tokenInfo = { _id: req.headers.userid, __t: 'user' }
        if (req.headers.specialStatus) {
            tokenInfo.specialStatus = req.headers.specialStatus
        }
        return res.json({ token: authHelpers.createToken(tokenInfo) })
    } catch(err) {
        console.error(err)
        return res.status(503).json({ token: null, msg: `Couldn't downgrade authorization ${err}` })
    }
})

router.post(
    '/add-auth',
    validationMiddleware.validateRequest(
        [
            validator.body("institution").isLength($config.consts.mongooseIdLength).isString(),
            validator.body("role").isString().isLength({ min: 1 })
        ]
    ),
    async (req, res) => {
        try {
            const [authInfo, userInfo] = await Promise.all([
                $db.authorizations.findOne(req.body).populate('institution').exec(),
                $db.users.findOne({ _id: req.headers.userid }).exec()
            ])
            if (!authInfo || !userInfo)
                return res.status(422).json({ code: 2, msg: `Couldn't find requested authorization or user` })
            const authorizationAlreadyExists = userInfo.authorizations.find(a => a.authId === authInfo._id)
            if (authorizationAlreadyExists)
                return res.status(403).json({ code: 3, msg: `Illegal operation. Authorization already exists` })
            const autoConfirmPolicy = authInfo.institution.settings.autoConfirmRegistration
            const updateCommand = { 
                $push: { 
                    authorizations: { 
                        authId: authInfo._id, 
                        // system administrators can never be autoconfirmed
                        // only khateebs can be if administrator turns on that setting
                        confirmed: req.body.role !== 'khateeb' ? false : autoConfirmPolicy
                    } 
                } 
            }
            if (req.body.role === 'khateeb') {
                const scheduleRestriction = await new $db.userScheduleRestrictions({ 
                    user: req.headers.userid, 
                    institution: req.body.institution 
                }).save()
                updateCommand.$push.scheduleRestrictions = scheduleRestriction._id
                const note = new notificationConstructors.KhateebSignupNotificationConstructor(userInfo, autoConfirmPolicy)
                await note.setRecipentsToAdmins(authInfo.institution._id)
                note.create()
            }
            await $db.users.update({ _id: userInfo._id }, updateCommand)
            return res.json({ code: 0 })
        } catch(err) {
            console.log(err)
            return res.json(503).json({ code: 1, msg: `Couldn't add authorization ${err}` })
        }
    }
)

router.post(
    '/remove-auth',
    validationMiddleware.validateRequest(
        [
            validator.body("id").isLength($config.consts.mongooseIdLength).isString(),
            validator.body("institution").isLength($config.consts.mongooseIdLength).isString(),
            validator.body("role").isString().isLength({ min: 1 })
        ]
    ),
    async (req, res) => {
        try {
            const updateCommand = databaseHelpers.removeAuthorizationFromUserCommand(req.body.id)
            if (req.body.role === 'khateeb') {
                const scheduleRestrictionIds = await databaseHelpers.getUserScheduleRestrictionsAssociatedWithInstitution(
                    req.headers.userid,
                    req.body.institution
                )
                await $db.userScheduleRestrictions.deleteMany({ 
                    _id: { $in: scheduleRestrictionIds }
                })
                updateCommand.$pull.scheduleRestrictions = {
                    $in: scheduleRestrictionIds
                }
            }
            await $db.users.update({ _id: req.headers.userid }, updateCommand) 
            return res.json({ code: 0 })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ code: 1, msg: `Couldn't remove authorization ${err}` })
        }
    }
)

router.put(
    '/notification',
    validationMiddleware.validateRequest(
        [
            validator.body("_id").isLength($config.consts.mongooseIdLength).isString(),
            validator.body("seen").isBoolean().optional(),
            validator.body("actionPerformed").isBoolean().optional(),
            validator.body("meta").optional()
        ]
    ),
    async (req, res) => {
        try {
            const notification = await $db.notifications.findOne({ _id: req.body._id }).exec()
            if (notification.userID.toString() !== req.headers.userid)
                return res.status(403).json({ msg: `You're not allowed to edit this notification (id: ${req.body._id})` })
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
        const user = await $db[req.headers.targetusermodel].findOne({ _id: req.headers.userid }).exec()
        const notificationRes = await user.deleteNotifications()
        const userRes = await $db[req.headers.targetusermodel].deleteOne({ _id: user._id.toString() })
        return res.json({ userRes, notificationRes })
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
            subscriptions = await new $db.pwaSubscriptions({ userID: req.headers.userid }).save()
        if (subscriptions.subscriptions.find(s => s.deviceId === req.headers.deviceid))
            return res.json({ code: 0, msg: `This device is already subscribed to notifications` })
        const deviceIdentification = new DeviceDetector().parse(req.headers["user-agent"])
        const deviceInfo = {
            deviceId: req.headers.deviceid,
            deviceType: deviceIdentification.device.type,
            deviceBrand: deviceIdentification.device.brand || 'unknown',
            browserBrand: deviceIdentification.client.type === 'browser' ? deviceIdentification.client.name : "unknown"
        }
        const newSubscriptionsArray = [...subscriptions.subscriptions, { ...deviceInfo, browserSubscriptionDetails: req.body, } ]
        await $db.pwaSubscriptions.updateOne({ _id: subscriptions._id.toString() }, { subscriptions: newSubscriptionsArray })
        return res.json({ code: 0 })
    } catch(err) {
        console.log(`Couldn't create subscription`, err)
        return res.json({ code: 1, msg: `Couldn't create subscription. ${err}` })
    }
})

router.put('/pwa-subscription', 
    validationMiddleware.validateRequest(
        [
            validator.body("status").isBoolean(),
            validator.body("deviceId").isString().isLength($config.consts.mongooseIdLength)
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

router.get('/schedule-restrictions', async (req, res) => {
    try {
        const data = await $db.userScheduleRestrictions
            .findOne({
                institution: req.headers.institutionid,
                user: req.headers.userid
            })
            .exec()
        return res.json({ data })
    } catch(err) {
        console.error(err)
        return res.status(503).json({ data: { availableTimings: [], unavailableDates: [] }, msg: `Couldn't fetch schedule restrictions ${err}` })
    }
})

router.put(
    '/schedule-restrictions', 
    validationMiddleware.validateRequest(
        [
            validator.body("availableTimings").isArray().optional(),
            validator.body("unavailableDates").isArray().optional(),
        ]
    ),
    async (req, res) => {
        try {
            const data = await $db.userScheduleRestrictions
                .findOneAndUpdate(
                    { user: req.headers.userid, institution: req.headers.institutionid },
                    req.body,
                    { new: true }
                )
                .exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: null, msg: `An error occured when updating profile. Err trace: ${err}` })
        }
    }
)

module.exports = router