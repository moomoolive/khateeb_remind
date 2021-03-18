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
        let jummahs = []
        try {
            jummahs = await $db.jummahPreferences.find({ institutionID: req.headers.institutionid, ...req.query }).exec()
            return res.json({ jummahs })
        } catch(err) {
            console.log(err)
            return res.json({ jummahs, msg: { status: 'err', errorTrace: err } })
        }
})

router.post(
    '/',
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(24),
        validator.body("timingID").isLength(24),
        validator.body("locationID").isLength(24),
        validator.body("khateebID").isLength(24),
        validator.body("notificationID").isLength({ min: 4 }),
        validator.body("date").isLength({ min: 1 }),
        validator.body("notified").isBoolean(),
        validator.body("isBackup").isBoolean(),
        validator.body("isGivingKhutbah").isBoolean(),
    ]),
    authMiddleware.authenticate({ min: 2, max: 3 }),
    async (req, res) => {
        try {
            if (jummahHelpers.oneMonthInThePast().getTime() >= new Date(req.body.date).getTime())
                return res.status(422).json({ msg: 'You cannot create entries for the past' })
            const savedPreference = await new $db.jummahPreferences(req.body).save()
            return res.json(savedPreference)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't save jummah preference`)
        }
    } 
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24).optional(),
        validator.body("khateebID").isLength(24).optional(),
        validator.body("notificationID").isLength({ min: 4 }).optional(),
        validator.body("notified").isBoolean().optional(),
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "jummahs"),
    async (req, res) => {
        console.log(req.body)
        try {
            const updated = await $db.jummahPreferences.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update jummah`)
        }
    }
)

router.put(
    '/run-loop/:backup',
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24)
    ]),
    authMiddleware.authenticate({ min: 2, max: 3 }),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "jummahs"),
    async (req, res) => {
        console.log(req.body)
        try {
            const jummah = await $db.jummahs.findOne(req.body).exec()
            const updatedJummah = await jummahHelpers.runNotificationLoop(jummah, req.params.backup === 'true')
            return res.json(updatedJummah)
        } catch(err) {
            console.log(err)
        }
    }
)

module.exports = router