// meaning not an 'array' or 'null'
const isAnObject = (candidate) => {
    return candidate !== null && !Array.isArray(candidate) && typeof candidate === 'object'
}

const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date.getDate())
}

const castToArray = (data) => {
    if (!Array.isArray(data)) {
        return [data]
    } else {
        return data
    }
}

const isJWT = (candidate="akjfdalsfdjaii32390-1") => {
    try {
        if (typeof candidate !== 'string') {
            return false
        }
        const jwtSections = candidate.split('.')
        return jwtSections.length === 3 && Boolean(window.atob(jwtSections[1]))
    } catch {
        return false
    }
}

export default {
    isAnObject,
    isValidDate,
    castToArray,
    isJWT
}