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
        try {
            const data = await $db.locations.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: [], msg: `Error retrieving jummahs. Err trace: ${err}` })
        }
    }
)

router.post(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(global.CONFIG.consts.mongooseIdLength).isString(),
        validator.body("name").isLength({ min: 1 }).isString(),
        validator.body("address").isLength({ min: 1 }).isString()
    ]),
    async (req, res) => {
        try {
            const newLocation = await $db.locations(req.body).save()
            const newTiming = await newLocation.findTimings()
            return res.json({ data: { location: newLocation, timing: newTiming[0] }})
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: { location: {}, timing: {} }, msg: `Couldn't create new location. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(global.CONFIG.consts.mongooseIdLength).isString(),
        validator.body("name").isLength({ min: 1 }).isString().optional(),
        validator.body("address").isLength({ min: 1 }).isString().optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "locations"),
    async (req, res) => {
        try {
            const data = await $db.locations.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update location. Err trace: ${err}` })
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(global.CONFIG.consts.mongooseIdLength).isString()
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "locations"),
    async (req, res) => {
        try {
            const deactivedLocation = await $db.locations.findOneAndUpdate(req.query, { active: false }, { new: true })
            const deletedDependants = await deactivedLocation.deleteDependants()
            return res.json({ data: { location: deactivedLocation, deletedDependants } })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete location. Err trace: ${err}` })
        }
    }
)

module.exports = router