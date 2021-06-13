import library from './main.js'

describe("Cast User Type String to Authorization Level Number Function", () => {
    it("User type 'user' casts to 1", () => {
        const userType = "user"
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(1)
    })

    it("User type 'khateeb' casts to 2", () => {
        const userType = "khateeb"
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(2)
    })

    it("User type 'institutionAdmin' casts to 3", () => {
        const userType = "institutionAdmin"
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(3)
    })

    it("User type 'rootInstitutionAdmin' casts to 4", () => {
        const userType = "rootInstitutionAdmin"
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(4)
    })

    it("User type 'sysAdmin' casts to 5", () => {
        const userType = "sysAdmin"
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(5)
    })

    it("User type 'root' casts to 6", () => {
        const userType = "root"
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(6)
    })

    it("Inputting non-existent user type returns 0", () => {
        const userType = "blah"
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(0)
    })

    it("Inputting falsy value (undefined) returns 0", () => {
        const userType = undefined
        const authLevel = library.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(0)
    })
})

describe("User Authenticator Function", () => {
    it("User type that doesn't meet minimum authorization requirements returns false", () => {
        const userType = 'khateeb'
        const isValid = library.validUserAuthentication(userType, { min: 3 })
        expect(isValid).toBe(false)
    })

    it("User type that meets minimum authorization requirements returns true", () => {
        const userType = 'khateeb'
        const isValid = library.validUserAuthentication(userType, { min: 2 })
        expect(isValid).toBe(true)
    })

    it("User type that is within authorization range returns true", () => {
        const userType = 'khateeb'
        const isValid = library.validUserAuthentication(userType, { min: 2, max: 4 })
        expect(isValid).toBe(true)
    })

    it("User type that is not within authorization range returns false", () => {
        const userType = 'root'
        const isValid = library.validUserAuthentication(userType, { min: 2, max: 4 })
        expect(isValid).toBe(false)
    })

    it("User type that meets exact authorization level returns true", () => {
        const userType = 'khateeb'
        const isValid = library.validUserAuthentication(userType, { level: 2 })
        expect(isValid).toBe(true)
    })

    it("User type that does not meets exact authorization level returns false", () => {
        const userType = 'user'
        const isValid = library.validUserAuthentication(userType, { level: 2 })
        expect(isValid).toBe(false)
    })

    it("Should return true if no auth options were provided part 1", () => {
        const userType = 'user'
        const isValid = library.validUserAuthentication(userType, {})
        expect(isValid).toBe(true)
    })

    it("Should return true if no auth options were provided part 2", () => {
        const userType = 'khateeb'
        const isValid = library.validUserAuthentication(userType, {})
        expect(isValid).toBe(true)
    })
})