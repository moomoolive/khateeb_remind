const createResponse = (msg="default", status="success") => {
    return { msg, status }
}

const createSingleResponseMsg = (msg="default", status="success") => {
    return [createResponse(msg, status)]
}

module.exports = {
    createResponse,
    createSingleResponseMsg
}