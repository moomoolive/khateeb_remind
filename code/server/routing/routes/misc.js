const express = require('express')
const validator = require('express-validator')

const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const router = express.Router()

router.post('/unique-username',
validationMiddleware.validateRequest(
        [
            validator.body("username").exists(),
        ]
    ),
    async (req, res) =>
    {
        try {
            const exists = await $db.users.findOne({ username: req.body.username }).exec()
            return res.json(!exists)
        } catch(err) {
            res.json(`Couldn't verify uniqueness`)
        }
    }
)

router.get('/institution-selection', async (req, res) => {
    try {
        const data = await $db.institutions.find({ confirmed: true, name: { $ne: "__ROOT__" } }).select(["-createdAt", "-updatedAt"]).exec()
        return res.json({ data })
    } catch(err) {
        console.log(err)
        res.json({ data: [], msg: `Couldn't get available institutions. Err trace: ${err}` })
    }
})

router.get('/health-endpoint', (req, res) => {
    return res.json(1)
})

module.exports = router