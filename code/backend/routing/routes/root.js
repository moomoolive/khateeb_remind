const express = require('express')

const middleware = require($DIR + "/middleware/main.js")
const requestTypeChecks = require("./rootTC.json")

const router = express.Router()

router.use(middleware.auth(4))

router.post('/sysAdmin/create',
    middleware.allowedFields(requestTypeChecks.createSysAdmin),
    async (req, res) => {
    try {
        req.body.institutionID = "__SYS-ADMIN__"
        req.body.confirmed = true
        req.body.isDefault = true
        const sysAdminEntry = await $db.funcs.save('sysAdmins', req.body)
        res.json(`System administrator ${sysAdminEntry.firstName} ${sysAdminEntry.lastName}, has been created (username: ${sysAdminEntry.username}).`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't create system Administrator - this is probably a server issue. Please try again later`)
    }
})

router.post('/user/username', 
    middleware.allowedFields(requestTypeChecks.userUsername),
    async (req, res) => {
    try {
        const userEntry = await $db.models.root.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user/password', 
    middleware.allowedFields(requestTypeChecks.userPassword),
    async (req, res) => {
    try {
        const userEntry = await $db.models.root.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user/profile', async (req, res) => {
    try {
        const updated = await $db.models.root.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully updated user profile!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user profile`)
    }
})


module.exports = router