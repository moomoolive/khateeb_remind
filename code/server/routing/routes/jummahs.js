const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')
const postRequestMiddleware = require(global.$dir + '/middleware/postRequests/main.js')

const jummahHelpers = require(global.$dir + '/libraries/jummahs/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 1, max: 3 }), 
    async (req, res) => {
        try {
            const data = await $db.jummahPreferences.find({ institutionID: req.headers.institutionid, ...req.query }).sort("-date").exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: [], msg: `An error occured when retrieving jummahs. Err trace:${err}` })
        }
})

router.post(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("timingID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("locationID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("khateebID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("notificationID").isLength({ min: 4 }).isString(),
        validator.body("date").isLength({ min: 1 }),
        validator.body("notified").isBoolean(),
        validator.body("isBackup").isBoolean(),
        validator.body("isGivingKhutbah").isBoolean(),
    ]),
    async (req, res) => {
        try {
            if (jummahHelpers.oneMonthInThePast().getTime() >= new Date(req.body.date).getTime())
                return res.status(422).json({ msg: 'You cannot create entries for the past' })
            const data = await new $db.jummahPreferences(req.body).save()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't create new jummah preference. Err trace: ${err}` })
        }
    } 
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("khateebID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("notificationID").isLength({ min: 4 }).isString().optional(),
        validator.body("notified").isBoolean().optional(),
        validator.body("isGivingKhutbah").isBoolean().optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "jummahPreferences"),
    async (req, res) => {
        try {
            const data = await $db.jummahPreferences.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update jummah. Err trace: ${err}` })
        }
    }
)

router.put(
    '/run-loop/:backup',
    validationMiddleware.validateRequest([
        validator.body("main._id").isLength({ min: 4 }).isString(),
        validator.body("main.khateebID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("main.isGivingKhutbah").isBoolean().optional(),
        validator.body("main.notified").isBoolean().optional(),
        validator.body("backup._id").isLength({ min: 4 }).isString(),
        validator.body("backup.khateebID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("backup.isGivingKhutbah").isBoolean().optional(),
        validator.body("backup.notified").isBoolean().optional(),
    ]),
    authMiddleware.authenticate({ min: 2, max: 3 }),
    async (req, res) => {
        try {
            const targetPreference = await $db.jummahPreferences.findOne({ _id: req.body[req.query.backup ? 'backup' : 'main']._id }).exec()
            if (!targetPreference)
                return res.status(422).json({ msg: `Target preference does not exist` })
            else if (targetPreference.institutionID !== req.headers.institutionid)
                return res.status(403).json({ msg: 'forbidden resource' })
            const updatedPreferences = await jummahHelpers.runNotificationLoop(targetPreference, req.body[!req.query.backup ? 'backup' : 'main'])
            return res.json({ data: updatedPreferences })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: { targetPreference: {}, otherPreference: {} }, msg: `Couldn't run notification loop. Err trace: ${err}` })
        }
    }
)

module.exports = router