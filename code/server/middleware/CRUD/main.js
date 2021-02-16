const middleware = require($DIR + '/middleware/main.js')
const helpers = require('./helpers.js')
const get = require('./get.js')

const GET = (router, targetCollection, authLevel=0, restrictions={}, postHook=helpers.postHook.default) => {
    router.get('/:query', middleware.auth(authLevel), get(restrictions, targetCollection, postHook))
}

module.exports = {
    GET
}