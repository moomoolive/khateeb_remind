const express = require('express')

const requestTypeChecks = require("./authTC.json")

const router = express.Router()

const arraysSameContentEqualOrder = (a, b) => {
    for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i])
                return false
    }
    return true
}

const arraysSameContent = (a, b) => {
    for (let i = 0; i < a.length; i++) {
        const found = !!b.find(elem => elem === a[i])
        if (!found)
            return false
    }
    return true
}

const equalArrays = (a, b, orderMatters=false) => {
    if (a.length !== b.length)
        return false

    if (orderMatters)
        return arraysSameContentEqualOrder(a, b)
    else
        return arraysSameContent(a, b)
}

const shortTypeOf = (val) => { 
    const typeofVal = typeof val
    return typeofVal.slice(0, -3)
}

const typeCheckRequest = (structure, data, depth='') => {
    let msgs = []
    for (let [allowedField, info] of Object.entries(structure)) {
        const value = data[allowedField]
        if (info.required === false && !value)
            continue
        else if ((info.required && !value) || !value) {
            msgs.unshift(`Required information missing in ${depth ? `${depth} object` : 'request body'}`)
            continue
        }
        if (!info.__type__) {
            const currentDepth = depth ? `${depth}.${allowedField}` : allowedField
            const deeperMsgs = typeCheckRequest(info, value, currentDepth)
            msgs = [...msgs, ...deeperMsgs]
            continue
        }
        if (info.__type__ === 'arr' && !Array.isArray(data[allowedField])) {
            msgs.push(`Illegal type in ${depth ? `${depth}.${allowedField}` : allowedField} field. Expected: array, got: ${shortTypeOf(value)}`)
            continue
        }
        if (info.__type__ !== shortTypeOf(data[allowedField])) {
            msgs.push(`Illegal type in ${depth ? `${depth}.${allowedField}` : allowedField} field. Expected: ${info.__type__}, got: ${value === null ? null : shortTypeOf(value)}`)
            continue
        }
    }

    for (let [requestField, value] of Object.entries(data)) {
        if (!structure[requestField]) {
            msgs.unshift(`Illegal fields in ${depth ? `${depth} object` : 'request body'}`)
            break
        }
    }
    return msgs
}

const allowedFields = (fields={}) => {
    return (request, response, next) => {
        let failed = typeCheckRequest(fields, request.body)
        if (failed.length < 1)
            next()
        else {
            response.status($utils.hCodes.notAcceptable)
            response.json(failed)
        }
    }
}


router.post('/create/institution', allowedFields(requestTypeChecks.createInstitution), async (req, res) => {
    try {
        const institutionEntry = await $db.funcs.save('institutions', req.body.institution)
        const institutionID = institutionEntry._id.toString()
        req.body.user.institutionID = institutionID
        const userEntry = await $db.funcs.save('users', req.body.user)
        req.body.institutionAdmin.userID = userEntry._id.toString()
        req.body.institutionAdmin.institutionID = institutionID
        const institutionAdminEntry = await $db.funcs.save('institutionAdmins', req.body.institutionAdmin)
        res.json(`Alhamdillah! ${institutionEntry.name} was created, with ${institutionAdminEntry.firstName} ${institutionAdminEntry.lastName} as it's administrator (username: ${userEntry.username}). Please wait a day or two for 'khateeb.com' to confirm your institution before logging in.`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't create Institution and Administrator - this is probably a server issue. Please try again later.`)
    }
})

router.post('/create/khateeb', allowedFields(requestTypeChecks.createKhateeb), async (req, res) => {
    try {
        const userEntry = await $db.funcs.save('users', req.body.user)
        req.body.khateeb.userID = userEntry._id.toString()
        const khateebEntry = await $db.funcs.save('khateebs', req.body.khateeb)
        res.json(`Asalam alaikoum ${khateebEntry.firstName} ${khateebEntry.lastName}, your account has been created (username: ${userEntry.username}). Please wait a day or two for the institution administrator to confirm your account.`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't create khateeb - this is probably a server issue. Please try again later`)
    }
})

const userExists = async (request, response, next) => {
    const user = await $db.models.users.findOne({ username: request.body.username }).exec()
    if (!user)
        response.json({ token: null })
    else {
        request.__USER__ = user
        next()
    }

}

router.post('/', [allowedFields(requestTypeChecks.login), userExists], async (req, res) => {
    try {
        let token
        const user = req.__USER__
        validPassword = await user.comparePassword(user.password)
        if (!validPassword)
            token = null
        else if (user.isDefault)
            token = 'default'
        else {
            const profile = await $db.models.profiles.findOne({ userID: user._id.toString() }).select(["-createdAt", "-updatedAt"])
            if (!user.confirmed && user.__t !== 'root') {
                token = `not-confirmed-${profile.__t}`
            } else
                token = $utils.auth.createToken('60-days', profile.__t, profile)
        }
        res.json(token)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't sign in user - this probably a problem with the server. Please try again later`)
    }
})

router.post('/create/root', allowedFields(requestTypeChecks.createRoot), async (req, res) => {
    try {
        const rootExists = await $db.models.root.findOne({}).exec()
        if (!!rootExists)
            res.json('already exists')
        else {
            const apiKey = process.env.EMERGENCY_KEY || '1234'
            if (req.body.apiKey !== apiKey) {
                res.status($utils.hCodes.unauthorized)
                res.json('unauthorized')
            } else {
                const rootInstitutionID = "__ROOT__"
                req.body.user.confirmed = true
                req.body.user.institutionID = rootInstitutionID
                const userEntry = await $db.funcs.save('users', req.body.user)
                req.body.profile.institutionID = rootInstitutionID
                req.body.profile.userID = userEntry._id.toString()
                const rootEntry = await $db.funcs.save('root', req.body.profile)
                res.json(`Successfully created root user with username: ${userEntry.username}`)
            }
        }
    } catch(err) {
        console.log(err)
        res.json('There was an issue creating root user, check console output for errors')
    }
})

module.exports = router