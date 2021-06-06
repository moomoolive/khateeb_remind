const locations = require($rootDir + "/database/models/locations.js")

function query(options={}) {
    const filter = options.filter || {}
    return locations.find(filter).exec()
}

async function createEntry(options={}) {
    try {
        const entry = options.entry || {}
        const location = await locations(entry).save()
        // only one timing exists for location at this point in time
        // for this new location so we can be sure that it's the 
        // first entry returned from the related timings query
        const timings = await location.findTimings()
        return { location,  timing: timings[0] }
    } catch(err) {
        throw err
    }
    
}

function updateEntry(options={}) {
    const updates = options.updates || {}
    const filter = options.filter || {}
    const returnOptions = options.returnOptions
    return locations
        .findOneAndUpdate(filter, updates, returnOptions)
        .exec()
}

async function deleteEntry(options={}) {
    try {
        const filter = options.filter || {}
        const location = await locations.findOneAndUpdate(
            filter, 
            { active: false }, 
            { new: true }
        )
        const deletedDependants = await location.deleteDependants() 
        return { location, deletedDependants }
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