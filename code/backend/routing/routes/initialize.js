import express from 'express'
import env from '../../app.js'
import $db from '../../database/funcs.js'

const router = express.Router()

router.post('/password', (req, res) => {
    if (req.body.API === env.emergency_key) {
        $db.save('password', req.body.data, res)
    } else {
        res.status(401)
        res.json('Unauthorized')
    }
})

router.get('/pass-exists', async (req, res) => {
    const response = await $db.getPassword()
    if (response) res.json('exists')
    else if (!response) res.json('None')
})

export { router as initialize }