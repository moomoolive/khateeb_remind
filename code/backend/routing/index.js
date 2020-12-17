import { misc } from './routes/misc.js'
import { general } from './routes/general.js'
import { admin } from './routes/admin.js'
import { initialize } from './routes/initialize.js'
import { text } from './routes/text.js'

const routesList = {
    misc,
    general,
    admin,
    initialize,
    text
}

export { routesList as routes }