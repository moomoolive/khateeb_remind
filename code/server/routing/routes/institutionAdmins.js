const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')
const postRequestMiddleware = require(global.$dir + '/middleware/postRequests/main.js')

const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')

const router = express.Router()

router.use(authMiddleware.authenticate(3))

router.get(
    "/", 
    async (req, res) => {
        try {
            const data = await $db.institutionAdmins.find({ institutionID: req.headers.institutionid }).select(['-updatedAt', "-__v", "-password"]).exec()
            return res.json(data)
        } catch(err) {
            console.log(err)
            res.json(`Couldn't get institutional Admins`)
        }
})

router.post("/",
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest(
        [
            validator.body("institutionID").isLength(24),
            validator.body("password").isLength({ min: 6 }),
            validator.body("username").isLength({ min: 6 }),
            validator.body("handle").isLength({ min: 1 }),
            validator.body("firstName").isLength({ min: 1 }),
            validator.body("lastName").isLength({ min: 1 }),
            validator.body("phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }),
        ]
    ),
    async (req, res) => {
        try {
            req.body.confirmed = true
            const newInstitutionAdmin = await new $db.institutionAdmins(req.body).save()
            await new notificationConstructors.WelcomeNotificationConstructor(newInstitutionAdmin).create()
            return res.json(newInstitutionAdmin)
        } catch(err) {
            console.log(err)
            res.json(`There was a creating institutional admin`)
        }
})

router.delete(
    "/",
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "institutionAdmins"), 
    async (req, res) => {
        try {
            const institutionAdmin = await $db.institutionAdmins.findOne(req.query).exec()
            const dependantsRes = await institutionAdmin.deleteNotifications()
            const deleted = await $db.institutionAdmins.deleteOne(req.query)
            return res.json({ institutionAdmin: deleted, dependantsRes })
        } catch(err) {
            console.log(err)
            res.json(`Couldn't delete institution admin ${req.params._id}`)
        }
})

module.exports = router