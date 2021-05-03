const express = require('express')
const validator = require('express-validator')
const mongoose = require('mongoose')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const notificationConstructors = require($rootDir + '/libraries/notifications/index.js')

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
                        authorizationId: "$authorizations._id"
                    }
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
        validator.body("_id").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("active").isBoolean().optional(),
        validator.body("confirmed").isBoolean().optional()
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "khateebs"),
    async (req, res) => {
        try {
            const data = await $db.khateebs.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
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
        validator.query("_id").isLength($config.consts.mongooseIdLength).isString()
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "khateebs"),
    async (req, res) => {
        try {
            const khateeb = await $db.khateebs.findOne(req.query)
            const dependantsRes = await khateeb.deleteNotifications()
            const deleted = await $db.khateebs.deleteOne(req.query)
            return res.json({ data: { khateeb: deleted, dependantsRes } })
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
            const note = new notificationConstructors[req.params.type + 'AvailabilityChangeConstructor']({ 
                change: req.body.change,
                khateebID: req.headers.userid,
                msg: req.body.msg 
            })
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