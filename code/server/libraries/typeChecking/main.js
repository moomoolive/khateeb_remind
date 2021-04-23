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

module.exports = {
    isAnObject,
    isValidDate,
    isArrayOrString,
    isEmail
}