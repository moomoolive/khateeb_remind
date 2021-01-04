import $db from '../database/index.js'
import $utils from '../utils/index.js'

export default {
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