const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.use(middleware.auth(3))

const routerGroup1 = 'institutionAdmin'
const routerGroup1URL = `/${routerGroup1}`

router.get(routerGroup1URL, async (req, res) => {
    try {
        const data = await $db.models.institutionAdmins.find({ institutionID: req.headers.institutionid }).select(['-updatedAt', "-__v", "-password"]).exec()
        res.json(data)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get institutional Admins`)
    }
})

router.post(routerGroup1URL, 
    middleware.validateRequest(
        [
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
        req.body.institutionID = req.headers.institutionid
        req.body.confirmed = true
        const updated = await $db.funcs.save('institutionAdmins', req.body)
        const welcomeMsg = new _.notifications.welcome(updated)
        await welcomeMsg.create()
        return res.json(updated)
    } catch(err) {
        console.log(err)
        res.json(`There was a creating institutional admin`)
    }
})

router.delete(routerGroup1URL + "/:_id", async (req, res) => {
    try {
        const deleted = await $db.models.institutionAdmins.deleteOne(req.params)
        res.json(deleted)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't delete institution admin ${req.params._id}`)
    }
})

router.delete('/institution', async (req, res) => {
    try {
        const models = Object.keys($db.models)
        const deleteRes = {}
        deleteRes.institution = await $db.models.institutions.deleteOne({ _id: req.headers.institutionid })
        for (let i = 0; i < models.length; i++) {
            const model = models[i]
            if (model === 'institutions')
                continue
            deleteRes[model] = await $db.models[model].deleteMany({ institutionID: req.headers.institutionid })
        }
        res.json({ msg: "Successfully deleted institution", ...deleteRes })
    } catch(err) {
        console.log(err)
        res.json(`Couldn't delete institution`)
    }
})

module.exports = router