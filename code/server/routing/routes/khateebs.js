const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 1, max: 3 }),
    async (req, res) => {
        let khateebs = []
        try {
            khateebs = await $db.khateebs.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json(khateebs)
        } catch(err) {
            console.log(err)
            return res.json({ khateebs, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("active").isBoolean().optional(),
        validator.body("confirmed").isBoolean().optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "khateebs"),
    async (req, res) => {
        try {
            const updated = await $db.khateebs.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            if (req.body.confirmed)
                await new notificationConstructors.WelcomeNotificationConstructor(updated).create()
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update khateeb`)
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "khateebs"),
    async (req, res) => {
        try {
            const khateeb = await $db.khateebs.findOne(req.query)
            const dependantsRes = await khateeb.deleteNotifications()
            const deleted = await $db.khateebs.deleteOne(req.query)
            return res.json({ khateeb: deleted, dependantsRes })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete location`)
        }
    }
)

module.exports = router