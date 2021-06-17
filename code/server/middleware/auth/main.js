const authHelpers = require($rootDir + '/libraries/auth/main.js')
const { users } = require($rootDir + "/database/public.js")

const jwt = require('jsonwebtoken')

const { securityConfig } = require($rootDir + "/Server.config.js")

const authenticate = (authOptions={}) => {
    return (request, response, next) => {
        jwt.verify(request.headers.authorization, securityConfig.jwtSecret, async (err, decoded) => {
            if (err || !authHelpers.validUserAuthentication(decoded.__t, authOptions)) {
                return response.status(401).json({ msg: `Invalid authorization check if authorization is present in header` })
            }
            authHelpers.mutateHeadersToIncludeUserInfo(request, decoded)
            if (request.headers.authLevel < 2) {
                return next()
            }
            try {
                const user = await users.findEntryByAuthorizationKey(decoded.authId)
                if (!user) {
                    return response.status(401).json({ msg: `user doesn't exist` })
                }
                const targetAuth = user.authorizations.find(a => a.authId.toString() === decoded.authId )
                const notValidAuthorization = !authHelpers.isValidAuthorizationKey(targetAuth, request.headers.specialStatus)
                if (notValidAuthorization) {
                    return response.status(401).json({ msg: `detected authorization doesn't exist for user` })
                }
                next()
            } catch(err) {
                console.error(err)
                return response.status(401).json({ msg: `error while authenticating`, err })
            }
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