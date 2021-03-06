const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const jummahHelpers = require(global.$dir + '/libraries/jummahs/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 1, max: 3 }), 
    async (req, res) => {
        //console.log(req.query)
        let jummahs = []
        try {
            jummahs = await $db.jummahs.find({ institutionID: req.headers.institutionid, ...req.query }).exec()
            return res.json({ jummahs })
        } catch(err) {
            console.log(err)
            return res.json({ jummahs, msg: { status: 'err', errorTrace: err } })
        }
})

router.post(
    '/',
    validationMiddleware.validateRequest([
        validator.body("jummahs").isArray({ min: 1 })
    ]),
    authMiddleware.authenticate({ min: 1, max: 3 }),
    async (req, res) => {
        try {
            const createdJummahs = []
            const requestingInstitution = await $db.institutions.findOne({ _id: req.headers.institutionid }).exec()
            const localTime = requestingInstitution.getLocalTime()
            const oneMonthInThePast = jummahHelpers.oneMonthInThePast(localTime)
            const twoMonthsAhead = jummahHelpers.twoMonthsAhead(localTime)
            console.log(req.body.jummahs)
            for (let i = 0; i < req.body.jummahs.length; i++) {
                const jummah = req.body.jummahs[i]
                const createdForRequesterInstitution = req.headers.institutionid === jummah.institutionID
                const jummahForDateExists = await $db.jummahs.findOne({ date: jummah.date, locationID: jummah.locationID, timingID: jummah.timingID }).exec()
                const creatingEntryForThePast = new Date(jummah.date).getTime() <= oneMonthInThePast.getTime()
                const creatingJummahToFarIntoFuture = new Date(jummah.date).getTime() >= twoMonthsAhead.getTime() 
                if (!createdForRequesterInstitution || jummahForDateExists || creatingEntryForThePast || creatingJummahToFarIntoFuture )
                    continue
                console.log('hi')
                const savedJummah = await new $db.jummahs(jummah).save()
                createdJummahs.push(savedJummah)
            }
            return res.json(createdJummahs)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't save jummahs`)
        }
    } 
)

module.exports = router