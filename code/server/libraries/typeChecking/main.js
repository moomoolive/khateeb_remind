const helpers = require('./helpers.js')

// meaning not an 'array' or 'null'
const isAnObject = (candidate={}) => {
    return candidate !== null && !Array.isArray(candidate) && typeof candidate === 'object'
}

const isValidDate = (date=new Date()) => {
    return date instanceof Date && !isNaN(date.getDate())
}

const isArrayOrString = (candidate="random") => {
    return typeof candidate === 'string' || Array.isArray(candidate)
} 

// look for @ sign with a peroid somewhere after it
// followed by at least one letter of the alphabet
const isEmail = (candidate="randome@random") => {
    return /@.*\..*[a-zA-Z]/g.test(candidate)
}

// 'TBD' is only here for legacy reasons
const validIdOrNullId = (candidate="none") => {
    return candidate && (candidate === $config.consts.nullId || candidate === 'TBD' || helpers.validId(candidate) ) 
}

module.exports = {
    isAnObject,
    isValidDate,
    isArrayOrString,
    isEmail,
    validIdOrNullId
}