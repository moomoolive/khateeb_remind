const jwt = require('jsonwebtoken')

const helpers = require('./helpers.js')
const resourceOwnershipValidation = require('./resourceOwnerChecking/main.js')
const typeCheckingHelpers = require($rootDir + '/libraries/typeChecking/main.js')

const { securityConfig } = require($rootDir + "/Server.config.js")

const createToken = (info={}, expiresAfter='60-days') => {
    const expiration = helpers.expirationDate(expiresAfter)
    return jwt.sign(info, securityConfig.jwtSecret, { expiresIn: expiration })
}

const refreshToken = async (userId) => {
    try {
        const unwantedFields = ["-password", "-__v", "-confirmed"]
        let user = await $db.users.findOne({ _id: userId }).select(unwantedFields).exec()
        user = JSON.parse(JSON.stringify(user))
        return createToken(user)
    } catch(err) {
        console.log(err)
        return err
    }
}

const userTypeToAuthLevel = (userType) => {
    const index = helpers.authLevels.findIndex(level => level === userType)
    return index === -1 ? 0 : index + 1
}

const validUserAuthentication = (userType, authOptions={}) => {
    if (!helpers.validInt(authOptions) && !typeCheckingHelpers.isAnObject(authOptions))
        throw TypeError(`You must provide valid authentication options`)
    else if (helpers.emptyAuthOptionObject(authOptions))
        return true
    else
        return helpers.authenticate(userTypeToAuthLevel(userType), authOptions)
}

const mutateHeadersToIncludeUserInfo = (request, decodedToken) => {
    request.headers.institutionid = decodedToken.institutionID
    request.headers.userid = decodedToken._id
    request.headers.usertype = decodedToken.__t
    request.headers.targetusermodel = decodedToken.specialStatus ?
        decodedToken.specialStatus === 'sysAdmin' ? 'sysAdmins': 'root' :
        'users'
    if (decodedToken.specialStatus) {
        request.headers.specialStatus = decodedToken.specialStatus
    }
    request.headers.authLevel = userTypeToAuthLevel(decodedToken.__t)
} 

module.exports = {
    createToken,
    refreshToken,
    validUserAuthentication,
    userTypeToAuthLevel,
    mutateHeadersToIncludeUserInfo,
    isValidResourceCreator: resourceOwnershipValidation.isValidResourceCreator,
    isValidResourceModifier: resourceOwnershipValidation.isValidResourceModifier,
    
}