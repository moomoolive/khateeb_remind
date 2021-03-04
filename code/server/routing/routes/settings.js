const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')
const authMiddleware = require($DIR + '/middleware/auth/main.js')
const validationMiddleware = require($DIR + '/middleware/validation/main.js')

const router = express.Router()

router.get(
    '/',
    middleware.auth(2),
    async (req, res) => {
        let settings = {}
        try {
            settings = await $db.models.settings.findOne({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json(settings)
        } catch(err) {
            console.log(err)
            return res.json({ settings, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.put(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("twilioUser").isLength({ min: 1 }).optional(),
        validator.body("twilioKey").isLength({ min: 1 }).optional(),
        validator.body("twilioPhoneNumber").isLength({ min: 12, max: 13 }).optional(),
        validator.body("textAllowed").isBoolean().optional(),
        validator.body("autoConfirmRegistration").isBoolean().optional(),
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "settings"),
    async (req, res) => {
        console.log(req.body)
        try {
            const updated = await $db.models.settings.findOneAndUpdate(req.body._id, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update settings`)
        }
    }
)

module.exports = router