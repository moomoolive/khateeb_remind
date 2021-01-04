import express from 'express'

import $utils from '../../utils/index.js'
import { middleware } from '../../utils/middleware.js'
import env from '../../app.js'
import $db from '../../database/index.js'

const router = express.Router()

router.get('/check-text-service', async (req, res) => {
    try {
        const adminProfile = await $db.funcs.getAdminProfile()
        const msg = await $utils.text.send(
            adminProfile.options.phoneNumber,
            `
                Asalam alikoum ${adminProfile.options.firstName}! It looks like khateeb remind's text service is well and alive!
            `
        )
        console.log(msg)
        res.json('text was sent')
    } catch(err) {
        console.log(err)
        res.json('text service offline')
    }
})

let verificationCode
router.get('/reset-pass', async (req, res) => {
    try {
        verificationCode = $utils.funcs.generateRandomNumber()
        const adminProfile = await $db.funcs.getAdminProfile()
        const adminNumber = adminProfile.options.phoneNumber
        const msg = await $utils.text.send(
            adminNumber,
            `This is your verification code ${verificationCode}`
        )
        console.log(msg)
        res.json('text was sent')
    } catch {
        res.json('Admin Not Found or text service offline')
    }
})

router.post('/verify-admin', middleware.validationCheck(['verificationCode', 'createNewPassword']), (req, res) => {
    const code = parseInt(req.body.verificationCode)
    const verificationCodeExistsAndEqualsSubmitted = (code === verificationCode && verificationCode)
    if (code === env.emergency_key || verificationCodeExistsAndEqualsSubmitted) {
        const password = {
            __t: 'password',
            options: req.body.createNewPassword
        }
        $db.funcs.save('password', password)
    } else {
        res.status($utils.hCodes.unauthorized)
        res.json('Unauthorized')
    }
})

router.post('/area-code', [middleware.validationCheck(['code']), middleware.authAdmin],
    (req, res) => {
        const exists = $utils.areaCodes.isCanadian(req.body.code)
        if (exists) res.json('exists')
        else res.json('none')
})

export { router as misc }