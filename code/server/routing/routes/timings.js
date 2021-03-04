const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')
const authMiddleware = require($DIR + '/middleware/auth/main.js')
const validationMiddleware = require($DIR + '/middleware/validation/main.js')

const router = express.Router()

router.get(
    '/',
    middleware.auth(1),
    async (req, res) => {
        let timings = []
        try {
            timings = await $db.models.timings.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json(timings)
        } catch(err) {
            console.log(err)
            return res.json({ timings, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.post(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(24),
        validator.body("locationID").isLength(24),
        validator.body("hour").isInt({ min: 0, max: 23 }),
        validator.body("minute").isLength({ min: 0, max: 59 })
    ]),
    authMiddleware.isAllowedToCreateResource(["institutionID"]),
    async (req, res) => {
        console.log(req.body)
        try {
            const newTiming = await $db.models.timings(req.body).save()
            await _.schedule.createJummahsForTiming(newTiming.locationID, newTiming._id.toString(), newTiming.institutionID)
            return res.json(newTiming)
        } catch(err) {
            console.log(err)
        }
    }
)

router.put(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("hour").isInt({ min: 0, max: 23 }).optional(),
        validator.body("minute").isLength({ min: 0, max: 59 }).optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "timings"),
    async (req, res) => {
        console.log(req.body)
        try {
            const updated = await $db.models.timings.findOneAndUpdate(req.body._id, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't timing location`)
        }
    }
)

router.delete(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "timings"),
    async (req, res) => {
        try {
            const deactivedTiming= await $db.models.timings.findOneAndUpdate(req.query, { active: false }, { new: true })
            const deletedDependants = await deactivedTiming.deleteDependants()
            return res.json({ msg: `Deactivated timing ${req.query._id}`, deletedDependants })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete timing`)
        }
    }
)


module.exports = router