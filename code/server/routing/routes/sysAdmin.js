const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const router = express.Router()

router.use(authMiddleware.authenticate({ min: 4, max: 5 }))

router.get('/institutions', async (req, res) => {
    try {
        const data = await $db.institutions.find(req.query).exec()
        return res.json({ data })
    } catch(err) {
        console.log(err)
        return res.json({ data: [], msg: `Couldn't retrieve institutions. Err trace: ${err}` })
    }
})

router.put('/institutions', 
    validationMiddleware.validateRequest([ 
        validator.body("institutionID").isLength(global.APP_CONFIG.consts.mongooseIdLength).isString(),
        validator.body("confirmed").isBoolean().optional(),
        validator.body("settings").optional()
    ]),
    async (req, res) => {
        try {
            console.log(req.body)
            const data = await $db.institutions.findOneAndUpdate({ _id: req.body.institutionID }, req.body, { new: true }).exec()
            return res.json({ data })
        } catch(err) {
            console.log(err)
            return res.json({ data: {}, msg: `there was a problem updating institution status. Err trace: ${err}` })
        }

})

module.exports = router