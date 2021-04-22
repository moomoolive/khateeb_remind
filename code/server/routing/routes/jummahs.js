const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')
const postRequestMiddleware = require(global.$dir + '/middleware/postRequests/main.js')

const jummahHelpers = require(global.$dir + '/libraries/jummahs/main.js')
const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')
const requestValidationHelpers = require(global.$dir + "/libraries/validation/requests.js")

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
    authMiddleware.authenticate({ min: 1, max: 3 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("timingID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("locationID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("khateebID").isString().custom(requestValidationHelpers.validIdOrNullIdInField),
        validator.body("notificationID").isString().custom(requestValidationHelpers.validIdOrNullIdInField),
        validator.body("date").isLength({ min: 1 }),
        validator.body("notified").isBoolean(),
        validator.body("isBackup").isBoolean(),
        validator.body("isGivingKhutbah").isBoolean(),
    ]),
    async (req, res) => {
        try {
            const duplicateEntry = await $db.jummahPreferences.findOne({ 
                institutionID: req.body.institutionID, 
                timingID: req.body.timingID, 
                locationID: req.body.locationID,
                isBackup: req.body.isBackup, 
                date: req.body.date, 
            }).exec()
            if (duplicateEntry)
                return res.status(422).json({ data: {}, msg: `You cannot create duplicate entries!` })
            const data = await new $db.jummahPreferences(req.body).save()
            if (req.headers.usertype === 'khateeb') {
                const jummahMeta = await data.gatherMeta()
                const khateeb = await $db.khateebs.findOne({ _id: req.headers.userid }).exec()
                const note = new notificationConstructors.khateebJummahSignupConstructor(khateeb, data, jummahMeta)
                await note.setRecipentsToAdmins(req.headers.institutionid)
                note.create()
            }
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
        validator.body("khateebID").isString().custom(requestValidationHelpers.validIdOrNullIdInField).optional(),
        validator.body("notificationID").isString().optional().custom(requestValidationHelpers.validIdOrNullIdInField),
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
    '/run-loop',
    validationMiddleware.validateRequest([
        validator.body("main._id").isLength({ min: 4 }).isString(),
        validator.body("main.khateebID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("main.isGivingKhutbah").isBoolean().optional(),
        validator.body("main.isBackup").isBoolean().optional(),
        validator.body("main.notified").isBoolean().optional(),
        validator.body("main.upsert").isBoolean().optional(),
        validator.body("main.date").isISO8601().optional(),
        validator.body("main.institutionID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("main.timingID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("main.locationID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),

        validator.body("backup._id").isLength({ min: 4 }).isString(),
        validator.body("backup.khateebID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("backup.isGivingKhutbah").isBoolean().optional(),
        validator.body("backup.isBackup").isBoolean().optional(),
        validator.body("backup.notified").isBoolean().optional(),
        validator.body("backup.upsert").isBoolean().optional(),
        validator.body("backup.date").isISO8601().optional(),
        validator.body("backup.institutionID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("backup.timingID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
        validator.body("backup.locationID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString().optional(),
    ]),
    authMiddleware.authenticate({ min: 2, max: 3 }),
    async (req, res) => {
        try {
            let targetPreference = req.body[req.query.backup ? 'backup' : 'main']
            if (targetPreference.institutionID !== req.headers.institutionid)
                return res.status(403).json({ msg: 'forbidden resource' })
            
            if (!targetPreference.upsert) {
                targetPreference = await $db.jummahPreferences.findOne({ _id: targetPreference._id }).exec()
                if (!targetPreference)
                    return res.status(422).json({ msg: `Target preference does not exist` })
            }
            
            let otherPreference = req.body[!req.query.backup ? 'backup' : 'main']
            if (otherPreference._id && otherPreference._id !== 'none')
                otherPreference = await $db.jummahPreferences.findOne({ _id: otherPreference._id }) || otherPreference
            
            const target = await jummahHelpers.jummahPreferenceNotifier(targetPreference, true).sendNotification()
            const other = await jummahHelpers.jummahPreferenceNotifier(otherPreference, false).sendNotification()
            return res.json({ data: { targetPreference: target, otherPreference: other } })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: { targetPreference: {}, otherPreference: {} }, msg: `Couldn't run notification loop. Err trace: ${err}` })
        }
    }
)

module.exports = router