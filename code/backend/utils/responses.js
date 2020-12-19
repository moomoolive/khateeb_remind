import $dbModels from '../database/models.js'
import $schedule from '../utils/schedule.js'

export default {
    previousEntriesAndEmptySchema(previousEntries, schemaName) {
        const emptySchema = $dbModels.schemasPlus(schemaName)
        const responseData = {
            emptySchema,
            previousEntries
        }
        return responseData
    },
    prayerSlotKhateebsAndSchema(previousEntries) {
        const emptySchema = $schedule.toBeDecidedIndicator()
        const responseData = {
            emptySchema,
            previousEntries
        }
        return responseData
    }
}