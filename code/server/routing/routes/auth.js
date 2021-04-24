const express = require('express')
const validator = require('express-validator')

const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')
const authHelpers = require($rootDir + '/libraries/auth/main.js')
const externalNotificationHelpers = require($rootDir + '/libraries/externalNotifications/main.js')

const router = express.Router()

router.post(
    '/create/institution',
    validationMiddleware.validateRequest(
        [
            validator.body("institution.name").isLength({ min: 1 }).isString(),
            validator.body("institution.abbreviatedName").isLength({ min: 1 }).isString(),
            validator.body("institution.timezone").isLength({ min: 1 }).isString(),
            validator.body("institution.country").isLength({ min: 1 }).isString(),
            validator.body("institution.state").isLength({ min: 1 }).isString().optional(),
            validator.body("institutionAdmin.password").isLength({ min: 6 }).isString(),
            validator.body("institutionAdmin.username").isLength({ min: 6 }).isString(),
            validator.body("institutionAdmin.handle").isLength({ min: 1 }).isString(),
            validator.body("institutionAdmin.firstName").isLength({ min: 1 }).isString(),
            validator.body("institutionAdmin.lastName").isLength({ min: 1 }).isString(),
            validator.body("institutionAdmin.email").isEmail()
        ]
    ), 
    async (req, res) => {
    try {
        if (req.body.institution.name === 'test')
            return res.json({ msg: `You cannot name your institution 'test'. Pick another name please.`, code: 2 })
        const rootUser = await $db.root.findOne({}).exec()
        const autoConfirm = rootUser.systemSettings.autoConfirmRegistration 
        const institutionEntry = await new $db.institutions({ ...req.body.institution, confirmed: autoConfirm }).save()
        const rootInstitutionAdminEntry = await institutionEntry.createRootAdministrator(req.body.institutionAdmin, autoConfirm)
        return res.json({ 
            code: 0, 
            msg: `Alhamdillah! ${institutionEntry.name} was created, with ${rootInstitutionAdminEntry.firstName} ${rootInstitutionAdminEntry.lastName} as it's administrator (username: ${rootInstitutionAdminEntry.username}).${ autoConfirm ? '' : ' Please wait a day or two for Khateeb Remind to confirm your institution before logging in.' }`
        })
    } catch(err) {
        console.error(err)
        return res.status(503).json({ msg: `Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`, code: 1, err })
    }
    }
)


router.post(
    '/create/khateeb',
    validationMiddleware.validateRequest(
        [
            validator.body("institutionID").isLength($config.consts.mongooseIdLength).isString(),
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
            const instituion = await $db.institutions.findOne({ _id: req.body.institutionID }).exec()
            if (!instituion)
                return res.status(422).json({ msg: `That institution doesn't exist!`, code: 2 })
            if (instituion.settings.autoConfirmRegistration)
                req.body.confirmed = true
            const khateebEntry = await new $db.khateebs(req.body).save()
            const note = new notificationConstructors.KhateebSignupNotificationConstructor(khateebEntry, instituion.settings.autoConfirmRegistration)
            await note.setRecipentsToAdmins(req.body.institutionID)
            await note.create()
            return res.json({ 
                code: 0, 
                msg: `Asalam alaikoum ${khateebEntry.firstName}, your account has been created (username: ${khateebEntry.username}).${instituion.settings.autoConfirmRegistration ? '' : ' Please wait a day or two for the institution administrator to confirm your account.'}`
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
            const user = await $db.users.findOne({ username: req.body.username }).select(["-__v"]).exec()
            if (!user)
                return res.status(401).json({  msg: 'unauthorized', token: null })
            validPassword = await user.comparePassword(req.body.password)
            if (!validPassword)
                return res.status(401).json({  msg: 'unauthorized', token: null })
            else if (!user.confirmed && user.__t !== 'root')
                return res.json({ msg: `un-confirmed-${user.__t}`, token: null })
            else
                return res.json({ 
                    msg: 'success', 
                    token: authHelpers.createToken({ 
                        _id: user._id, 
                        __t: user.__t, 
                        institutionID: user.institutionID  
                    })
                })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ msg: `There was an issue encountered during sign`, token: null })
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
            const accounts = await $db.users.find(req.body).exec()
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
            const account = await $db.users.findOne(req.body).exec()
            if (account) {
                const verificationCode = await new $db.verificationCodes({ username: account.username }).save()
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
            const verificationCode = await $db.verificationCodes.findOne({ code: req.body.code }).exec()
            if (!verificationCode || verificationCode.username !== req.body.username)
                return res.json({ msg: "Incorrect code", code: 2 })
            await $db.users.updateOne({ username: req.body.username }, { password: req.body.newPassword })
            return res.json({ msg: "Password successfully updated", code: 0 })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ msg: `Couldn't verify code`, code: 1, err })
        }
})

module.exports = router