const mongoose = require("mongoose")

const { createToken } = require($rootDir + '/libraries/auth/main.js')
const { testInstitution, authorizations, users } = require($rootDir + "/database/public.js")

function testModuleTitle(title="default title", subTitle="Tests will start now") {
    const mainTitle = title.toUpperCase()
    describe(`** ${mainTitle} **`, () => {
        it(subTitle, () => expect(true).toBe(true))
    })
}

async function createTestInstitutionRootAdminToken() {
    try {
        const institution = await testInstitution.testInstitutionExists()
        const auths = await authorizations.query({ filter: { institution: institution._id } })
        const rootInstitutionAdminAuthorization = auths.find(a => a.role === 'rootInstitutionAdmin')
        let testInstitutionRootAdmin = await users.findEntry({ 
            filter: { "authorizations.authId": rootInstitutionAdminAuthorization._id }
        })
        return createToken({
            institutionID: institution._id,
            __t: rootInstitutionAdminAuthorization.role,
            authId: rootInstitutionAdminAuthorization._id,
            _id: testInstitutionRootAdmin._id,
            institutionStatus: "testInstitution"
        })
    } catch(err) {
        console.error(err)
    }
}

class ServerInstance {
    constructor() {
        // an instance of the khateeb remind server
        // is instantiated on construction
        this.server = require($rootDir + "/Server.js")
    }

    async dropDatabase() {
        const models = Object.keys(mongoose.connection.collections)
        const errors = []
        for (const model of models) {
            try {
                await mongoose.connection.collections[model].drop()
            } catch {
                errors.push(model)
            }
        }
        return "couldn't drop models: " + errors.reduce((total, model) => `${total}, ${model}`)
    }

    cleanup() {
        mongoose.connection.close()
        this.server.close()
    }

    getInstance() {
        return this.server
    }

    async dropModel(modelName="restTokens") {
        try {
            await mongoose.connection.collections[modelName].drop()
        } catch {
            
        }
    }
}

module.exports = {
    testModuleTitle,
    ServerInstance,
    createTestInstitutionRootAdminToken
}