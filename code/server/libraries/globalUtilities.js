// capitalizes first non-whitespace character of string
const capitalize = (string) => {
    const str = string.trim()
    if (str.length < 1) {
        return ""
    } else {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}

// returns a complete copy of an object and not reference
// useful for arrays and static objects (aka objects with no methods)
const deepCopy = (object) => {
    return JSON.parse(JSON.stringify(object))
}

module.exports = {
    deepCopy,
    capitalize
}