const mongoose = require('mongoose')

const institutions = require($rootDir + "/database/models/institutions.js")
const users = require($rootDir + "/database/models/users.js")

const testInstitution = new mongoose.Schema(
    {},
{ timestamps: true, minimize: false })

// most methods here found in parent schema 'institution'
testInstitution.methods.deactivate = async function() {
    const res = {}
    res.directDependencies = await this.deleteDirectDependencies()
    res.logo = await this.deleteInstitutionLogo()
    const authorizationKeys = await this.getAuthorizationKeys()
    try {
        // In the case that users with authorization keys aren't correctly deleted
        // I want to keep the authorization keys so that they can at least be
        // manually deleted, or programmatically by a cron script
        res.userAuth = await this.deleteAllUsers(authorizationKeys)
        res.authKeys = await this.deleteAuthorizationKeys()
        res.institution = await this.deleteInstitution()
    } catch(err) {
        console.error(err)
    }
    console.log(res)
    return res
}

testInstitution.methods.deleteAllUsers = async function(authKeys=[]) {
    try {
        const res = await users.deleteMany({
            "authorizations.authId": { $in: authKeys }
        })
        return res
    } catch(err) {
        console.error(err)
        throw new Error(err)
    }
}

testInstitution.methods.deleteInstitution = async function(postHook=()=>{}) {
    try {
        const res = await institutions.deleteOne({ _id: this._id })
        postHook()
        return res
    } catch(err) {
        console.error(err)
        throw new Error(err)
    }
}

module.exports = institutions.discriminator('testInstitution', testInstitution)