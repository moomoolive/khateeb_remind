module.exports = class resourceOwnerChecker {
    constructor(options={}) {
        const resource = options.resourceInfo || {}
        if (resource === undefined || resource === null || typeof resource !== 'object')
            throw TypeError(`Invalid resource type`)
        this.resourceInfo = this.castResourceToArray(resource)
        this.userInfoSection = options.userInfoSection || 'headers'
        this.keysToValidateAgainst = options.keysToValidateAgainst || []
    }

    requesterIsResourceOwner(request) {
        const errors = this.validate(request)
        return errors.length < 1
    }

    validate(request) {
        const userInfo = this.collectUserInfo(request)
        return this.isUserValidResourceOwner(request, userInfo)
    }

    isUserValidResourceOwner(userInfo) {
        const allErrors = []
        this.resourceInfo.forEach(resource => {
            this.checkRequestOwnerIsResourceOwner(resource, userInfo)
        })
        return allErrors
    }

    checkRequestOwnerIsResourceOwner(resource, userInfo) {
        const errors = []
        for (const [key, value] of Object.entries(resource)) {
            if (userInfo[key] !== undefined && value !== userInfo[key])
                errors.push(`${key} is invalid`)
        }
        return errors
    }

    collectUserInfo(request) {
        const info = {}
        this.keysToValidateAgainst.forEach(key => {
            // the reason why I use lowercase is because all user indentification
            // in this app is included in the header, and the header is case insenstive
            const targetKey = request[this.userInfoSection][key.toLowerCase()]
            if (targetKey === undefined)
                info[key] === 'not found'
            else
                info[key] = targetKey
        })
        return info
    }

    castResourceToArray(resourceInfo) {
        if (Array.isArray(resourceInfo)) {
            resourceInfo.forEach(resource => {
                if (typeof resource !== 'object')
                    throw TypeError(`Resource must be an object`)
            })
            return resourceInfo
        }
        else if (!Array.isArray(resourceInfo) && typeof resourceInfo === 'object')
            return [resourceInfo]
        else
            throw TypeError(`Resource must be an object or an array of objects`)
    }

}