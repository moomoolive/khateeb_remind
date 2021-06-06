const requestValidationHelpers = require("./main.js")
const testHelpers = require($rootDir + "/tests/helpers/main.js")

const { globalConfig } = require($rootDir + "/Server.config.js")

testHelpers.testModuleTitle("Request Validation Module")

describe("Valid or null id checking function", () => {

    it("Should return true when a valid id or null id is inputted", () => {
        const idWithLengthOfMongooseDefaultIdLength = "012345678901234567890123"
        expect(requestValidationHelpers.validIdOrNullIdInField(globalConfig.consts.nullId)).toBe(true)
        expect(requestValidationHelpers.validIdOrNullIdInField("TBD")).toBe(true)
        expect(requestValidationHelpers.validIdOrNullIdInField(idWithLengthOfMongooseDefaultIdLength)).toBe(true)
        expect(requestValidationHelpers.validIdOrNullIdInField("098765432109876543210987")).toBe(true)
    })

    it("Should throw error when a non-id is inputted", () => {
        const a = () => requestValidationHelpers.validIdOrNullIdInField(null)
        expect(a).toThrowError(TypeError)
        const b = () => requestValidationHelpers.validIdOrNullIdInField("a_random_id")
        expect(b).toThrowError(TypeError)
        const c = () => requestValidationHelpers.validIdOrNullIdInField(0)
        expect(c).toThrow(TypeError)
    })

    it("Should throw error when undefined is inputted", () => {
        const a = () => requestValidationHelpers.validIdOrNullIdInField(undefined)
        expect(a).toThrowError(TypeError)
    })
})

describe("Valid institution id function", () => {

    it("Should return true when valid institution id is provided", () => {
        const idWithLengthOfMongooseDefaultIdLength = "012345678901234567890123"
        expect(requestValidationHelpers.validInstitutionId(idWithLengthOfMongooseDefaultIdLength)).toBe(true)
        expect(requestValidationHelpers.validInstitutionId("098765432109876543210987")).toBe(true)
        // this is here for legacy reasons
        expect(requestValidationHelpers.validInstitutionId("root")).toBe(true)
    })

    it("Should throw error when a non-id is inputted", () => {
        const a = () => requestValidationHelpers.validInstitutionId(null)
        expect(a).toThrowError(TypeError)
        const b = () => requestValidationHelpers.validInstitutionId("a_random_id")
        expect(b).toThrowError(TypeError)
        const c = () => requestValidationHelpers.validInstitutionId(0)
        expect(c).toThrow(TypeError)
    })

    it("Should throw error when undefined is inputted", () => {
        const a = () => requestValidationHelpers.validInstitutionId(undefined)
        expect(a).toThrowError(TypeError)
    })
})