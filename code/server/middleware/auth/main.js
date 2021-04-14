const authHelpers = require(global.$dir + '/libraries/auth/main.js')

const jwt = require('jsonwebtoken')

const authenticate = (authOptions={}) => {
    return (request, response, next) => {
        jwt.verify(request.headers.authorization, process.env.JWT_SECRET || 'secret', async (err, decoded) => {
            if (err)
                return response.status(401).json({ msg: `Invalid authorization check if authorization is present in header` })
            try {
                const userInfo = await $db.users.findOne({ _id: decoded._id }).exec()
                if (!userInfo || !authHelpers.validUserAuthentication(userInfo.__t, authOptions))
                    return response.status(401).json({ msg: `Invalid authorization to access this resource` })
                request.headers = authHelpers.mutateHeadersToIncludeUserInfo(request, userInfo)
                return next()
            } catch(error) {
                console.log(error)
                return response.status(503).msg({ msg: `An error occurred when fetching user info. Err trace: ${error}` })
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