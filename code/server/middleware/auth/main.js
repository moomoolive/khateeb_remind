const resourceAccessValidators = require('./resourceOwnerChecking/main.js')

const isAllowedToCreateResource = (validateKeys=[]) => {
    return (request, response, next) => {
        if (!resourceAccessValidators.isValidResourceCreator(request, validateKeys))
            return response.status(403).json(`You're not allowed to create this resource`)
        else
            return next()
    }
}

const isAllowedToDeleteResource = (validateKeys=[], resourceType="locations") => {
    return async (request, response, next) => {
        try {
            const args = [request, validateKeys, resourceType, "query"]
            const isAllowed = await resourceAccessValidators.isValidResourceModifier(...args)
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
            const isAllowed = await resourceAccessValidators.isValidResourceModifier(...args)
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
    isAllowedToUpdateResource
}