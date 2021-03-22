const createResponse = (msg="default", status="success") => {
    return { msg, status }
}

const pingResponse = () => {
    return [createResponse("API is ready for commands 🌐")]
}

const generalErrorResponse = (err=TypeError("unknown error")) => {
    return [createResponse(`A problem occurred when executing command.\nError trace: ${err}`, 'fail')]
}

const commandCategoryNotFound = (category) => {
    return [createResponse(`Couldn't find command category "${category}"`, 'fail')]
}

const commandDoesNotExist = (category, command) => {
    return [createResponse(`Couldn't find command "${command}" in the ${category} category`, 'fail')]
}



module.exports = {
    createResponse,
    pingResponse,
    generalErrorResponse,
    commandCategoryNotFound,
    commandDoesNotExist,
}