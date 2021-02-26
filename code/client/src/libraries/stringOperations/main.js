import helpers from './helpers.js'

const camelCaseToArray = (camelCase) => {
    return camelCase.split(/(?=[A-Z])/)
}

const arrayToString = (arrayOfWords, format, raw) => {
    const modifiedArray = helpers.toXCase(arrayOfWords, format)
    if (raw)
        return modifiedArray
    else return helpers.arrayToString(modifiedArray)
}

export default {
    camelCaseToArray,
    arrayToString
}