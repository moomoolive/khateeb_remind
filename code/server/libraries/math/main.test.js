const mathHelpers = require("./main.js")
const testHelpers = require($rootDir + "/tests/helpers/main.js")

testHelpers.testModuleTitle("Math Module")

describe("Random number generation function", () => {

    it('Should return random numbers', () => {
        const baseCase = mathHelpers.generateRandomNumber(5)
        expect(baseCase).not.toBe(mathHelpers.generateRandomNumber(5))
        expect(baseCase).not.toBe(mathHelpers.generateRandomNumber(5))
        expect(baseCase).not.toBe(mathHelpers.generateRandomNumber(5))
    })

    it("Should return number with specified number of digits", () => {
        expect(mathHelpers.generateRandomNumber(5).toString().length).toBe(5)
        expect(mathHelpers.generateRandomNumber(4).toString().length).toBe(4)
        expect(mathHelpers.generateRandomNumber(8).toString().length).toBe(8)
    })

    it("Should return number with 1 digit if 0 is inputted", () => {
        expect(mathHelpers.generateRandomNumber(0).toString().length).toBe(1)
    })

    it("Should return number with 1 digit if input is less than 0", () => {
        expect(mathHelpers.generateRandomNumber(-1).toString().length).toBe(1)
        expect(mathHelpers.generateRandomNumber(-5).toString().length).toBe(1)
        expect(mathHelpers.generateRandomNumber(-7).toString().length).toBe(1)
    })

})