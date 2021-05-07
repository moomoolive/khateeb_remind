const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 4 }),
    async (req, res) => {
        try {
            const data = await $db.institutions.findOne({ _id: req.headers.institutionid }).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: { settings: {} }, msg: `Couldn't retrieve institution. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("name").isLength({ min: 1 }).isString().optional(),
        validator.body("abbreviatedName").isLength({ min: 1 }).isString().optional(),
        validator.body("timezone").isLength({ min: 1 }).isString().optional(),
        validator.body("country").isLength({ min: 1 }).isString().optional(),
        validator.body("state").isLength({ min: 1 }).isString().optional(),
        validator.body("settings").optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "institutions"),
    async (req, res) => {
        try {
            const data = await $db.institutions.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update instituion. Err trace: ${err}` })
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ level: 4 }),
    async (req, res) => {
        try {
            const targetInstitution = await $db[req.headers.specialInstitution || "institutions"]
                .findOne({ _id: req.headers.institutionid })
                .exec()
            const data = await targetInstitution.deactivate()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete institution or dependencies. Err trace ${err}` })
        }
    }
)

module.exports = router