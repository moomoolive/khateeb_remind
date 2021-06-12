import library from './main.js'

describe("camel case to array function", () => {

    it("correctly parses camel case part 1", () => {
        const word = "camelCase"
        const correctlyParsed = ["camel", "Case"]
        const parsed = library.camelCaseToArray(word)
        for (let i = 0; i < correctlyParsed.length; i++) {
            expect(parsed[i]).toBe(correctlyParsed[i])
        }
    })

    it("correctly parses camel case part 2", () => {
        const word = "yeahManLetsParse"
        const correctlyParsed = ["yeah", "Man", "Lets", "Parse"]
        const parsed = library.camelCaseToArray(word)
        for (let i = 0; i < correctlyParsed.length; i++) {
            expect(parsed[i]).toBe(correctlyParsed[i])
        }
    })

    it("correctly parses camel case part 3", () => {
        const word = "parseMe"
        const correctlyParsed = ["parse", "Me"]
        const parsed = library.camelCaseToArray(word)
        for (let i = 0; i < correctlyParsed.length; i++) {
            expect(parsed[i]).toBe(correctlyParsed[i])
        }
    })

    it("Returns array with one entry if no camel case is present", () => {
        const word = "parsemeplease"
        const correctlyParsed = ["parsemeplease"]
        const parsed = library.camelCaseToArray(word)
        for (let i = 0; i < correctlyParsed.length; i++) {
            expect(parsed[i]).toBe(correctlyParsed[i])
        }
    })

})

describe("array to string function", () => {

    it("correctly build string from array with title case option", () => {
        const arr = ["hi", "there"]
        expect(library.arrayToString(arr, "title")).toBe("Hi There")
    })

    it("correctly build string from array with upper case option", () => {
        const arr = ["hi", "there"]
        expect(library.arrayToString(arr, "upper")).toBe("HI THERE")
    })

    it("correctly build string from array with upper case option", () => {
        const arr = ["HI", "THERE"]
        expect(library.arrayToString(arr, "lower")).toBe("hi there")
    })

    it("should return empty string if empty array is inputted", () => {
        expect(library.arrayToString([], "title")).toBe("")
    })

})