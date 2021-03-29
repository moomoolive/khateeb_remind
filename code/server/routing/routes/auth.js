const express = require('express')
const validator = require('express-validator')

const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')
const authHelpers = require(global.$dir + '/libraries/auth/main.js')

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
            validator.body("institutionAdmin.phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }),
        ]
    ), 
    async (req, res) => {
    try {
        if (req.body.institution.name === '__TEST__' || req.body.institution.name === '__ROOT__')
            return res.json({ msg: `You cannot name your institution __TEST__ or __ROOT__. Pick another name please.`, status: "reserved" })
        const institutionEntry = await new $db.institutions(req.body.institution).save()
        const rootInstitutionAdminEntry = await institutionEntry.createRootAdministrator(req.body.institutionAdmin)
        return res.json(`Alhamdillah! ${institutionEntry.name} was created, with ${rootInstitutionAdminEntry.firstName} ${rootInstitutionAdminEntry.lastName} as it's administrator (username: ${rootInstitutionAdminEntry.username}). Please wait a day or two for Khateeb Remind to confirm your institution before logging in.`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`)
    }
    }
)


router.post(
    '/create/khateeb',
    validationMiddleware.validateRequest(
        [
            validator.body("institutionID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
            validator.body("password").isLength({ min: 6 }).isString(),
            validator.body("username").isLength({ min: 6 }).isString(),
            validator.body("handle").isLength({ min: 1 }).isString(),
            validator.body("firstName").isLength({ min: 1 }).isString(),
            validator.body("lastName").isLength({ min: 1 }).isString(),
            validator.body("phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }),
            validator.body("title").isLength({ min: 1 }).isString()
        ]
    ),
    async (req, res) => {
        try {
            const instituion = await $db.institutions.findOne({ _id: req.body.institutionID }).exec()
            if (!instituion)
                return res.json(`That institution doesn't exist!`)
            if (instituion.settings.autoConfirmRegistration)
                req.body.confirmed = true
            const khateebEntry = await new $db.khateebs(req.body).save()
            const note = new notificationConstructors.KhateebSignupNotificationConstructor(khateebEntry, instituion.settings.autoConfirmRegistration)
            await note.setRecipentsToAdmins(req.body.institutionID)
            await note.create()
            return res.json(`Asalam alaikoum ${khateebEntry.firstName}, your account has been created (username: ${khateebEntry.username}).${ settings.autoConfirmRegistration ? '' : ' Please wait a day or two for the institution administrator to confirm your account.'}`)
    } catch(err) {
        console.log(err)
        return res.json(`Couldn't create khateeb - this is probably a server issue. Please try again later`)
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
            else {
                const tokenInfo = global.utils.deepCopy(user)
                delete tokenInfo.password
                return res.json({ msg: 'success', token: authHelpers.createToken(tokenInfo) }) 
            }
        } catch(err) {
            console.log(err)
            res.json(`Couldn't sign in user - this probably a problem with the server. Please try again later`)
        }
})

router.post(
    '/forgot/password',
    validationMiddleware.validateRequest(
        [
            validator.body("username").isString().isLength({ min: 1 })
        ]
    ),
    async (req, res) => {
        try {
            if (!global.textManager.isTextServiceOnline())
                return res.json({ msg: `Account recovery is under maintenance right now! Try again later.`, status: "error" })
            const account = await $db.users.findOne(req.body).exec()
            if (account) {
                const verificationCode = await new $db.verificationCodes({ username: account.username }).save()
                await global.textManager.sendRecoveryText(
                    account.phoneNumber,
                    `This code will be invalid after 15 minutes insha'Allah. Your code is:\n\n${verificationCode.code}`,
                    "password"
                )
            }
            return res.json({ msg: `If ${req.body.username} is in the Khateeb Remind database, then ${req.body.username}'s associated phone number will be recieving a text with a verification code in the next few minutes insha'Allah`, status: 'okay' })
        } catch(err) {
            console.log(err)
            return res.json({msg: `Something went wrong when sending verification code`, status: "error"})
        }
    }
)

router.post(
    '/forgot/username',
    validationMiddleware.validateRequest(
        [
            validator.body("phoneNumber").isNumeric()
        ]
    ),
    async (req, res) => {
        try {
            if (!global.textManager.isTextServiceOnline())
                return res.json({ msg: `Account recovery is under maintenance right now! Try again later.`, status: "error" })
            const accounts = await $db.users.find(req.body).exec()
            if (accounts.length > 0) {
                const accountsString = accounts
                    .map(a => a.username)
                    .reduce((total, a) => `${total}\n- ${a.username}`)    
                await global.textManager.sendRecoveryText(
                    req.body.phoneNumber,
                    `Accounts under this phone number:\n- ${accountsString}`,
                    "username"
                )
            }
            return res.json({ msg: `If ${req.body.phoneNumber} is the system, it should be recieving a text shortly insha'Allah`, status: 'okay' })
        } catch(err) {
            console.log(err)
            return res.json({msg: `An error occured when sending verification text! Try again later`, status: "error"})
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
                return res.json({ msg: "Incorrect code", status: "error" })
            await $db.users.updateOne({ username: req.body.username }, { password: req.body.newPassword })
            return res.json({ msg: "Password successfully updated", status: "success" })
        } catch(err) {
            console.log(err)
            res.json({ msg: `Couldn't verify code`, status: "error" })
        }
})

module.exports = router