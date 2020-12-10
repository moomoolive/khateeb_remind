import $dbModels from './models.js'

export default {
    databaseError(response, error) {
        console.log(error)
        response.json('There was a problem accessing the database!')
    },
    databaseSuccess(response) {
        if (response) response.json('Changes successfully made!')
    },
    databaseCallback(response, error=false) {
        if (error) this.databaseCallback(response, error)
        else this.databaseSuccess(response)
    },
    save(schemaName, toBeSaved, response=false) {
        toBeSaved.savedOn = new Date().toUTCString()
        if (toBeSaved._id) {
            toBeSaved.__v++
            $dbModels[schemaName].findByIdAndUpdate(toBeSaved._id, toBeSaved, (err) => {
                this.databaseCallback(response, err)
            })
        } else {
            const x = new $dbModels[schemaName](toBeSaved)
            x.save((err) => { this.databaseCallback(response, err) })
        }
    },
    delete(schemaName, ID, response) {
        $dbModels[schemaName].deleteOne({ _id: ID }, (err) => {
            this.databaseCallback(response, err)
        })
    }
}