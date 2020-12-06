import dbModels from './models.js'

export default {
    databaseErrorCallback(error, response) {
        console.log(err)
        response.json('There was a problem accessing the database!')
    },
    save(schemaName, toBeSaved, response) {
        toBeSaved.savedOn = new Date().toUTCString()
        if (toBeSaved._id) {
            toBeSaved.__v++
            dbModels[schemaName].findByIdAndUpdate(toBeSaved._id, toBeSaved, (err) => {
                if (err) this.databaseErrorCallback(err, response)
                else response.json(`${schemaName} ${toBeSaved._id} successfully saved!`)
            })
        } else {
            const x = new dbModels[schemaName](toBeSaved)
            x.save((err) => {
                if (err) this.databaseErrorCallback(err, response)
                else response.json(`${schemaName} successfully saved!`)
            })
        }
    },
    delete(schemaName, ID, response) {
        dbModels[schemaName].deleteOne({ _id: ID }, (err) => {
            if(err) this.databaseErrorCallback(err, response)
            else response.json(`${schemaName} succesfully deleted!`)
        })
    }
    //res.json(Object.keys(dbModels.announcements.schema.paths)) >> access all schema properties
}