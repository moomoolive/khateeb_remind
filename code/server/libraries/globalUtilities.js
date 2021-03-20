const isNumeric = (value) => {
    return /^\d+$/.test(value)
}

const capitalize = (string) => {
    if (typeof string !== 'string')
        throw TypeError(`You must provide a string`)
    return string.charAt(0).toUpperCase() + string.slice(1)
}

const deepCopy = (object) => {
    return JSON.parse(JSON.stringify(object))
}

module.exports = {
    deepCopy,
    capitalize,
    isNumeric
}