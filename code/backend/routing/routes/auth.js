const express = require('express')

const router = express.Router()

router.post('/create/institution', async (req, res) => {
    try {
        const institutionEntry = await new $db.models.institutions(req.body.institution).save()
        const institutionID = institutionEntry._id.toString()
        req.body.user.institutionID = institutionID
        const userEntry = await new $db.models.users(req.body.user).save()
        req.body.institutionAdmin.userID = userEntry._id.toString()
        req.body.institutionAdmin.institutionID = institutionID
        const institutionAdminEntry = await new $db.models.institutionAdmins(req.body.institutionAdmin).save()
        res.json(`Alhamdillah! ${institutionEntry.name} was created, with ${institutionAdminEntry.firstName} ${institutionAdminEntry.lastName} as it's administrator (username: ${userEntry.username}). Please wait a day or two for 'khateeb.com' to confirm your institution before logging in.`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`)
    }
})

router.post('/create/khateeb', async (req, res) => {
    try {
        const userEntry = await new $db.models.users(req.body.user).save()
        req.body.khateeb.userID = userEntry._id.toString()
        const khateebEntry = await new $db.models.khateebs(req.body.khateeb).save()
        res.json(`Asalam alaikoum ${khateebEntry.firstName} ${khateebEntry.lastName}, your account has been created (username: ${userEntry.username}). Please wait a day or two for the institution administrator to confirm your account.`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't create khateeb - this is probably a server issue. Please try again later`)
    }
})

router.post('/', async (req, res) => {
    try {
        const user = await $db.models.users.findOne({ username: req.body.username }).exec()
        let token
        if (!user || req.body.password !== user.password)
            token = user
        else if (user.password === 'password')
            token = 'default'
        else {
            const profile = await $db.models.profiles.findOne({ userID: user._id.toString() }).select(["-createdAt", "-updatedAt"])
            token = $utils.auth.createToken('60-days', profile.__t, profile)
        }
        res.json(token)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't sign in user - this probably a problem with the server. Please try again later`)
    }
})

module.exports = router