const $dbModels = require('../models/main.js')
const helpers = require('./helpers.js')

const funcs = {
    databaseError(response, error) {
        console.log(error)
        response.json('There was a problem accessing the database!')
    },
    databaseSuccess(response) {
        if (response) response.json('Changes successfully made!')
    },
    databaseCallback(response, error=false) {
        if (error) this.databaseError(response, error)
        else if(response) this.databaseSuccess(response)
    },
    saveSetting(discriminatorName, toBeSaved, response=false) {
        $dbModels[discriminatorName].findOne({}, (err, setting) => {
            if (err) console.log(err)
            else if (setting) {
                $dbModels[discriminatorName].findOneAndUpdate({}, 
                    {
                        options: toBeSaved.options,
                        savedOn: new Date()
                    }, (err) => { this.databaseCallback(response, err) }
                ).select(['options'])
            } else {
                const x = new $dbModels[discriminatorName](toBeSaved)
                x.save((err) => { this.databaseCallback(response, err) })
            }
        })
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
        else if (isMongooseDiscriminator)  this.saveSetting(toBeSaved.__t, toBeSaved, response)
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
    },
    getSetting(name) {
        return new Promise((resolve, reject) => {
            $dbModels[name].findOne({}, (err, setting) => {
                if (err) {
                    console.log(err)
                    reject()
                }
                if (setting) {
                    resolve(setting)
                } else {
                    console.log('unknown error')
                    reject()
                }
            }).select(['options', 'savedOn'])
        })
    }
}

module.exports = funcs