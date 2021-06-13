import helpers from './helpers.js'

import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

const userTypeToAuthLevel = (userType) => {
    const index = helpers.authLevels.findIndex(level => level === userType)
    return index === -1 ? 0 : index + 1
}

const validUserAuthentication = (userType, authOptions={}) => {
    if (!helpers.validInt(authOptions) && !typeCheckingHelpers.isAnObject(authOptions)) {
        throw TypeError(`You must provide valid authentication options`)
    } else if (helpers.emptyAuthOptionObject(authOptions)) {
        return true
    } else {
        return helpers.authenticate(userTypeToAuthLevel(userType), authOptions)
    }
}

export default {
    validUserAuthentication,
    userTypeToAuthLevel
}