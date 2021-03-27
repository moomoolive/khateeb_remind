const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    async (req, res) => {
        try {
            const data = await $db.institutions.findOne({ _id: req.headers.institutionid }).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't retrieve institution. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
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
    authMiddleware.authenticate({ level: 3 }),
    async (req, res) => {
        try {
            const query = { _id: req.headers.institutionid }
            const targetInstitution = await $db.institutions.findOne(query).exec()
            const institutionRes = await $db.institutions.deleteOne(query)
            const deletedDependants = await targetInstitution.deleteDependencies()
            return res.json({ data: { institution: institutionRes, deletedDependants } })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete institution or dependencies. Err trace ${err}` })
        }
    }
)

module.exports = router