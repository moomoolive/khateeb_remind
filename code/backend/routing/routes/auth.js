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
        res.status($utils.hCodes.serverError)
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
        console.log(req.body)
        const institution = req.body.institutionID
        const settings = await $db.models.settings.find({ institutionID: institution }).exec()
        console.log(settings)
        if (settings.autoConfirmRegistration)
            req.body.confirmed = true
        const khateebEntry = await $db.funcs.save('khateebs', req.body)
        res.json(`Asalam alaikoum ${khateebEntry.firstName} ${khateebEntry.lastName}, your account has been created (username: ${khateebEntry.username}). Please wait a day or two for the institution administrator to confirm your account.`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
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
        console.log(req.body.password)
        console.log(validPassword)
        if (!validPassword) {
            res.status($utils.hCodes.unauthorized)
            response = {  msg: 'unauthorized', token: null }
        }
        else {
            if (!user.confirmed && user.__t !== 'root') {
                response = { msg: `un-confirmed-${user.__t}`, token: null }
            } else {
                const tokenInfo = $utils.general.deepCopy(user)
                delete tokenInfo.password; delete tokenInfo.confirmed; delete tokenInfo.__v;
                response = { msg: 'success', token: $utils.auth.createToken(tokenInfo) }
            }
        }
        res.json(response)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't sign in user - this probably a problem with the server. Please try again later`)
    }
})

module.exports = router