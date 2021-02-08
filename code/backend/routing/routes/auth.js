const express = require('express')

const requestTypeChecks = require("./authTC.json")
const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.post('/create/institution',
    middleware.allowedFields(requestTypeChecks.createInstitution), 
    async (req, res) => {
    try {
        const institutionEntry = await $db.funcs.save('institutions', req.body.institution)
        req.body.institutionAdmin.institutionID = institutionEntry._id.toString()
        const rootInstitutionAdminEntry = await $db.funcs.save('rootInstitutionAdmins', req.body.institutionAdmin)
        res.json(`Alhamdillah! ${institutionEntry.name} was created, with ${rootInstitutionAdminEntry.firstName} ${rootInstitutionAdminEntry.lastName} as it's administrator (username: ${rootInstitutionAdminEntry.username}). Please wait a day or two for Khateeb Remind to confirm your institution before logging in.`)
    } catch(err) {
        console.log(err)
        res.status(_.hCodes.serverError)
        res.json(`Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`)
    }
    }
)

router.get('/institution-selection', async (req, res) => {
    try {
        const data = await $db.models.institutions.find({ confirmed: true }).select(["-createdAt", "-updatedAt"]).exec()
        res.json(data)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get institutions!`)
    }
})

router.post('/create/khateeb',
    middleware.allowedFields(requestTypeChecks.createKhateeb),
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
        res.json(`Asalam alaikoum ${khateebEntry.firstName}, your account has been created (username: ${khateebEntry.username}).${ settings.autoConfirmRegistration ? '' : ' Please wait a day or two for the institution administrator to confirm your account.'}`)
    } catch(err) {
        console.log(err)
        res.status(_.hCodes.serverError)
        res.json(`Couldn't create khateeb - this is probably a server issue. Please try again later`)
    }
})

// root --> user: "moomoo123" password: "password123"
// institutionAdmin ---> user: "moomoolive" password: "123456" institution: "Al-Salam Centre"
// khateeb ---> user: "gandgand" password: "123456" institution: "Al-Salam Centre"
// sysAdmin ---> user: "sysAdmin1" password: "123456"

router.post('/',
    [
        middleware.allowedFields(requestTypeChecks.login),
        middleware.userExists
    ],
    async (req, res) => {
    try {
        let response
        const user = req.__USER__
        validPassword = await user.comparePassword(req.body.password)
        if (!validPassword) {
            res.status(_.hCodes.unauthorized)
            response = {  msg: 'unauthorized', token: null }
        }
        else {
            if (!user.confirmed && user.__t !== 'root') {
                response = { msg: `un-confirmed-${user.__t}`, token: null }
            } else {
                const tokenInfo = _.deepCopy(user)
                delete tokenInfo.password; delete tokenInfo.confirmed; delete tokenInfo.__v;
                const updated = await $db.models.users.updateOne({ _id: user._id.toString() }, { lastLogin: new Date() })
                const notifications = await $db.models.notifications.find({ userID: user._id.toString() }).limit(10).exec()
                response = { msg: 'success', token: _.auth.createToken(tokenInfo), notifications }
            }
        }
        res.json(response)
    } catch(err) {
        console.log(err)
        res.status(_.hCodes.serverError)
        res.json(`Couldn't sign in user - this probably a problem with the server. Please try again later`)
    }
})

module.exports = router