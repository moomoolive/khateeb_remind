const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const databaseHelpers = require($rootDir + '/database/helperFunctions/main.js')

const router = express.Router()

router.use(authMiddleware.authenticate({ level: 4 }))

router.get(
    "/", 
    async (req, res) => {
        try {
            const institutionAdminAuthorization = await $db.authorizations.findOne({ 
                institution: req.headers.institutionid, 
                role: "institutionAdmin" 
            }).exec()
            const data = await $db.users.aggregate([
                // find users that have the 'institutionAdmin' key
                // for requesting institution
                { 
                    $match: { "authorizations.authId": institutionAdminAuthorization._id }
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
                // being an institutionAdmin at this institution
                {
                    $match: { 
                        "authorizations.info.institution": req.headers.institutionid,
                        "authorizations.info.role": "institutionAdmin"
                    }
                },
                // cast institution admins to desired data structure
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
                        confirmed: "$authorizations.confirmed",
                        authorizationId: "$authorizations._id",
                        active: "$active"
                    }
                },
                // filter by request query
                {
                    $match: req.query
                }
            ]).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
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
            console.log(req.query)
            const [targetAdmin] = await $db.users
                .find({ _id: req.body.adminId })
                .populate("authorizations.authId")
                .exec()
            const targetAuthorization = targetAdmin.authorizations.find(a => {
                return a.authId.institution.toString() === req.headers.institutionid && a.authId.role === 'institutionAdmin'
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
    "/",
    validationMiddleware.validateRequest([
        validator.query("authId").isLength($config.consts.mongooseIdLength).isString(),
        validator.query("adminId").isLength($config.consts.mongooseIdLength).isString(),
    ], "query"),
    async (req, res) => {
        try {
            console.log(req.query)
            const [targetUser] = await $db.users
                .find({ _id: req.query.adminId })
                .populate("authorizations.authId")
                .exec()
            const targetAuthorization = targetUser.authorizations.find(a => {
                return a.authId.role === 'institutionAdmin' && a.authId.institution.toString() === req.headers.institutionid
            })
            if (!targetAuthorization)
                return res.status(422).json({ data: {}, msg: `target authorization does not exist` })
            const updateCommand = databaseHelpers.removeAuthorizationFromUserCommand(targetAuthorization._id)
            const data = await $db.users.update({ _id: targetUser._id }, updateCommand)
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.status(503).json({ data: {}, msg: `Couldn't delete institution admin. Err trace: ${err}` })
        }
})

module.exports = router