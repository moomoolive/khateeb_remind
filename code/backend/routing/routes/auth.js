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
        const institutionAdminEntry = await $db.funcs.save('institutionAdmins', req.body.institutionAdmin)
        res.json(`Alhamdillah! ${institutionEntry.name} was created, with ${institutionAdminEntry.firstName} ${institutionAdminEntry.lastName} as it's administrator (username: ${institutionAdminEntry.username}). Please wait a day or two for 'khateeb.com' to confirm your institution before logging in.`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`)
    }
    }
)

router.post('/create/khateeb',
    middleware.allowedFields(requestTypeChecks.createKhateeb),
    async (req, res) => {
    try {
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
        if (!validPassword) {
            res.status($utils.hCodes.unauthorized)
            response = {  msg: 'unauthorized', token: null }
        }
        else if (user.isDefault)
            response = 'default'
        else {
            if (!user.confirmed && user.__t !== 'root') {
                response = { msg: `un-confirmed-${user.__t}`, token: null }
            } else {
                const tokenInfo = $utils.general.deepCopy(user)
                delete tokenInfo.password
                delete tokenInfo.isDefault 
                delete tokenInfo.confirmed
                response = { msg: 'success', token: $utils.auth.createToken('60-days', tokenInfo) }
            }
        }
        res.json(response)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't sign in user - this probably a problem with the server. Please try again later`)
    }
})

router.post('/create/root',
    middleware.allowedFields(requestTypeChecks.createRoot), 
    async (req, res) => {
    try {
        const rootExists = await $db.models.root.findOne({}).exec()
        if (!!rootExists)
            res.json('already exists')
        else {
            const apiKey = process.env.EMERGENCY_KEY || '1234'
            if (req.body.apiKey !== apiKey) {
                res.status($utils.hCodes.unauthorized)
                res.json('unauthorized')
            } else {
                req.body.user.confirmed = true
                req.body.user.institutionID = "__ROOT__"
                const rootEntry = await $db.funcs.save('root', req.body.user)
                res.json(`Successfully created root user with username: ${rootEntry.username}`)
            }
        }
    } catch(err) {
        console.log(err)
        res.json('There was an issue creating root user, check console output for errors')
    }
})

module.exports = router