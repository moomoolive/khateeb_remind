const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')
const databaseHelpers = require($rootDir + '/database/helperFunctions/main.js')

const router = express.Router()

const { authorizations, jummahPreferences } = require($rootDir + "/database/public.js")

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 4 }),
    async (req, res) => {
        try {
            const khateebAuthorization = await authorizations.query({
                filter: {
                    institution: req.headers.institutionid, 
                    role: "khateeb" 
                }
            })
            if (!khateebAuthorization) {
                return res.status(422).json({ 
                    data: [], 
                    msg: `Requested authorization doesn't exist. Authorization reference: role=khateeb institution=${req.headers.institutionid}` 
                })
            }
            const data = await databaseHelpers.getKhateebs(req.headers.institutionid, khateebAuthorization, req.query)
            return res.json({ data, authorizationReference: khateebAuthorization._id })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: [], msg: `Error retrieving khateebs. Err trace: ${err}` })
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.body("khateebId").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("confirmed").isBoolean()
    ]),
    async (req, res) => {
        try {
            const [targetKhateeb] = await $db.users
                .find({ _id: req.body.khateebId })
                .populate("authorizations.authId")
                .exec()
            const targetAuthorization = targetKhateeb.authorizations.find(a => {
                return a.authId.institution.toString() === req.headers.institutionid && a.authId.role === 'khateeb'
            })
            if (!targetAuthorization)
                return res.status(422).json({ data: {}, msg: `target authorization does not exist` }) 
            const data = await $db.users.update(
                { "authorizations._id": targetAuthorization._id },
                { "authorizations.$.confirmed": req.body.confirmed }
            )
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't update khateeb. Err trace: ${err}` })
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 3, max: 4 }),
    validationMiddleware.validateRequest([
        validator.query("authId").isLength($config.consts.mongooseIdLength).isString(),
        validator.query("khateebId").isLength($config.consts.mongooseIdLength).isString(),
    ], "query"),
    async (req, res) => {
        try {
            const [targetUser] = await $db.users
                .find({ _id: req.query.khateebId })
                .populate("authorizations.authId")
                .populate("scheduleRestrictions")
                .exec()
            const targetAuthorization = targetUser.authorizations.find(a => {
                return a.authId.role === 'khateeb' && a.authId.institution.toString() === req.headers.institutionid
            })
            if (!targetAuthorization)
                return res.status(422).json({ data: {}, msg: `target authorization does not exist` })
            const targetScheduleRestrictions = targetUser.scheduleRestrictions
                .filter(sR => sR.institution.toString() === req.headers.institutionid)
                .map(sR => sR._id)
            const updateCommand = databaseHelpers.removeAuthorizationFromUserCommand(targetAuthorization._id)
            updateCommand.$pull.scheduleRestrictions = { $in: targetScheduleRestrictions }
            const data = await $db.users.update({ _id: targetUser._id }, updateCommand)
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: `Couldn't delete khateeb. Err trace: ${err}` })
        }
    }
)

router.post(
    '/availability-change/:type',
    authMiddleware.authenticate({ level: 2 }),
    validationMiddleware.validateRequest([
        validator.body("change").exists(),
        validator.body("msg").isString().isLength({ min: 1 }),
        validator.body("eraseKhateebIdQuery").optional()
    ]),
    async (req, res) => {
        try {
            const note = new notificationConstructors[req.params.type + 'AvailabilityChangeConstructor'](
                req.headers.institutionid,
                { 
                    change: req.body.change,
                    khateebID: req.headers.userid,
                    msg: req.body.msg 
                }
            )
            await note.setRecipentsToAdmins(req.headers.institutionid)
            await note.create()
            if (req.body.eraseKhateebIdQuery) {
                await jummahPreferences.deleteManyEntries({
                    filter: {
                        institutionID: req.headers.institutionid,
                        khateebID: req.headers.userid,
                        ...req.body.eraseKhateebIdQuery  
                    }  
                })
            }
            return res.json({ code: 0 })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ code: 1, msg: `Couldn't notify admins about availability change. Err trace: ${err}` })
        }
    }
)

module.exports = router