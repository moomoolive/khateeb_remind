const general = require('./schemas/generalSchemas.js')
const parent = require('./schemas/parentSchemas.js')
const child = require('./schemas/childSchemas.js')
const subDocs = require('./schemas/subDocs.js')
const discriminators = require('./schemas/discriminators.js')

module.exports = {
    ...general,
    ...parent,
    ...child,
    ...subDocs,
    ...discriminators
}