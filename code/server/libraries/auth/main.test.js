const authHelpers = require("./main.js")
const testHelpers = require($rootDir + "/tests/helpers/main.js")

const jwt = require("jsonwebtoken")

// found in .env.test @ root folder
const TEST_JWT_SECRET = "secret"
// end enviromental variable mocks

testHelpers.testModuleTitle("Authorization Module")

describe( `Token Creation Function`, () => {
    const tokenPayload = { 
        random: "hi", 
        random2: "bye", 
        random3: true, 
        random4: 20 
    }
    const token = authHelpers.createToken(tokenPayload, '2-days')

    it('Token verification succeeds with correct jwt secret', () => {        
        jwt.verify(token, TEST_JWT_SECRET, (err, decoded) => {
            expect(err).toBe(null)
            expect(Boolean(decoded)).toBe(true)
        })
    })

    it('Token verification fails with mismatched jwt secret', () => {
        jwt.verify(token, "not secret", err => {
            expect(Boolean(err)).toBe(true)
        })
    })

    it('Created token holds correct expiration date using hours syntax', () => {
        jwt.verify(token, TEST_JWT_SECRET, (_, decoded) => {
            const oneDayInSeconds = 60 * 60 * 24
            const tokenLifetime = decoded.exp - decoded.iat
            expect(tokenLifetime).toBe(oneDayInSeconds * 2)
        })
    })

    it('Created token holds correct expiration date using minutes syntax', () => {
        const expiration = "20-minutes"
        const token = authHelpers.createToken(tokenPayload, expiration)
        jwt.verify(token, TEST_JWT_SECRET, (_, decoded) => {
            const oneMinuteInSeconds = 60
            const tokenLifetime = decoded.exp - decoded.iat
            expect(tokenLifetime).toBe(oneMinuteInSeconds * 20)
        })
    })

    it('Created token carries correct payload', () => {        
        jwt.verify(token, TEST_JWT_SECRET, (_, decoded) => {
            expect(decoded.random).toBe("hi")
            expect(decoded.random2).toBe("bye")
            expect(decoded.random3).toBe(true)
            expect(decoded.random4).toBe(20)
        })
    })
})

describe("Cast User Type String to Authorization Level Number Function", () => {
    it("User type 'user' casts to 1", () => {
        const userType = "user"
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(1)
    })

    it("User type 'khateeb' casts to 2", () => {
        const userType = "khateeb"
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(2)
    })

    it("User type 'institutionAdmin' casts to 3", () => {
        const userType = "institutionAdmin"
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(3)
    })

    it("User type 'rootInstitutionAdmin' casts to 4", () => {
        const userType = "rootInstitutionAdmin"
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(4)
    })

    it("User type 'sysAdmin' casts to 5", () => {
        const userType = "sysAdmin"
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(5)
    })

    it("User type 'root' casts to 6", () => {
        const userType = "root"
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(6)
    })

    it("Inputting non-existent user type returns 0", () => {
        const userType = "blah"
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(0)
    })

    it("Inputting falsy value (undefined) returns 0", () => {
        const userType = undefined
        const authLevel = authHelpers.userTypeToAuthLevel(userType)
        expect(authLevel).toBe(0)
    })
})


describe("User Authenticator Function", () => {
    it("User type that doesn't meet minimum authorization requirements returns false", () => {
        const userType = 'khateeb'
        const isValid = authHelpers.validUserAuthentication(userType, { min: 3 })
        expect(isValid).toBe(false)
    })

    it("User type that meets minimum authorization requirements returns true", () => {
        const userType = 'khateeb'
        const isValid = authHelpers.validUserAuthentication(userType, { min: 2 })
        expect(isValid).toBe(true)
    })

    it("User type that is within authorization range returns true", () => {
        const userType = 'khateeb'
        const isValid = authHelpers.validUserAuthentication(userType, { min: 2, max: 4 })
        expect(isValid).toBe(true)
    })

    it("User type that is not within authorization range returns false", () => {
        const userType = 'root'
        const isValid = authHelpers.validUserAuthentication(userType, { min: 2, max: 4 })
        expect(isValid).toBe(false)
    })

    it("User type that meets exact authorization level returns true", () => {
        const userType = 'khateeb'
        const isValid = authHelpers.validUserAuthentication(userType, { level: 2 })
        expect(isValid).toBe(true)
    })

    it("User type that does not meets exact authorization level returns false", () => {
        const userType = 'user'
        const isValid = authHelpers.validUserAuthentication(userType, { level: 2 })
        expect(isValid).toBe(false)
    })
})

describe("Header mutation function", () => {
    const mockRequest = {
        headers: {}
    }
    const decodedToken = {
        institutionID: "1234",
        _id: "4321",
        __t: "khateeb"
    }
    const copyObject = obj => JSON.parse(JSON.stringify(obj))
    it("Mutates headers correctly for users without special status", () => {
        const copy = copyObject(mockRequest)
        authHelpers.mutateHeadersToIncludeUserInfo(copy, decodedToken)
        expect(copy.headers.institutionid).toBe("1234")
        expect(copy.headers.userid).toBe("4321")
        expect(copy.headers.usertype).toBe("khateeb")
        expect(copy.headers.targetusermodel).toBe("users")
        expect(copy.headers.specialStatus).toBe(undefined)
        expect(copy.headers.specialInstitution).toBe(undefined)
        expect(copy.headers.authLevel).toBe(2)
    })

    it("Mutates special users headers correctly", () => {
        const copy = copyObject(mockRequest)
        authHelpers.mutateHeadersToIncludeUserInfo(copy, { ...decodedToken, specialStatus: "sysAdmin" })
        expect(copy.headers.targetusermodel).toBe("sysAdmins")
        expect(copy.headers.specialStatus).toBe("sysAdmin")
    })

    it("Mutates users with special institution correctly", () => {
        const copy = copyObject(mockRequest)
        authHelpers.mutateHeadersToIncludeUserInfo(copy, { ...decodedToken, specialInstitution: "test" })
        expect(copy.headers.specialInstitution).toBe("test")
    })
})

describe("valid authorization key checking function", () => {

    it("should return true for special user types regardless of key part 1", () => {
        const key = {}
        const specialUserType = "root"
        expect(authHelpers.isValidAuthorizationKey(key, specialUserType)).toBe(true)
    })

    it("should return true for special user types regardless of key part 1", () => {
        const key = {}
        const specialUserType = "sysAdmin"
        expect(authHelpers.isValidAuthorizationKey(key, specialUserType)).toBe(true)
    })

    it("should return true for non-special user with existent authorization key that is confirmed", () => {
        const key = { confirmed: true }
        expect(authHelpers.isValidAuthorizationKey(key)).toBe(true)
    })

    it("should return false for non-special user with unconfirmed authorization key", () => {
        const key = { confirmed: false }
        expect(authHelpers.isValidAuthorizationKey(key)).toBe(false)
    })

    it("should return false for non-special user missing authorization key", () => {
        expect(authHelpers.isValidAuthorizationKey()).toBe(false)
    })

})