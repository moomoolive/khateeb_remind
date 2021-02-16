const helpers = require('./helpers.js')

const unallowedFieldsBasedOnRole = (role, restrictions, defaultUnallowed=true) => {
    // restriction object must have a get property to work
    const defaultRestriction = defaultUnallowed ? ["-__v"] : []
    if (!restrictions.get)
        return defaultRestriction
    else
        return restrictions.get[role] ? restrictions.get[role] : defaultRestriction
}

// post hooks must have one argument called data, another optional field called
// queryoptions, and must have a return value
const get = (restrictions, targetCollection, postHook) => {
    return async (request, response) => {
        try {
            const queryOptions = helpers.queries.parse(request.params)
            const queryRestrictions = unallowedFieldsBasedOnRole(request.headers.usertype, restrictions)
            const data = await helpers.CRUD.operation(queryOptions, request, targetCollection, { select: queryRestrictions })
            return response.json(helpers.postHook.execute(data, queryOptions, postHook))
        } catch(err) {
            console.log(err)
            response.json(`Couldn't GET from ${targetCollection}.\n Err trace: ${err}`)
        }
    }
}

module.exports = get