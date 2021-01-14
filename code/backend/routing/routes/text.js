const express = require('express')

const wednesdayReminder = require($DIR + '/cron/wednesdayReminder.js')
const thursdayReport = require($DIR + '/cron/thursdayReport.js')
const fridayCleanup = require($DIR + '/cron/fridayTextCleanup.js')
const dummyText = require('./text.json')

const router = express.Router()

router.post('/hub', express.urlencoded({ extended: true }), async (req, res) => {
    try {
        const msg = dummyText //req.body
        if ($utils.text.isTextConfirmationOrCanceling(msg)) {
            console.log('confirmation')
            $utils.text.updateTextHub(msg)
        } else {
            $utils.text.sendTextToAdmin(msg)    
        }
    } catch(err) {
        console.log('There was a problem sending text')
        console.log(err)
    }
})

//wednesdayReminder.start()
//thursdayReport.start()
//fridayCleanup.start()


module.exports = router