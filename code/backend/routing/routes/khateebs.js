const express = require('express')

const middleware = require($DIR + '/middleware/main.js')
const requestTypeChecks = require('./khateebsTC.json')

const router = express.Router()

router.use(middleware.auth(1))

router.get('/', async (req, res) => {
    try {
        const date = new Date()
        const params = {
            month: date.getMonth(),
            year: date.getFullYear(), 
            institutionID: req.headers.institutionid 
        }
        const currentSchedule = await $db.models.jummahs.findOne(params).exec()
        if (!currentSchedule)
            res.json("This month's schedule hasn't been created yet") 
        else
            res.json(currentSchedule)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't retrieve current schedule. This is probably a server error. Try again later.`)
    }
})

router.get('/announcements', async (req, res) => {
    try {
        const mostRecent = { _id: -1 }
        const announcements = await $db.models.announcements.find({}).limit(10).sort(mostRecent).exec()
        res.json(announcements)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't retrieve announcements. This is probably a server error. Try again later.`)
    }
})

router.post('/user-info', 
    middleware.allowedFields(requestTypeChecks.userInfo),
    async (req, res) => {
    try {
        const userEntry = await $db.models.users.updateOne({ _id: req.headers.userid }, req.body).exec()
        console.log(userEntry)
        res.json(`Successfully updated user information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user-profile', async (req, res) => {
    try {
        const updateObj = {}
        for (let [profileField, value] of Object.entries(req.body)) {
            updateObj["profile." + profileField] = value
        }
        const updated = await $db.models.users.updateOne({ _id: req.headers.userid }, updateObj)
        res.json(`Successfully updated user profile!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user profile`)
    }
})

module.exports = router