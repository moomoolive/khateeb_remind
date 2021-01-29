const  misc  = require('./routes/misc.js')
const  khateeb  = require('./routes/khateebs.js')
const  admin  = require('./routes/admin.js')
const  text  = require('./routes/text.js')
const auth = require('./routes/auth.js')
const sysAdmin = require('./routes/sysAdmin.js')
const root = require('./routes/root.js')
const user = require('./routes/user.js')

const routesList = {
    misc,
    khateeb,
    admin,
    text,
    auth,
    sysAdmin,
    root,
    user
}

module.exports = routesList