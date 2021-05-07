const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const validIdOrNullIdInField = (val="none") => {
    if (!typeCheckingHelpers.validIdOrNullId(val))
        throw TypeError(`Invalid id format`)
    return true
}

const validInstitutionId = (val="root") => {
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