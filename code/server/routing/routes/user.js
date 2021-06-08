const express = require('express')
const validator = require('express-validator')
const DeviceDetector = require('device-detector-js')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')
const scripts = require($rootDir + '/libraries/scripts/index.js')

const authHelpers = require($rootDir + '/libraries/auth/main.js')
const requestValidationHelpers = require($rootDir + '/libraries/requestValidation/main.js')
const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')

const { 
    notifications, 
    authorizations,
    pwaSubscriptions,
    userScheduleRestrictions,
    users
} = require($rootDir + "/database/public.js")

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
            validator.body("systemSettings.autoConfirmInstitutionRegistration").isBoolean().optional(),
            validator.body("systemSettings.autoConfirmUserRegistration").isBoolean().optional(),
            validator.body("settings.recieveExternalNotification").isBoolean().optional(),
            validator.body("settings.recievePWAPush").isBoolean().optional(),
        ],
        "body",
        { doNotParseObjectSyntax: true }
    ),
    async (req, res) => {
        try {
            const data = await users.updateProfile({
                filter: { _id: req.headers.userid },
                updates: req.body,
                targetModel: req.headers.targetusermodel,
                dataShape: ["-__v", "-password"]
            })
            return res.json({ data, msg: `Successfully updated` })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: null, msg: `An error occured when updating profile. Err trace: ${err}` })
        }
    }
)

router.get('/authorizations', async (req, res) => {
    try {
        let data = await users.findEntryRelatedAuthorizations(req.headers.userid)
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
        const [userNotifications, userInfo] = await Promise.all([
            notifications.query({
                filter: { userID: req.headers.userid },
                populate: { path: 'institutionID', select: { abbreviatedName: 1 } },
                sortBy: "-createdAt",
                limit: 20
            }),
            users.updateEntry({
                filter: { _id: req.headers.userid },
                updates: { lastLogin: new Date() }
            })
        ])
        return res.json({ data: { notifications: userNotifications, lastLogin: userInfo.lastLogin } })
    } catch(err) {
        console.error(err)
        return res.json({ data: { notifications: [], lastLogin: new Date() }, msg: `Couldn't get notifications ${err}` })
    }
})

router.post(
    '/upgrade-auth',
    validationMiddleware.validateRequest(
        [
            validator.body("authId").isString().custom(requestValidationHelpers.validInstitutionId),
            validator.body("role").isString().isLength({ min: 1 }),
            validator.body("institutionID").isString().custom(requestValidationHelpers.validInstitutionId),
            // this is used to distinguish better default institutions and special ones
            // like the test institution
            validator.body("institutionStatus").isString().isLength({ min: 1 })
        ]
    ),
    async (req, res) => {
        try {
            const user = await users.findEntry({ filter: { _id: req.headers.userid } })
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
            if (req.body.institutionStatus !== 'default') {
                tokenInfo.specialInstitution = req.body.institutionStatus
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
                authorizations.findEntry({ filter: req.body, populate: "institution" }),
                users.findEntry({ filter: { _id: req.headers.userid } })
            ])
            if (!authInfo || !userInfo) {
                return res.status(422).json({ code: 2, msg: `Couldn't find requested authorization or user` })
            }
            const authorizationAlreadyExists = userInfo.authorizations.find(a => a.authId === authInfo._id)
            if (authorizationAlreadyExists) {
                return res.status(403).json({ code: 3, msg: `Illegal operation. Authorization already exists` })
            }
            const autoConfirmPolicy = authInfo.institution.settings.autoConfirmRegistration
            let extraUpdates = {}
            if (req.body.role === 'khateeb') {
                const scheduleRestriction = await userScheduleRestrictions.createEntry({ 
                    entry: {
                        user: req.headers.userid, 
                        institution: req.body.institution 
                    }
                })
                extraUpdates = { 
                    ...extraUpdates, 
                    addScheduleRestriction: true,
                    scheduleRestrictionId: scheduleRestriction._id 
                }
                const note = new notificationConstructors.KhateebSignupNotificationConstructor(userInfo, autoConfirmPolicy, req.body.institution)
                await note.setRecipentsToAdmins(authInfo.institution._id)
                note.create()
            }
            await users.addAuthorization(
                userInfo._id,
                authInfo._id,
                req.body.role !== 'khateeb' ? false : autoConfirmPolicy,
                extraUpdates
            )
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
            let scheduleRestrictionIds = []
            if (req.body.role === 'khateeb') {
                scheduleRestrictionIds = await users.getUserScheduleRestrictionsAssociatedWithInstitution(
                    req.headers.userid,
                    req.body.institution
                )
                await userScheduleRestrictions.deleteAllEntriesWithAnyOfIds(scheduleRestrictionIds)
            }
            await users.removeAuthorization(
                req.headers.userid,
                req.body.id,
                { removeAssociatedSchedules: true, scheduleIds: scheduleRestrictionIds }
            )
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
            const targetNotification = await notifications.query({ filter: { _id: req.body._id } })
            const notification = targetNotification[0]
            if (notification.userID.toString() !== req.headers.userid) {
                return res.status(403).json({ msg: `You're not allowed to edit this notification (id: ${req.body._id})` })
            }
            const updated = await notifications.updateEntry({
                filter: {_id: req.body._id },
                updates: req.body,
                returnOptions: { new: true }
            })
            return res.json(updated)
        } catch(err) {
            console.error(err)
            return res.json(`Couldn't update notification`)
        }
    }
)

router.delete('/', async (req, res) => {
    try {
        const data = await users.deleteEntry({
            filter: { _id: req.headers.userid },
            targetModel: req.headers.targetusermodel,
            // postHook is only used for the deletion of the root admin
            // where after deletion it reinitializes the root admin
            // account, all other accounts do not actually execute
            // this hook
            postHook: () => {
                const threeSecondsInMilliseconds = 3_000
                global.setTimeout(async () => {
                    try {
                        await scripts.createRootUser()
                    } catch(err) {
                        console.error(err)
                    }
                }, threeSecondsInMilliseconds)
            }
        })
        return res.json({ data })
    } catch(err) {
        console.error(err)
        return res.json({ data: {}, msg: `Couldn't delete user account ${err}` })
    }
})

router.get('/pwa-subscription', async (req, res) => {
    try {
        const data = await pwaSubscriptions.query({
            filter: { userID: req.headers.userid },
            dataShape: ["-subscriptions.browserSubscriptionDetails"]
        })
        return res.json({ data: data ? data.subscriptions : [] })
    } catch(err) {
        console.error(err)
        return res.json({ data: [], msg: `There was an error retrieving your subscriptions. ${err}` })
    }
})

router.post('/pwa-subscription', async (req, res) => {
    try {
        let subscriptions = await pwaSubscriptions.query({ filter: { userID: req.headers.userid } })
        if (!subscriptions) {
            subscriptions = await pwaSubscriptions.createEntry({ entry: { userID: req.headers.userid } })
        }
        const subscriptionExists = subscriptions.subscriptions.find(s => s.deviceId === req.headers.deviceid)
        if (subscriptionExists) {
            return res.json({ code: 0, msg: `This device is already subscribed to notifications` })
        }
        const deviceIdentification = new DeviceDetector().parse(req.headers["user-agent"])
        const deviceInfo = {
            deviceId: req.headers.deviceid,
            deviceType: deviceIdentification.device.type,
            deviceBrand: deviceIdentification.device.brand || 'unknown',
            browserBrand: deviceIdentification.client.type === 'browser' ? deviceIdentification.client.name : "unknown"
        }
        const newSubscriptionsArray = [...subscriptions.subscriptions, { ...deviceInfo, browserSubscriptionDetails: req.body, } ]
        await pwaSubscriptions.updateEntry({
            filter: { _id: subscriptions._id },
            updates: { subscriptions: newSubscriptionsArray }
        })
        return res.json({ code: 0 })
    } catch(err) {
        console.error(`Couldn't create subscription`, err)
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
            const data = await pwaSubscriptions.updateSubscriptionStatus({
                userId: req.headers.userid,
                deviceId: req.body.deviceId,
                subscriptionStatus: req.body.status
            }) || { subscriptions: [] }
            return res.json({ data: data.subscriptions.find(s => s.deviceId === req.body.deviceId) || {} })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete subscription. ${err}` })
        }
})

router.get('/schedule-restrictions', async (req, res) => {
    try {
        const data = await userScheduleRestrictions.findEntry({
            filter: {
                institution: req.headers.institutionid,
                user: req.headers.userid
            }
        })
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
            const data = await userScheduleRestrictions.updateEntry({
                filter: { user: req.headers.userid, institution: req.headers.institutionid },
                updates: req.body,
                returnOptions: { new: true }
            })
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: null, msg: `An error occured when updating profile. Err trace: ${err}` })
        }
    }
)

module.exports = router