const express = require('express')

const middleware = require($DIR + '/middleware/main.js')
const typeChecks = require('./rootInstitutionAdminTC.json')

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
    middleware.allowedFields(typeChecks.institutionAdmin),
    async (req, res) => {
    try {
        req.body.institutionID = req.headers.institutionid
        req.body.confirmed = true
        const updated = await $db.funcs.save('institutionAdmins', req.body)
        if (!req.body._id) {
            const welcomeMsg = new _.notifications.welcome(updated)
            const saved = await welcomeMsg.create()
        }
        res.json(`Successfully made ${updated.firstName} ${updated.lastName} an institutional admin!`)
    } catch(err) {
        console.log(err)
        res.json(`There was a problem updated institutional admins`)
    }
})

router.delete(routerGroup1URL, async (req, res) => {
    try {
        const deleted = await $db.models.institutionAdmins.deleteOne(req.body)
        res.json('Successfully deleted')
    } catch(err) {
        console.log(err)
        res.json(`Couldn't delete institution admin ${req.body._id}`)
    }
})

router.delete('/delete-institution', async (req, res) => {
    try {
        const models = Object.keys($db.models)
        const deletedInstitution = await $db.models.institutions.deleteOne({ _id: req.headers.institutionid })
        for (let i = 0; i < models.length; i++) {
            const model = models[i]
            if (model === 'institutions')
                continue
            const deleted = await $db.models[model].deleteMany({ institutionID: req.headers.institutionid })
        }
        res.json('Successfully deleted institution')
    } catch(err) {
        console.log(err)
        res.json(`Couldn't delete institution`)
    }
})

module.exports = router