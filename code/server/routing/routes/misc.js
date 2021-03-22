const express = require('express')
const validator = require('express-validator')

const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

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
        const data = await $db.institutions.find({ confirmed: true, _id: { $ne: "__ROOT__" } }).select(["-createdAt", "-updatedAt"]).exec()
        return res.json(data)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get institutions!`)
    }
})

router.get('/redirect/:shortCode', async (req, res) => {
    const homepage = 'https://app.khateebs.com'
    try {
        const url = await $db.shortenedURLs.findOne({ shortURLCode: req.params.shortCode }).exec()
        const redirect = url ? `https://${url.longURL}` : homepage
        let msg = null
        if (!url)
            msg = `This link doesn't exist or is no longer active! Redirecting you to home.`
        return res.json({ status: 'all good', url: redirect, msg })
    } catch(err) {
        console.log(err)
        res.json({ status: "err", url: homepage})
    }
})

module.exports = router