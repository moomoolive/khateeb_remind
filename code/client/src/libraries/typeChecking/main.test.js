import library from './main.js'

describe("Object checking function", () => {

    it('Correctly identifies objects', () => {
        expect(library.isAnObject({})).toBe(true)
        expect(library.isAnObject({ hi: "hi" })).toBe(true)
        expect(library.isAnObject({ rand: { hi: "Hi" } })).toBe(true)
    })

    it("Treats nulls as non-object", () => {
        expect(library.isAnObject(null)).toBe(false)
    })

    it("Should return false when non-object is inputted", () => {
        expect(library.isAnObject([])).toBe(false)
        expect(library.isAnObject(2)).toBe(false)
        expect(library.isAnObject("hi")).toBe(false)
    })

    it("Should return false when undefined is inputted", () => {
        expect(library.isAnObject(undefined)).toBe(false)
    })

})

describe("Valid Date checking function", () => {

    it("Should return false when invalid date inputted", () => {
        expect(library.isValidDate(new Date("hi"))).toBe(false)
        expect(library.isValidDate(new Date("not_a_date"))).toBe(false)
        expect(library.isValidDate(new Date("yeah"))).toBe(false)
    })

    it("Correctly identifies valid dates", () => {
        expect(library.isValidDate(new Date())).toBe(true)
        expect(library.isValidDate(new Date("2021-10-10"))).toBe(true)
        expect(library.isValidDate(new Date(Date.now()))).toBe(true)
    })

    it("Should return false when undefined is inputted", () => {
        expect(library.isValidDate(undefined)).toBe(false)
    })

})

describe("Cast to array function", () => {

    it("Should return array if array was inputted part 1", () => {
        const arr = []
        const casted = library.castToArray(arr)
        expect(Array.isArray(casted)).toBe(true)
        expect(casted.length).toBe(0)
    })

    it("Should return array if array was inputted part 2", () => {
        const firstElement = "hi"
        const arr = [firstElement]
        const casted = library.castToArray(arr)
        expect(Array.isArray(casted)).toBe(true)
        expect(casted.length).toBe(1)
        expect(casted[0]).toBe(firstElement)
    })

    it("Should return array with input inside if input was not an array part 1", () => {
        const input = "hi"
        const casted = library.castToArray(input)
        expect(Array.isArray(casted)).toBe(true)
        expect(casted.length).toBe(1)
        expect(casted[0]).toBe(input)
    })

    it("Should return array with input inside if input was not an array part 2", () => {
        const input = true
        const casted = library.castToArray(input)
        expect(Array.isArray(casted)).toBe(true)
        expect(casted.length).toBe(1)
        expect(casted[0]).toBe(input)
    })

    it("Should return array with input inside if input was not an array part 3", () => {
        const input = 45
        const casted = library.castToArray(input)
        expect(Array.isArray(casted)).toBe(true)
        expect(casted.length).toBe(1)
        expect(casted[0]).toBe(input)
    })
})

describe("JWT checking function", () => {

    it("should return false if non-string is inputted part 1", () => {
        expect(library.isJWT(500)).toBe(false)
    })

    it("should return false if non-string is inputted part 2", () => {
        expect(library.isJWT({})).toBe(false)
    })

    it("should return false if non-string is inputted part 3", () => {
        expect(library.isJWT(["hi"])).toBe(false)
    })

    it("should return false if inputted string does not have three sections seperated by periods part 1", () => {
        expect(library.isJWT("not.3.sections.here")).toBe(false)
    })

    it("should return false if inputted string does not have three sections seperated by periods part 2", () => {
        expect(library.isJWT("too.little")).toBe(false)
    })

    it("should return false if inputted string does not have three sections seperated by periods part 3", () => {
        expect(library.isJWT("no dots at all")).toBe(false)
    })

    // jwt examples provided by jwt.io
    it("should return true if valid jwt is inputted part 1", () => {
        expect(library.isJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c")).toBe(true)
    })

    it("should return true if valid jwt is inputted part 2", () => {
        expect(library.isJWT("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.-gA0s_1W17W97dDB1gVRe0jlrvQbzziyTN1EFDcKUKs")).toBe(true)
    })
})