const testHelpers = require($rootDir + "/tests/helpers/main.js")
const library = require("./main.js")

testHelpers.testModuleTitle("JS Object Restructuring Module")

describe("Nested JS Object to dot notation function", () => {

    it("Should revert target nested objects into dot notation part-1", () => {
        const fieldNames = ["dot.me"]
        const targetObject = { dot: { me: "yeah" }, hi: true }
        const restored = library.restoreJSObjectDotNotation(fieldNames, targetObject)
        expect(restored["dot.me"]).toBe("yeah")
        expect(restored.hi).toBe(true)
    })

    it("Should revert target nested objects into dot notation part-2", () => {
        const fieldNames = ["yeah.me.cool", "please.parse"]
        const targetObject = {
            yeah: {
                me: { cool: 23 }
            },
            please: {
                parse: false
            },
            isCool: true,
            str: "yeah"
        }
        const restored = library.restoreJSObjectDotNotation(fieldNames, targetObject)
        expect(restored["yeah.me.cool"]).toBe(23)
        expect(restored["please.parse"]).toBe(false)
        expect(restored.isCool).toBe(true)
        expect(restored.str).toBe("yeah")
    })

    it("Should revert target nested objects into dot notation part-3", () => {
        const fieldNames = ["plz.parse"]
        const targetObject = {
            yeah: 50,
            isCool: true,
            str: "yeah",
            plz: { parse: true }
        }
        const restored = library.restoreJSObjectDotNotation(fieldNames, targetObject)
        expect(restored["yeah"]).toBe(50)
        expect(restored["plz.parse"]).toBe(true)
        expect(restored.isCool).toBe(true)
        expect(restored.str).toBe("yeah")
    })

    it("Should return original object if no field names specified", () => {
        const fieldNames = []
        const targetObject = {
            yeah: 50,
            isCool: true,
            str: "yeah",
            plz: { parse: true }
        }
        const restored = library.restoreJSObjectDotNotation(fieldNames, targetObject)
        expect(restored.yeah).toBe(50)
        expect(restored.plz.parse).toBe(true)
        expect(restored.isCool).toBe(true)
        expect(restored.str).toBe("yeah")
    })

    it("Should return original object if a specified field does not exist on target object part-1", () => {
        const fieldNames = ["str.cool"]
        const targetObject = {
            yeah: 50,
            isCool: true,
            str: "yeah",
            plz: { parse: true }
        }
        const restored = library.restoreJSObjectDotNotation(fieldNames, targetObject)
        expect(restored.yeah).toBe(50)
        expect(restored.plz.parse).toBe(true)
        expect(restored.isCool).toBe(true)
        expect(restored.str).toBe("yeah")
    })

    it("Should return original object if a specified field does not exist on target object part-2", () => {
        const fieldNames = ["str.cool.yo", "nope.yeah"]
        const targetObject = {
            yeah: 50,
            isCool: true,
            str: "yeah",
            plz: { parse: true }
        }
        const restored = library.restoreJSObjectDotNotation(fieldNames, targetObject)
        expect(restored.yeah).toBe(50)
        expect(restored.plz.parse).toBe(true)
        expect(restored.isCool).toBe(true)
        expect(restored.str).toBe("yeah")
    })
})