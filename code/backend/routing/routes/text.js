const express = require('express')

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


module.exports = router