const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')

const router = express.Router()

const { 
    authorizations, 
    jummahPreferences,
    users 
} = require($rootDir + "/database/public.js")

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
            const data = await users.findKhateebs(req.headers.institutionid, khateebAuthorization, req.query)
            return res.json({ data, authorizationReference: khateebAuthorization._id })
        } catch(err) {
            console.error(err)
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
            const [targetKhateeb] = await users.query({
                filter: { _id: req.body.khateebId },
                populate: "authorizations.authId"
            })
            const targetAuthorization = targetKhateeb.authorizations.find(a => {
                return a.authId.institution.toString() === req.headers.institutionid && a.authId.role === 'khateeb'
            })
            if (!targetAuthorization) {
                return res.status(422).json({ data: {}, msg: `target authorization does not exist` }) 
            }
            const data = await users.confirmAuthorization(targetAuthorization._id, req.body.confirmed)
            return res.json({ data })
        } catch(err) {
            console.error(err)
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
            const targetUser = await users.populateScheduleRestrictionsAndAuthorizations(req.query.khateebId)
            const targetAuthorization = targetUser.authorizations.find(a => {
                return a.authId.role === 'khateeb' && a.authId.institution.toString() === req.headers.institutionid
            })
            if (!targetAuthorization) {
                return res.status(422).json({ data: {}, msg: `target authorization does not exist` })
            }
            const targetScheduleRestrictions = targetUser.scheduleRestrictions
                .filter(sR => sR.institution.toString() === req.headers.institutionid)
                .map(sR => sR._id)
            const data = await users.removeAuthorization(
                targetUser._id,
                targetAuthorization._id,
                { $pull: { scheduleRestrictions: { $in: targetScheduleRestrictions } } }
            )
            return res.json({ data })
        } catch(err) {
            console.error(err)
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