const validationHelpers = require('./main.js')

const validIdOrNullIdInField = (val="none") => {
    if (!validationHelpers.validIdOrNullId(val))
        throw TypeError(`Invalid id format`)
    return true
}

module.exports = {
    validIdOrNullIdInField
}