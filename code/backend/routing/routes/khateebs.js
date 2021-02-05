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
        res.status(_.hCodes.serverError)
        res.json(`Couldn't retrieve current schedule. This is probably a server error. Try again later.`)
    }
})

router.get('/announcements', async (req, res) => {
    try {
        const announcements = await $db.models.announcements.find({}).limit(10).sort('-createdAt').exec()
        res.json(announcements)
    } catch(err) {
        console.log(err)
        res.status(_.hCodes.serverError)
        res.json(`Couldn't retrieve announcements. This is probably a server error. Try again later.`)
    }
})

router.get('/jummah-confirm/:jummahID/:notificationID', async (req, res) => {
    try {
        const returnPackage = {}
        console.log(req.headers)
        const notification = await $db.models.notifications.findOne({ _id: req.params.notificationID, userID: req.params.userid }).exec()
        console.log(notification)
        if (!notification)
            return res.status(_.hCodes.unauthorized).json(`Incorrect user credentials`)
        returnPackage.notification = notification
        returnPackage.jummah = await $db.models.jummahs.findOne({ _id: req.params.jummahID }).exec()
        res.json(returnPackage)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get confirmation package`)
    }
})

module.exports = router