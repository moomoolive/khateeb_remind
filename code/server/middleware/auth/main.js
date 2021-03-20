const authHelpers = require(global.$dir + '/libraries/auth/main.js')

const jwt = require('jsonwebtoken')

// _.validAuthentication({ max: 2 })

const authenticate = (authOptions={}) => {
    return (request, response, next) => {
        jwt.verify(request.headers.authorization, process.env.JWT_SECRET || 'secret', (err, decoded) => {
            if (err || !authHelpers.validUserAuthentication(decoded.__t, authOptions))
                return response.status(401).json(`Invalid authorization check if authorization is present in header`)
            request.headers = authHelpers.mutateHeadersToIncludeUserInfo(request, decoded)
            return next()
        })
    }
}

const isAllowedToCreateResource = (validateKeys=[]) => {
    return (request, response, next) => {
        if (!authHelpers.isValidResourceCreator(request, validateKeys))
            return response.status(403).json(`You're not allowed to create this resource`)
        else
            return next()
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
    isAllowedToCreateResource,
    isAllowedToDeleteResource,
    isAllowedToUpdateResource,
    authenticate
}