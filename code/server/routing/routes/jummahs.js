const express = require('express')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')

const router = express.Router()

router.get(
    '/',
    authMiddleware.authenticate({ min: 1, max: 3 }), 
    async (req, res) => {
        console.log(req.query)
        let jummahs = []
        try {
            jummahs = await $db.jummahs.find({ institutionID: req.headers.institutionid, ...req.query }).exec()
            return res.json({ jummahs })
        } catch(err) {
            console.log(err)
            return res.json({ jummahs, msg: { status: 'err', errorTrace: err } })
        }
})

module.exports = router