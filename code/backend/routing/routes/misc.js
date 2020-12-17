import express from 'express'
import jwt from 'jsonwebtoken'

import $dbModels from '../../database/models.js'
import $utils from '../../utils/funcs.js'
import $areaCode from '../../utils/areaCodes/codes.js'
import { middleware } from '../../utils/middleware.js'
import env from '../../app.js'

const router = express.Router()

let verificationCode;
const adminNumber = '+14034716397' // hardcoded for now
router.get('/reset-pass', (req, res) => {
    verificationCode = $utils.generateRandomNumber()
    env.text.messages
        .create({
            body: `This is your verification code ${verificationCode}`,
            from: env.phone,
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
        verificationCode = null
        const secsPerMin = 60
        const thirtyMinutes = 30 * secsPerMin
        const response = {
            token: jwt.sign({ user: 'admin' }, env.jwt, { expiresIn: thirtyMinutes }),
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
    jwt.verify(token, env.jwt, (err, decoded) => {
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

router.post('/area-code', [middleware.validationCheck(['code']), middleware.authAdmin],
    (req, res) => {
        const code = req.body.code
        const exists = $areaCode.isCanadian(code)
        if (exists) res.json('exists')
        else res.json('none')
})

export { router as misc }