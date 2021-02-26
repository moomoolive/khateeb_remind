import helpers from './helpers.js'

const userTypeToAuthLevel = (userType) => {
    const index = helpers.authLevels.findIndex(level => level === userType)
    return index === -1 ? 0 : index + 1
}

const validUserAuthentication = (userType, authOptions={}) => {
    if (!helpers.validAuthOptionTypes(authOptions) || helpers.illegalObjectTypes(authOptions))
        throw TypeError(`You must provide valid authentication options`)
    else if (helpers.emptyAuthOptionObject(authOptions))
        return true
    else
        return helpers.authenticate(userTypeToAuthLevel(userType), authOptions)
}

export default {
    validUserAuthentication,
    userTypeToAuthLevel
}