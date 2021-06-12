import library from './main.js'

describe("timing display function", () => {
    
    it("returns correct display string part 1", () => {
        const timing = { hour: 12, minute: 50 }
        const str = library.timingDisplay(timing)
        expect(str).toBe("12:50 PM")
    })

    it("returns correct display string part 1", () => {
        const timing = { hour: 11, minute: 50 }
        const str = library.timingDisplay(timing)
        expect(str).toBe("11:50 AM")
    })

    it("returns correct display string part 1", () => {
        const timing = { hour: 14, minute: 10 }
        const str = library.timingDisplay(timing)
        expect(str).toBe("02:10 PM")
    })

})

describe("cron timing function", () => {

    it("returns correct chron timing js date object part 1", () => {
        const dayOfWeek = 3
        const minute = 50
        const hour = 12
        const cronTime = { dayOfWeek, minute, hour }
        const jsDate = library.chronTiming(cronTime)
        expect(jsDate.getDay()).toBe(dayOfWeek)
        expect(jsDate.getMinutes()).toBe(minute)
        expect(jsDate.getHours()).toBe(hour)
    })

    it("returns correct chron timing js date object part 2", () => {
        const dayOfWeek = 2
        const minute = 2
        const hour = 17
        const cronTime = { dayOfWeek, minute, hour }
        const jsDate = library.chronTiming(cronTime)
        expect(jsDate.getDay()).toBe(dayOfWeek)
        expect(jsDate.getMinutes()).toBe(minute)
        expect(jsDate.getHours()).toBe(hour)
    })

    it("returns correct chron timing js date object part 3", () => {
        const dayOfWeek = 5
        const minute = 59
        const hour = 19
        const cronTime = { dayOfWeek, minute, hour }
        const jsDate = library.chronTiming(cronTime)
        expect(jsDate.getDay()).toBe(dayOfWeek)
        expect(jsDate.getMinutes()).toBe(minute)
        expect(jsDate.getHours()).toBe(hour)
    })

})