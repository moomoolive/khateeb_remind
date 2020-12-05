import express from 'express'
import dbModels from '../database/models.js'
import httpCodes from '../utils/httpCodes.js'
import { middleware } from '../utils/middleware.js'
import scheduleFunctions from '../utils/montlySchedule.js'

const router = express.Router()

router.use(middleware.authAdmin)

// all read update, create and delete should be put into one route 
// need to standardized CRUD
// also all DB interactions should be standardized into helper functions
router.post('/announcements', (req, res) => {
    if (!req.body.payload) {
        res.status(httpCodes.notAcceptable)
        res.json('No data was sent')
    } else {
        if (req.body.payload.action === 'get') {
            dbModels.announcement.find({}, (err, announcements) => {
                if (err) {
                    console.log(err)
                } else {
                    res.json(announcements)
                }
            })
        } else {
            if (req.body.payload._id && req.body.payload.action !== 'delete') {
                console.log(req.body.payload)
                dbModels.announcement.findByIdAndUpdate(req.body.payload._id, {
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
                dbModels.announcement.deleteOne({ _id: req.body.payload._id }, (err) => {
                    if (err) console.log(err)
                })
            } else {
                const announcementX = new dbModels.announcements({
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
})

const columnData = ['Timing', 'Khateeb'] //hardcoded

router.post('/scheduler', (req, res) => {
    if (req.body.month) {
        dbModels.monthlySchedules.findOne({month : req.body.month}, (err, schedule) => {
            if (err) {
                console.log(err)
            } else {
                if (!schedule) {
                    res.json({ data: null, msg: "No data recorded for given month"})
                } else {
                        dbModels.settings.findOne({name: 'locations&Timing'}, (err, locationAndTiming) => {
                            if (err) console.log(err)
                            else {
                                if (locationAndTiming.savedOn > schedule.savedOn ) {
                                    const updatedSchedule = scheduleFunctions(schedule, locationAndTiming)
                                    dbModels.monthlySchedules.findByIdAndUpdate(schedule._id,
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
})

router.post('/update-schedule', (req, res) => {
    if (!req.body.payload) {
        res.status(httpCodes.notAcceptable)
        res.json('No data was sent')
    } else {
        const monthName = req.body.payload.key
        const updatedSchedule = req.body.payload.updatedSchedule
        const originalSchedule = req.body.payload.originalSchedule // unused for now
        if (req.body.payload._id) {
            dbModels.monthlySchedules.findByIdAndUpdate(req.body.payload._id,
                {
                    month: monthName,
                    data: updatedSchedule,
                    savedOn: new Date().toUTCString(),
                    __v: req.body.payload.__v + 1
                }, (err) => {
                    if (err) console.log(err)
                })
        } else {
            const monthlyScheduleX = new dbModels.monthlySchedules({
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
})

router.post('/update-khateeb/:khateebID', (req, res) => {
    if (req.params.khateebID === 'New Khateeb') {
        console.log(req.body.payload)
        const khateebX = new dbModels.khateebs({
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
            dbModels.khateebs.deleteOne({ _id: req.body.payload._id }, (err) => {
                if (err) console.log(err)
            })
        }
        else if (req.body.payload.action === 'get') {
            dbModels.khateebs.find({}, (err, khateebs) => {
                if (err) {
                    console.log(err)
                } else {
                    res.json(khateebs)
                }
            })
        } else {
            dbModels.khateebs.findByIdAndUpdate(req.body.payload._id,
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
})

// should be refactored to more generally work for all settings
router.post('/locations-timing', (req, res) => {
    if (req.body.payload) {
        if (req.body._id) {
            dbModels.settings.findByIdAndUpdate(req.body._id, {
                name: 'locations&Timing',
                options: req.body.payload,
                savedOn: new Date().toUTCString(),
                __v: req.body.__v + 1
            }, (err) => {
                if (err) console.log(err)
            })
        } else {
            const settingX = new dbModels.settings({
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
    dbModels.settings.findOne({name: 'locations&Timing'}, (err, locationAndTiming) => {
        if (err) console.log(err)
        else {
            res.json(locationAndTiming)
        }
    })
})

export {router as adminRoutes}