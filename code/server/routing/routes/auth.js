const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.post(
    '/create/institution',
    middleware.validateRequest(
        [
            validator.body("institution.name").isLength({ min: 1 }),
            validator.body("institution.abbreviatedName").isLength({ min: 1 }),
            validator.body("institution.timezone").isLength({ min: 1 }),
            validator.body("institution.country").isLength({ min: 1 }),
            validator.body("institution.state").isLength({ min: 1 }).optional(),
            validator.body("institutionAdmin.password").isLength({ min: 6 }),
            validator.body("institutionAdmin.username").isLength({ min: 6 }),
            validator.body("institutionAdmin.handle").isLength({ min: 1 }),
            validator.body("institutionAdmin.firstName").isLength({ min: 1 }),
            validator.body("institutionAdmin.lastName").isLength({ min: 1 }),
            validator.body("institutionAdmin.phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }),
        ]
    ), 
    async (req, res) => {
    try {
        if (req.body.institution.name === '__TEST__')
            return res.json({ msg: `You cannot name your institution __TEST__. Pick another name please.`, status: "reserved" })
        const institutionEntry = await $db.funcs.save('institutions', req.body.institution)
        req.body.institutionAdmin.institutionID = institutionEntry._id.toString()
        const rootInstitutionAdminEntry = await $db.funcs.save('rootInstitutionAdmins', req.body.institutionAdmin)
        return res.json(`Alhamdillah! ${institutionEntry.name} was created, with ${rootInstitutionAdminEntry.firstName} ${rootInstitutionAdminEntry.lastName} as it's administrator (username: ${rootInstitutionAdminEntry.username}). Please wait a day or two for Khateeb Remind to confirm your institution before logging in.`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`)
    }
    }
)


router.post(
    '/create/khateeb',
    middleware.validateRequest(
        [
            validator.body("institutionID").isLength(20),
            validator.body("password").isLength({ min: 6 }),
            validator.body("username").isLength({ min: 6 }),
            validator.body("handle").isLength({ min: 1 }),
            validator.body("firstName").isLength({ min: 1 }),
            validator.body("lastName").isLength({ min: 1 }),
            validator.body("phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }),
            validator.body("title").isLength({ min: 1 })
        ]
    ),
    async (req, res) => {
        try {
            const institution = req.body.institutionID
            const settings = await $db.models.settings.findOne({ institutionID: institution }).exec()
            if (!settings)
                return res.json(`That institution doesn't exist!`)
            if (settings.autoConfirmRegistration)
                req.body.confirmed = true
            else
                req.body.confirmed = false
            const khateebEntry = await $db.funcs.save('khateebs', req.body)
            if (settings.autoConfirmRegistration) {
                const welcomeMsg = new _.notifications.welcome(khateebEntry)
                const saved = await welcomeMsg.create()
            }
            const note = new _.notifications.khateebSignup(khateebEntry, settings.autoConfirmRegistration)
            await note.setRecipentsToAdmins(institution)
            const msgs = await note.create()
            return res.json(`Asalam alaikoum ${khateebEntry.firstName}, your account has been created (username: ${khateebEntry.username}).${ settings.autoConfirmRegistration ? '' : ' Please wait a day or two for the institution administrator to confirm your account.'}`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't create khateeb - this is probably a server issue. Please try again later`)
    }
})

router.post(
    '/',
    middleware.validateRequest(
        [
            validator.body("password").isLength({ min: 1 }),
            validator.body("username").isLength({ min: 1 }),
        ]
    ),
    async (req, res) => {
        try {
            const user = await $db.models.users.findOne({ username: req.body.username }).select(["-__v"]).exec()
            if (!user)
                return res.status(401).json({  msg: 'unauthorized', token: null })
            validPassword = await user.comparePassword(req.body.password)
            if (!validPassword)
                return res.status(401).json({  msg: 'unauthorized', token: null })
            else if (!user.confirmed && user.__t !== 'root')
                return res.json({ msg: `un-confirmed-${user.__t}`, token: null })
            else {
                const tokenInfo = _.deepCopy(user)
                delete tokenInfo.password
                return res.json({ msg: 'success', token: _.auth.createToken(tokenInfo) }) 
            }
        } catch(err) {
            console.log(err)
            res.json(`Couldn't sign in user - this probably a problem with the server. Please try again later`)
        }
})

router.post(
    '/forgot/:type', 
    middleware.validateRequest(
        [
            validator.body("data").isLength({ min: 1 }),
        ]
    ),
    async (req, res) => {
        try {
            if (req.params.type !== 'username' && req.params.type !== 'password')
                return res.json(`Invalid Recovery Option`)
            let khateebRemindTextInfo = await $db.models.settings.findOne({ institutionID: "__ROOT__" }).exec()
            if (!khateebRemindTextInfo.textAllowed)
                return res.json({ msg:`Account recovery service is offline right now`, status: 'error' })
            khateebRemindTextInfo = khateebRemindTextInfo.decrypt()
            const twilio = require('twilio')(khateebRemindTextInfo.twilioUser, khateebRemindTextInfo.twilioKey)
            let apiMsg
            let textMsg
            let to
            if (req.params.type === 'username') {
                to = `+1${req.body.data}`
                const results = await $db.models.users.find({ phoneNumber: req.body.data }).exec()
                textMsg = 'Accounts under this phone number:\n'
                results.forEach(account => { textMsg += `\n- ${account.username}` })
                apiMsg = `Your username(s) were sent to your recovery phone via text!`
            }
            else if (req.params.type === 'password') {
                const account = await $db.models.users.findOne({ username: req.body.data }).exec()
                if (!account)
                    return res.json({ msg: `That account doesn't exist`, status: "error" }) // security risk??
                to = `+1${account.phoneNumber}`
                const verificationCode = await new $db.models.verificationCodes({ userID: account._id.toString() }).save()
                textMsg = `You requested a password recovery code from Khateeb Remind. This code will be invalid after 15 minutes insha'Allah. Your code is:\n\n${verificationCode.code}`
                apiMsg = { msg: `A verification code was sent to your phone via text!`, status: "code", userID: account._id.toString()}
            }
            textMsg += `\n\nYou recieved this message because you requested help recovering your ${req.params.type}.\n\n🤖 Sent from Khateeb Remind Bot`
            await twilio.messages.create({
                to,
                from: khateebRemindTextInfo.twilioPhoneNumber,
                body: textMsg 
            })
            res.json(apiMsg)
        } catch(err) {
            console.log(err)
            res.json({msg: `Couldn't send verification method`, status: "error"})
        }
})

router.post(
    '/verification-code', 
    middleware.validateRequest(
        [
            validator.body("code").isLength({ min: 1 }),
            validator.body("userID").isLength(20),
            validator.body("password").isLength({ min: 6 }),
        ]
    ),
    async (req, res) => {
        try {
            const verificationCode = await $db.models.verificationCodes.findOne({ code: req.body.code }).exec()
            if (!verificationCode || verificationCode.userID !== req.body.userID)
                return res.json({ msg: "Incorrect code", status: "error" })
            const updated = await $db.models.users.updateOne({ _id: req.body.userID }, { password: req.body.password })
            res.json({ msg: "Password successfully updated", status: "success" })
        } catch(err) {
            console.log(err)
            res.json({ msg: `Couldn't verify code`, status: "error" })
        }
})

module.exports = router