const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 4 }),
    async (req, res) => {
        try {
            const data = await $db.khateebs.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: [], msg: `Error retrieving khateebs. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("active").isBoolean().optional(),
        validator.body("confirmed").isBoolean().optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "khateebs"),
    async (req, res) => {
        try {
            const data = await $db.khateebs.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update khateeb. Err trace: ${err}` })
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength($config.consts.mongooseIdLength).isString()
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "khateebs"),
    async (req, res) => {
        try {
            const khateeb = await $db.khateebs.findOne(req.query)
            const dependantsRes = await khateeb.deleteNotifications()
            const deleted = await $db.khateebs.deleteOne(req.query)
            return res.json({ data: { khateeb: deleted, dependantsRes } })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: `Couldn't delete khateeb. Err trace: ${err}` })
        }
    }
)

router.post(
    '/availability-change/:type',
    authMiddleware.authenticate({ level: 2 }),
    validationMiddleware.validateRequest([
        validator.body("change").exists(),
        validator.body("msg").isString().isLength({ min: 1 })
    ]),
    async (req, res) => {
        try {
            const note = new notificationConstructors[req.params.type + 'AvailabilityChangeConstructor']({ 
                change: req.body.change,
                khateebID: req.headers.userid,
                msg: req.body.msg 
            })
            await note.setRecipentsToAdmins(req.headers.institutionid)
            await note.create()
            return res.json({ code: 0 })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ code: 1, msg: `Couldn't notify admins about availability change. Err trace: ${err}` })
        }
    }
)

module.exports = router