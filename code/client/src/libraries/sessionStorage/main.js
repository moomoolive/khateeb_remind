const get = (key="seenAnnoucements") => {
    const val = window.sessionStorage.getItem(key)
    if (val)
        return JSON.parse(val)
    else
        return null
}

const commit = (key="seenAnnoucements", value=true) => {
    window.sessionStorage.setItem(key, JSON.stringify(value))
}

export default {
    commit,
    get
}