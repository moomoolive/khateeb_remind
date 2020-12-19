import express from 'express'
import jwt from 'jsonwebtoken'

import $dbModels from '../../database/models.js'
import $utils from '../../utils/funcs.js'
import $areaCode from '../../utils/areaCodes/codes.js'
import { middleware } from '../../utils/middleware.js'
import env from '../../app.js'
import $db from '../../database/funcs.js'
import $text from '../../utils/texting.js'

const router = express.Router()

router.get('/check-text-service', async (req, res) => {
    try {
        const adminProfile = await $db.getAdminProfile()
        $text.send(
            adminProfile.options.phoneNumber,
            `
                Asalam alikoum ${adminProfile.options.firstName}! It looks like khateeb remind's text service is well and alive!
            `,
            res
    )
    } catch {
        res.json('text service offline')
    }
})

let verificationCode
router.get('/reset-pass', async (req, res) => {
    try {
        verificationCode = $utils.generateRandomNumber()
        const adminProfile = await $db.getAdminProfile()
        const adminNumber = adminProfile.options.phoneNumber
        $text.send(
            adminNumber,
            `This is your verification code ${verificationCode}`,
            res
        )
    } catch {
        res.json('Admin Not Found or text service offline')
    }
})

router.post('/verify-admin-text', middleware.validationCheck(['code']), (req, res) => {
    const code = parseInt(req.body.code)
    console.log(code, verificationCode)
    console.log(code === verificationCode)
    if (code === verificationCode && verificationCode) {
        const secsPerMin = 60
        const thirtyMinutes = 30 * secsPerMin
        const response = {
            token: jwt.sign({ user: 'admin' }, env.jwt, { expiresIn: thirtyMinutes }),
            msg: `verified`
        }
        res.json(response)
        verificationCode = null
    } else {
        res.status(401)
        res.json('Unauthorized')
    }
})

router.post('/save-pass', middleware.validationCheck(['token', 'passwordInfo']), (req, res) => {
    const token = req.body.token
    jwt.verify(token, env.jwt, (err, decoded) => {
        if(err || decoded.user !== 'admin') {
            res.status(401)
            res.json('Unauthorized')
        } else {
            $dbModels.password.findOneAndUpdate( {},
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