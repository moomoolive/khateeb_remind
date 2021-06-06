const express = require('express')
const validator = require('express-validator')

const validationMiddleware = require($rootDir + '/middleware/validation/main.js')

const { institutions, users } = require($rootDir + "/database/public.js")

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
            const exists = await users.findEntry({ filter: { username: req.body.username } })
            return res.json(!exists)
        } catch(err) {
            console.error(err)
            return res.json(`Couldn't verify uniqueness`)
        }
    }
)

router.get('/institution-selection', async (req, res) => {
    try {
        const data = await institutions.query({
            filter: { confirmed: true, active: true },
            sortBy: ["-createdAt", "-updatedAt"]
        })
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