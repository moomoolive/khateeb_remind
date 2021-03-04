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
        let locations = []
        try {
            locations = await $db.models.locations.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json(locations)
        } catch(err) {
            console.log(err)
            return res.json({ locations, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.post(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(24),
        validator.body("name").isLength({ min: 1 }),
        validator.body("address").isLength({ min: 1 })
    ]),
    authMiddleware.isAllowedToCreateResource(["institutionID"]),
    async (req, res) => {
        try {
            const newLocation = await $db.models.locations(req.body).save()
            const newTiming = await newLocation.createAssociatedTiming()
            return res.json({ location: newLocation, timing: newTiming })
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
        validator.body("name").isLength({ min: 1 }).optional(),
        validator.body("address").isLength({ min: 1 }).optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "locations"),
    async (req, res) => {
        console.log(req.body)
        try {
            const updated = await $db.models.locations.findOneAndUpdate(req.body._id, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update location`)
        }
    }
)

router.delete(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "locations"),
    async (req, res) => {
        try {
            const deactivedLocation = await $db.models.locations.findOneAndUpdate(req.query, { active: false }, { new: true })
            const deletedDependants = await deactivedLocation.deleteDependants()
            return res.json({ msg: `Deactivated location ${req.query._id}`, deletedDependants })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete location`)
        }
    }
)

module.exports = router