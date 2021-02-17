const express = require('express')

const router = express.Router()

const restrictions = {
    get: {
        institutionAdmin: ['-password', '-username'],
        rootInstitutionAdmin: ['-password', '-username']
    }
}

const CRUD = require($DIR + '/middleware/CRUD/main.js')
const validator = require('express-validator')

CRUD.GET(router, { authLevel: 2, restrictions })

const mongooseIdLength = 24

const postPostHook = async (data) => {
    try {
        const institutionSetting = await $db.models.settings.findOne({ institutionID: data.institutionID })
        if (institutionSetting.autoConfirmRegistration) {
            await $db.models.khateebs.updateOne({ _id: data._id.toString() }, { confirmed: true })
            await new _.notifications.welcome(data).create()
        }
        const note = new _.notifications.khateebSignup(data, institutionSetting.autoConfirmRegistration)
        await note.setRecipentsToAdmins(data.institutionID)
        await note.create()
        return `Asalam alaikoum ${data.firstName}, your account has been created (username: ${data.username}).${ institutionSetting.autoConfirmRegistration ? '' : ' Please wait a day or two for the institution administrator to confirm your account.'}`
    } catch(err) {
        console.log(err)
        console.log(`Couldn't perform khateeb post post-hook`)
        return data
    }
}

CRUD.POST(router, { 
        bodyValidators: [
            validator.body("institutionID").isLength(mongooseIdLength),
            validator.body("username").isLength({ min: 6 }),
            validator.body("password").isLength({ min: 6 }),
            validator.body("handle").isLength({ min: 1 }),
            validator.body("firstName").isLength({ min: 1 }),
            validator.body("lastName").isLength({ min: 1 }),
            validator.body("phoneNumber").isInt({ min: 100_000_0000, max: 999_999_9999 }),
            validator.body("title").isLength({ min: 1 })
        ],
        postHook: postPostHook
    }
)

const deletePostHook = async (data, queryOptions) => {
    try {
        const khateebRes = _.deepCopy(data)
        const userID = queryOptions.fields._id
        const notificationsRes = await $db.models.notifications.deleteMany({ userID })
        const verificationCodeRes = await $db.models.verificationCodes.deleteMany({ userID })
        return { notificationsRes, verificationCodeRes, khateebRes }
    } catch(err) {
        console.log(err)
        console.log(`Couldn't perform khateeb delete post hook`)
        return data
    }
}
CRUD.DELETE(router, { authLevel: 2, allowedQueries: ['_id'], allowedOptions: 'none', postHook: deletePostHook })

module.exports = router