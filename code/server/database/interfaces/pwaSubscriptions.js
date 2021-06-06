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

function updateSubscriptionStatus(options={}) {
    const deviceId = options.deviceId || ""
    const userId = options.userId || ""
    const subscriptionStatus = option.subscriptionStatus || null
    return updateEntry({
        filter: { userID: userId, "subscriptions.deviceId": deviceId },
        updates: { $set: { "subscriptions.$.active": subscriptionStatus } },
        returnOptions: { new: true },
        dataShape: ["-subscriptions.browserSubscriptionDetails"]
    })
}

module.exports = {
    query,
    createEntry,
    updateEntry,
    updateSubscriptionStatus
}