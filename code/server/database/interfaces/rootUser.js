const rootUser = require($rootDir + "/database/childModels/rootUser.js")

function find() {
    return rootUser.findOne({}).exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return new rootUser(entry).save()
}

module.exports = {
    find,
    createEntry
}