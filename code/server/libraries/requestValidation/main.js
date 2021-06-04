const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const validIdOrNullIdInField = () => {
    if (!typeCheckingHelpers.validIdOrNullId(val))
        throw TypeError(`Invalid id format`)
    return true
}

const validInstitutionId = () => {
    if (val !== 'root' && val.length !== $config.consts.mongooseIdLength) {
        throw TypeError(`Invalid institution id`)
    } else {
        return true
    }
}

module.exports = {
    validIdOrNullIdInField,
    validInstitutionId
}