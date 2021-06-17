const restTokens = require($rootDir + "/database/models/restTokens.js")

function createEntry(options={}) {
    const entry = options.entry || {}
    return new restTokens(entry).save()
}

function query(options={}) {
    const filter = options.filter || {}
    return restTokens
        .find(filter)
        .exec()
}

function deleteEntry(options={}) {
    const filter = options.filter || {}
    return restTokens.deleteOne(filter)
}

module.exports = {
    createEntry,
    query,
    deleteEntry
}