const express = require('express')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.use(middleware.authAdmin)

const routerGroup1 = 'announcements'
const routerGroup1URL = `/${routerGroup1}`
router.get(routerGroup1URL, async (req, res) => {
    try {
        const data = await $db.models.previousEntriesAndEmptySchema(routerGroup1)
        res.json(data)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't retrieve ${routerGroup1}`)
    }
})

router.delete(routerGroup1URL, (req, res) => {
    $db.funcs.delete(routerGroup1, req.body._id, res)
})

router.post(routerGroup1URL, middleware.validationCheck('schema'), (req, res) => {
    $db.funcs.save(routerGroup1, req.body, res)
})

const routerGroup2 = 'khateebs'
const routerGroup2URL = `/${routerGroup2}`
router.get(routerGroup2URL + '/:fullOrNot', async (req, res) => {
    try {
        const params = req.params.fullOrNot === 'no' ? ['_id', 'firstName', 'lastName'] : 'all'
        const specialEmptySchema = req.params.fullOrNot === 'no' ? $utils.schedule.TBDIndicator : null
        const data = await $db.models.previousEntriesAndEmptySchema(routerGroup2, params, specialEmptySchema)
        res.json(data)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't retrieve ${routerGroup2}`)
    }
})

router.delete(routerGroup2URL, (req, res) => {
    $db.funcs.delete(routerGroup2, req.body._id, res)
})

router.post(routerGroup2URL, middleware.validationCheck('schema'), (req, res) => {
    $db.funcs.save(routerGroup2, req.body, res)
})

const routerGroup3 = 'settings'
const routerGroup3URL = `/${routerGroup3}`

router.get(routerGroup3URL + '/:settingName', async (req, res) => {
    const settingName = req.params.settingName
    try {
        const data = await $db.models.previousEntriesAndEmptySchema(settingName)
        res.json(data)
    } catch(err) {
        console.log(err)
        res.json(`Could't retrieve ${settingName}`)
    }
})

router.post(routerGroup3URL, [middleware.isPassword, middleware.validationCheck('schema')], (req, res) => {
    $db.funcs.save(routerGroup3, req.body, res)
})

const routerGroup4 = 'monthlySchedules'
const routerGroup4URL = `/${routerGroup4}`

router.get(routerGroup4URL + '/:monthToQuery', async (req, res) => {
    try {
        let schedule = await $utils.schedule.fetchSchedule(req.params.monthToQuery)
        const locationAndTimings = await $db.funcs.getSetting('locationAndTimings')
        const needsUpdate = $utils.schedule.needsUpdate(locationAndTimings, schedule)
        if (!locationAndTimings)
            res.json("No locations or timings were found!")
        if(!schedule)
            schedule = $utils.schedule.new(req.params.monthToQuery, locationAndTimings)
        else if (needsUpdate) {
            schedule = $utils.schedule.update(schedule, locationAndTimings)
            $db.funcs.save('monthlySchedules', schedule)
        }
        res.json(schedule)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json('something went wrong')

    }
})

router.post(routerGroup4URL, middleware.validationCheck('schema'), (req, res) => {
    const updatedSchedule = $utils.schedule.checkForUpdates(req.body, req.body.original)
    $db.funcs.save(routerGroup4, updatedSchedule, res)
})

module.exports = router