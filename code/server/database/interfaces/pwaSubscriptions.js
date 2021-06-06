const pwaSubscriptions = require($rootDir + "/database/models/pwaSubscriptions.js")

function query(options={}) {
    const filter = options.filter || {}
    const dataShape = options.dataShape || []
    return pwaSubscriptions
        .findOne(filter)
        .select(dataShape)
        .exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return new pwaSubscriptions(entry).save()
}

function updateEntry(options={}) {
    const filter = options.filter || {}
    const updates = options.updates || {}
    const returnOptions = options.returnOptions || {}
    const dataShape = options.dataShape || []
    return pwaSubscriptions
        .findOneAndUpdate(filter, updates, returnOptions)
        .select(dataShape)
        .exec()
}

module.exports = {
    query,
    createEntry,
    updateEntry
}