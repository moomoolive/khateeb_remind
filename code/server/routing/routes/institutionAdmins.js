const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')
const postRequestMiddleware = require($rootDir + '/middleware/postRequests/main.js')

const router = express.Router()

router.use(authMiddleware.authenticate({ level: 4 }))

router.get(
    "/", 
    async (req, res) => {
        try {
            const institutionAdminAuthorization = await $db.authorizations.findOne({ institution: req.headers.institutionid, role: "institutionAdmin" }).exec()
            const data = await $db.users.find({ authorizations: institutionAdminAuthorization._id.toString() }).select(['-updatedAt', "-__v", "-password"]).exec()
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
            validator.body("institutionID").isLength($config.consts.mongooseIdLength).isString(),
            validator.body("password").isLength({ min: 6 }).isString(),
            validator.body("username").isLength({ min: 6 }).isString(),
            validator.body("handle").isLength({ min: 1 }).isString(),
            validator.body("email").isEmail(),
            validator.body("firstName").isLength({ min: 1 }).isString(),
            validator.body("lastName").isLength({ min: 1 }).isString(),
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
        validator.query("_id").isLength($config.consts.mongooseIdLength).isString()
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