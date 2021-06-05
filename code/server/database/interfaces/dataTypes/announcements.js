const { announcements } = require($rootDir + "/database/models.js")

function query(options={}) {
    const query = options.filter || {}
    const sortBy = options.sortBy || "-updatedAt"
    const limit = options.limit || 20
    return announcements
        .find(query)
        .sort(sortBy)
        .limit(limit)
        .exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return announcements(entry).save()
}

function updateEntry(options={}) {
    const updates = options.updates || {}
    const filter = options.filter || {}
    const returnOptions = options.returnOptions
    return announcements
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

function deleteEntry(options={}) {
    const filter = options.filter || {}
    return announcements.deleteOne(filter)
}


module.exports = {
    query,
    createEntry,
    updateEntry,
    deleteEntry
}