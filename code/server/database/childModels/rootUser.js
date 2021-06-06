const mongoose = require('mongoose')

const scripts = require($rootDir + '/libraries/scripts/index.js')

const users = require($rootDir + "/database/models/users.js")

const root = new mongoose.Schema({
    systemSettings: {
        autoConfirmInstitutionRegistration: {
            type: Boolean,
            required: false,
            default: false
        },
        autoConfirmUserRegistration: {
            type: Boolean,
            required: false,
            default: true
        }
    }
}, { timestamps: true })

const model = users.discriminator('root', root)

root.methods.deactivateAccount = async function() {
    const dependants = await this.deleteDependencies() // method found in parent schema 'user'
    const userRes = await this.deleteAccount()
    return { userRes, dependants }
}

// anytime the root user is deleted via this method they are
// automatically recreated. See the method below
root.methods.deleteAccount = async function() {
    let res = {}
    try {
        res = await model
            .deleteOne({ _id: this._id })
            .exec()
    } catch(err) {
        console.error(err)
    }
    return res
}

root.post("deleteOne", function() {
    const threeSecondsInMilliseconds = 3_000
    global.setTimeout(async () => { 
        await scripts.createRootUser() 
    }, threeSecondsInMilliseconds)
})

module.exports = model