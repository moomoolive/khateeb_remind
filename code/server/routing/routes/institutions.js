const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    async (req, res) => {
        let institution = {}
        try {
            institution = await $db.institutions.findOne({ _id: req.headers.institutionid }).exec()
            return res.json(institution)
        } catch(err) {
            console.log(err)
            return res.json({ institution, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("name").isLength({ min: 1 }).optional(),
        validator.body("abbreviatedName").isLength({ min: 1 }).optional(),
        validator.body("timezone").isLength({ min: 1 }).optional(),
        validator.body("country").isLength({ min: 1 }).optional(),
        validator.body("state").isLength({ min: 1 }).optional(),
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "institutions"),
    async (req, res) => {
        try {
            const updated = await $db.institutions.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update institution`)
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate(3),
    async (req, res) => {
        try {
            const query = { _id: req.headers.institutionid }
            const targetInstitution = await $db.institutions.findOne(query).exec()
            const deletedDependants = await targetInstitution.deleteDependencies()
            await $db.institutions.deleteOne(query)
            return res.json({ msg: `Successfully deleted institution ${req.headers.institutionid}`, deletedDependants })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete location`)
        }
    }
)

module.exports = router