const general = require('./schemas/generalSchemas.js')
const subDocs = require('./schemas/subDocs.js')
const discriminators = require('./schemas/discriminators.js')

module.exports = {
    ...general,
    ...subDocs,
    ...discriminators
}