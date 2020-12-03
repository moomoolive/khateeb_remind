import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../index.js'
import schemas from '../databaseSchemas/index.js'
import httpCodes from '../utils/httpCodes.js'

const router = express.Router()

const JWT_SECRET = 'secret' // >>should be put into db
const columnData = ['Timing', 'Khateeb'] //hardcoded

router.post('/', (req, res) => {
    try {
        const scheduleFor = req.body.date
        const monthlySchedule = db.model('monthlySchedule', schemas.scheduleEntry)
        monthlySchedule.findOne({month : scheduleFor}, (err, schedule) => {
            if (err) console.log(err)
            else {
                const responseData = {
                    columnData,
                    rows: schedule.data
                }
                res.json(responseData)
            }
        })
    }
    catch (err) {
        res.status(httpCodes.serverError)
        res.json("Are servers aren't responding right now, try later...")
    }
})

router.post('/announcements', (req, res) => {
    try {
        const maxDisplayedAnnouncements = 5
        const mostRecent = { _id: -1 }
        const announcement = db.model('announcement', schemas.announcement)
        announcement.find({}, {_id: false, __v: false}, (err, announcements) => {
            if (err) {
                console.log(err)
            } else {
                res.json(announcements)
            }
        }).limit(maxDisplayedAnnouncements).sort(mostRecent)
    }
    catch (err) {
        res.status(httpCodes.serverError).send("Are servers aren't responding right now, try later...")
    }
})

router.post('/authenicate', (req, res) => {
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