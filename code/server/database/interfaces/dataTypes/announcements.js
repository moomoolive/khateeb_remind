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

function create(options={}) {
    const document = options.document || {}
    return announcements(document).save()
}

function updateDocument(options={}) {
    const updates = options.updates || {}
    const filter = options.filter || {}
    const returnOptions = options.returnOptions
    return announcements
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

function deleteDocument(options={}) {
    const filter = options.filter || {}
    return announcements.deleteOne(filter)
}


module.exports = {
    query,
    create,
    updateDocument,
    deleteDocument
}