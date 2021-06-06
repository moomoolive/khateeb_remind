const timings = require($rootDir + "/database/models/timings.js")

function query(options={}) {
    const filter = options.filter || {}
    return timings.find(filter).exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return timings(entry).save()
}

function updateEntry(options={}) {
    const filter = options.filter || {}
    const updates = options.updates || {}
    const returnOptions = options.returnOptions || {}
    return timings
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

async function deleteEntry(options={}) {
    try {
        const filter = options.filter || {}
        const timing = await timings.findOneAndUpdate(
            filter,
            { active: false },
            { new: true }
        )
        const deletedDependants = await timing.deleteDependants()
        return { timing, deletedDependants }
    } catch(err) {
        throw err
    }
}

module.exports = {
    query,
    createEntry,
    updateEntry,
    deleteEntry
}