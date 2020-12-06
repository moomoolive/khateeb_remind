import express from 'express'
import dbModels from '../database/models.js'
import httpCodes from '../utils/httpCodes.js'
import { middleware } from '../utils/middleware.js'
import scheduleFunctions from '../utils/montlySchedule.js'
import db from '../database/funcs.js'

const router = express.Router()

router.use(middleware.authAdmin)
// router.post(middleware.schemaValidationCheck) >> must finish schedule requests

const routerGroup1 = 'announcements'
const routerGroup1URL = `/${routerGroup1}`
router.get(routerGroup1URL, (req, res) => {
    dbModels.announcements.find({}, (err, announcements) => {
        if (err) db.databaseErrorCallback(err, res)
        else res.json(announcements)
    })
})

router.delete(routerGroup1URL, (req, res) => {
    db.delete(routerGroup1, req.body._id, res)
})

router.post(routerGroup1URL, (req, res) => {
    db.save(routerGroup1, req.body, res)
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
                                    const updatedSchedule = scheduleFunctions.updateExistingScheduleWithNewSettings(schedule, locationAndTiming)
                                    dbModels.monthlySchedules.findByIdAndUpdate(schedule._id,
                                        {
                                            month: schedule.month,
                                            data: updatedSchedule,
                                            savedOn: new Date().toUTCString(),
                                            __v: schedule.__v + 1
                                        }, (err) => {
                                            if (err) console.log(err)
                                        })
                                    const responseData = {
                                        columnData: columnData,
                                        rows: updatedSchedule,
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

const routerGroup2 = 'khateebs'
const routerGroup2URL = `/${routerGroup2}`

router.get(routerGroup2URL, (req, res) => {
    dbModels.khateebs.find({}, (err, khateebs) => {
        if (err) console.log(err)
        else res.json(khateebs)
    })
})

router.delete(routerGroup2URL, (req, res) => {
    db.delete(routerGroup2, req.body._id, res)
})

router.post(routerGroup2URL, (req, res) => {
    db.save(routerGroup2, req.body, res)
})

const routerGroup3 = 'settings'
const routerGroup3URL = `/${routerGroup3}`

router.get(routerGroup3URL + '/:settingName', (req, res) => {
    dbModels.settings.findOne({name: req.params.settingName}, (err, locationAndTiming) => {
        if (err) console.log(err)
        else res.json(locationAndTiming)
    })
})

router.post(routerGroup3URL, (req, res) => {
    db.save(routerGroup3, req.body, res)
})

export {router as adminRoutes}