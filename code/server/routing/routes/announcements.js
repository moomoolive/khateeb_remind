const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')
const authMiddleware = require($DIR + '/middleware/auth/main.js')
const validationMiddleware = require($DIR + '/middleware/validation/main.js')
const postRequestMiddleware = require($DIR + '/middleware/postRequests/main.js')

const router = express.Router()

router.get(
    '/',
    middleware.auth(1),
    async (req, res) => {
        let announcements = []
        try {
            announcements = await $db.models.announcements.find({ institutionID: req.headers.institutionid, ...req.query}).limit(20).exec()
            return res.json(announcements)
        } catch(err) {
            console.log(err)
            return res.json({ announcements, msg: { status: 'err', errorTrace: err } })
        }
    }
)

router.post(
    '/',
    middleware.auth(2),
    postRequestMiddleware.appendUserInfoToBody("institutionID"),
    validationMiddleware.validateRequest([
        validator.body("institutionID").isLength(24),
        validator.body("headline").isLength({ min: 1 }),
        validator.body("content").isLength({ min: 1 }),
        validator.body("important").isBoolean(),
        validator.body("urgent").isBoolean(),
    ]),
    async (req, res) => {
        console.log(req.body)
        try {
            const newAnnouncement = await $db.models.announcements(req.body).save()
            return res.json(newAnnouncement)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't create announcement`)
        }
    }
)

router.put(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.body("_id").isLength(24),
        validator.body("headline").isLength({ min: 1 }).optional(),
        validator.body("content").isLength({ min: 1 }).optional(),
        validator.body("important").isBoolean().optional(),
        validator.body("urgent").isBoolean().optional(),
    ]),
    authMiddleware.isAllowedToUpdateResource(["institutionID"], "announcements"),
    async (req, res) => {
        console.log(req.body)
        try {
            const updated = await $db.models.announcements.findOneAndUpdate(req.body._id, req.body, { new: true })
            return res.json(updated)
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't update announcement`)
        }
    }
)

router.delete(
    '/',
    middleware.auth(2),
    validationMiddleware.validateRequest([
        validator.query("_id").isLength(24)
    ], "query"),
    authMiddleware.isAllowedToDeleteResource(["institutionID"], "announcements"),
    async (req, res) => {
        try {
            await $db.models.announcements.deleteOne(req.query)
            return res.json({ msg: `Deleted Announcement ${req.query._id}` })
        } catch(err) {
            console.log(err)
            return res.json(`Couldn't delete timing`)
        }
    }
)


module.exports = router