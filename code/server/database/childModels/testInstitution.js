const mongoose = require('mongoose')

const scripts = require($rootDir + '/libraries/scripts/index.js')

const institutions = require($rootDir + "/database/models/institutions.js")

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
        const res = await $db.users.deleteMany({
            "authorizations.authId": { $in: authKeys }
        })
        return res
    } catch(err) {
        console.error(err)
        throw new Error(err)
    }
}

testInstitution.methods.deleteInstitution = async function() {
    try {
        const res = await institutions.deleteOne({ _id: this._id })
        return res
    } catch(err) {
        console.error(err)
        throw new Error(err)
    }
}

// the test institution always recreates itself
testInstitution.post('deleteOne', async function() {
    const threeSecondsInMilliseconds = 3_000
    global.setTimeout(async () => { 
        try {
            await scripts.createTestInstitution() 
        } catch(err) {
            console.error(err)
        }
    }, threeSecondsInMilliseconds)
})

module.exports = institutions.discriminator('testInstitution', testInstitution)