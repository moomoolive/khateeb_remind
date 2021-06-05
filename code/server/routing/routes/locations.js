const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')
const postRequestMiddleware = require($rootDir + '/middleware/postRequests/main.js')

const { locations } = require($rootDir + "/database/interfaces/index.js")

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 4 }),
    async (req, res) => {
        try {
            const data = await locations.query({
                filter: { institutionID: req.headers.institutionid, ...req.query } 
            })
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: [], msg: `Error retrieving jummahs. Err trace: ${err}` })
        }
    }
)

router.post(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("name").isLength({ min: 1 }).isString(),
        validator.body("address").isLength({ min: 1 }).isString()
    ]),
    async (req, res) => {
        try {
            const data = await locations.createEntry({ entry: req.body })
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: { location: {}, timing: {} }, msg: `Couldn't create new location. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("name").isLength({ min: 1 }).isString().optional(),
        validator.body("address").isLength({ min: 1 }).isString().optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "locations"),
    async (req, res) => {
        try {
            const data = await locations.updateEntry({
                filter: { _id: req.body._id },
                updates: req.body,
                returnOptions: { new: true }
            })
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update location. Err trace: ${err}` })
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength($config.consts.mongooseIdLength).isString()
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "locations"),
    async (req, res) => {
        try {
            const data = await locations.deleteEntry({ filter: req.query })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete location. Err trace: ${err}` })
        }
    }
)

module.exports = router