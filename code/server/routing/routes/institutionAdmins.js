const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')
const postRequestMiddleware = require(global.$dir + '/middleware/postRequests/main.js')

const router = express.Router()

router.use(authMiddleware.authenticate(3))

router.get(
    "/", 
    async (req, res) => {
        try {
            const data = await $db.institutionAdmins.find({ institutionID: req.headers.institutionid }).select(['-updatedAt', "-__v", "-password"]).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: [], msg: `Couldn't retrieve institution admins. Err trace: ${err}` })
        }
})

router.post("/",
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest(
        [
            validator.body("institutionID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
            validator.body("password").isLength({ min: 6 }).isString(),
            validator.body("username").isLength({ min: 6 }).isString(),
            validator.body("handle").isLength({ min: 1 }).isString(),
            validator.body("firstName").isLength({ min: 1 }).isString(),
            validator.body("lastName").isLength({ min: 1 }).isString(),
            validator.body("phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }),
        ]
    ),
    async (req, res) => {
        try {
            const data = await new $db.institutionAdmins({ ...req.body, confirmed: true }).save()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't create new institution admin. Err trace: ${err}` })
        }
})

router.delete(
    "/",
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString()
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "institutionAdmins"), 
    async (req, res) => {
        try {
            const institutionAdmin = await $db.institutionAdmins.findOne(req.query).exec()
            const dependantsRes = await institutionAdmin.deleteNotifications()
            const deleted = await $db.institutionAdmins.deleteOne(req.query)
            return res.json({ data: { institutionAdmin: deleted, dependantsRes } })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete institution admin. Err trace: ${err}` })
        }
})

module.exports = router