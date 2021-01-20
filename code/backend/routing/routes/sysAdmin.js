const express = require('express')

const middleware = require($DIR + "/middleware/main.js")
const requestTypeChecks = require('./sysAdminTC.json')

const router = express.Router()

router.use(middleware.auth(3))

router.get('/pending-institutions', async (req, res) => {
    try {
        const pendingInstitutions = await $db.models.institutions.find({ confirmed: false })
        res.json(pendingInstitutions)
    } catch(err) {
        console.log('there was an error retrieving pending institions')
        console.log(err)
        res.json('there was an error retrieving pending institions')
    }
})

router.post('/institution-status',
    middleware.allowedFields(requestTypeChecks.institutionStatus),
    async (req, res) => {
        try {
            if (req.body.confirmed) {
                const updated = await $db.models.institutions.updateOne({ _id: req.body._id }, req.body)
                if (req.body.users) {
                    const updatedAdmin = await $db.models.institutionAdmins.updateOne({ institutionID: req.body._id }, { confirmed: true })
                }
                res.json(`Successfully confirmed status of institution ${req.body._id}${req.body.users ? ` and it's administrator` : ''}`)
            } else {
                const updated = await $db.models.institutions.updateOne({ _id: req.body._id }, req.body)
                if (req.body.users) {
                    const updatedUsers = await $db.models.users.updateMany({ institutionID: req.body._id }, { confirmed: false })
                }
                res.json(`Successfully disconfirmed status of institution ${req.body._id} and all of it's users`)
            }
        } catch(err) {
            console.log(`there was a problem updating the status of institution: ${req.body._id}`)
            console.log(err)
            res.json(`there was a problem updating the status of institution: ${req.body._id}`)
        }
    }
)


module.exports = router