const express = require('express')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.get('/', async (req, res) => {
    const currentScheduleKey = $utils.schedule.currentScheduleKey()
    const currentSchedule = await $utils.schedule.fetchSchedule(currentScheduleKey)
    if (!currentSchedule) {
        res.json("This month's schedule hasn't been created yet")
    } else res.json(currentSchedule)
})

router.get('/announcements', (req, res) => {
    const maxDisplayedAnnouncements = 10
    const mostRecent = { _id: -1 }
    $db.models.announcements.find({}, (err, announcements) => {
        if (err) console.log(err)
        else res.json(announcements)
    }).limit(maxDisplayedAnnouncements).sort(mostRecent)
})

router.post('/authenicate', middleware.validationCheck(['key']), async (req, res) => {
    const key = req.body.key
    try {
        const password = await $db.funcs.getPassword()
        if (password && key === password) {
            const token = $utils.auth.createToken()
            const repsonse = {
                token,
                msg: "You've been successfully logged in!"
            }
            res.json(repsonse)
        } else {
            res.status($utils.hCodes.unauthorized)
            res.json({token: null, msg: 'Unauthorized'})
        }
    } catch(err) {
        console.log(err)
        res.json('A problem occurred while authenticating')
    }
})

module.exports = router