import express from 'express'
import jwt from 'jsonwebtoken'
import dbModels from '../database/models.js'
import httpCodes from '../utils/httpCodes.js'

const router = express.Router()

const columnData = ['Timing', 'Khateeb'] //hardcoded

router.get('/', (req, res) => {
    const x = new Date()
    const month = x.toLocaleString('default', { month: 'long' })
    const year = x.getFullYear()
    const scheduleFor = `${month}${year}`
    dbModels.monthlySchedules.findOne({month : scheduleFor}, (err, schedule) => {
        if (err) console.log(err)
        else {
            if (schedule) {
                const responseData = {
                    columnData,
                    rows: schedule.data
                }
                res.json(responseData)
            } else {
                res.json({ msg: "This month's schedule hasn't been created yet" })
            }
        }
    })
})

router.get('/announcements', (req, res) => {
    const maxDisplayedAnnouncements = 5
    const mostRecent = { _id: -1 }
    dbModels.announcements.find({}, (err, announcements) => {
        if (err) console.log(err)
        else res.json(announcements)
    }).limit(maxDisplayedAnnouncements).sort(mostRecent)
})

router.post('/authenicate', (req, res) => {
    const JWT_SECRET = 'secret' // >>should be put into db
    const KEY = 'password'
    try {
        const key = req.body.key
        if (key === KEY) {
            const secsPerMin = 60
            const minPerHour = 60
            const hourPerDay = 24
            const thirtyDays = 30 * secsPerMin * minPerHour * hourPerDay
            const repsonse = {
                token: jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn:  thirtyDays}),
                msg: "You've been successfully logged in!"
            }
            res.json(repsonse)
        } else {
            res.status(httpCodes.unauthorized)
            res.json({token: null, msg: 'Unauthorized'})
        }
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({token: null, msg: 'Unauthorized'})
    }
})

export { router as generalRoutes }