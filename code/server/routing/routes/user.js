const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()
router.use(middleware.auth(1))

router.put(
    '/', 
    middleware.validateRequest(
        [
            validator.body("password").isLength({ min: 6 }).optional(),
            validator.body("username").isLength({ min: 6 }).optional(),
            validator.body("handle").isLength({ min: 1 }).optional(),
            validator.body("firstName").isLength({ min: 1 }).optional(),
            validator.body("lastName").isLength({ min: 1 }).optional(),
            validator.body("phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }).optional(),
            validator.body("availableTimings").isArray().optional(),
            validator.body("unavailableDates").isArray().optional(),
            validator.body("title").isLength({ min: 1 }).optional()
        ]
    ),
    async (req, res) => {
        try {
            const userType = `${req.headers.usertype}${req.headers.usertype === 'root' ? '' : 's'}`
            const mongooseRes = await $db.models[userType].updateOne({ _id: req.headers.userid }, req.body)
            // JWT token carries important information needed on the client side
            // so whenever user information is updated, it should be refreshed
            const token = await _.auth.refreshToken(req.headers.userid)
            return res.json({ token, msg: `Successfully updated`, mongooseRes })
        } catch(err) {
            console.log(err)
            const msg = `Couldn't edit user information`
            console.log(msg)
            res.json(msg)
        }
    }
)

router.get('/check-in', async(req, res) => {
    try {
        // log login time
        const userPackage = {}
        userPackage.lastVisit = await $db.models.users.findOneAndUpdate({ _id: req.headers.userid }, { lastLogin: new Date() }).select(["lastLogin"])
        userPackage.notifications = await $db.models.notifications.find({ userID: req.headers.userid }).sort('-createdAt').limit(10).exec()
        if (req.headers.usertype === 'root' || req.headers.usertype === 'sysAdmin')
            return userPackage
        userPackage.institution = await $db.models.institutions.findOne({ _id: req.headers.institutionid }).select(["-updatedAt", "-__v"]).exec()
        return res.json(userPackage)
    } catch(err) {
        console.log(err)
        res.json(`Check-in failed`)
    }
})

router.put('/mark-notification-as-seen', async (req, res) => {
    try {
        await $db.models.notifications.updateOne(req.body, { seen: true, seenAt: new Date() })
        const notifications = await $db.models.notifications.find({ userID: req.headers.userid }).sort('-createdAt').limit(10).exec()
        return res.json(notifications)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update notification status`)
    }
})

router.delete('/', async (req, res) => {
    try {
        const deletedUser = await $db.models.users.deleteOne({ _id: req.headers.userid })
        const deletedNotifications = await $db.models.notifications.deleteMany({ userID: user })
        return res.json({ msg: 'Successfully deleted account', notifications: deletedNotifications, user: deletedUser })
    } catch(err) {
        console.log(err)
        res.json(`Couldn't delete account`)
    }
})

module.exports = router