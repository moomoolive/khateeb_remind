const  misc  = require('./routes/misc.js')
const  khateeb  = require('./routes/khateeb.js')
const  admin  = require('./routes/admin.js')
const auth = require('./routes/auth.js')
const sysAdmin = require('./routes/sysAdmin.js')
const user = require('./routes/user.js')
const rootInstitutionAdmin = require('./routes/rootInstitutionAdmin.js')
const khateebs = require('./routes/khateebs.js')

const routesList = {
    misc,
    khateeb,
    admin,
    auth,
    sysAdmin,
    user,
    rootInstitutionAdmin,
    khateebs
}

module.exports = routesList