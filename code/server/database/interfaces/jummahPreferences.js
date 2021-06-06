const jummahPreferences = require($rootDir + "/database/models/jummahPreferences.js")

function query(options={}) {
    const filter = options.filter || {}
    const sortBy = options.sortBy || ""
    return jummahPreferences
        .find(filter)
        .sort(sortBy)
        .exec()
}

function findEntry(options={}) {
    const filter = options.filter || {}
    return jummahPreferences
        .findOne(filter)
        .exec()
}

function deleteManyEntries(options={}) {
    const filter = options.filter || {}
    return jummahPreferences.deleteMany(filter)
}

function updateEntry(options={}) {
    const filter = options.filter || {}
    const updates = options.updates || {}
    const returnOptions = options.returnOptions || {}
    return jummahPreferences
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return new jummahPreferences(entry).save()
}

module.exports = {
    query,
    deleteManyEntries,
    createEntry,
    updateEntry,
    findEntry
}