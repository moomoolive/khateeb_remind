import { misc } from './misc.js'
import { general } from './general.js'
import { admin } from './admin.js'
import { initialize } from './initialize.js'
import { text } from './text.js'

const routesList = {
    misc,
    general,
    admin,
    initialize,
    text
}

export { routesList as routes }