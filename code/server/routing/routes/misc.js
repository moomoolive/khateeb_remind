const express = require('express')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

const typeCheck = {
    uniqueUser: {
        username: {
            __type__: 'str',
            required: true
        }
    }
}

router.post('/unique-username',
    middleware.allowedFields(typeCheck.uniqueUser),
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

module.exports = router