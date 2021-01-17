const  misc  = require('./routes/misc.js')
const  general  = require('./routes/general.js')
const  admin  = require('./routes/admin.js')
const  text  = require('./routes/text.js')
const auth = require('./routes/auth.js')

const routesList = {
    misc,
    general,
    admin,
    text,
    auth
}

module.exports = routesList