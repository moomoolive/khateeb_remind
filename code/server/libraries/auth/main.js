const jwt = require('jsonwebtoken')

const helpers = require('./helpers.js')
const resourceOwnershipValidation = require('./resourceOwnerChecking/main.js')
const typeCheckingHelpers = require(global.$dir + '/libraries/typeChecking/main.js')

const createToken = (info={}, expiresAfter='60-days') => {
    const secret = process.env.JWT_SECRET || 'secret'
    const expiration = helpers.expirationDate(expiresAfter)
    return jwt.sign(info, secret, { expiresIn: expiration })
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
    const newHeader = { ...request.headers }
    newHeader.institutionid = decodedToken.institutionID
    newHeader.userid = decodedToken._id
    newHeader.usertype = decodedToken.__t
    newHeader.authLevel = userTypeToAuthLevel(decodedToken.__t)
    return newHeader
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