import express from 'express'
import $dbModels from '../database/models.js'
import { middleware } from '../utils/middleware.js'
import $schedule from '../utils/schedule.js'
import $db from '../database/funcs.js'
import $responses from '../utils/responses.js'

const router = express.Router()

router.use(middleware.authAdmin)
router.post('*', middleware.validationCheck('schema'))

const routerGroup1 = 'announcements'
const routerGroup1URL = `/${routerGroup1}`
router.get(routerGroup1URL, (req, res) => {
    $dbModels.announcements.find({}, (err, announcements) => {
        if (err) $db.databaseErrorCallback(err, res)
        else {
            const responseData = $responses.previousEntriesAndEmptySchema(announcements, routerGroup1)
            res.json(responseData)
        }
    })
})

router.delete(routerGroup1URL, (req, res) => {
    $db.delete(routerGroup1, req.body._id, res)
})

router.post(routerGroup1URL, (req, res) => {
    $db.save(routerGroup1, req.body, res)
})

const routerGroup2 = 'khateebs'
const routerGroup2URL = `/${routerGroup2}`
router.get(routerGroup2URL + '/:fullOrNot', (req, res) => {
    let x
    req.params.fullOrNot === 'no' ? x = ['_id', 'firstName', 'lastName'] : x = null;
    $dbModels.khateebs.find({}, (err, khateebs) => {
        if (err) console.log(err)
        else {
            let responseData
            if (x) {
                responseData = $responses.prayerSlotKhateebsAndSchema(khateebs)
            } else {
                responseData = $responses.previousEntriesAndEmptySchema(khateebs, routerGroup2)
            }
            res.json(responseData)
        }
    }).select(x)
})

router.delete(routerGroup2URL, (req, res) => {
    $db.delete(routerGroup2, req.body._id, res)
})

router.post(routerGroup2URL, (req, res) => {
    $db.save(routerGroup2, req.body, res)
})

const routerGroup3 = 'settings'
const routerGroup3URL = `/${routerGroup3}`

router.get(routerGroup3URL + '/:settingName', (req, res) => {
    $dbModels.settings.findOne({name: req.params.settingName}, (err, setting) => {
        if (err) console.log(err)
        else {
            let responseData = $responses.previousEntriesAndEmptySchema(setting, routerGroup3)
            if (req.params.settingName === "locations&Timing") {
                const emptySchema = $responses.emptyLocationTimingTemplate()
                responseData.emptySchema = emptySchema
            }
            res.json(responseData)
        }
    })
})

router.post(routerGroup3URL, middleware.isPassword, (req, res) => {
    $db.save(routerGroup3, req.body, res)
})

const routerGroup4 = 'monthlySchedules'
const routerGroup4URL = `/${routerGroup4}`

router.get(routerGroup4URL + '/:monthToQuery/:fridayDates', (req, res) => {
    $dbModels.monthlySchedules.findOne({month : req.params.monthToQuery}, (err, schedule) => {
        if (err) console.log(err)
        else {
            $dbModels.settings.findOne({name: 'locations&Timing'}, (err, locationAndTiming) => {
                const fridayDates = req.params.fridayDates.split(',')
                if (err) console.log(err)
                else if (!schedule) {
                    if (!locationAndTiming) res.json('No locations or timings were found!')
                    else {
                        const newSchedule = $schedule.new(fridayDates, locationAndTiming)
                        res.json({ data: newSchedule })
                    }
                } else {
                    if (locationAndTiming.savedOn > schedule.savedOn) {
                        const updatedSchedule = $schedule.update(fridayDates, locationAndTiming, schedule)
                        res.json(updatedSchedule)
                    } else res.json(schedule)
                }
            })
        }
    })
})

router.post(routerGroup4URL, (req, res) => {
    const updatedSchedule = $schedule.updatePrayerSlotDates(req.body, req.body.original)
    delete req.body.original
    console.log(updatedSchedule)
    $db.save(routerGroup4, req.body, res)
})

export {router as adminRoutes}