const shortTypeOf = (val) => { 
    const typeofVal = typeof val
    return typeofVal.slice(0, -3)
}

const typeCheckRequest = (structure, data, depth='') => {
    let msgs = []
    for (let [allowedField, info] of Object.entries(structure)) {
        const value = data[allowedField]
        const valueMissing = typeof value === 'undefined'
        if (!info.required && valueMissing)
            continue
        else if (info.required && valueMissing) {
            msgs.unshift(`Required information missing in ${depth ? `${depth} object` : 'request body'}`)
            continue
        }
        if (!info.__type__) {
            const currentDepth = depth ? `${depth}.${allowedField}` : allowedField
            const deeperMsgs = typeCheckRequest(info, value, currentDepth)
            msgs = [...msgs, ...deeperMsgs]
            continue
        }
        if (info.__type__ === 'arr' && !Array.isArray(value)) {
            msgs.push(`Illegal type in ${depth ? `${depth}.${allowedField}` : allowedField} field. Expected: array, got: ${shortTypeOf(value)}`)
            continue
        }
        if (info.__type__ !== shortTypeOf(value) && !Array.isArray(value)) {
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

const authLevelToUser = (authLevel) => {
    const allowedUserType = []
    switch(authLevel) {
        case 1:
            allowedUserType.push('khateeb')
        case 2:
            allowedUserType.push('institutionAdmin')
        case 3:
            allowedUserType.push('rootInstitutionAdmin')
        case 4:
            allowedUserType.push('sysAdmin')
        case 5:
            allowedUserType.push('root')
    }
    return allowedUserType
}

const permissionGranted = (authLevel, userType) => {
    const allowedUsers = authLevelToUser(authLevel)
    return !!allowedUsers.find(allowedUserType => allowedUserType === userType)
}

module.exports = {
    async confirmOldPassword(request, response, next) {
        const oldPassword = await $db.funcs.getPassword()
        if (request.body.confirm === oldPassword) {
            delete request.body.confirm
            next()
        } else {
            response.status(_.hCodes.unauthorized)
            response.json('Incorrect Credentials')
        }
    },
    typeCheckRequest,
    permissionGranted
}