const authHelpers = require(global.$dir + '/libraries/auth/main.js')

const jwt = require('jsonwebtoken')

const authenticate = (authOptions={}) => {
    return (request, response, next) => {
        jwt.verify(request.headers.authorization, process.env.JWT_SECRET || 'secret', (err, decoded) => {
            if (err || !authHelpers.validUserAuthentication(decoded.__t, authOptions))
                return response.status(401).json({ msg: `Invalid authorization check if authorization is present in header` })
            authHelpers.mutateHeadersToIncludeUserInfo(request, decoded)
            return next()
        })
    }
}

const isAllowedToDeleteResource = (validateKeys=[], resourceType="locations") => {
    return async (request, response, next) => {
        try {
            const args = [request, validateKeys, resourceType, "query"]
            const isAllowed = await authHelpers.isValidResourceModifier(...args)
            if (!isAllowed)
                return response.status(403).json(`You're not allowed to delete this resource`)
            else
                return next()
        } catch(err) {
            console.log(err)
            return response.status(403).json(err)
        }
    }
}

const isAllowedToUpdateResource = (validateKeys=[], resourceType="locations") => {
    return async (request, response, next) => {
        try {
            const args = [request, validateKeys, resourceType, "body"]
            const isAllowed = await authHelpers.isValidResourceModifier(...args)
            if (!isAllowed)
                return response.status(403).json(`You're not allowed to update this resource`)
            else
                return next()
        } catch(err) {
            console.log(err)
            return response.status(403).json(err)
        }
    }
}

module.exports = {
    isAllowedToDeleteResource,
    isAllowedToUpdateResource,
    authenticate
}