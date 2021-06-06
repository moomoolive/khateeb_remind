const express = require('express')
const validator = require('express-validator')

const validationMiddleware = require($rootDir + '/middleware/validation/main.js')
const authMiddleware = require($rootDir + '/middleware/auth/main.js')

const authHelpers = require($rootDir + '/libraries/auth/main.js')
const externalNotificationHelpers = require($rootDir + '/libraries/externalNotifications/main.js')

const { 
    institutions, 
    verificationCodes, 
    authorizations,
    users 
} = require($rootDir + "/database/public.js")

const router = express.Router()

router.post(
    '/create/institution',
    authMiddleware.authenticate({ min: 1 }),
    validationMiddleware.validateRequest(
        [
            validator.body("name").isLength({ min: 1 }).isString(),
            validator.body("abbreviatedName").isLength({ min: 1 }).isString(),
            validator.body("timezone").isLength({ min: 1 }).isString(),
            validator.body("country").isLength({ min: 1 }).isString(),
            validator.body("state").isLength({ min: 1 }).isString().optional(),
        ]
    ), 
    async (req, res) => {
    try {
        if (req.body.name === 'test')
            return res.json({ msg: `You cannot name your institution 'test'. Pick another name please.`, code: 2 })
        const rootUser = await $db.root.findOne({}).exec()
        const autoConfirm = rootUser.systemSettings.autoConfirmInstitutionRegistration 
        const institutionEntry = await institutions.createEntry({
            entry: { ...req.body, confirmed: autoConfirm }
        })
        const institutionAuthorizations = await authorizations.query({ filter: { institution: institutionEntry._id } })
        const authorizationId = institutionAuthorizations.find(a => a.role === 'rootInstitutionAdmin')._id
        await users.addAuthorizationKey(req.headers.userid, authorizationId, autoConfirm)
        return res.json({ 
            code: 0, 
            msg: `Alhamdillah! ${institutionEntry.name} was created.${ autoConfirm ? ' You can now start setting schedules.' : ' Please wait a day or two for Khateeb Remind to confirm your institution before logging in.' }`
        })
    } catch(err) {
        console.error(err)
        return res.status(503).json({ msg: `Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`, code: 1, err })
    }
    }
)


router.post(
    '/create/user',
    validationMiddleware.validateRequest(
        [
            validator.body("password").isLength({ min: 6 }).isString(),
            validator.body("username").isLength({ min: 6 }).isString(),
            validator.body("handle").isLength({ min: 1 }).isString(),
            validator.body("firstName").isLength({ min: 1 }).isString(),
            validator.body("lastName").isLength({ min: 1 }).isString(),
            validator.body("title").isLength({ min: 1 }).isString(),
            validator.body("email").isEmail()
        ]
    ),
    async (req, res) => {
        try {
            const root = await $db.root.findOne({}).exec()
            if (!root)
                return res.status(422).json({ msg: `An error occured`, code: 2 })
            if (!root.systemSettings.autoConfirmUserRegistration)
                return res.json({ msg: `Unfortunately user registration is currently offline`, code: 3 })
            const userEntry = await users.createEntry({ entry: req.body })
            return res.json({ 
                code: 0, 
                msg: `Asalam alaikoum ${userEntry.firstName}, your account has been created (username: ${userEntry.username}). Please login to start using Khateeb Remind.`
            })
    } catch(err) {
        console.error(err)
        return res.status(503).json({ msg: `Couldn't create khateeb - this is probably a server issue. Please try again later`, code: 1, err })
    }
})

router.post(
    '/',
    validationMiddleware.validateRequest(
        [
            validator.body("password").isLength({ min: 1 }).isString(),
            validator.body("username").isLength({ min: 1 }).isString(),
        ]
    ),
    async (req, res) => {
        try {
            const user = await users.findEntry({
                filter: { username: req.body.username, active: true },
                dataShape: ["-__v"]
            })
            if (!user) {
                return res.status(401).json({  msg: 'unauthorized', token: null })
            }
            validPassword = await user.comparePassword(req.body.password)
            if (!validPassword) {
                return res.status(401).json({  msg: 'unauthorized', token: null })
            }
            const tokenInfo = { _id: user._id, __t: 'user' }
            if (user.__t) {
                tokenInfo.specialStatus = user.__t
            }
            return res.json({ msg: 'success', token: authHelpers.createToken(tokenInfo) })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ msg: `There was an issue encountered during authentication ${err}`, token: null })
        }
})

router.post(
    '/forgot/username',
    validationMiddleware.validateRequest(
        [
            validator.body("email").isEmail().isString()
        ]
    ),
    async (req, res) => {
        try {
            const accounts = await users.query({ filter: req.body })
            if (accounts.length > 0) {
                const accountsString = accounts
                    .map(a => a.username)
                    .reduce((total, a) => `${total}\n- ${a.username}`)
                await externalNotificationHelpers.sendExternalNotification(
                    req.body.email, 
                    `Khateeb Remind Username Recovery`, 
                    `You're recieving this message because you requested help recovering your username.\n\nAccounts under this email:\n- ${accountsString}`
                )
            }
            return res.json({ msg: `If ${req.body.email} is the system, it should be recieving a email shortly insha'Allah. Make sure to check all your inboxes, including spam.`, code: 0 })
        } catch(err) {
            console.error(err)
            return res.staus(503).json({ msg: `An error occured when sending verification text! Try again later`, code: 1, err })
        }
    }
)

router.post(
    '/forgot/password',
    validationMiddleware.validateRequest(
        [
            validator.body("username").isString().isLength({ min: 1 })
        ]
    ),
    async (req, res) => {
        try {
            const account = await users.findEntry({ filter: req.body })
            if (account) {
                const verificationCode = await verificationCodes.createEntry({ username: account.username })
                await externalNotificationHelpers.sendExternalNotification(
                    account.email, 
                    `Khateeb Remind Password Recovery`, 
                    `You're recieving this message because you requested help recovering your password.\n\nThis code will be invalid after 15 minutes insha'Allah. Your code is:\n\n${verificationCode.code}`
                )
            }
            return res.json({ code: 0, msg: `If ${req.body.username} is in the Khateeb Remind database, then ${req.body.username}'s will be recieving an email with a verification code in the next few minutes insha'Allah. Make sure to check all inboxes, including spam.` })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ code: 1, msg: `Something went wrong when sending verification code.`, err })
        }
    }
)

router.put(
    '/verification-code', 
    validationMiddleware.validateRequest(
        [
            validator.body("code").isLength({ min: 1 }),
            validator.body("username").isLength({ min: 1 }).isString(),
            validator.body("newPassword").isLength({ min: 6 }).isString()
        ]
    ),
    async (req, res) => {
        try {
            const verificationCode = await verificationCodes.findEntry({ code: req.body.code })
            if (!verificationCode || verificationCode.username !== req.body.username) {
                return res.json({ msg: "Incorrect code", code: 2 })
            }
            await users.updateEntry({
                filter: { username: req.body.username }, 
                updates: { password: req.body.newPassword }
            })
            return res.json({ msg: "Password successfully updated", code: 0 })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ msg: `Couldn't verify code`, code: 1, err })
        }
})

router.post(
    '/delegate-permissions',
    authMiddleware.authenticate({ level: 4 }),
    validationMiddleware.validateRequest(
        [
            validator.body("targetUserId").isLength($config.consts.mongooseIdLength).isString(),
        ]
    ),
    async (req, res) => {
        try {
            const [targetUser] = await users.query({
                filter: { _id: req.body.targetUserId },
                populate: "authorizations.authId"
            })
            const isUserInRequestingInstitution = targetUser.authorizations.find(a => {
                return a.confirmed && a.authId.institution.toString() === req.headers.institutionid
            })
            if (!targetUser || !isUserInRequestingInstitution) {
                return res.status(403).json({ code: 2, msg: `Cannot add permissions to user` })
            }
            const institutionAuthorizations = await authorizations.query({ filter: { institution: req.headers.institutionid } })
            const delegationResponse = await users.delegateRootInstitutionAdminAuthorization(
                req.body.targetUserId,
                req.headers.userid,
                institutionAuthorizations
            )
            return res.json({ code: 0, msg: `Permissions successfully delegated`, delegationResponse })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ code: 1, msg: `An error occured when delgating authorization ${err}` })
        }
    }
)

module.exports = router