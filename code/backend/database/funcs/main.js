import $dbModels from '../models/main.js'
import helpers from './helpers.js'

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
        helpers.saveDateOfEntry(toBeSaved)
        const previousEntry = toBeSaved._id
        const isMongooseDiscriminator = toBeSaved.__t
        if (previousEntry) {
            toBeSaved.__v++
            $dbModels[schemaName].findByIdAndUpdate(toBeSaved._id, toBeSaved, (err) => {
                this.databaseCallback(response, err)
            })
        } 
        else if (isMongooseDiscriminator)  helpers.saveSetting(toBeSaved.__t, toBeSaved, response)
        else {
            const x = new $dbModels[schemaName](toBeSaved)
            x.save((err) => { this.databaseCallback(response, err) })
        }
    },
    delete(schemaName, ID, response) {
        $dbModels[schemaName].deleteOne({ _id: ID }, (err) => {
            this.databaseCallback(response, err)
        })
    },
    getPassword() {
        return new Promise((resolve, reject) => {
            $dbModels.password.findOne({}, { _id: false }, (err, password) => {
                if (err) {
                    console.log(err)
                    reject()
                }
                else if (password) {
                    resolve(password.options)
                }
            }).select(['options'])
        })
        
    },
    getAdminProfile() {
        return new Promise((resolve, reject) => {
            $dbModels.adminProfile.findOne({}, { _id: false }, (err, profile) => {
                if (err) {
                    console.log(err)
                    reject()
                }
                else if (profile) resolve(profile)
            }).select(['options'])
        })
    },
    getTwillioPhone() {
        return new Promise((resolve, reject) => {
            $dbModels.textPhone.findOne({}, { _id: false }, (err, phone) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                if (phone) {
                    const phoneDetails = phone.options
                    resolve(phoneDetails)
                } else reject('Unknown error occured')
            }).select(['options'])
        })
    }
}