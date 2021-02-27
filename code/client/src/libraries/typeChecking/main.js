// meaning not an 'array' or 'null'
const isAnObject = (candidate) => {
    return candidate !== null && !Array.isArray(candidate) && typeof candidate === 'object'
}

export default {
    isAnObject
}