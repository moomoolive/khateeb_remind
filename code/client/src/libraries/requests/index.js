import responseInterceptors from './responseInterceptor/main.js'
import requestInterceptors from './requestInterceptor/main.js'

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
import institutions from './routes/institutions.js'
import pwa from './routes/pwa.js'
import logos from './routes/logos.js'

import axios from 'axios'

import requestQueryHelpers from './queries/main.js'

axios.interceptors.response.use(responseInterceptors.normalResponse, responseInterceptors.errorResponse)
axios.interceptors.request.use(requestInterceptors.normalRequest)
axios.defaults.paramsSerializer = requestQueryHelpers.stringify
axios.defaults.timeout = 15_000 // 15 seconds

export default {
    jummahs,
    locations,
    timings,
    khateebs,
    chainedRequests,
    announcements,
    institutions,
    institutionAdmins,
    auth,
    sysAdmin,
    user,
    misc,
    pwa,
    logos
}