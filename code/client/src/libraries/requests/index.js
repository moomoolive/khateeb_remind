import responseInterceptors from './responseInterceptor/main.js'

import auth from './routes/auth.js'
import user from './routes/user.js'
import sysAdmin from './routes/sysAdmin.js'
import institutionAdmins from './routes/institutionAdmins.js'
import misc from './routes/misc.js'
import jummahs from './routes/jummahs.js'
import locations from './routes/locations.js'
import timings from './routes/timings.js'
import khateebs from './routes/khateebs.js'
import chainedRequests from './chainedRequests/main.js'
import announcements from './routes/announcements.js'
import settings from './routes/settings.js'
import institutions from './routes/institutions.js'

import axios from 'axios'

import requestQueryHelpers from './queries/main.js'

axios.interceptors.response.use(responseInterceptors.normalResponse, responseInterceptors.errorResponse)
axios.defaults.paramsSerializer = requestQueryHelpers.stringify

export default {
    jummahs,
    locations,
    timings,
    khateebs,
    chainedRequests,
    announcements,
    settings,
    institutions,
    institutionAdmins,
    auth,
    sysAdmin,
    user,
    misc,
}