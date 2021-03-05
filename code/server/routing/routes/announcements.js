const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')
const postRequestMiddleware = require(global.$dir + '/middleware/postRequests/main.js')

const router = express.Router()


router.get(
    '/',
    authMiddleware.authenticate({ min: 1, max: 3 }),
    async (req, res) => {
        let announcements = []
        try {
            announcements = await $db.announcements.find({ institutionID: req.headers.institutionid, ...req.query}).limit(20).exec()
            return res.json(announcements)
        } catch(err) {
            console.log(err)
            return res.json({ announcements, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.post(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(24),
        validator.body("headline").isLength({ min: 1 }),
        validator.body("content").isLength({ min: 1 }),
        validator.body("important").isBoolean(),
        validator.body("urgent").isBoolean(),
    ]),
    async (req, res) => {
        try {
            const newAnnouncement = await $db.announcements(req.body).save()
            return res.json(newAnnouncement)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't create announcement`)
        }
    }
)

router.put(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("headline").isLength({ min: 1 }).optional(),
        validator.body("content").isLength({ min: 1 }).optional(),
        validator.body("important").isBoolean().optional(),
        validator.body("urgent").isBoolean().optional(),
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "announcements"),
    async (req, res) => {
        try {
            const updated = await $db.announcements.findOneAndUpdate(req.body._id, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update announcement`)
        }
    }
)

router.delete(
    '/',
    authMiddleware.authenticate({ min: 2, max: 3 }),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "announcements"),
    async (req, res) => {
        try {
            await $db.announcements.deleteOne(req.query)
            return res.json({ msg: `Deleted Announcement ${req.query._id}` })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete timing`)
        }
    }
)


module.exports = router