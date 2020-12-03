import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../index.js'
import schemas from '../databaseSchemas/index.js'

const router = express.Router()

const JWT_SECRET = 'secret' // should be put into db

router.post('/new-announcement', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        if (!req.body.payload) {
            res.status(httpCodes.notAcceptable)
            res.json('No data was sent')
        } else {
            const announcement = db.model('announcement', schemas.announcement)
            const dateAbbreviated = req.body.payload.currentDate.month.slice(0, 3)
            const announcementX = new announcement({
                headline: req.body.payload.headline,
                content: req.body.payload.content,
                important: req.body.payload.important,
                urgent: req.body.payload.urgent,
                date: `${dateAbbreviated} ${req.body.payload.currentDate.date}, ${req.body.payload.currentDate.year}`
            })
            announcementX.save((err) => {
                if (err) console.log(err)
                else res.json(`Announcement "${announcementX.headline}" saved`)
            })
        }
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

const columnData = ['Timing', 'Khateeb'] //hardcoded

router.post('/scheduler', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        if (req.body.month) {
            const monthlySchedule = db.model('monthlySchedule', schemas.scheduleEntry)
            monthlySchedule.findOne({month : req.body.month}, (err, schedule) => {
                if (err) {
                    console.log(err)
                } else {
                    if (!schedule) {
                        res.json({ data: null, msg: "No data recorded for given month"})
                    } else {
                        const responseData = {
                            data: {
                                columnData: columnData,
                                rows: schedule.data
                            }
                        }
                        res.json({data: responseData, msg:'Data Found' })
                    }
                }
            })
        } else {
            res.status(httpCodes.notAcceptable)
            res.json({ data: null, msg: "You're missing required data for request!" })
        }
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

router.post('/update-schedule', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        if (!req.body.payload) {
            res.status(httpCodes.notAcceptable)
            res.json('No data was sent')
        } else {
            // should be written to update existing, and create new if not there
            // update version as well
            const monthName = req.body.payload.key
            const updatedSchedule = req.body.payload.updatedSchedule
            const originalSchedule = req.body.payload.originalSchedule // unused for now
            const monthlySchedule = db.model('monthlySchedule', schemas.scheduleEntry)
            const monthlyScheduleX = new monthlySchedule({
                month: monthName,
                data: updatedSchedule
            })
            monthlyScheduleX.save((err) => {
                if (err) console.log(err)
                else console.log(`Schedule for ${monthlyScheduleX.month} saved successfully!`)
            })
        }
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

router.post('/khateebs', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        const khateeb = db.model('khateeb', schemas.khateeb)
        khateeb.find({}, (err, khateebs) => {
            if (err) {
                console.log(err)
            } else {
                res.json(khateebs)
            }
        })
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

router.post('/update-khateeb/:khateebID', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        const khateeb = db.model('khateeb', schemas.khateeb)
        if (req.params.khateebID === 'New Khateeb') {
            console.log(req.body.payload)
            const khateebX = new khateeb({
                firstName: req.body.payload.firstName,
                lastName: req.body.payload.lastName,
                phoneNumber: req.body.payload.phoneNumber,
                active: req.body.payload.active,
                email: req.body.payload.email,
                dropouts: req.body.payload.dropouts,
                comments: req.body.payload.comments
            })
            khateebX.save((err) => {
                if (err) console.log(err)
                else console.log(`${khateebX.firstName} ${khateebX.lastName} saved successfully!`)
            })
        } else {
            khateeb.findByIdAndUpdate(req.body.payload._id,
                {
                    firstName: req.body.payload.firstName,
                    lastName: req.body.payload.lastName,
                    phoneNumber: req.body.payload.phoneNumber,
                    active: req.body.payload.active,
                    email: req.body.payload.email,
                    dropouts: req.body.payload.dropouts,
                    comments: req.body.payload.comments,
                    __v: req.body.payload.__v
                }, (err) => {
                    if (err) console.log(err)
                })
        }
        res.json('success')
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

export {router as adminRoutes}