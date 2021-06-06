const verificationCodes = require($rootDir + "/database/models/verificationCodes.js")

function createEntry(options={}) {
    const entry = options.entry || {}
    return new verificationCodes(entry).save()
}

function findEntry(options={}) {
    const filter = options.filter || {}
    return verificationCodes.findOne(filter).exec()
}

module.exports = {
    createEntry,
    findEntry
}