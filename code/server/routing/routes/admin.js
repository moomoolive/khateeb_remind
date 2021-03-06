const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')

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

router.delete(routerGroup1URL + '/:_id', async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup1].deleteOne(req.params)
        return res.json(deleted)
    } catch(err) {
        res.json(errors.db(routerGroup1.slice(0, -1), 'deleting', err))
    }
})

router.post(routerGroup1URL,
    middleware.validateRequest(
        [
            validator.body("_id").isLength(24).optional(),
            validator.body("headline").isLength({ min: 1 }),
            validator.body("content").isLength({ min: 1 }),
            validator.body("important").isBoolean(),
            validator.body("urgent").isBoolean(),
        ]
    ),
    async (req, res) => {
        try {
            req.body.institutionID = req.headers.institutionid
            const announcementEntry = await $db.funcs.save(routerGroup1, req.body)
            return res.json(announcementEntry)
        } catch(err) {
            return res.json(errors.db(routerGroup1.slice(0, -1), 'saving', err))
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

router.delete(routerGroup2URL + "/:_id", async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup2].deleteOne(req.params)
        return res.json(deleted)
    } catch(err) {
        res.json(errors.db(routerGroup2.slice(0, -1), 'deleting', err))
    }
})

router.put(
    routerGroup2URL,
    middleware.validateRequest(
        [
            validator.body("_id").isLength(24),
            validator.body("active").isBoolean().optional(),
            validator.body("confirmed").isBoolean().optional()
        ]
    ),
    async (req, res) => {
        try {
            const updated = await $db.models[routerGroup2].findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }).select(["-password", "-username"])
            if (req.body.confirmed)
                await new _.notifications.welcome(updated).create()
            return res.json(updated)
        } catch(err) {
            res.json(errors.db(routerGroup2.slice(0, -1), 'updating', err))
        }
})

const routerGroup6 = "locations"
const routerGroup6URL = `/${routerGroup6}`

const locations = {
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
        return res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup6, err))
    }
})

router.post(routerGroup6URL,
    middleware.validateRequest(
        [
            validator.body("locations").isArray(),
            validator.body("new").isBoolean().optional(),
        ]
    ),
    async (req, res) => {
    try {
        for (let i = 0; i < req.body.locations.length; i++) {
            req.body["institutionID"] = req.headers.institutionid
            const saved = await $db.funcs.save(routerGroup6, req.body.locations[i])
            if (req.body.new && !req.body.locations[i]._id) {
                const newTiming = await locations.firstTiming(req.headers.institutionid, saved._id.toString())
                const associatedJummahs = await _.schedule.createJummahsForTiming(saved._id.toString(), newTiming._id.toString(), req.headers.institutionid)
            }
        }
        return res.json(`successfully saved locations!`)
    } catch(err) {
        res.json(errors.db(routerGroup6.slice(0, -1), 'saving', err))
    }
})

router.delete(routerGroup6URL + "/:_id", async (req, res) => {
    try {
        const deletedLocation = await $db.models[routerGroup6].findOneAndUpdate(req.params, { active: false }, { new: true })
        const dependantRes = await deletedLocation.deleteDependants()
        return res.json({ msg: `Successfully deleted location ${req.params._id}`, dependantRes })
    } catch(err) {
        return res.json(errors.db(`${routerGroup6.slice(0, -1)} and associated jummahs and timings.`, 'deleting', err))
    }
})

const routerGroup7 = "timings"
const routerGroup7URL = `/${routerGroup7}`

router.get(routerGroup7URL + '/:_id' + "/:locationID", async (req, res) => {
    try {
        const data = await funcs.query(req, routerGroup7, { active: true }).exec()
        return res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup7, err))
    }
})

router.post(routerGroup7URL, 
    middleware.validateRequest(
        [
            validator.body("times").isArray()
        ]
    ),
    async (req, res) => {
    try {
        for (let i = 0; i < req.body.times.length; i++) {
            req.body.times[i]["institutionID"] = req.headers.institutionid
            const saved = await $db.funcs.save(routerGroup7, req.body.times[i])
            if (!req.body.times[i]._id) {
                const associatedJummahs = await _.schedule.createJummahsForTiming(saved.locationID, saved._id.toString(), req.headers.institutionid)
            }
        }
        return res.json('timings successfully saved')
    } catch(err) {
        res.json(errors.db(routerGroup7, "saving", err))
    }
})

router.delete(routerGroup7URL + '/:_id', async (req, res) => {
    try {
        const deletedTiming = await $db.models[routerGroup7].findOneAndUpdate(req.params, { active: false }, { new: true })
        const dependantsRes = await deletedTiming.deleteDependants()
        return res.json({ msg: `Successfully deleted timing ${req.params._id}`, dependantsRes })
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

router.put(
    routerGroup8URL,
    middleware.validateRequest(
        [
            validator.body("jummahs").isArray()
        ]
    ), 
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
            let jummahs = await $db.models.jummahs.find({ institutionID: req.headers.institutionid }).monthlyEntries(req.params.year, req.params.month)
            if (jummahs.length < 1 && schedules.previousMonth(req.params.month, req.params.year))
                return res.json(`nobuild-previous`)
            else if (jummahs.length < 1 && schedules.twoMonthsAhead(req.params.month, req.params.year))
                return res.json(`nobuild-future`)
            if (jummahs.length < 1)
                jummahs = await _.schedule.build(req.params.month, req.params.year, req.headers.institutionid)
            const data = await jummahs[0].gatherScheduleComponents()
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

router.put(
    routerGroup10URL,
    middleware.validateRequest(
        [
            validator.body("_id").isLength(24),
            validator.body("twilioUser").isLength({ min: 1 }).optional(),
            validator.body("twilioKey").isLength({ min: 1 }).optional(),
            validator.body("twilioPhoneNumber").isLength({ min: 12, max: 13 }).optional(),
            validator.body("textAllowed").isBoolean().optional(),
            validator.body("autoConfirmRegistration").isBoolean().optional(),
        ]
    ),
    async(req, res) => {
        try {
            req.body.institutionID = req.headers.institutionid
            // I chose to update and find seperate instead of mongoose's 
            // 'findOneAndUpdate' because update hooks don't apply to them
            // and I need to encrypt certain settings on update
            const identifier = { _id: req.body._id }
            await $db.models.settings.updateOne(identifier, req.body)
            const updated = await $db.models.settings.findOne(identifier).exec()
            return res.json(updated)
        } catch(err) {
            console.log(err)
            res.json(`Couldn't save settings`)
        }
})

const routerGroup9 = 'institution'
const routerGroup9URL = `/${routerGroup9}`

router.get(routerGroup9URL, 
    async (req, res) => {
        try {
            const institution = await $db.models.institutions.findOne({ _id: req.headers.institutionid }).select(['-updatedAt', '-createdAt', '-__v', '-confirmed']).exec()
            return res.json(institution)
        } catch(err) {
            console.log(err)
            res.json(`Couldn't get institution details`)
        }
    }
)

router.put(routerGroup9URL,
    middleware.validateRequest(
        [
            validator.body("_id").isLength(24),
            validator.body("name").isLength({ min: 1 }).optional(),
            validator.body("abbreviatedName").isLength({ min: 1 }).optional(),
            validator.body("timezone").isLength({ min: 1 }).optional(),
            validator.body("country").isLength({ min: 1 }).optional(),
            validator.body("state").isLength({ min: 1 }).optional(),
        ]
    ),
    async (req, res) => {
        try {
            const updated = await $db.models.institutions.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            res.json(updated)
        } catch(err) {
            console.log(err)
            res.json(`Couldn't update institution details`)
        }
    }    
)

// test institution only

// --- deal with this later ---

//const jummahNotifications = require($DIR + '/cron/jummahNotifications.js')

router.get('/send-notifications', async (req, res) => {
    try {
        const date = new Date()
        date.setSeconds(date.getSeconds() + 2)
        //await jummahNotifications(date, true)
        res.json('Succesfully sent notifications')
    } catch(err) {
        console.log(err)
        res.json(`Couldn't send notifications`)
    }
})

router.put('/clear-jummah', async (req, res) => {
    try {
        const updated = await $db.models.jummahs.updateOne({ _id: req.body._id }, req.body)
        res.json('hi')
    } catch(err) {
        console.log(err)
        res.json(`Couldn't clear jummah status`)
    }
})

module.exports = router