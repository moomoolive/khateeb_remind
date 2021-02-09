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
        const unwantedFields = ['-createdAt', '-updatedAt', '-__v']
        const notification = await $db.models.notifications.findOne({ _id: req.params.notificationID }).select(unwantedFields).exec()
        if (!notification || req.headers.userid !== notification.userID)
            return res.json(`non-existent`)
        returnPackage.notification = notification
        returnPackage.jummah = await $db.models.jummahs.findOne({ _id: req.params.jummahID }).select(unwantedFields).exec()
        returnPackage.location = await $db.models.locations.findOne({ _id: returnPackage.jummah.locationID }).exec()
        returnPackage.timing = await $db.models.timings.findOne({ _id: returnPackage.jummah.timingID }).exec()
        res.json(returnPackage)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get confirmation package`)
    }
})

router.post('/jummah-confirm', async (req, res) => {
    try {
        const savedJummah = await $db.models.jummahs.updateOne({ _id: req.body.jummah._id }, req.body.jummah)
        const savedNotification = await $db.models.actionNotifications.updateOne({ _id: req.body.notification._id }, req.body.notification)
        if (req.body.preferenceIndicator === 0 && !req.body.jummah.confirmed) {
            const addDropout = await $db.models.khateebs.findOneAndUpdate({ _id: req.headers.userid }, { $inc: { dropouts: 1 } })
            const note = new _.notifications.jummahDropout(addDropout)
            await note.setRecipentsToAdmins(req.body.institutionid)
            const msgs = await note.create()
        }
        res.json('Updated Notification and Associated Jummah')
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update notification status!`)
    }
})

module.exports = router