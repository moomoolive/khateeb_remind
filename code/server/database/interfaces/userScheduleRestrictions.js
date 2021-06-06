const userScheduleRestrictions = require($rootDir + "/database/models/userScheduleRestrictions.js")

function findEntry(options={}) {
    const filter = options.filter || {}
    return userScheduleRestrictions
        .findOne(filter)
        .exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return new userScheduleRestrictions(entry).save()
}

function deleteManyEntries(options={}) {
    const filter = options.filter || {}
    return userScheduleRestrictions.deleteMany(filter)
}

function updateEntry(options={}) {
    const filter = options.filter || {}
    const updates = options.updates || {}
    const returnOptions = options.returnOptions
    return userScheduleRestrictions
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

function deleteAllEntriesWithAnyOfIds(ids=[]) {
    return deleteManyEntries({ 
        filter: { _id: { $in: ids } }
     })
}

module.exports = {
    createEntry,
    deleteManyEntries,
    findEntry,
    updateEntry,
    deleteAllEntriesWithAnyOfIds
}