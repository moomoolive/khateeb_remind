const express = require('express')
const validator = require('express-validator')

const authMiddleware = require($rootDir + '/middleware/auth/main.js')
const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const { institutions, authorizations } = require($rootDir + "/database/public.js")

const router = express.Router()

router.use(authMiddleware.authenticate({ min: 5, max: 6 }))

router.get('/institutions', async (req, res) => {
    try {
        const data = await institutions.query({ filter: req.query })
        return res.json({ data })
    } catch(err) {
        console.log(err)
        return res.status(503).json({ data: [], msg: `Couldn't retrieve institutions. Err trace: ${err}` })
    }
})

router.put('/institutions', 
    validationMiddleware.validateRequest([ 
        validator.body("institutionID").isLength($config.consts.mongooseIdLength).isString(),
        validator.body("confirmed").isBoolean().optional(),
        validator.body("settings").optional()
    ]),
    async (req, res) => {
        try {
            const data = await institutions.updateEntry({
                filter: { _id: req.body.institutionID },
                updates: req.body,
                returnOptions: { new: true }
            })
            if (data.confirmed) {
                const auths = await authorizations.query({ filter: { institution: data._id } })
                await $db.users.update(
                    { "authorizations.authId": auths.find(a => a.role === 'rootInstitutionAdmin')._id.toString() },
                    { $set: { "authorizations.$.confirmed": true } }
                )
            }
            return res.json({ data })
        } catch(err) {
            console.error(err)
            return res.status(503).json({ data: {}, msg: `there was a problem updating institution status. Err trace: ${err}` })
        }

})

module.exports = router