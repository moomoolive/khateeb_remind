import responseInterceptors from './responseInterceptor/main.js'
import auth from './routes/auth.js'
import user from './routes/user.js'
import khateeb from './routes/khateeb.js'
import sysAdmin from './routes/sysAdmin.js'
import rootInstitutionAdmin from './routes/rootInstitutionAdmin.js'
import misc from './routes/misc.js'
import institutionAdmin from './routes/institutionAdmin.js'

import axios from 'axios'

axios.interceptors.response.use(responseInterceptors.normalResponse, responseInterceptors.errorResponse)

export default {
    auth,
    sysAdmin,
    khateeb,
    institutionAdmin,
    user,
    misc,
    rootInstitutionAdmin
}