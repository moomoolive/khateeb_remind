// meaning not an 'array' or 'null'
const isAnObject = (candidate) => {
    return candidate !== null && !Array.isArray(candidate) && typeof candidate === 'object'
}

const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getDate())
}

module.exports = {
    isAnObject,
    isValidDate
}