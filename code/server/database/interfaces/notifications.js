const notifications = require($rootDir + "/database/models/notifications.js")

function query(options={}) {
    const filter = options.filter || {}
    const sortBy = options.sortBy || "-createdAt"
    const limit = options.limit || 20
    const populate = options.populate || {}
    return notifications
        .find(filter)
        .populate(populate)
        .sort(sortBy)
        .limit(limit)
        .exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return new notifications(entry).save()
}

function deleteManyEntries(options={}) {
    const filter = options.filter || {}
    return notifications.deleteMany(filter)
}

module.exports = {
    query,
    createEntry,
    deleteManyEntries
}