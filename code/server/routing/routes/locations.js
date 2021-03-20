const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')
const postRequestMiddleware = require(global.$dir + '/middleware/postRequests/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 1, max: 3 }),
    async (req, res) => {
        let locations = []
        try {
            locations = await $db.locations.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json(locations)
        } catch(err) {
            console.log(err)
            return res.json({ locations, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.post(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(24),
        validator.body("name").isLength({ min: 1 }),
        validator.body("address").isLength({ min: 1 })
    ]),
    async (req, res) => {
        try {
            const newLocation = await $db.locations(req.body).save()
            const newTiming = await newLocation.createAssociatedTiming()
            return res.json({ location: newLocation, timing: newTiming })
        } catch(err) {
            console.log(err)
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("name").isLength({ min: 1 }).optional(),
        validator.body("address").isLength({ min: 1 }).optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "locations"),
    async (req, res) => {
        try {
            const updated = await $db.locations.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update location`)
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "locations"),
    async (req, res) => {
        try {
            const deactivedLocation = await $db.locations.findOneAndUpdate(req.query, { active: false }, { new: true })
            const deletedDependants = await deactivedLocation.deleteDependants()
            return res.json({ location: deactivedLocation, deletedDependants })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete location`)
        }
    }
)

module.exports = router