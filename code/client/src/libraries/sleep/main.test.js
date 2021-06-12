import library from './main.js'

describe("non-blocking sleep function", () => {

    // insert a mock version of needed window functions
    global.window = { setTimeout: global.setTimeout }

    it("Should return true after specified time part 1", async () => {
        const milliseconds = 200
        let sleep = false
        expect(sleep).toEqual(false)
        const timeBefore = performance.now()
        sleep = await library.nonBlockingSleep(milliseconds)
        const timeAfter = performance.now()
        expect(sleep).toBe(true)
        expect(timeAfter - timeBefore).toBeGreaterThanOrEqual(milliseconds)
    })

    it("Should return true after specified time part 2", async () => {
        const milliseconds = 500
        let sleep = false
        expect(sleep).toEqual(false)
        const timeBefore = performance.now()
        sleep = await library.nonBlockingSleep(milliseconds)
        const timeAfter = performance.now()
        expect(sleep).toBe(true)
        expect(timeAfter - timeBefore).toBeGreaterThanOrEqual(milliseconds)
    })

    it("Should return true after specified time part 3", async () => {
        const milliseconds = 333
        let sleep = false
        expect(sleep).toEqual(false)
        const timeBefore = performance.now()
        sleep = await library.nonBlockingSleep(milliseconds)
        const timeAfter = performance.now()
        expect(sleep).toBe(true)
        expect(timeAfter - timeBefore).toBeGreaterThanOrEqual(milliseconds)
    })
})