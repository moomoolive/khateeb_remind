const express = require('express')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.use(middleware.auth(1))

router.get('/', async (req, res) => {
    try {
        const date = new Date()
        const month = date.getMonth()
        const year = date.getFullYear()
        const jummahs = await $db.models.jummahs.find({ institutionID: req.headers.institutionid }).monthlyEntries(year, month)
        if (!jummahs || jummahs.length < 1)
            return res.json("non-existent") 
        const data = await jummahs[0].gatherScheduleComponents()
        return res.json({ jummahs, ...data })
    } catch(err) {
        console.log(err)
        res.json(`Couldn't retrieve current schedule. This is probably a server error. Try again later.`)
    }
})

router.get('/announcements', async (req, res) => {
    try {
        const announcements = await $db.models.announcements.find({}).limit(10).sort('-createdAt').exec()
        res.json(announcements)
    } catch(err) {
        console.log(err)
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

router.post(
    '/jummah-confirm', 
    async (req, res) => {
        try {
            const savedJummah = await $db.models.jummahs.findOneAndUpdate({ _id: req.body.jummah._id }, req.body.jummah, { new: true })
            const savedNotification = await $db.models.actionNotifications.updateOne({ _id: req.body.notification._id }, req.body.notification)
            if (req.body.preferenceIndicator === 0 && !req.body.jummah.confirmed) {
                const addDropout = await $db.models.khateebs.findOneAndUpdate({ _id: req.headers.userid }, { $inc: { dropouts: 1 } })
                const note = new _.notifications.jummahDropout(addDropout)
                await note.setRecipentsToAdmins(req.body.institutionid)
                const msgs = await note.create(true, true)
            }
            else if (req.body.jummah.khateebPreference[req.body.preferenceIndicator].confirmed && req.body.jummah.confirmed) {
                const khateeb = await $db.models.khateebs.findOne({ _id: req.headers.userid }).exec()
                const note = new _.notifications.jummahDropout(khateeb, savedJummah)
                await note.setRecipentsToAdmins(req.body.institutionid)
                const msgs = await note.create(true, true)
            }
            return res.json('Updated Notification and Associated Jummah')
        } catch(err) {
            console.log(err)
            res.json(`Couldn't update notification status!`)
        }
})

router.get('/available-timings', async (req, res) => {
    try {
        const locations = await $db.models.locations.find({ institutionID: req.headers.institutionid, active: true }).exec()
        for (let i = 0; i < locations.length; i++) {
            const timings = await locations[i].findTimings({ active: true })
            locations[i] = _.deepCopy(locations[i])
            locations[i].timings = timings
        }
        const userInfo = await $db.models.users.findOne({ _id: req.headers.userid }).exec()
        res.json({ locations, availableTimings: userInfo.availableTimings })
    } catch(err) {
        console.log(err)
        res.json(`Couldn't fetch available timings`)
    }
})

module.exports = router