const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')
const requestTypeChecks = require('./adminTC.json')

const router = express.Router()

router.use(middleware.auth(2))

const funcs = {
    isNumeric(value) {
        return /^\d+$/.test(value)
    },
    parseNum(value) {
        if (!this.isNumeric(value))
            return value
        else
            return parseInt(value)
    },
    buildQueryFromParams(params) {
        const query = {}
        for (let [key, value] of Object.entries(params)) {
            if (value !== 'all') {
                query[key] = this.parseNum(value)
            }
        }
        return query
    },
    query(request, dataName, options={}) {
        let query = funcs.buildQueryFromParams(request.params)
        query.institutionID = request.headers.institutionid
        query = { ...query, ...options }
        return $db.models[dataName].find(query)
    }
}
const errors = {
    getReq(dataName, err) {
        console.log(err)
        return `There was an error retrieving ${dataName}`
    },
    dbSaveError(dataName, err) {
        console.log(err)
        return `There was a problem saving ${dataName}`
    },
    db(dataName, actionName, err) {
        console.log(err)
        return `There was a problem ${actionName} ${dataName}`
    }
}

const routerGroup1 = 'announcements'
const routerGroup1URL = `/${routerGroup1}`
router.get(routerGroup1URL, async (req, res) => {
    try {
        const mostRecent = -1
        const data = await $db.models[routerGroup1].find({ institutionID: req.headers.institutionid }).sort('-updatedAt').exec()
        res.json(data)
    } catch(err) {
        res.json(errors.db(routerGroup1, 'retrieve', err))
    }
})

router.delete(routerGroup1URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup1].deleteOne(req.body)
        res.json(`successfullly deleted announcement: ${req.body._id}`)
    } catch(err) {
        res.json(errors.db(routerGroup1.slice(0, -1), 'deleting', err))
    }
})

router.post(routerGroup1URL,
    middleware.allowedFields(requestTypeChecks.announcements),
    async (req, res) => {
    console.log(req.body)
    try {
        req.body.institutionID = req.headers.institutionid
        const announcementEntry = await $db.funcs.save(routerGroup1, req.body)
        res.json(`successfully saved announcement: '${req.body.headline}'`)
    } catch(err) {
        res.json(errors.db(routerGroup1.slice(0, -1), 'saving', err))
    }
})

const routerGroup2 = 'khateebs'
const routerGroup2URL = `/${routerGroup2}`

router.get(routerGroup2URL, async (req, res) => {
    try {
        const data = await $db.models[routerGroup2].find({ institutionID: req.headers.institutionid }).select(['-password', '-username']).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.db(routerGroup2, 'retrieve', err))
    }
})

router.delete(routerGroup2URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup2].deleteOne(req.body)
        res.json(`successfullly deleted khateeb: ${req.body._id}`)
    } catch(err) {
        res.json(errors.db(routerGroup2.slice(0, -1), 'deleting', err))
    }
})

router.post(routerGroup2URL,
    middleware.allowedFields(requestTypeChecks.existingKhateeb),
    async (req, res) => {
    try {
        const updated = await $db.models[routerGroup2].updateOne({ _id: req.body._id }, req.body)
        res.json(`successfully updated khateeb: ${req.body._id}`)
    } catch(err) {
        res.json(errors.db(routerGroup2.slice(0, -1), 'updating', err))
    }
})

router.post(routerGroup2URL + "/create", 
    middleware.allowedFields(requestTypeChecks.newKhateeb),
    async(req, res) => {
    try {
        req.body.institutionID = req.headers.institutionid
        req.body.confirmed = true
        const khateebEntry = await $db.funcs.save(routerGroup2, req.body)
        res.json(`You've successfully made ${khateebEntry.firstName} ${khateebEntry.lastName} a khateeb (username: ${khateebEntry.username}).`)
    } catch(err) {
        res.json(errors.db(routerGroup2.slice(0, 1), 'creating', err))
    }
})

router.post(routerGroup2URL + "/confirm", 
    middleware.allowedFields(requestTypeChecks.confirmKhateebs),
    async (req, res) => {
    try {
        const khateeb = await $db.models[routerGroup2].findOne(req.body).exec()
        const updated = await $db.models[routerGroup2].updateOne(req.body, { confirmed: true }).exec()
        const welcomeMsg = new _.notifications.welcome(khateeb)
        const saved = await welcomeMsg.create()
        res.json(`Successfully confirmed`)
    } catch(err) {
        res.json(errors.db(`khateebs`, `confirming`, err ))
    }
})

const routerGroup6 = "locations"
const routerGroup6URL = `/${routerGroup6}`

const locations = {
    async build(institutionID) {
        const location = await this.firstLocation(institutionID)
        const timing = await this.firstTiming(institutionID, location._id.toString())
        return [location]
    },
    async firstLocation(institutionID) {
        const location = {
            institutionID,
            name: 'Unknown Location 1',
            address: "Unknown Address 1"
        }
        const saved = await new $db.models.locations(location).save()
        return saved
    },
    async firstTiming(institutionID, locationID) {
        const timing = {
            institutionID,
            locationID,
            hour: 12,
            minute: 30
        }
        const saved = await new $db.models.timings(timing).save()
        return saved
    }
}

router.get(routerGroup6URL + "/:_id", async (req, res) => {
    try {
        let data = await funcs.query(req, routerGroup6, { active: true }).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup6, err))
    }
})

router.post(routerGroup6URL,
    middleware.allowedFields(requestTypeChecks.locations),
    async (req, res) => {
    try {
        for (let i = 0; i < req.body.locations.length; i++) {
            req.body["institutionID"] = req.headers.institutionid
            const saved = await $db.funcs.save(routerGroup6, req.body.locations[i])
            if (req.body.new && !req.body.locations[i]._id) {
                const newTiming = await locations.firstTiming(req.headers.institutionid, saved._id.toString())
                const associatedJummahs = await _.schedule.createAssociatedJummahs(saved._id.toString(), newTiming._id.toString(), req.headers.institutionid)
            }
        }
        res.json(`successfully saved locations!`)
    } catch(err) {
        res.json(errors.db(routerGroup6.slice(0, -1), 'saving', err))
    }
})

router.delete(routerGroup6URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup6].updateOne({ ...req.body }, { active: false })
        const associatedJummahs = await _.schedule.futureJummahsAssociated({ locationID: req.body._id, institutionID: req.headers.institutionid })
        for (let i = 0; i < associatedJummahs.length; i++) {
            const deleted = await $db.models.jummahs.deleteMany(associatedJummahs[i])
        }
        const associatedTimings = await $db.models.timings.find({ locationID: req.body._id, institutionID: req.headers.institutionid }).exec()
        const timingsObject = {}
        for (let i = 0; i < associatedTimings.length; i++) {
            const updatedTiming = _.deepCopy(associatedTimings[i])
            timingsObject[updatedTiming._id] = _.deepCopy(updatedTiming)
            const updated = await $db.models.timings.updateOne({ _id: updatedTiming._id }, { active: false })
        }
        const khateebs = await $db.models.khateebs.find({ institutionID: req.headers.institutionid }).exec()
        for (let i = 0; i < khateebs.length; i++) {
            const newKhateeb = _.deepCopy(khateebs[i])
            newKhateeb.availableTimings = newKhateeb.availableTimings.filter(timing => !timingsObject[timing])
            const updated = await $db.models.khateebs.updateOne({ _id: newKhateeb._id }, newKhateeb)
        }
        res.json(`Successfully deleted location: ${req.body._id} and it's associated jummahs and timings`)
    } catch(err) {
        res.json(errors.db(`${routerGroup6.slice(0, -1)} and associated jummahs and timings.`, 'deleting', err))
    }
})

const routerGroup7 = "timings"
const routerGroup7URL = `/${routerGroup7}`

router.get(routerGroup7URL + '/:_id' + "/:locationID", async (req, res) => {
    try {
        const data = await funcs.query(req, routerGroup7, { active: true }).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup7, err))
    }
})



router.post(routerGroup7URL, 
    middleware.allowedFields(requestTypeChecks.timings),
    async (req, res) => {
    try {
        for (let i = 0; i < req.body.times.length; i++) {
            req.body.times[i]["institutionID"] = req.headers.institutionid
            console.log(req.body.times[i]._id, req.body.times[i].locationID)
            const saved = await $db.funcs.save(routerGroup7, req.body.times[i])
            console.log(saved._id)
            if (!req.body.times[i]._id) {
                const associatedJummahs = await _.schedule.createAssociatedJummahs(saved.locationID, saved._id.toString(), req.headers.institutionid)
            }
        }
        res.json('timings successfully saved')
    } catch(err) {
        res.json(errors.db(routerGroup7, "saving", err))
    }
})

router.delete(routerGroup7URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup7].updateOne({ ...req.body }, { active: false })
        const associatedJummahs = await _.schedule.futureJummahsAssociated({ timingID: req.body._id, institutionID: req.headers.institutionid })
        for (let i = 0; i < associatedJummahs.length; i++) {
            const deleted = await $db.models.jummahs.deleteMany(associatedJummahs[i])
        }
        const khateebs = await $db.models.khateebs.find({ institutionID: req.headers.institutionid }).exec()
        for (let i = 0; i < khateebs.length; i++) {
            const newKhateeb = _.deepCopy(khateebs[i])
            newKhateeb.availableTimings = newKhateeb.availableTimings.filter(timing => timing !== req.body._id)
            const updated = await $db.models.khateebs.updateOne({ _id: newKhateeb._id }, newKhateeb)
        }
        res.json(`Successfully deleted timing: ${req.body._id} and it's associated jummahs`)
    } catch(err) {
        res.json(errors.db(`${routerGroup7.slice(0, -1)} and associated jummahs.`, 'deleting', err))
    }
})

const routerGroup8 = "jummahs"
const routerGroup8URL = `/${routerGroup8}`
router.get(routerGroup8URL + "/:_id/:year/:month/:weekOf/:locationID/:timingID", async (req, res) => {
    try {
        const data = await funcs.query(req, routerGroup8).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup8, err))
    }
})

router.post(
    routerGroup8URL,
    middleware.allowedFields(requestTypeChecks.jummahs), 
    async (req, res) => {
    try {
        for (let i = 0; i < req.body.jummahs.length; i++) {
            req.body.jummahs[i]["institutionID"] = req.headers.institutionid
            const saved = await $db.funcs.save(routerGroup8, req.body.jummahs[i])
        }
        res.json("successfully updated")
    } catch(err) {
        res.json(errors.db(routerGroup8, "saving", err))
    }
})

const schedules = {
    createDateObjectFromRequest(month, year) {
        const requestDate = new Date()
        requestDate.setMonth(parseInt(month))
        requestDate.setFullYear(parseInt(year))
        return requestDate
    },
    previousMonth(month, year) {
        const requestDate = this.createDateObjectFromRequest(month, year)
        const currentDate = new Date()
        return currentDate.getTime() > requestDate.getTime()
    },
    twoMonthsAhead(month, year) {
        const requestDate = this.createDateObjectFromRequest(month, year)
        requestDate.setDate(1)
        const twoMonthsAhead = new Date()
        twoMonthsAhead.setDate(1)
        twoMonthsAhead.setMonth(twoMonthsAhead.getMonth() + 2)
        return twoMonthsAhead.getTime() <= requestDate.getTime()
    }
}

router.get(
    "/schedules" + "/:month/:year",
    middleware.validateRequest(
        [
            validator.param("month").toInt().isInt({ min: 0, max: 11 }),
            validator.param("year").toInt().isInt({ min: 2021 })
        ],
        'params'
    ),
    async (req, res) => {
        try {
            console.log(req.params)
            let jummahs = await $db.models.jummahs.find().monthlyEntries(req.params.year, req.params.month)
            if (jummahs.length < 1 && schedules.previousMonth(req.params.month, req.params.year))
                return res.json(`nobuild-previous`)
            else if (jummahs.length < 1 && schedules.twoMonthsAhead(req.params.month, req.params.year))
                return res.json(`nobuild-future`)
            if (jummahs.length < 1)
                jummahs = await _.schedule.build(req.params.month, req.params.year, req.headers.institutionid)
            let data = await jummahs[0].gatherScheduleComponents()
            return res.json({ jummahs, ...data })
        } catch(err) {
            res.json(errors.getReq('schedules', err))
        }
})

const routerGroup10 = 'settings'
const routerGroup10URL = `/${routerGroup10}`

router.get(routerGroup10URL, async (req, res) => {
    try {
        const settings = await $db.models.settings.findOne({ institutionID: req.headers.institutionid }).select(['-updatedAt', '-createdAt', '-__v', '-confirmed']).exec()
        return res.json(settings.decrypt())
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get institution settings!`)
    }
})

router.post(routerGroup10URL, async(req, res) => {
    try {
        console.log(req.body)
        req.body.institutionID = req.headers.institutionid
        const saved = await $db.funcs.save('settings', req.body)
        res.json(`Successfully saved settings!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't save settings`)
    }
    //no type checking yet, don't know exactly what's going into this
})

const routerGroup9 = 'institution'
const routerGroup9URL = `/${routerGroup9}`

router.get(routerGroup9URL, 
    async (req, res) => {
    try {
        const institution = await $db.models.institutions.findOne({ _id: req.headers.institutionid }).select(['-updatedAt', '-createdAt', '-__v', '-confirmed']).exec()
        res.json(institution)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get institution details`)
    }
    }
)

router.post(routerGroup9URL,
    middleware.allowedFields(requestTypeChecks.institutionDetails),
    async (req, res) => {
        try {
            const updated = await $db.models.institutions.updateOne({ _id: req.body._id }, req.body)
            res.json(`Successfully updated institution`)
        } catch(err) {
            console.log(err)
            res.json(`Couldn't update institution details`)
        }
    }    
)

// test institution only

const jummahNotifications = require($DIR + '/cron/jummahNotifications.js')

router.get('/send-notifications', async (req, res) => {
    try {
        const date = new Date()
        date.setSeconds(date.getSeconds() + 2)
        await jummahNotifications(date, true)
        res.json('Succesfully sent notifications')
    } catch(err) {
        console.log(err)
        res.json(`Couldn't send notifications`)
    }
})

router.post('/clear-jummah', async (req, res) => {
    try {
        const updated = await $db.models.jummahs.updateOne({ _id: req.body._id }, req.body)
        res.json('hi')
    } catch(err) {
        console.log(err)
        res.json(`Couldn't clear jummah status`)
    }
})

module.exports = router