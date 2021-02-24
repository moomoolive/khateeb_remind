const authLevels = {
    "khateeb": 1,
    "institutionAdmin": 2,
    "rootInstitutionAdmin": 3,
    "sysAdmin": 4,
    "root": 5
}

const userTypeToAuthLevel = (userType) => {
    return authLevels[userType] || 0
}

const authenticate = (authLevel, options={}) => {
    if (Object.keys(options).length < 1)
        return true
    else if (options.level !== undefined)
        return authLevel === parseInt(options.level)
    else if (options.min !== undefined && options.max !== undefined)
        return authLevel >= parseInt(options.min) && authLevel <= parseInt(options.max)
    else if (options.greaterThanOrEqual !== undefined)
        return authLevel >= parseInt(options.greaterThanOrEqual)
    else
        throw TypeError(`You didn't provide a valid authentication option!`)
}

const validUserAuthentication = (userType, routeAuthOptions) => {
    if (routeAuthOptions === undefined)
        throw TypeError(`You must provide route authentication options`)
    else
        return authenticate(userTypeToAuthLevel(userType), routeAuthOptions)
}

export default {
    validUserAuthentication
}