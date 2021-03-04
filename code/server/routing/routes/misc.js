const express = require('express')
const validator = require('express-validator')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.post('/unique-username',
    middleware.validateRequest(
        [
            validator.body("username").exists(),
        ]
    ),
    async (req, res) =>
    {
        try {
            const exists = await $db.models.users.findOne({ username: req.body.username }).exec()
            res.json(!exists)
        } catch(err) {
            res.json(`Couldn't verify uniqueness`)
        }
    }
)

router.get('/institution-selection', async (req, res) => {
    try {
        const data = await $db.models.institutions.find({ confirmed: true }).select(["-createdAt", "-updatedAt"]).exec()
        return res.json(data)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't get institutions!`)
    }
})

router.get('/redirect/:shortCode', async (req, res) => {
    const homepage = 'https://app.khateebs.com'
    try {
        const url = await $db.models.shortenedURLs.findOne({ shortURLCode: req.params.shortCode }).exec()
        const redirect = url ? `https://${url.longURL}` : homepage
        let msg = null
        if (!url)
            msg = `This link doesn't exist or is no longer active! Redirecting you to home.`
        res.send({ status: 'all good', url: redirect, msg })
    } catch(err) {
        console.log(err)
        res.json({ status: "err", url: homepage})
    }
})

module.exports = router