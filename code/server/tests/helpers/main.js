const mongoose = require("mongoose")

function testModuleTitle(title="default title", subTitle="Tests will start now") {
    const mainTitle = title.toUpperCase()
    describe(`** ${mainTitle} **`, () => {
        it(subTitle, () => expect(true).toBe(true))
    })
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
}

module.exports = {
    testModuleTitle,
    ServerInstance
}