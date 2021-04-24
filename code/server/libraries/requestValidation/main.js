const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const validIdOrNullIdInField = (val="none") => {
    if (!typeCheckingHelpers.validIdOrNullId(val))
        throw TypeError(`Invalid id format`)
    return true
}

module.exports = {
    validIdOrNullIdInField
}