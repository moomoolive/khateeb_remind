import library from './main.js'

describe("Date base date formating function", () => {

    it("Should return date object with same date, year, and month as input with hours @ 12:00PM UTC", () => {
        const hours = 12
        
        let date = 6
        let year = 2021
        let month = 5
        let jsDate = new Date(year, month, date)
        let dbFormattedDate = new Date(library.fridayToFridayDBFormat(jsDate))
        expect(dbFormattedDate.getUTCHours()).toBe(hours)
        expect(dbFormattedDate.getUTCDate()).toBe(date)
        expect(dbFormattedDate.getMonth()).toBe(month)
        expect(dbFormattedDate.getUTCFullYear()).toBe(year)

        date = 7
        year = 2007
        month = 3
        jsDate = new Date(year, month, date)
        dbFormattedDate = new Date(library.fridayToFridayDBFormat(jsDate))
        expect(dbFormattedDate.getUTCHours()).toBe(hours)
        expect(dbFormattedDate.getUTCDate()).toBe(date)
        expect(dbFormattedDate.getMonth()).toBe(month)
        expect(dbFormattedDate.getUTCFullYear()).toBe(year)

        date = 18
        year = 1990
        month = 10
        jsDate = new Date(year, month, date)
        dbFormattedDate = new Date(library.fridayToFridayDBFormat(jsDate))
        expect(dbFormattedDate.getUTCHours()).toBe(hours)
        expect(dbFormattedDate.getUTCDate()).toBe(date)
        expect(dbFormattedDate.getMonth()).toBe(month)
        expect(dbFormattedDate.getUTCFullYear()).toBe(year)
    })
    
})

describe("Monthly Query database query creator function", () => {

    it("should return correct query format part 1", () => {
        const year = 2021
        const feburary = 2
        const date = new Date(`${year}-${feburary}-3`)
        const { $lt, $gte } = library.createMonthlyRequestRange(date)
        const lesser = new Date($lt)
        expect(lesser.getDate()).toBeLessThan(2)
        expect(lesser.getMonth()).toBe(feburary)
        expect(lesser.getFullYear()).toBe(year)
        const greater = new Date($gte)
        expect(greater.getDate()).toBeGreaterThanOrEqual(1)
        expect(greater.getMonth()).toBe(feburary - 1)
        expect(greater.getFullYear()).toBe(year)
    })

    it("should return correct query format part 2", () => {
        const year = 1999
        const feburary = 2
        const date = new Date(`${year}-${feburary}-3`)
        const { $lt, $gte } = library.createMonthlyRequestRange(date)
        const lesser = new Date($lt)
        expect(lesser.getDate()).toBeLessThan(2)
        expect(lesser.getMonth()).toBe(feburary)
        expect(lesser.getFullYear()).toBe(year)
        const greater = new Date($gte)
        expect(greater.getDate()).toBeGreaterThanOrEqual(1)
        expect(greater.getMonth()).toBe(feburary - 1)
        expect(greater.getFullYear()).toBe(year)
    })

    it("should return correct query format part 3", () => {
        const year = 1999
        const may = 5
        const date = new Date(`${year}-${may}-3`)
        const { $lt, $gte } = library.createMonthlyRequestRange(date)
        const lesser = new Date($lt)
        expect(lesser.getDate()).toBeLessThan(2)
        expect(lesser.getMonth()).toBe(may)
        expect(lesser.getFullYear()).toBe(year)
        const greater = new Date($gte)
        expect(greater.getDate()).toBeGreaterThanOrEqual(1)
        expect(greater.getMonth()).toBe(may - 1)
        expect(greater.getFullYear()).toBe(year)
    })
})