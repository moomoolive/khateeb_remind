/* 
--- URL Parsing ---
key-value pairs seperated by '=' signs

example: key1=value1, age=10


**Value types**
- values that are equal 'true' or 'false' are automatically casted to booleans. 
Example: "many=true" (url) => many: true (js)

- values are entirely numeric are casted to numbers.
Example: "age=10" (url) => age: 10 (js)

- values that end in semicolons (;) are casted to static objects.
Example: "age=min:10;max:15;" (url) => age: { min: 10, max: 15 } (js)
NOTE: key names may be changed to the native mongodb name of operation,
min for example is changed to '$gte', check 'complexQueryFieldToMongooseQueryField'
function in the helpers.js file in this directory for all changes

- values that start and end with square brackets ([]) are casted to arrays.
Examples: "post-hook=[getAllLocations, getAssociatedKhateebs]" )(url) =>
post-hook: ["getAllLocations", "getAssociatedKhateebs"]


different query filters and options are seperated by '&'

example: key1=value1&key2=value2, age=10&name=mo


--- Current Query Options ---
query options are specified before the '$' seperator, and follow normal url parsing
rules

example: "many=true&post-hook=[getAllLocations, getAssociatedKhateebs]$queryField1=value...."

many: boolean => is crud operation done on one or multiple documents
post-hook: array => mongoose document methods to be execute after operation


--- Post hooks ---
post hooks can be specified in url by adding "post-hooks=[all the post hooks you want]"
essentially url post hooks are mongoose model methods that take NO arguments
and return objects

Hardcoded post hooks can also be added, but these will be executed after the one's specificed
in the url
*/


/* 
--- CRUD routing --- 
CRUD routes are essentially useful middlewares that are togther to create a
route

CRUD routes identify target model through the base url of express router

Authentication middleware comes first, then model identification middleware,
then any extra middleware, and finally the crud middleware which processes
request and creates response
*/


const helpers = require('./helpers.js')
const get = require('./get.js')
const Delete = require('./delete.js')
const post = require('./post.js')
const put = require('./put.js')

const GET = (router, options={}) => {
    const routeOptions = {
        ...helpers.routes.defaultCRUDRouteOptions(options),
        restrictions: options.restrictions || {}
    }
    router.get(
        '/:query', 
        ...helpers.routes.middlewarePipleine(routeOptions), 
        get(
            routeOptions.restrictions, 
            routeOptions.postHook
        )
    )
}

const POST = (router, options={}) => {
    const routeOptions = {
        ...helpers.routes.defaultCRUDRouteOptions(options),
        bodyValidators: options.bodyValidators || [],
        targetInfo: options.targetInfo || 'body'
    }
    routeOptions.extraMiddleware = [...routeOptions.extraMiddleware, ...routeOptions.bodyValidators]
    router.post(
        '/',
        ...helpers.routes.middlewarePipleine(routeOptions),
        post(
            routeOptions.targetInfo,
            routeOptions.postHook
        )
    )
}

const PUT = (router, options={}) => {
    const routeOptions = {
        ...helpers.routes.defaultCRUDRouteOptions(options),
        bodyValidators: options.bodyValidators || [],
        targetInfo: options.targetInfo || 'body'
    }
    routeOptions.extraMiddleware = [...routeOptions.extraMiddleware, ...routeOptions.bodyValidators]
    router.put(
        '/',
        ...helpers.routes.middlewarePipleine(routeOptions),
        put(
            routeOptions.targetInfo,
            routeOptions.postHook
        )
    )
}

const DELETE = (router, options={}) => {
    const routeOptions = {
        ...helpers.routes.defaultCRUDRouteOptions(options),
        allowedQueries: options.allowedQueries || null,
        allowedOptions: options.allowedOptions || null
    }
    router.delete(
        '/:query', 
        ...helpers.routes.middlewarePipleine(routeOptions), 
        Delete(
            routeOptions.postHook,
            routeOptions.allowedQueries,
            routeOptions.allowedOptions
        )
    )
}

module.exports = {
    GET,
    DELETE,
    POST,
    PUT
}