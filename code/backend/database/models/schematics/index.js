const general = require('./schemas/generalSchemas.js')
const parent = require('./schemas/parentSchemas.js')
const child = require('./schemas/childSchemas.js')

module.exports = {
    ...general,
    ...parent,
    ...child
}