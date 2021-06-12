import helpers from './helpers.js'

const camelCaseToArray = (camelCase) => {
    return camelCase.split(/(?=[A-Z])/)
}

const arrayToString = (arrayOfWords, format) => {
    if (arrayOfWords.length < 1) {
        return ""
    }
    const modifiedArray = helpers.toXCase(arrayOfWords, format)
    return helpers.arrayToString(modifiedArray)
}

export default {
    camelCaseToArray,
    arrayToString
}