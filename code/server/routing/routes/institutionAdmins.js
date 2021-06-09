const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const router = express.Router()

const { authorizations, users } = require($rootDir + "/database/public.js")

router.use(authMiddleware.authenticate({ level: 4 }))

router.get(
    "/", 
    async (req, res) => {
        try {
            const [institutionAdminAuthorization] = await authorizations.query({
                filter: {
                    institution: req.headers.institutionid, 
                    role: "institutionAdmin" 
                }
            })
            const data = await users.findInstitutionAdmins(
                req.headers.institutionid, 
                institutionAdminAuthorization, 
                req.query
            )
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: [], msg: `Couldn't retrieve institution admins. Err trace: ${err}` })
        }
})

router.put(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.body("adminId").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("confirmed").isBoolean()
    ]),
    async (req, res) => {
        try {
            const [targetAdmin] = await users.query({
                filter: { _id: req.body.adminId },
                populate: "authorizations.authId"
            })
            const targetAuthorization = targetAdmin.authorizations.find(a => {
                return a.authId.institution.toString() === req.headers.institutionid && a.authId.role === 'institutionAdmin'
            })
            if (!targetAuthorization) {
                return res.status(422).json({ data: {}, msg: `target authorization does not exist` }) 
            }
            const data = await users.confirmAuthorization(
                targetAuthorization._id, 
                req.body.confirmed
            )
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update khateeb. Err trace: ${err}` })
        }
    }
)

router.delete(
    "/",
    validationMiddleware.validateRequest([
        validator.query("authId").isLength($config.consts.mongooseIdLength).isString(),
        validator.query("adminId").isLength($config.consts.mongooseIdLength).isString(),
    ], "query"),
    async (req, res) => {
        try {
            const [targetUser] = await users.query({
                filter: { _id: req.query.adminId },
                populate: "authorizations.authId"
            })
            const targetAuthorization = targetUser.authorizations.find(a => {
                return a.authId.role === 'institutionAdmin' && a.authId.institution.toString() === req.headers.institutionid
            })
            if (!targetAuthorization) {
                return res.status(422).json({ data: {}, msg: `target authorization does not exist` })
            }
            const data = await users.removeAuthorization(targetUser._id, targetAuthorization._id)
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete institution admin. Err trace: ${err}` })
        }
})

module.exports = router