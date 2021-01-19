const express = require('express')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.use(middleware.authAdmin)


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
    /*try {
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

    } */
})

router.post(routerGroup4URL, middleware.validationCheck('schema'), (req, res) => {
    const updatedSchedule = $utils.schedule.checkForUpdates(req.body, req.body.original)
    $db.funcs.save(routerGroup4, updatedSchedule, res)
})

// ------------------------------------------------------------ old routes
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const objectSupport = require('dayjs/plugin/objectSupport')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(objectSupport)

const funcs = {
    isNumeric(value) {
        return /^\d+$/.test(value)
    },
    parseNum(value) {
        if (typeof value !== 'string' || !this.isNumeric(value))
            return value
        else
            return parseInt(value)
    },
    buildQueryFromParams(params, modelID=null) {
        const query = {}
        for (let [key, value] of Object.entries(params)) {
            if (value !== 'all') {
                if (modelID && key === modelID)
                    query["_id"] = this.parseNum(value)
                else
                    query[key] = this.parseNum(value)
            }
        }
        return query
    },
    modelID(request) {
        const paramKeys = Object.keys(request.params)
        const basePath = request.path.split('/')[1]
        if ((paramKeys[0] + 's') === basePath)
            return paramKeys[0]
        else return null
    },
    queryBuilder(request) {
        request.params.institutionID = request.headers.institution
        const modelID = this.modelID(request)
        if (modelID)
            return funcs.buildQueryFromParams(request.params, modelID)
        else return funcs.buildQueryFromParams(request.params)
    },
    query(request, dataName) {
        const query = this.queryBuilder(request)
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

const schedules = {
    async build(month, year, institutionID) {
        try {
            const fridays = this.fridaysOfMonth(month, year)
            const prayerInfo = await this.getActiveLocationsAndTimings(institutionID)
            const emptyJummah = this.getEmptyJummah()
            const emptyJummahArray = this.createEmptyJummahsEntries(
                emptyJummah, prayerInfo, fridays, month,
                year, institutionID
            )
            const jummahEntries = await this.createJummahsAndReturnEntries(emptyJummahArray)
            return jummahEntries
        } catch(err) {
            console.log(`Could not build schedule for ${month} ${year}`)
            console.log(err)
        }
    },
    async createJummahsAndReturnEntries(emptyJummahArray) {
        const jummahEntries = []
        for (let i = 0; i < emptyJummahArray.length; i++) {
            try {
                const jummah = await new $db.models.jummahs(emptyJummahArray[i]).save()
                jummahEntries.push(jummah)
            } catch(err) {
                console.log(err)
            }
        }
        return jummahEntries
    },
    createEmptyJummahsEntries(emptyJummah, prayerInfo, fridays, month, year, institutionID) {
        const linkedTimesAndLocations = this.linkTimesAndLocations(prayerInfo)
        const emptyJummahs = this.loopOverLinkedStructAndFillJummahs(
            linkedTimesAndLocations, emptyJummah, fridays, month, year, institutionID
        )
        return emptyJummahs
    },
    loopOverLinkedStructAndFillJummahs(linkedStruct, emptyJummah, fridays, month, year, institutionID) {
        const jummahArray = []
        for (let [locationID, timingIDs] of Object.entries(linkedStruct)) {
            fridays.forEach(friday => {
                timingIDs.forEach(timingID => {
                    const jummah = $utils.general.deepCopy(emptyJummah)
                    jummah.institutionID = institutionID
                    jummah.month = month
                    jummah.year = year
                    jummah.weekOf = friday
                    jummah.locationID = locationID
                    jummah.timingID = timingID.toString()
                    jummahArray.push(jummah)
                })
            })
        }
        return jummahArray
    },
    linkTimesAndLocations(prayerInfo) {
        const linkedStruct = {  }
        prayerInfo.locations.forEach(location => {
            linkedStruct[location._id] = []
        })
        prayerInfo.timings.forEach(timing => {
            linkedStruct[timing.locationID].push(timing._id)
        })
        return linkedStruct
    },
    getEmptyJummah() {
        const templates = this.getEmptyJummahComponents()
        return this.createEmptyJummah(templates)
    },
    getEmptyJummahComponents() {
        const jummah = {
            month: 0,
            year: 2021,
            weekOf: 15,
            confirmed: false,
            institutionID: 'TBD',
            locationID: "TBD",
            timingID: 'TBD',
            khateebPreference: []
        }
        const prayerSlot = {
            notified: false,
            confirmed: false,
            responded: false,
            khateebID: 'TBD'
        }
        return { jummah, prayerSlot }
    },
    createEmptyJummah(templates) {
        const maxKhateebPreference = 3
        const preferences = []
        for (let i =0; i < maxKhateebPreference; i++)
            preferences.push(templates.prayerSlot)
        templates.jummah.khateebPreference = preferences
        return templates.jummah
    },
    async getActiveLocationsAndTimings(institutionID) {
        try {
            const query = { institutionID, active: true }
            const locations = await $db.models.locations.find(query).exec()
            const timings = await $db.models.timings.find(query).exec()
            return { locations, timings }
        } catch(err) {
            console.log(`Could not get locations and timings`)
            console.log(err)
        }
    },
    fridaysOfMonth(month, year) {
        const firstFriday = this.findFirstFriday(month, year)
        return this.findAllFridays(firstFriday)
    },
    findFirstFriday(month, year) {
        let date = dayjs().month(month).year(year).date(1)
        const friday = 5
        while (date.day() !== friday)
            date = dayjs(date).date(date.date() + 1)
        return date
    },
    findAllFridays(firstFridayDayJs) {
        const fridays = []
        let fri = firstFridayDayJs.clone()
        const oneWeek = 7
        while (fri.month() === firstFridayDayJs.month()) {
            fridays.push(fri.date())
            fri = dayjs(fri).date(fri.date() + oneWeek)
        }
        return fridays
    }
}

// ------ do we need to have schema checks??
const routerGroup1 = 'announcements'
const routerGroup1URL = `/${routerGroup1}`
router.get(routerGroup1URL, async (req, res) => {
    try {
        const data = await $db.models[routerGroup1].find({ institutionID: req.headers.institutionid }).exec()
        res.json(data)
    } catch(err) {
        errors.db(routerGroup1, 'retrieve', err)
    }
})

router.delete(routerGroup1URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup1].deleteOne(req.body)
        res.json(`successfullly deleted announcement: ${req.body._id}`)
    } catch(err) {
        errors.db(routerGroup1.slice(0, -1), 'deleting', err)
    }
})

router.post(routerGroup1URL, async (req, res) => {
    try {
        req.body.institutionID = req.headers.institutionid
        const announcementEntry = await $db.funcs.save(routerGroup1, req.body)
        res.json(`successfully saved announcement: '${req.body.headline}'`)
    } catch(err) {
        errors.db(routerGroup1.slice(0, -1), 'saving', err)
    }
})

const routerGroup2 = 'khateebs'
const routerGroup2URL = `/${routerGroup2}`

router.get(routerGroup2URL, async (req, res) => {
    try {
        const data = await $db.models[routerGroup2].find({ institutionID: req.headers.institutionid }).exec()
        res.json(data)
    } catch(err) {
        errors.db(routerGroup2, 'retrieve', err)
    }
})

router.delete(routerGroup2URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup2].deleteOne(req.body)
        res.json(`successfullly deleted khateeb: ${req.body._id}`)
    } catch(err) {
        errors.db(routerGroup2.slice(0, -1), 'deleting', err)
    }
})

router.post(routerGroup2URL, async (req, res) => {
    try {
        console.log(req.body)
        const updated = await $db.models[routerGroup2].updateOne({ _id: req.body._id }, req.body)
        res.json(`successfully updated khateeb: ${req.body._id}`)
    } catch(err) {
        errors.db(routerGroup2.slice(0, -1), 'updating', err)
    }
})

router.post(routerGroup2URL + "/create", async(req, res) => {
    try {
        const institutionID = req.headers.institutionid
        req.body.user.institutionID = institutionID
        req.body.user.isDefault = true
        const userEntry = await $db.funcs.save('users', req.body.user)
        req.body.khateeb.institutionID = institutionID
        req.body.khateeb.userID = userEntry._id.toString()
        const khateebEntry = await $db.funcs.save(routerGroup2, req.body.khateeb)
        res.json(`You've successfully made ${khateebEntry.firstName} ${khateebEntry.lastName} a khateeb (username: ${userEntry.username}).`)
    } catch(err) {
        errors.db(routerGroup2.slice(0, 1), 'creating', err)
    }
})

const routerGroup6 = "locations"
const routerGroup6URL = `/${routerGroup6}`

router.get(routerGroup6URL + "/:location", async (req, res) => {
    try {
        const data = await funcs.query(req, routerGroup6).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup6, err))
    }
})

router.post(routerGroup6URL, async (req, res) => {
    try {
        req.body["institutionID"] = req.headers.institutionid
        const saved = await $db.funcs.save(routerGroup6, req.body)
        res.json(`successfully saved ${req.body.name}`)
    } catch(err) {
        errors.db(routerGroup6.slice(0, -1), 'saving', err)
    }
})

const routerGroup7 = "timings"
const routerGroup7URL = `/${routerGroup7}`

router.get(routerGroup7URL + '/:timing' + "/:locationID", async (req, res) => {
    try {
        const data = await funcs.query(req, routerGroup7).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup7, err))
    }
})

router.post(routerGroup7URL, async (req, res) => {
    try {
        for (let i = 0; i < req.body.times.length; i++) {
            req.body.times[i]["institutionID"] = req.headers.institutionid
            const saved = await $db.funcs.save(routerGroup7, req.body.times[i])
        }
        res.json('timings successfully saved')
    } catch(err) {
        errors.db(routerGroup7, "saving", err)
    }
})

const routerGroup8 = "jummahs"
const routerGroup8URL = `/${routerGroup8}`

router.get(routerGroup8URL + "/:jummah/:year/:month/:weekOf/:locationID/:timingID", async (req, res) => {
    try {
        const data = await funcs.query(req, routerGroup8).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup8, err))
    }
})

router.post(routerGroup8URL, async (req, res) => {
    try {
        for (let i = 0; i < req.body.jummahs.length; i++) {
            req.body.jummahs[i]["institutionID"] = req.headers.institutionid
            const saved = await $db.funcs.save(routerGroup8, req.body.jummahs[i])
        }
        res.json("successfully updated")
    } catch(err) {
        errors.db(routerGroup8, "saving", err)
    }
})

router.get(routerGroup8URL + "/:jummah/:year/:month/:weekOf/:locationID/:timingID", async (req, res) => {
    try {
        let data = await funcs.query(req, routerGroup8).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup8, err))
    }
})

router.get("/schedules" + "/:month/:year", async (req, res) => {
    try {
        let data = await funcs.query(req, 'jummahs').exec()
        if (data.length < 1)
            data = await schedules.build(req.params.month, req.params.year, req.headers.institutionid)
        res.json(data)
    } catch(err) {
        res.json(errors.getReq('schedules', err))
    }
})

module.exports = router