const helpers = require('./helpers.js')

// didn't name it 'delete' because 'delete' is a js reserved keyword
const Delete = (postHook, queryFilterRestrictions, queryOptionRestrictions) => {
    return async (request, response) => {
        try {
            const queryOptions = helpers.queries.parse(
                request.params,
                { allowedParameters: queryOptionRestrictions }, 
                { allowedParameters: queryFilterRestrictions }
            )
            const data = await helpers.CRUD.operation(queryOptions, request)
            const returnVal = await helpers.postHook.execute(data, queryOptions, postHook)
            return response.json(returnVal)
        } catch(err) {
            console.log(err)
            response.json(`Couldn't DELETE. Err trace: ${err}`)
        }
    }
}

module.exports = Delete