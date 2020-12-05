import express from 'express'
import jwt from 'jsonwebtoken'
import db from '../index.js'
import schemas from '../databaseSchemas/index.js'
import httpCodes from '../utils/httpCodes.js'
import e from 'express'

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
                            const setting = db.model('setting', schemas.settings)
                            setting.findOne({name: 'locations&Timing'}, (err, locationAndTiming) => {
                                if (err) console.log(err)
                                else {
                                    if (locationAndTiming.savedOn > schedule.savedOn ) {
                                        const updatedNumberOfLocations = locationAndTiming.options.length
                                        const oldNumberOfLocations = schedule.data.length
                                        const difference = oldNumberOfLocations - updatedNumberOfLocations < 0 ? 0 : oldNumberOfLocations - updatedNumberOfLocations
                                        for (let x = 0; x < difference; x++) {
                                            schedule.data.pop()
                                        }
                                        for (let location = 0; location < locationAndTiming.options.length; location++) {
                                            if (schedule.data[location]) {
                                                schedule.data[location].info = JSON.parse(JSON.stringify(locationAndTiming.options[location].info))
                                                const updatedTimingLength = locationAndTiming.options[location].timings.length
                                                const oldTimingLength = schedule.data[location].timing.length
                                                const diff = oldTimingLength - updatedTimingLength < 0 ? 0 : oldTimingLength - updatedTimingLength
                                                for (let x = 0; x < diff; x++) {
                                                    schedule.data[location].timing.pop()
                                                }
                                                let mismatchedTimings = []
                                                for (let x = 0; x < locationAndTiming.options[location].timings.length; x++) {
                                                    const y = locationAndTiming.options[location].timings[x]
                                                    const compareVal = `${y.hour}:${y.minutes}${y.AMorPM}`
                                                    if (schedule.data[location].timing[x] !== compareVal) {
                                                        schedule.data[location].timing[x] = compareVal
                                                        mismatchedTimings.push(x)
                                                    }
                                                }
                                                for (let week in schedule.data[location].monthlySchedule) {
                                                    for (let x = 0; x < diff; x++) {
                                                        schedule.data[location].monthlySchedule[week].pop()
                                                    }
                                                    let y = 0
                                                    for (let x = 0; x < schedule.data[location].monthlySchedule[week].length; x++) {
                                                        if (x === mismatchedTimings[y]) {
                                                            schedule.data[location].monthlySchedule[week][x] = 'TBD'
                                                            y++
                                                        }
                                                    }
                                                }
                                            } else {
                                                const tempSchedule = JSON.parse(JSON.stringify(schedule.data[location - 1]))
                                                tempSchedule.info = JSON.parse(JSON.stringify(locationAndTiming.options[location].info))
                                                tempSchedule.timing = locationAndTiming.options[location].timings
                                                const numberOfKhateebsPerWeek = tempSchedule.timing.length
                                                let emptyArray = []
                                                for (let x = 0; x < numberOfKhateebsPerWeek; x++) {
                                                    emptyArray.push('TBD')
                                                }
                                                for (let week in tempSchedule.monthlySchedule) {
                                                    tempSchedule.monthlySchedule[week] = emptyArray
                                                }
                                                schedule.data[location] = JSON.parse(JSON.stringify(tempSchedule))
                                            }
                                        }
                                        // save to database
                                        monthlySchedule.findByIdAndUpdate(schedule._id,
                                            {
                                                month: schedule.month,
                                                data: schedule.data,
                                                savedOn: new Date().toUTCString(),
                                                __v: schedule.__v + 1
                                            }, (err) => {
                                                if (err) console.log(err)
                                            })
                                        const responseData = {
                                            columnData: columnData,
                                            rows: schedule.data,
                                            _id: schedule._id,
                                            __v: schedule.__v
                                        }
                                        res.json({data: responseData, msg:'Data Found' })
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
                        savedOn: new Date().toUTCString(),
                        __v: req.body.payload.__v + 1
                    }, (err) => {
                        if (err) console.log(err)
                    })
            } else {
                const monthlyScheduleX = new monthlySchedule({
                    month: monthName,
                    data: updatedSchedule,
                    savedOn: new Date().toUTCString(),
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
                savedOn: new Date().toUTCString(),
                __v: req.body.__v + 1
            }, (err) => {
                if (err) console.log(err)
            })
        } else {
            const settingX = new setting({
                name: 'locations&Timing',
                options: req.body.payload,
                savedOn: new Date().toUTCString()
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