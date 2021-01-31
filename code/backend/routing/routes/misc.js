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

module.exports = router