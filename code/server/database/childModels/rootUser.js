const mongoose = require('mongoose')

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

root.methods.deactivateAccount = async function(postHook=()=>{}) {
    const dependants = await this.deleteDependencies() // method found in parent schema 'user'
    const userRes = await this.deleteAccount()
    postHook()
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

module.exports = users.discriminator('root', root)