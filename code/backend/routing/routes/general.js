import express from 'express'
import jwt from 'jsonwebtoken'

import $dbModels from '../../database/models.js'
import $httpCodes from '../../utils/httpCodes.js'
import env from '../../app.js'
import $db from '../../database/funcs.js'
import $funcs from '../../utils/funcs.js'

const router = express.Router()

router.get('/', (req, res) => {
    const x = $funcs.findUpcomingFriday()
    const month = x.toLocaleString('default', { month: 'long' })
    const year = x.getFullYear()
    const scheduleFor = `${month}${year}`
    $dbModels.monthlySchedules.findOne({month : scheduleFor}, (err, schedule) => {
        if (err) console.log(err)
        else {
            if (schedule) { res.json(schedule) }
            else res.json("This month's schedule hasn't been created yet")
        }
    })
})

router.get('/announcements', (req, res) => {
    const maxDisplayedAnnouncements = 10
    const mostRecent = { _id: -1 }
    $dbModels.announcements.find({}, (err, announcements) => {
        if (err) console.log(err)
        else res.json(announcements)
    }).limit(maxDisplayedAnnouncements).sort(mostRecent)
})

router.post('/authenicate', async (req, res) => {
    const key = req.body.key
    const password = await $db.getPassword()
    console.log(password)
    if (password && key === password) {
        const secsPerMin = 60
            const minPerHour = 60
            const hourPerDay = 24
            const thirtyDays = 30 * secsPerMin * minPerHour * hourPerDay
            const repsonse = {
                token: jwt.sign({ user: 'admin' }, env.jwt, { expiresIn:  thirtyDays}),
                msg: "You've been successfully logged in!"
            }
            res.json(repsonse)
    } else {
        res.status($httpCodes.unauthorized)
        res.json({token: null, msg: 'Unauthorized'})
    }
})

export { router as general }