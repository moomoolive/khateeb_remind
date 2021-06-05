const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')
const postRequestMiddleware = require($rootDir + '/middleware/postRequests/main.js')

const { announcements } = require($rootDir + "/database/interfaces/index.js")

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 4 }),
    async (req, res) => {
        try {
            const data = await announcements.query({
                filter: { institutionID: req.headers.institutionid, ...req.query },
                sortBy: "-updatedAt",
                limit: 20
            })
            res.set($config.customHeaders.serviceWorkerCache)
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: [], msg: `Couldn't retrieve announcements. Err trace: ${err}` })
        }
    }
)

router.post(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("headline").isLength({ min: 1 }).isString(),
        validator.body("content").isLength({ min: 1 }).isString(),
        validator.body("important").isBoolean(),
        validator.body("urgent").isBoolean(),
    ]),
    async (req, res) => {
        try {
            const data = await announcements.create({ document: req.body })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update announcement. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("headline").isLength({ min: 1 }).isString().optional(),
        validator.body("content").isLength({ min: 1 }).isString().optional(),
        validator.body("important").isBoolean().optional(),
        validator.body("urgent").isBoolean().optional(),
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "announcements"),
    async (req, res) => {
        try {
            const data = await announcements.updateDocument({
                filter: { _id: req.body._id },
                updates: req.body,
                returnOptions: { new: true }
            })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update announcement. Err trace ${err}` })
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength($config.consts.mongooseIdLength).isString()
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "announcements"),
    async (req, res) => {
        try {
            const data = await announcements.deleteDocument({ filter: req.query })
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete announcement. Err trace: ${err}` })
        }
    }
)


module.exports = router