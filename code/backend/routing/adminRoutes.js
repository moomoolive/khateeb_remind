import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../index.js'
import schemas from '../databaseSchemas/index.js'
import httpCodes from '../utils/httpCodes.js'

const router = express.Router()

const JWT_SECRET = 'secret' // should be put into db

// all read update, create and delete should be put into one route 
// need to standardized CRUD
router.post('/announcements', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        if (!req.body.payload) {
            res.status(httpCodes.notAcceptable)
            res.json('No data was sent')
        } else {
            const announcement = db.model('announcement', schemas.announcement)
            if (req.body.payload.action === 'get') {
                // sends all announcements for now
                announcement.find({}, (err, announcements) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.json(announcements)
                    }
                })
            } else {
                if (req.body.payload._id && req.body.payload.action !== 'delete') {
                    console.log(req.body.payload)
                    announcement.findByIdAndUpdate(req.body.payload._id, {
                        headline: req.body.payload.headline,
                        content: req.body.payload.content,
                        important: req.body.payload.important,
                        urgent: req.body.payload.urgent,
                        __v: req.body.payload.__v + 1
                    }, (err) => {
                        if (err) console.log(err)
                    })
                } 
                else if (req.body.payload.action === 'delete') {
                    announcement.deleteOne({ _id: req.body.payload._id }, (err) => {
                        if (err) console.log(err)
                    })
                } else {
                    const dateAbbreviated = req.body.payload.currentDate.month.slice(0, 3)
                    const announcementX = new announcement({
                        headline: req.body.payload.headline,
                        content: req.body.payload.content,
                        important: req.body.payload.important,
                        urgent: req.body.payload.urgent,
                        date: req.body.payload.date
                    })
                    announcementX.save((err) => {
                        if (err) console.log(err)
                        else res.json(`Announcement "${announcementX.headline}" saved`)
                    })
                }
            }
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
                                columnData: columnData,
                                rows: schedule.data,
                                _id: schedule._id,
                                __v: schedule.__v
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
            if (req.body.payload._id) {
                monthlySchedule.findByIdAndUpdate(req.body.payload._id,
                    {
                        month: monthName,
                        data: updatedSchedule,
                        __v: req.body.payload.__v + 1
                    }, (err) => {
                        if (err) console.log(err)
                    })
            } else {
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
            if (req.body.payload.action === 'delete') {
                khateeb.deleteOne({ _id: req.body.payload._id }, (err) => {
                    if (err) console.log(err)
                })
            }
            else if (req.body.payload.action === 'get') {
                khateeb.find({}, (err, khateebs) => {
                    if (err) {
                        console.log(err)
                    } else {
                        res.json(khateebs)
                    }
                })
            } else {
                console.log('hi')
                khateeb.findByIdAndUpdate(req.body.payload._id,
                    {
                        firstName: req.body.payload.firstName,
                        lastName: req.body.payload.lastName,
                        phoneNumber: req.body.payload.phoneNumber,
                        active: req.body.payload.active,
                        email: req.body.payload.email,
                        dropouts: req.body.payload.dropouts,
                        comments: req.body.payload.comments,
                        __v: req.body.payload.__v + 1
                    }, (err) => {
                        if (err) console.log(err)
                    })
            }
        }
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

// should be refactored to more generally work for all settings
router.post('/locations-timing', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
    if (req.body.payload) {
        const setting = db.model('setting', schemas.settings)
        if (req.body._id) {
            setting.findByIdAndUpdate(req.body._id, {
                name: 'locations&Timing',
                options: req.body.payload,
                __v: req.body.__v + 1
            }, (err) => {
                if (err) console.log(err)
            })
        } else {
            const settingX = new setting({
                name: 'locations&Timing',
                options: req.body.payload
            })
            settingX.save((err) => {
                if (err) console.log(err)
                else res.json(`Setting ${settingX.name} saved successfully!`)
            })
            }
    } else {
        res.status(httpCodes.notAcceptable)
    }
})

router.post('/locations-timing-info', (req, res) => {
    try {
        const token = req.body.token
        jwt.verify(token, JWT_SECRET)
        const setting = db.model('setting', schemas.settings)
        setting.findOne({name: 'locations&Timing'}, (err, locationAndTiming) => {
            if (err) console.log(err)
            else {
                res.json(locationAndTiming)
            }
        })
    }
    catch {
        res.status(httpCodes.unauthorized)
        res.json({data: null, msg: 'Unauthorized'})
    }
})

export {router as adminRoutes}