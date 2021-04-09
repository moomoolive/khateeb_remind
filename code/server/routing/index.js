const misc  = require('./routes/misc.js')
const auth = require('./routes/auth.js')
const sysAdmin = require('./routes/sysAdmin.js')
const user = require('./routes/user.js')
const institutionAdmins = require('./routes/institutionAdmins.js')
const jummahs = require('./routes/jummahs.js')
const locations = require('./routes/locations.js')
const timings = require('./routes/timings.js')
const khateebs = require('./routes/khateebs.js')
const announcements = require('./routes/announcements.js')
const institutions = require('./routes/institutions.js')
const logos = require('./routes/logos.js')

const routesList = {
    misc,
    auth,
    sysAdmin,
    user,
    jummahs,
    locations,
    timings,
    khateebs,
    announcements,
    institutions,
    institutionAdmins,
    logos
}

module.exports = routesList