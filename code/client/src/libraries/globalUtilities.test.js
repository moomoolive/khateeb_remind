import globalUtilities from './globalUtilities.js'

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
  