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

function findByRole(institution="1234", role="khateeb") {
    return findEntry({ filter: { institution, role } })
}

module.exports = {
    query,
    findEntry,
    findByRole
}