const get = (key) => {
    const data = window.localStorage.getItem(key)
    if (data) {
        return JSON.parse(data)
    } else {
        return null
    }
}

const commit = (key, value) => {
    if (value !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(value))
    }
}

export default {
    get,
    commit
}