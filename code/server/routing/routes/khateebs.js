const express = require('express')
const validator = require('express-validator')
const mongoose = require('mongoose')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')
const databaseHelpers = require($rootDir + '/database/helperFunctions/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 2, max: 4 }),
    async (req, res) => {
        try {
            const khateebAuthorization = await $db.authorizations.findOne({ 
                institution: req.headers.institutionid,
                role: 'khateeb'
            }).exec()
            if (!khateebAuthorization)
                return res.status(422).json({ 
                    data: [], 
                    msg: `Requested authorization doesn't exist. Authorization reference: role=khateeb institution=${req.headers.institutionid}` 
                })
            const data = await $db.users.aggregate([
                // get users that have the 'khateeb' authorization key for 
                // requesting institution
                { 
                    $match: { "authorizations.authId": khateebAuthorization._id } 
                },
                { $unwind: "$authorizations" },
                // perform "join" on the "authorization" field
                {
                    $lookup: {
                        from: "authorizations",
                        localField: "authorizations.authId",
                        foreignField: "_id",
                        as: "authorizations.info"
                    }
                },
                { $unwind: "$authorizations.info" },
                // filter out authorizations that aren't relavent to 
                // being a khateeb at this institution
                {
                    $match: { 
                        "authorizations.info.institution": req.headers.institutionid,
                        "authorizations.info.role": "khateeb"
                    }
                },
                // perform "join" on the "scheduleRestriction" field
                {
                    $lookup: {
                        // aggregate won't find model unless the model name
                        // is all lowercase and will NOT work with camel case
                        from: "userschedulerestrictions",
                        localField: "scheduleRestrictions",
                        foreignField: "_id",
                        as: "schedule"
                    }
                },
                { $unwind: '$schedule' },
                // filter out schedule restrictions and that aren't 
                // related to requesting institution
                { 
                    $match: { "schedule.institution": mongoose.Types.ObjectId(req.headers.institutionid), } 
                },
                // cast khateebs to desired data structure
                {
                    $project: {
                        _id: "$_id",
                        handle: "$handle",
                        email: "$email",
                        title: "$title",
                        firstName: "$firstName",
                        lastName: "$lastName",
                        lastLogin: "$lastLogin",
                        createdAt: "$authorizations.createdAt",
                        updatedAt: "$authorizations.updatedAt",
                        availableTimings: "$schedule.availableTimings",
                        unavailableDates: "$schedule.unavailableDates",
                        confirmed: "$authorizations.confirmed",
                        authorizationId: "$authorizations._id",
                        active: "$active",
                        __t: 'khateeb'
                    }
                },
                // now filter khateebs based on query
                {
                    $match: req.query
                }
            ]).exec()
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
        validator.body("msg").isString().isLength({ min: 1 })
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
            return res.json({ code: 0 })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ code: 1, msg: `Couldn't notify admins about availability change. Err trace: ${err}` })
        }
    }
)

module.exports = router