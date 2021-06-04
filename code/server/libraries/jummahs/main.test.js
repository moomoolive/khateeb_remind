//const jummahHelpers = require("./main.js")
const testHelpers = require($rootDir + "/tests/helpers/main.js")

testHelpers.testModuleTitle("Jummah (fridays) Module")

describe("Object checking function", () => {

    it('Correctly identifies objects', () => {
        expect(true).toBe(true)
    })

})