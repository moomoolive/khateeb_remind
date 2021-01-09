const $db = require('../database/index.js')
const $utils = require('../utils/index.js')

module.exports = {
    previousEntriesAndEmptySchema(previousEntries, schemaName) {
        const emptySchema = $db.models.schemasPlus(schemaName)
        const responseData = {
            emptySchema,
            previousEntries
        }
        return responseData
    },
    prayerSlotKhateebsAndSchema(previousEntries) {
        const emptySchema = $utils.schedule.toBeDecidedIndicator()
        const responseData = {
            emptySchema,
            previousEntries
        }
        return responseData
    }
}