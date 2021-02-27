const requestId = (requestInfo) => {
    return `${requestInfo.extension}-${requestInfo.function}`
}

export default {
    requestId
}