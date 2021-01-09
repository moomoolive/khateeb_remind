const  misc  = require('./routes/misc.js')
const  general  = require('./routes/general.js')
const  admin  = require('./routes/admin.js')
const  text  = require('./routes/text.js')

const routesList = {
    misc,
    general,
    admin,
    text
}

module.exports = routesList