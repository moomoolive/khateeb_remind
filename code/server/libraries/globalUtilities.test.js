const testHelpers = require($rootDir + "/tests/helpers/main.js")
const globalUtilities = require("./globalUtilities.js")

testHelpers.testModuleTitle("Global Utilites Module")

describe("String capitalization function", () => {
    
    it("Should return empty string when empty string or whitespace inputted", () => {
        expect(globalUtilities.capitalize("")).toBe("")
        expect(globalUtilities.capitalize("    ")).toBe("")
        expect(globalUtilities.capitalize("\n")).toBe("")
    })

    it("Should return capitalized letter if string length is 1", () => {
        expect(globalUtilities.capitalize("c")).toBe("C")
        expect(globalUtilities.capitalize("k")).toBe("K")
        expect(globalUtilities.capitalize("a")).toBe("A")
    })

    it("Should return string with first non-whitespace character capitalize if string length is bigger than 1", () => {
        expect(globalUtilities.capitalize("cool")[0]).toBe("C")
        expect(globalUtilities.capitalize("kats are really kool")[0]).toBe("K")
        expect(globalUtilities.capitalize("alphabet")[0]).toBe("A")
        expect(globalUtilities.capitalize("   alphabet")[0]).toBe("A")
        expect(globalUtilities.capitalize("\nalphabet")[0]).toBe("A")
    })
})

describe("Object copying function", () => {

    it("Should return an object with exactly the same values", () => {
        let base = { hi: "hi" }
        expect(globalUtilities.deepCopy(base).hi).toBe(base.hi)
        base = ["hi"]
        expect(globalUtilities.deepCopy(base)[0]).toBe(base[0])
        base = { hi: { hi: "hi" } }
        expect(globalUtilities.deepCopy(base).hi.hi).toBe(base.hi.hi)
    })

    it("Should return a copy of object and NOT a reference", () => {
        let base = { hi: "hi" }
        let copy = globalUtilities.deepCopy(base)
        base.hi = "bye"
        expect(copy.hi).not.toBe(base.hi)
        base = ["hi"]
        copy = globalUtilities.deepCopy(base)
        base[0] = "bye"
        expect(copy[0]).not.toBe(base[0])
    })

    it("Should remove functions (or methods) from objects and arrays", () => {
        expect(globalUtilities.deepCopy([() => {}])[0]).toBe(null)
        expect(globalUtilities.deepCopy({ func: () => {} }).func).toBe(undefined)
    })
})