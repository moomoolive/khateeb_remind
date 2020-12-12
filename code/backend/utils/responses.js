import $dbModels from '../database/models.js'
import $schedule from '../utils/schedule.js'

export default {
    previousEntriesAndEmptySchema(previousEntries, schemaName) {
        const emptySchema = $dbModels.emptySchema(schemaName)
        const responseData = {
            emptySchema,
            previousEntries
        }
        return responseData
    },
    emptyLocationTimingTemplate() {
        const locationSkeleton = $dbModels.emptySchema('locationDetails')
        const locationMeta = $dbModels.emptySchema('locationMetas')
        for (let field in locationMeta) {
            locationMeta[field] = ''
        }
        locationSkeleton.info = locationMeta
        const timingTemp = $dbModels.emptySchema('timingTemplates')
        for (let i = 0; i < 2; i++) {
            const template = JSON.parse(JSON.stringify(timingTemp))
            template.hour = 1 + i
            template.minutes = '00'
            template.AMorPM = 'PM'
            locationSkeleton.timings.push(template)

        }
        return locationSkeleton
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