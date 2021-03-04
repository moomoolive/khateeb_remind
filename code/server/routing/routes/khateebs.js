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
        let khateebs = []
        try {
            khateebs = await $db.models.khateebs.find({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json(khateebs)
        } catch(err) {
            console.log(err)
            return res.json({ khateebs, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.put(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("active").isBoolean().optional(),
        validator.body("confirmed").isBoolean().optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "khateebs"),
    async (req, res) => {
        console.log(req.body)
        try {
            const updated = await $db.models.khateebs.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            if (req.body.confirmed)
                await new _.notifications.welcome(updated).create()
           console.log(updated)
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update khateeb`)
        }
    }
)

router.delete(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "khateebs"),
    async (req, res) => {
        try {
            const khateeb = await $db.models.khateebs.findOne(req.query)
            const dependantsRes = await khateeb.deleteNotifications()
            console.log(dependantsRes)
            await $db.models.khateebs.deleteOne(req.query)
            return res.json({ msg: `Deleted khateeb with id:${req.query._id}`, dependantsRes })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete location`)
        }
    }
)

module.exports = router