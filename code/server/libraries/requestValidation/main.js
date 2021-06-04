const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const validIdOrNullIdInField = (val) => {
    if (!typeCheckingHelpers.validIdOrNullId(val)) {
        throw TypeError(`Invalid id format`)
    } else {
        return true
    }
}

const validInstitutionId = (val) => {
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