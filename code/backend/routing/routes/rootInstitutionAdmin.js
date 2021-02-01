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
        console.log(req.body)
        const updated = await $db.funcs.save('institutionAdmins', req.body)
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

module.exports = router