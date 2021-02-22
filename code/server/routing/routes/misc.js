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

router.get('/pending-khateebs', 
    middleware.auth(2),
    async (req, res) => {
        try {
            const pending = await $db.models.khateebs.find({ institutionID: req.headers.institutionid, confirmed: false }).exec()
            const count = pending.length
            res.json(count === 0 ? null : count)
        } catch(err) {
            console.log(err)
            res.json(`Couldn't retrieve pending khateebs`)
        }
    }
)

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