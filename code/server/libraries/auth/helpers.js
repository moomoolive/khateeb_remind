const authLevels = [
    'user', "khateeb", 
    "institutionAdmin", "rootInstitutionAdmin",
    "sysAdmin", "root"
]

const validAuthLevel = (authLevel) => {
    return authLevel <= authLevels.length && authLevel >= 0
}

const levelOption = (authLevel, option, minOrMax) => {
    if (!validAuthLevel(authLevel))
        throw TypeError(`That's not a valid authorization level`)
    if (option === undefined)
        return true
    else {
        const value = parseInt(option)
        return minOrMax === 'min' ? authLevel >= value : authLevel <= value
    }
}

const authenticate = (authLevel, options={}) => {
    if (Object.keys(options).length < 1)
        return true
    else if (options.level !== undefined || typeof options === 'number')
        return authLevel === parseInt(options.level || options)
    else if (options.min !== undefined || options.max !== undefined)
        return levelOption(authLevel, options.min, 'min') && levelOption(authLevel, options.max, 'max')
    else
        throw TypeError(`You didn't provide a valid authentication option!`)
}

const validInt = (options) => {
    return typeof options === 'number' && validAuthLevel(options)
}

const emptyAuthOptionObject = (options) => {
    return typeof options !== 'number' && Object.keys(options).length < 1
}

const expirationDate = (expiresAfter) => {
    const secsPerMin = 60
    const minPerHour = 60
    const hourPerDay = 24
    const decoded = expiresAfter.split('-')
    let expirationDate
    switch(decoded[1]) {
        case 'days':
            expirationDate = decoded[0] * secsPerMin * minPerHour * hourPerDay
            break
        case 'minutes':
            expirationDate = decoded[0] * secsPerMin
            break
    }
    return expirationDate
}

module.exports = {
    expirationDate,
    emptyAuthOptionObject,
    validInt,
    authenticate,
    levelOption,
    validAuthLevel,
    authLevels
}