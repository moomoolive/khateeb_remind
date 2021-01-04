import $dbModels from './models.js'

const helpers = {
    appendCanadaCountryCode(phoneNumber) {
        const countryCodeArea = phoneNumber.slice(0, 2)
        const canadaCode = '+1'
        if (countryCodeArea === canadaCode) {
            return phoneNumber
        } else {
            return canadaCode + phoneNumber
        }
    },
    verifyCountryCode(toBeSaved) {
        let x  = toBeSaved.options ? toBeSaved.options : toBeSaved
        x.phoneNumber = this.appendCanadaCountryCode(x.phoneNumber)
    },
    saveSetting(discriminatorName, toBeSaved, response=false) {
        $dbModels[discriminatorName].find({}, (err, setting) => {
            if (err) console.log(err)
            else if (setting[0]) {
                $dbModels[discriminatorName].findOneAndUpdate({}, 
                    {
                        options: toBeSaved.options,
                        savedOn: new Date()
                    }, (err) => { funcs.databaseCallback(response, err) }
                    )
            } else {
                const x = new $dbModels[discriminatorName](toBeSaved)
                x.save((err) => { funcs.databaseCallback(response, err) })
            }
        })
    },
    saveDateOfEntry(toBeSaved) {
        toBeSaved.savedOn = new Date().toUTCString()
    }
}

const funcs = {
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
        console.log(toBeSaved)
        helpers.saveDateOfEntry(toBeSaved)
        // needs to be fixed here
        /*const ifPhoneNumberExists = toBeSaved.phoneNumber || toBeSaved.options.phoneNumber
        if (ifPhoneNumberExists) helpers.verifyCountryCode(toBeSaved) */
        const previousEntry = toBeSaved._id
        const isSetting = toBeSaved.__t
        if (previousEntry) {
            toBeSaved.__v++
            $dbModels[schemaName].findByIdAndUpdate(toBeSaved._id, toBeSaved, (err) => {
                this.databaseCallback(response, err)
            })
        } 
        else if (isSetting)  helpers.saveSetting(toBeSaved.__t, toBeSaved, response)
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
    async getAdminProfile() {
        let adminProfile
        await $dbModels.adminProfile.findOne({}, { _id: false }, (err, profile) => {
            if (err) console.log(err)
            else if (profile) adminProfile = profile 
        }).select(['options'])
        return adminProfile
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

export default funcs