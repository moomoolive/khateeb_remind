const $dbModels = require($DIR + '/database/models/main.js')
const helpers = require('./helpers.js')


const funcs = {
    async save(modelName, toBeSaved) {
        if (toBeSaved._id)
            return $db.models[modelName].updateOne({ _id: toBeSaved._id }, toBeSaved)
        else
            return new $db.models[modelName](toBeSaved).save()
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