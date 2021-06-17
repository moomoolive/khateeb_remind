const { ServerInstance, testModuleTitle, createTestInstitutionRootAdminToken } = require($rootDir + "/tests/helpers/main.js")
const { createTestInstitution } = require($rootDir + "/libraries/scripts/index.js")

const request = require("supertest")

const server = new ServerInstance()

let jwtToken

beforeEach(async () => {
    await server.dropDatabase()
    await createTestInstitution()
    jwtToken = await createTestInstitutionRootAdminToken()
})

afterAll(() => {
    server.cleanup()
})

testModuleTitle("Rest tokens routes")

describe("REST token fetching route", () => {
    it("Should reject request when invalid authorization presented", async () => {
        await request(server.getInstance())
            .get("/rest-tokens/")
            .expect(401)
    })

    it("Should return token when token exists", async () => {
        const res = await request(server.getInstance())
            .get("/rest-tokens/")
            .set("authorization", jwtToken)
            .expect(200)
        const tokens = res.body.data
        expect(tokens.length).toBeGreaterThanOrEqual(0)
        expect(Array.isArray(tokens)).toBe(true)
    })

    it("Should return empty array when token doesn't exist", async () => {
        await server.dropModel("restTokens".toLowerCase())
        const res = await request(server.getInstance())
            .get("/rest-tokens/")
            .set("authorization", jwtToken)
            .expect(200)
        const tokens = res.body.data
        expect(tokens.length).toBeLessThanOrEqual(0)
        expect(Array.isArray(tokens)).toBe(true)
    })
})

describe("REST token creation route", () => {
    it("Should reject request if invalid authorization presented", async () => {
        const tag = "rest-token"
        await request(server.getInstance())
            .post("/rest-tokens/")
            .send({ tag })
            .expect(401)
    })

    it("Should return newly created token if valid input provided", async () => {
        const tag = "rest-token"
        const res = await request(server.getInstance())
            .post("/rest-tokens/")
            .set("authorization", jwtToken)
            .send({ tag })
            .expect(200)
        const newlyCreated = res.body.data
        expect(Object.keys(newlyCreated).length).toBeGreaterThanOrEqual(0)
        expect(newlyCreated.tag).toBe(tag)
    })

    it("Should reject request if invalid authorization body provided", async () => {
        await request(server.getInstance())
            .post("/rest-tokens/")
            .set("authorization", jwtToken)
            .send({ tag: true })
            .expect(422)
    })    
})