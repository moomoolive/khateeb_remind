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
        const currentSchedule = await $db.models.jummahs.find(params).exec()
        if (!currentSchedule)
            res.json("non-existent") 
        else {
            const locations = await $db.models.locations.find({ institutionID: req.headers.institutionid }).exec()
            const timings = await $db.models.timings.find({ institutionID: req.headers.institutionid }).exec()
            const khateebs = await $db.models.khateebs.find({ institutionID: req.headers.institutionid }).select(['-password', '-username']).exec()
            const data = {
                jummahs: currentSchedule,
                locations,
                timings,
                khateebs
            }
            res.json(data)
        }
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

router.post('/user/username', 
    middleware.allowedFields(requestTypeChecks.userUsername),
    async (req, res) => {
    try {
        const userEntry = await $db.models.khateebs.updateOne({ _id: req.headers.userid }, req.body)
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
        const userEntry = await $db.models.khateebs.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user/profile', async (req, res) => {
    try {
        const updated = await $db.models.khateebs.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully updated user profile!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user profile`)
    }
})

module.exports = router