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
            const data = await $db.timings.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: [], msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.post(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(global.CONFIG.consts.mongooseIdLength).isString(),
        validator.body("locationID").isLength(global.CONFIG.consts.mongooseIdLength).isString(),
        validator.body("hour").isInt({ min: 0, max: 23 }),
        validator.body("minute").isInt({ min: 0, max: 59 })
    ]),
    async (req, res) => {
        try {
            const data = await $db.timings(req.body).save()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't create new timing. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(global.CONFIG.consts.mongooseIdLength).isString(),
        validator.body("hour").isInt({ min: 0, max: 23 }).optional(),
        validator.body("minute").isInt({ min: 0, max: 59 }).optional(),
        validator.body("defaultKhateebs").isArray().isLength(5).optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "timings"),
    async (req, res) => {
        try {
            const data = await $db.timings.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update timing. Err trace: ${err}` })
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(global.CONFIG.consts.mongooseIdLength).isString()
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "timings"),
    async (req, res) => {
        try {
            const deactivedTiming= await $db.timings.findOneAndUpdate(req.query, { active: false }, { new: true })
            const deletedDependants = await deactivedTiming.deleteDependants()
            return res.json({ data: { timing: deactivedTiming, deletedDependants } })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete timing. Err trace: ${err}` })
        }
    }
)


module.exports = router