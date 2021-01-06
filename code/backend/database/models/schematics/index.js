import general from './schemas/generalSchemas.js'
import parent from './schemas/parentSchemas.js'
import child from './schemas/childSchemas.js'

export default {
    ...general,
    ...parent,
    ...child
}