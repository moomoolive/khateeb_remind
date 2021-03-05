const resourceOwnerChecker = require('./resourceOwnerChecker.js')
const helpers = require('./helpers.js')

const isValidResourceCreator = (request={}, keysToValidateAgainst=[]) => {
    const validator = new resourceOwnerChecker({
        keysToValidateAgainst,
        checkRequestSection: 'headers',
        resourceInfo: request.body
    })
    return validator.isUserValidResourceOwner(request)
}

const isValidResourceModifier = async (request={}, keysToValidateAgainst=[], resourceType="location", resourceIdentfierFoundIn="query") => {
    try {
        if (helpers.noResourceIdentiferFound(request, resourceIdentfierFoundIn))
            throw TypeError(`No resource identifier found`)
        const resource = await $db[resourceType].find({ _id: request[resourceIdentfierFoundIn]._id }).exec()
        const validator = new resourceOwnerChecker({
            keysToValidateAgainst,
            checkRequestSection: 'header',
            resourceInfo: resource
        })
        return validator.isUserValidResourceOwner(request)
    } catch(err) {
        console.log(err)
        return false
    }
}

module.exports = {
    isValidResourceCreator,
    isValidResourceModifier
}