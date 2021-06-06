const institutions = require($rootDir + "/database/models/institutions.js")
const testInstitution = require($rootDir + "/database/childModels/testInstitution.js")

function query(options={}) {
    const filter = options.filter || {}
    const sortBy = options.sortBy || []
    return institutions
        .find(filter)
        .select(sortBy)
        .exec()
}

function createEntry(options={}) {
    const entry = options.entry || {}
    return new institutions(entry).save()
}

function updateEntry(options={}) {
    const filter = options.filter || {}
    const updates = options.updates || {}
    const returnOptions = options.returnOptions || {}
    return institutions
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

async function deleteEntry(options={}) {
    try {
        let targetDatabaseModel = institutions
        const isTestInstitution = Boolean(options.specialInstitution)
        if (isTestInstitution) {
            targetDatabaseModel = testInstitution
        }
        const filter = options.filter || {}
        const institution = await targetDatabaseModel
            .findOneAndUpdate(filter, { active: false }, { new: true })
            .exec()
        const deletedDependants = await institution.deactivate()
        return { institution, deletedDependants }
    } catch(err) {
        throw err
    }
}

module.exports = {
    query,
    updateEntry,
    createEntry,
    deleteEntry
}