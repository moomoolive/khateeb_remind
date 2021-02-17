const express = require('express')

const router = express.Router()

const restrictions = {
    get: {
        institutionAdmin: ['-password', '-username'],
        rootInstitutionAdmin: ['-password', '-username']
    }
}

const CRUD = require($DIR + '/middleware/CRUD/main.js')

CRUD.GET(router, { authLevel: 2, restrictions })

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