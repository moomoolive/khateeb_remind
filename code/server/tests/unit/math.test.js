const mathHelpers = require($rootDir + "/libraries/math/main.js")
const testHelpers = require($rootDir + "/tests/helpers/main.js")

testHelpers.testModuleTitle("Math Module")

describe("Random number generation function", () => {

    it('Returns random numbers', () => {
        const baseCase = mathHelpers.generateRandomNumber(5)
        expect(baseCase !== mathHelpers.generateRandomNumber(5)).toBe(true)
        expect(baseCase !== mathHelpers.generateRandomNumber(5)).toBe(true)
        expect(baseCase !== mathHelpers.generateRandomNumber(5)).toBe(true)
    })

    it("Returns number with specified number of digits", () => {
        expect(mathHelpers.generateRandomNumber(5).toString().length === 5).toBe(true)
        expect(mathHelpers.generateRandomNumber(4).toString().length === 4).toBe(true)
        expect(mathHelpers.generateRandomNumber(8).toString().length === 8).toBe(true)
    })

    it("Returns number with 1 digit if 0 is inputted", () => {
        expect(mathHelpers.generateRandomNumber(0).toString().length === 1).toBe(true)
    })

    it("Returns number with 1 digit if input is less than 0", () => {
        expect(mathHelpers.generateRandomNumber(-1).toString().length === 1).toBe(true)
        expect(mathHelpers.generateRandomNumber(-5).toString().length === 1).toBe(true)
        expect(mathHelpers.generateRandomNumber(-7).toString().length === 1).toBe(true)
    })

})