import express from 'express'
import jwt from 'jsonwebtoken'
import $dbModels from '../database/models.js'
import twilio from 'twilio'
const client = twilio(process.env.TWILIO_USER, process.env.TWILIO_KEY)
import $utils from '../utils/funcs.js'

import { middleware } from '../utils/middleware.js'
import ENV from '../app.js'

const router = express.Router()

let verificationCode;
const adminNumber = '+14034716397' // hardcoded for now
router.get('/reset-pass', (req, res) => {
    verificationCode = $utils.generateRandomNumber().toString()
    client.messages
        .create({
            body: `This is your verification code ${verificationCode}`,
            from: process.env.TWILIO_NUMBER,
            to: adminNumber
        })
            .then((mes) => {
                res.json('texted')
                console.log(mes)
            })
})

router.post('/verify-admin-text', middleware.validationCheck(['code']), (req, res) => {
    const code = req.body.code
    if (code === verificationCode && verificationCode) {
        const secsPerMin = 60
        const thirtyMinutes = 30 * secsPerMin
        const response = {
            token: jwt.sign({ user: 'admin' }, ENV.JWT_SECRET, { expiresIn: thirtyMinutes }),
            msg: `verified`
        }
        res.json(response)
    } else {
        res.status(401)
        res.json('Unauthorized')
    }
})

router.post('/save-pass', middleware.validationCheck(['token', 'passwordInfo']), (req, res) => {
    const token = req.body.token
    console.log(req.body)
    jwt.verify(token, ENV.JWT_SECRET, (err, decoded) => {
        if(err || decoded.user !== 'admin') {
            res.status(401)
            res.json('Unauthorized')
        } else {
            $dbModels.settings.findOneAndUpdate(
                { name: req.body.passwordInfo.name },
                { 
                    options: req.body.passwordInfo.options,
                    savedOn: new Date()
                }, (err) => {
                    if (err) console.log(err)
                    else res.json(`success`)
                }
            )
        }
    })
})

export { router as misc }