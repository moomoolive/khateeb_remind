const helpers = require('./helpers.js')

// meaning not an 'array' or 'null'
// takes valid object
const isAnObject = (candidate) => {
    return candidate !== null && !Array.isArray(candidate) && typeof candidate === 'object'
}

// takes a valid date object
const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getDate())
}

// takes string or array as input
const isArrayOrString = (candidate) => {
    return typeof candidate === 'string' || Array.isArray(candidate)
} 

// look for @ sign with a peroid somewhere after it
// followed by at least one letter of the alphabet
// takes string as input
const isEmail = (candidate) => {
    return /@.*\..*[a-zA-Z]/g.test(candidate)
}

// 'TBD' is only here for legacy reasons
// takes string as input
const validIdOrNullId = (candidate) => {
    return Boolean(candidate) && (candidate === $config.consts.nullId || candidate === 'TBD' || helpers.validId(candidate) ) 
}

module.exports = {
    isAnObject,
    isValidDate,
    isArrayOrString,
    isEmail,
    validIdOrNullId
}