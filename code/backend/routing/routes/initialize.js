import express from 'express'
import env from '../../app.js'
import $db from '../../database/funcs.js'

const router = express.Router()

router.post('/password', (req, res) => {
    if (req.body.API === env.emergency_key) {
        $db.save('settings', req.body.data, res)
    } else {
        res.status(401)
        res.json('Unauthorized')
    }
})

router.get('/pass-exists', (req, res) => {
    const response = $db.getPassword()
    if (response) res.json('exists')
    else res.json('None')
})

export { router as initialize }