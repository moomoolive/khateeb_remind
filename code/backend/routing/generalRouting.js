import express from 'express'
import jwt from 'jsonwebtoken'

import dummyData from '../dummyData.js'
import dummyAnnouncements from '../dummyAnnouncements.js'

const router = express.Router()

const JWT_SECRET = 'secret'

router.post('/', (req, res) => {
    try {
        res.json(dummyData)
    }
    catch (err) {
        const intervalServerError = 500
        res.status(intervalServerError).send("Are servers aren't responding right now, try later...")
    }
})

router.post('/announcements', (req, res) => {
    try {
        res.json(dummyAnnouncements)
    }
    catch (err) {
        const intervalServerError = 500
        res.status(intervalServerError).send("Are servers aren't responding right now, try later...")
    }
})

router.post('/authenicate', (req, res) => {
    const KEY = 'password'
    const unauthorized = 401
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
            res.status(unauthorized)
            res.json({token: null, msg: 'Unauthorized'})
        }
    }
    catch {
        res.status(unauthorized).send("That isn't the correct secret code")
    }
})

export { router as generalRoutes }