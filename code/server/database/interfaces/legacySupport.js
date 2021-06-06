// these interfaces only exists to support older code
// are will eventually be phased out (insha'Allah)
const locations = require($rootDir + "/database/models/locations.js")
const timings = require($rootDir + "/database/models/timings.js")
const jummahPreferences = require($rootDir + "/database/models/jummahPreferences.js")
const announcements = require($rootDir + "/database/models/announcements.js")
const institutions = require($rootDir + "/database/models/institutions.js")

const compiledModels = {
    locations,
    timings,
    jummahPreferences,
    announcements,
    institutions
}

function findModelEntry(options={}) {
    const targetModel = options.model || "locations"
    const model = compiledModels[targetModel]
    const filter = options.filter || {}
    return model
        .find(filter)
        .exec()
}

module.exports = {
    findModelEntry
}