import express from 'express'

import { middleware } from '../../middleware/main.js'
import $db from '../../database/index.js'
import $responses from '../../utils/responses.js'
import $utils from '../../utils/index.js'
import sched from '../../utils/schedule.js'

const router = express.Router()

router.use(middleware.authAdmin)
router.post('*', middleware.validationCheck('schema'))

const routerGroup1 = 'announcements'
const routerGroup1URL = `/${routerGroup1}`
router.get(routerGroup1URL, (req, res) => {
    $db.models.announcements.find({}, (err, announcements) => {
        if (err) $db.funcs.databaseErrorCallback(err, res)
        else {
            const responseData = $responses.previousEntriesAndEmptySchema(announcements, routerGroup1)
            res.json(responseData)
        }
    })
})

router.delete(routerGroup1URL, (req, res) => {
    $db.funcs.delete(routerGroup1, req.body._id, res)
})

router.post(routerGroup1URL, (req, res) => {
    $db.funcs.save(routerGroup1, req.body, res)
})

const routerGroup2 = 'khateebs'
const routerGroup2URL = `/${routerGroup2}`
router.get(routerGroup2URL + '/:fullOrNot', (req, res) => {
    let x
    req.params.fullOrNot === 'no' ? x = ['_id', 'firstName', 'lastName'] : x = null;
    $db.models.khateebs.find({}, (err, khateebs) => {
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
    $db.funcs.delete(routerGroup2, req.body._id, res)
})

router.post(routerGroup2URL, (req, res) => {
    $db.funcs.save(routerGroup2, req.body, res)
})

const routerGroup3 = 'settings'
const routerGroup3URL = `/${routerGroup3}`

router.get(routerGroup3URL + '/:settingName', (req, res) => {
    const settingName = req.params.settingName
    $db.models[settingName].find({}, (err, setting) => {
        if (err) console.log(err)
        else {
            let responseData = $responses.previousEntriesAndEmptySchema(setting, settingName)
            res.json(responseData)
        }
    })
})

router.post(routerGroup3URL, middleware.isPassword, (req, res) => {
    $db.funcs.save(routerGroup3, req.body, res)
})

const routerGroup4 = 'monthlySchedules'
const routerGroup4URL = `/${routerGroup4}`

router.get(routerGroup4URL + '/:monthToQuery', async (req, res) => {
    try {
        let schedule = await sched.fetchSchedule(req.params.monthToQuery)
        const locationAndTimings = await $db.funcs.getSetting('locationAndTimings')
        const needsUpdate = sched.needsUpdate(locationAndTimings.savedOn, schedule.savedOn)
        if(!schedule) {
            schedule = sched.new(req.params.monthToQuery, locationAndTimings)
        }
        else if (needsUpdate) {
            schedule = sched.update(schedule, locationAndTimings)
        }
    } catch {
        res.status($utils.hCodes.serverError)
        res.json('something went wrong')

    }
    res.json(schedule)
    /*$db.models.monthlySchedules.findOne({month : req.params.monthToQuery}, (err, schedule) => {
        if (err) console.log(err)
        else {
            $db.models.locationAndTimings.findOne({}, (err, locationAndTiming) => {
                const fridayDates = req.params.fridayDates.split(',')
                if (err) console.log(err)
                else if (!schedule) {
                    if (!locationAndTiming) res.json('No locations or timings were found!')
                    else {
                        const newSchedule =$utils.schedule.new(fridayDates, locationAndTiming)
                        res.json({ data: newSchedule })
                    }
                } else {
                    if (locationAndTiming.savedOn > schedule.savedOn) {
                        const updatedSchedule =$utils.schedule.update(fridayDates, locationAndTiming, schedule)
                        res.json(updatedSchedule)
                    } else res.json(schedule)
                }
            })
        }
    }) */
})

router.post(routerGroup4URL, (req, res) => {
    const updatedSchedule =$utils.schedule.updatePrayerSlotDates(req.body, req.body.original)
    delete req.body.original
    console.log(updatedSchedule)
    $db.funcs.save(routerGroup4, req.body, res)
})

export { router as admin }