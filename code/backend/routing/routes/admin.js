const express = require('express')

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
    queryBuilder(request) {
        request.params.institutionID = request.headers.institutionid
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

const routerGroup1 = 'announcements'
const routerGroup1URL = `/${routerGroup1}`
router.get(routerGroup1URL, async (req, res) => {
    try {
        const data = await $db.models[routerGroup1].find({ institutionID: req.headers.institutionid }).exec()
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
        const data = await $db.models[routerGroup2].find({ institutionID: req.headers.institutionid }).exec()
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
        req.body.isDefault = true
        req.body.confirmed = true
        const khateebEntry = await $db.funcs.save(routerGroup2, req.body)
        res.json(`You've successfully made ${khateebEntry.firstName} ${khateebEntry.lastName} a khateeb (username: ${khateebEntry.username}).`)
    } catch(err) {
        res.json(errors.db(routerGroup2.slice(0, 1), 'creating', err))
    }
})

router.post(routerGroup2URL + "/confirm", async (req, res) => {
    try {
        if (req.body.all) {
            const updatedKhateebs = await $db.models[routerGroup2].updateMany({ confirmed: false }, { confirmed: true }).exec()
        } else {
            const updated = await $db.models[routerGroup2].updateOne({ _id: req.body._id })
        }
        res.json(`Successfully confirmed`)
    } catch(err) {
        res.json(errors.db(`khateebs`, `confirming`, err ))
    }
})

const routerGroup6 = "locations"
const routerGroup6URL = `/${routerGroup6}`

router.get(routerGroup6URL + "/:_id", async (req, res) => {
    try {
        const data = await funcs.query(req, routerGroup6).exec()
        res.json(data)
    } catch(err) {
        res.json(errors.getReq(routerGroup6, err))
    }
})

router.post(routerGroup6URL,
    middleware.allowedFields(requestTypeChecks.locations),
    async (req, res) => {
    try {
        req.body["institutionID"] = req.headers.institutionid
        const saved = await $db.funcs.save(routerGroup6, req.body)
        res.json(`successfully saved ${req.body.name}`)
    } catch(err) {
        res.json(errors.db(routerGroup6.slice(0, -1), 'saving', err))
    }
})

router.delete(routerGroup6URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup6].updateOne({ ...req.body }, { active: false })
        const associatedJummahs = await $utils.schedule.futureJummahsAssociated({ locationID: req.body._id, institutionID: req.headers.institutionid })
        for (let i = 0; i < associatedJummahs.length; i++) {
            const deleted = await $db.models.jummahs.deleteMany(associatedJummahs[i])
        }
        const associatedTimings = await $db.models.timings.find({ locationID: req.body._id, institutionID: req.headers.institutionid }).exec()
        const timingsObject = {}
        for (let i = 0; i < associatedTimings.length; i++) {
            const updatedTiming = $utils.general.deepCopy(associatedTimings[i])
            timingsObject[updatedTiming._id] = $utils.general.deepCopy(updatedTiming)
            const updated = await $db.models.timings.updateOne({ _id: updatedTiming._id }, { active: false })
        }
        const khateebs = await $db.models.khateebs.find({ institutionID: req.headers.institutionid }).exec()
        for (let i = 0; i < khateebs.length; i++) {
            const newKhateeb = $utils.general.deepCopy(khateebs[i])
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
        const data = await funcs.query(req, routerGroup7).exec()
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
            const saved = await $db.funcs.save(routerGroup7, req.body.times[i])
        }
        res.json('timings successfully saved')
    } catch(err) {
        res.json(errors.db(routerGroup7, "saving", err))
    }
})

router.delete(routerGroup7URL, async (req, res) => {
    try {
        const deleted = await $db.models[routerGroup7].updateOne({ ...req.body }, { active: false })
        const associatedJummahs = await $utils.schedule.futureJummahsAssociated({ timingID: req.body._id, institutionID: req.headers.institutionid })
        for (let i = 0; i < associatedJummahs.length; i++) {
            const deleted = await $db.models.jummahs.deleteMany(associatedJummahs[i])
        }
        const khateebs = await $db.models.khateebs.find({ institutionID: req.headers.institutionid }).exec()
        for (let i = 0; i < khateebs.length; i++) {
            const newKhateeb = $utils.general.deepCopy(khateebs[i])
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

router.get("/schedules" + "/:month/:year", async (req, res) => {
    try {
        let data = await funcs.query(req, 'jummahs').exec()
        if (data.length < 1)
            data = await $utils.schedule.build(req.params.month, req.params.year, req.headers.institutionid)
        res.json(data)
    } catch(err) {
        res.json(errors.getReq('schedules', err))
    }
})


router.post('/user/username', 
    middleware.allowedFields(requestTypeChecks.userUsername),
    async (req, res) => {
    try {
        const userEntry = await $db.models.institutionAdmins.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user/password', 
    middleware.allowedFields(requestTypeChecks.userPassword),
    async (req, res) => {
    try {
        const userEntry = await $db.models.institutionAdmins.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user/profile', async (req, res) => {
    try {
        const updated = await $db.models.institutionAdmins.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully updated user profile!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user profile`)
    }
})

module.exports = router