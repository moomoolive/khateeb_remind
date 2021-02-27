import helpers from './helpers.js'

const requestId = (requestInfo) => {
    return `${requestInfo.extension}-${requestInfo.function}${helpers.additionalIdentification(requestInfo)}`
}

export default {
    requestId
}