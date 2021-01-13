const express = require('express')

const wednesdayReminder = require($DIR + '/cron/wednesdayReminder.js')

const router = express.Router()

router.post('/hub', express.urlencoded({ extended: true }),(req, res) => {
    console.log(req.body)
})

wednesdayReminder.start()


module.exports = router