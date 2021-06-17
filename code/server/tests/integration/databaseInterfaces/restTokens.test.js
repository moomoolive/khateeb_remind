const { ServerInstance } = require($rootDir + "/tests/helpers/main.js")
const { createEntry, query, deleteEntry } = require($rootDir + "/database/interfaces/restTokens.js")
const { createTestInstitution } = require($rootDir + "/libraries/scripts/index.js")

const server = new ServerInstance()

let institution

beforeEach(async () => {
    await server.dropDatabase()
    institution = await createTestInstitution()
})

afterAll(() => {
    server.cleanup()
})

describe("REST Token creation function", () => {
    it("Should throw error when incorret input is entered", async () => {
        try {
            await createEntry({ entry: {} })
            fail()
        } catch(err) {
            expect(Boolean(err)).toBe(true)
        }
    })

    it("Should create REST token entry with correct input part 1", async () => {
        const entry = await createEntry({ 
            entry: { institution: institution._id }
        })
        expect(entry.institution.toString()).toBe(institution._id.toString())
        expect(entry.tag).toBe("default tag")
    })

    it("Should create REST token entry with correct input part 2", async () => {
        const tag = "cool token"
        const entry = await createEntry({ 
            entry: { institution: institution._id, tag }
        })
        expect(entry.institution.toString()).toBe(institution._id.toString())
        expect(entry.tag).toBe(tag)
    })

    it("Should be able to find tokens that are in database", async () => {
        const tag = "cool token"
        const entry = await createEntry({ 
            entry: { institution: institution._id, tag }
        })
        const [token] = await query({ filter: { _id: entry._id } })
        expect(Boolean(token)).toBe(true) 
    })

    it("Should be able to correctly delete existent tokens", async () => {
        const tag = "cool token"
        const entry = await createEntry({ 
            entry: { institution: institution._id, tag }
        })
        const [token] = await query({ filter: { _id: entry._id } })
        expect(Boolean(token)).toBe(true) 
        await deleteEntry({ filter: { _id: entry._id } })
        const [deletedToken] = await query({ filter: { _id: entry._id } })
        expect(Boolean(deletedToken)).toBe(false) 
    })
})