const express = require('express')
const validator = require('express-validator')

const middleware = require(global.$dir + '/middleware/main.js')
const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const router = express.Router()

router.get(
    '/',
    middleware.auth(2),
    async (req, res) => {
        let settings = {}
        try {
            settings = await $db.settings.findOne({ institutionID: req.headers.institutionid, ...req.query}).exec()
            return res.json(settings.decrypt())
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
            // I chose to update and find seperately instead of mongoose's 
            // 'findOneAndUpdate' because update hooks don't apply to them
            // and I need to encrypt certain settings on update
            const identifier = { _id: req.body._id }
            await $db.settings.updateOne(identifier, req.body)
            const updated = await $db.settings.findOne(identifier).exec()
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update settings`)
        }
    }
)

module.exports = router