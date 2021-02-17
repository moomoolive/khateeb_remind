const helpers = require('./helpers.js')

const put = (targetInfo, postHook) => {
    return async (request, response) => {
        try {
            const validRequestBody = helpers.bodyValidation.isValid(request)
            if (!validRequestBody.passed)
                return response.status(406).json(validRequestBody.errors)
            const commitOptions = helpers.commit.options(request.body, targetInfo)
            const data = await helpers.CRUD.operation(commitOptions, request)
            console.log(data)
            const returnVal = await helpers.postHook.execute(data, commitOptions, postHook)
            return response.json(returnVal)
        } catch(err) {
            console.log(err)
            response.json(`Couldn't update ${request.headers.targetCollection}`)
        }
    }
}

module.exports = put