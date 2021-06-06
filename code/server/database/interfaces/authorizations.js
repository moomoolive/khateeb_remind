const authorizations = require($rootDir + "/database/models/authorizations.js")

function query(options={}) {
    const filter = options.filter || {}
    return authorizations
        .find(filter)
        .exec()
}

function findEntry(options={}) {
    const filter = options.filter || {}
    const populate = options.populate || ""
    return authorizations
        .findOne(filter)
        .populate(populate)
        .exec()
}

module.exports = {
    query,
    findEntry
}