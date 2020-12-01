import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'

import dummyData from './dummyData.js'
import dummyAnnouncements from './dummyAnnouncements.js'

const app = express()

const PORT = process.env.PORT || 5_000

app.use(cors())
app.use(express.json())

app.post('/', (req, res) => {
    try {
        res.json(dummyData)
    }
    catch (err) {
        const intervalServerError = 500
        res.status(intervalServerError).send("Are servers aren't responding right now, try later...")
    }
})

app.post('/announcements', (req, res) => {
    try {
        res.json(dummyAnnouncements)
    }
    catch (err) {
        const intervalServerError = 500
        res.status(intervalServerError).send("Are servers aren't responding right now, try later...")
    }
})

app.post('/authenicate', (req, res) => {
    let key
    const KEY = 'password'
    const JWT_SECRET = 'secret'
    const unauthorized = 401
    try {
        key = req.body.key
    }
    catch {
        res.status(unauthorized).send("That isn't the correct secret code")
    }
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
        res.json({token: null, msg: 'Unauthorized'})
        res.status(unauthorized)
    }
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})