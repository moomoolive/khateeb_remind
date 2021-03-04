const express = require('express')

const middleware = require($DIR + '/middleware/main.js')

const router = express.Router()

router.get(
    '/',
    middleware.auth(1), 
    async (req, res) => {
        console.log(req.query)
        let jummahs = []
        try {
            jummahs = await $db.models.jummahs.find({ institutionID: req.headers.institutionid, ...req.query }).exec()
            return res.json({ jummahs })
        } catch(err) {
            console.log(err)
            return res.json({ jummahs, msg: { status: 'err', errorTrace: err } })
        }
})

module.exports = router