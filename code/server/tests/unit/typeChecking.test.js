const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")
const testHelpers = require($rootDir + "/tests/helpers/main.js")

const { globalConfig } = require($rootDir + "/Server.config.js")

testHelpers.testModuleTitle("Type Checking Module")

describe("Object checking function", () => {

    it('Correctly identifies objects', () => {
        expect(typeCheckingHelpers.isAnObject({})).toBe(true)
        expect(typeCheckingHelpers.isAnObject({ hi: "hi" })).toBe(true)
        expect(typeCheckingHelpers.isAnObject({ rand: { hi: "Hi" } })).toBe(true)
    })

    it("Treats nulls as non-object", () => {
        expect(typeCheckingHelpers.isAnObject(null)).toBe(false)
    })

    it("Should return false when non-object is inputted", () => {
        expect(typeCheckingHelpers.isAnObject([])).toBe(false)
        expect(typeCheckingHelpers.isAnObject(2)).toBe(false)
        expect(typeCheckingHelpers.isAnObject("hi")).toBe(false)
    })

    it("Should return false when undefined is inputted", () => {
        expect(typeCheckingHelpers.isAnObject(undefined)).toBe(false)
    })

})

describe("Valid Date checking function", () => {

    it("Should return false when invalid date inputted", () => {
        expect(typeCheckingHelpers.isValidDate(new Date("hi"))).toBe(false)
        expect(typeCheckingHelpers.isValidDate(new Date("not_a_date"))).toBe(false)
        expect(typeCheckingHelpers.isValidDate(new Date("yeah"))).toBe(false)
    })

    it("Correctly identifies valid dates", () => {
        expect(typeCheckingHelpers.isValidDate(new Date())).toBe(true)
        expect(typeCheckingHelpers.isValidDate(new Date("2021-10-10"))).toBe(true)
        expect(typeCheckingHelpers.isValidDate(new Date(Date.now()))).toBe(true)
    })

    it("Should return false when undefined is inputted", () => {
        expect(typeCheckingHelpers.isValidDate(undefined)).toBe(false)
    })

})

describe("Is Array or String checking function", () => {

    it("Should return true when string is inputted", () => {
        expect(typeCheckingHelpers.isArrayOrString("hi")).toBe(true)
        expect(typeCheckingHelpers.isArrayOrString("a longer string")).toBe(true)
        expect(typeCheckingHelpers.isArrayOrString("")).toBe(true)
    })

    it("Should return true when array is inputted", () => {
        expect(typeCheckingHelpers.isArrayOrString([])).toBe(true)
        expect(typeCheckingHelpers.isArrayOrString([2, 3])).toBe(true)
        expect(typeCheckingHelpers.isArrayOrString(["hi"])).toBe(true)
    })

    it("Should return false anything other than an array or string is inputted", () => {
        expect(typeCheckingHelpers.isArrayOrString({})).toBe(false)
        expect(typeCheckingHelpers.isArrayOrString(2)).toBe(false)
        expect(typeCheckingHelpers.isArrayOrString(true)).toBe(false)
    })

    it("Should return false when undefined is inputted", () => {
        expect(typeCheckingHelpers.isArrayOrString(undefined)).toBe(false)
    })
})

describe("String is email checking function", () => {

    it("Should return true when valid email is inputted", () => {
        expect(typeCheckingHelpers.isEmail("moomoo@hotmail.com")).toBe(true)
        expect(typeCheckingHelpers.isEmail("x@live.ca")).toBe(true)
        expect(typeCheckingHelpers.isEmail("a_really_cool_email@ilovetrees.org")).toBe(true)
    })

    it("Should return false when email doesn't include domain extension", () => {
        expect(typeCheckingHelpers.isEmail("moomoo@hotmail")).toBe(false)
        expect(typeCheckingHelpers.isEmail("x@live")).toBe(false)
        expect(typeCheckingHelpers.isEmail("ahemd@gmail")).toBe(false)
    })

    it("Should return false when input was not a string", () => {
        expect(typeCheckingHelpers.isEmail({})).toBe(false)
        expect(typeCheckingHelpers.isEmail([])).toBe(false)
        expect(typeCheckingHelpers.isEmail(2)).toBe(false)
    })

    it("Should return false when email is missing decorator", () => {
        expect(typeCheckingHelpers.isEmail("moomoohotmail.com")).toBe(false)
        expect(typeCheckingHelpers.isEmail("xlive.com")).toBe(false)
        expect(typeCheckingHelpers.isEmail("ahemdgmail.com")).toBe(false)
    })

    it("Should return false when the domain extension contains no alphabetic characters", () => {
        expect(typeCheckingHelpers.isEmail("moomoo@hotmail.1")).toBe(false)
        expect(typeCheckingHelpers.isEmail("x@live.2")).toBe(false)
        expect(typeCheckingHelpers.isEmail("a_really_cool_email@ilovetrees.3")).toBe(false)
    })

    it("Should return false when undefined is inputted", () => {
        expect(typeCheckingHelpers.isEmail(undefined)).toBe(false)
    })
})

describe("Valid id checking function", () => {

    it("Should return true when a valid id or null id is inputted", () => {
        const idWithLengthOfMongooseDefaultIdLength = "012345678901234567890123"
        expect(typeCheckingHelpers.validIdOrNullId(globalConfig.consts.nullId)).toBe(true)
        // "TBD" is accepted as a valid null id for legacy reasons
        expect(typeCheckingHelpers.validIdOrNullId("TBD")).toBe(true)
        expect(typeCheckingHelpers.validIdOrNullId(idWithLengthOfMongooseDefaultIdLength)).toBe(true)
        expect(typeCheckingHelpers.validIdOrNullId("098765432109876543210987")).toBe(true)
    })

    it("should return false when a non-id is inputted", () => {
        expect(typeCheckingHelpers.validIdOrNullId(null)).toBe(false)
        expect(typeCheckingHelpers.validIdOrNullId("a_random_id")).toBe(false)
        expect(typeCheckingHelpers.validIdOrNullId(0)).toBe(false)
    })

    it("Should return false when undefined is inputted", () => {
        expect(typeCheckingHelpers.validIdOrNullId(undefined)).toBe(false)
    })
})