const scheduleHelpers = require("./main.js")
const testHelpers = require($rootDir + "/tests/helpers/main.js")

testHelpers.testModuleTitle("Schedule Module")

describe("Find upcoming friday function", () => {

    it("Should return upcoming friday if non-friday date is inputted", () => {
        let year = 2021
        const june = 5
        const thursday = 3
        let jsDate = new Date(year, june, thursday)
        let upcomingFriday = scheduleHelpers.findUpcomingFriday(jsDate)
        expect(upcomingFriday.getFullYear()).toBe(year)
        expect(upcomingFriday.getMonth()).toBe(june)
        expect(upcomingFriday.getDate()).toBe(thursday + 1)
        
        year = 2020
        const december = 11
        const tuesday = 8
        jsDate = new Date(year, december, tuesday)
        upcomingFriday = scheduleHelpers.findUpcomingFriday(jsDate)
        expect(upcomingFriday.getFullYear()).toBe(year)
        expect(upcomingFriday.getMonth()).toBe(december)
        expect(upcomingFriday.getDate()).toBe(tuesday + 3)
    })

    it("Should return same date if input is a friday", () => {
        let year = 2021
        const june = 5
        let friday = 4
        let jsDate = new Date(year, june, friday)
        let upcomingFriday = scheduleHelpers.findUpcomingFriday(jsDate)
        expect(upcomingFriday.getFullYear()).toBe(year)
        expect(upcomingFriday.getMonth()).toBe(june)
        expect(upcomingFriday.getDate()).toBe(friday)
        
        year = 2020
        const november = 10
        friday = 6
        jsDate = new Date(year, november, friday)
        upcomingFriday = scheduleHelpers.findUpcomingFriday(jsDate)
        expect(upcomingFriday.getFullYear()).toBe(year)
        expect(upcomingFriday.getMonth()).toBe(november)
        expect(upcomingFriday.getDate()).toBe(friday)
    })
})

describe("Find first friday of month function", () => {

    it("Should return first friday of month", () => {
        const june = 5
        let year = 2021
        let firstFriday = scheduleHelpers.findFirstFriday(june, year)
        let firstFridayDate = 4
        expect(firstFriday.getDate()).toBe(firstFridayDate)
        expect(firstFriday.getFullYear()).toBe(year)
        expect(firstFriday.getMonth()).toBe(june)
        
        const may = 4
        firstFriday = scheduleHelpers.findFirstFriday(may, year)
        firstFridayDate = 7
        expect(firstFriday.getDate()).toBe(firstFridayDate)
        expect(firstFriday.getFullYear()).toBe(year)
        expect(firstFriday.getMonth()).toBe(may)
    })
})

describe("JS Date Object datate, month, and year comparison function", () => {

    it("Should return true if two dates with same date, month, and year are inputted", () => {
        let a = new Date()
        let b = new Date()
        expect(scheduleHelpers.sameMonthDateAndYear(a, b)).toBe(true)
        
        a = new Date(2021, 3, 4)
        b = new Date(2021, 3, 4)
        expect(scheduleHelpers.sameMonthDateAndYear(a, b)).toBe(true)
        
        a = new Date(1998, 5, 17)
        b = new Date(1998, 5, 17)
        expect(scheduleHelpers.sameMonthDateAndYear(a, b)).toBe(true)
    })

    it("Should return false if two dates differ in date, month, or year are inputted", () => {
        let a = new Date(2021, 3, 4)
        let b = new Date(2021, 3, 5)
        expect(scheduleHelpers.sameMonthDateAndYear(a, b)).toBe(false)
        
        a = new Date(2021, 5, 4)
        b = new Date(2021, 3, 4)
        expect(scheduleHelpers.sameMonthDateAndYear(a, b)).toBe(false)
        
        a = new Date(1998, 5, 17)
        b = new Date(1996, 5, 17)
        expect(scheduleHelpers.sameMonthDateAndYear(a, b)).toBe(false)
    })
})

describe("Count number of fridays in month function", () => {

    it("Returns correct number of fridays in a month", () => {
        const june = 5
        let year = 2021
        const date = 6
        let jsDate = new Date(year, june, date)
        let fridaysInMonth = 4
        expect(scheduleHelpers.numberOfJummahThisMonth(jsDate)).toBe(fridaysInMonth)
        
        const april = 3
        jsDate = new Date(year, april, date)
        fridaysInMonth = 5
        expect(scheduleHelpers.numberOfJummahThisMonth(jsDate)).toBe(fridaysInMonth)
        
        year = 2020
        const december = 11
        jsDate = new Date(year, december, date)
        fridaysInMonth = 4
        expect(scheduleHelpers.numberOfJummahThisMonth(jsDate)).toBe(fridaysInMonth)
    })
})

describe("Find upcoming/previous day of week function", () => {

    it("Should return upcoming day of the week when option is selected", () => {
        const year = 2021

        const thursday = 4 
        const june = 5
        const wednesdayDate = 9
        let jsDate = new Date(year, june, wednesdayDate)
        let upcomingDayOfWeekDate = 10
        let target = scheduleHelpers.findDayOfWeek(jsDate, thursday, true)
        expect(target.getDay()).toBe(thursday)
        expect(target.getDate()).toBe(upcomingDayOfWeekDate)

        const tuesday = 2 
        const january = 0
        const saturdayDate = 2
        jsDate = new Date(year, january, saturdayDate)
        upcomingDayOfWeekDate = 5
        target = scheduleHelpers.findDayOfWeek(jsDate, tuesday, true)
        expect(target.getDay()).toBe(tuesday)
        expect(target.getDate()).toBe(upcomingDayOfWeekDate)

        const friday = 5 
        const may = 4
        const sundayDate = 23
        jsDate = new Date(year, may, sundayDate)
        upcomingDayOfWeekDate = 28
        target = scheduleHelpers.findDayOfWeek(jsDate, friday, true)
        expect(target.getDay()).toBe(friday)
        expect(target.getDate()).toBe(upcomingDayOfWeekDate)
    })

    it("Should return previous day of the week when option is selected", () => {
        const year = 2021
        
        const thursday = 4 
        const june = 5
        const wednesdayDate = 9
        let jsDate = new Date(year, june, wednesdayDate)
        let previousDayOfWeekDate = 3
        let target = scheduleHelpers.findDayOfWeek(jsDate, thursday, false)
        expect(target.getDay()).toBe(thursday)
        expect(target.getDate()).toBe(previousDayOfWeekDate)

        const tuesday = 2 
        const january = 0
        const saturdayDate = 2
        jsDate = new Date(year, january, saturdayDate)
        previousDayOfWeekDate = 29
        const previousDayOfWeekMonth = 11
        const previousDayOfWeekYear = 2020
        target = scheduleHelpers.findDayOfWeek(jsDate, tuesday, false)
        expect(target.getDay()).toBe(tuesday)
        expect(target.getDate()).toBe(previousDayOfWeekDate)
        expect(target.getMonth()).toBe(previousDayOfWeekMonth)
        expect(target.getFullYear()).toBe(previousDayOfWeekYear)

        const friday = 5 
        const may = 4
        const sundayDate = 23
        jsDate = new Date(year, may, sundayDate)
        previousDayOfWeekDate = 21
        target = scheduleHelpers.findDayOfWeek(jsDate, friday, false)
        expect(target.getDay()).toBe(friday)
        expect(target.getDate()).toBe(previousDayOfWeekDate)
    })

    it("Should return inputted date if it is the same day of week as target", () => {
        const year = 2021
        const june = 5

        const friday = 5
        const fridayDate = 4
        let jsDate = new Date(year, june, fridayDate)
        let target = scheduleHelpers.findDayOfWeek(jsDate, friday, true)
        expect(target.getDate()).toBe(fridayDate)
        expect(target.getFullYear()).toBe(year)
        expect(target.getMonth()).toBe(june)

        const sunday = 0
        const sundayDate = 6
        jsDate = new Date(year, june, sundayDate)
        target = scheduleHelpers.findDayOfWeek(jsDate, sunday, false)
        expect(target.getDate()).toBe(sundayDate)
        expect(target.getFullYear()).toBe(year)
        expect(target.getMonth()).toBe(june)

        const tuesday = 2
        const tuesdayDate = 1
        jsDate = new Date(year, june, tuesdayDate)
        target = scheduleHelpers.findDayOfWeek(jsDate, tuesday, true)
        expect(target.getDate()).toBe(tuesdayDate)
        expect(target.getFullYear()).toBe(year)
        expect(target.getMonth()).toBe(june)
    })

})

describe("Date base date formating function", () => {

    it("Should return date object with same date, year, and month as input with hours @ 12:00PM UTC", () => {
        const hours = 12
        
        let date = 6
        let year = 2021
        let month = 5
        let jsDate = new Date(year, month, date)
        let dbFormattedDate = scheduleHelpers.toDBDateFormat(jsDate)
        expect(dbFormattedDate.getUTCHours()).toBe(hours)
        expect(dbFormattedDate.getUTCDate()).toBe(date)
        expect(dbFormattedDate.getMonth()).toBe(month)
        expect(dbFormattedDate.getUTCFullYear()).toBe(year)

        date = 7
        year = 2007
        month = 3
        jsDate = new Date(year, month, date)
        dbFormattedDate = scheduleHelpers.toDBDateFormat(jsDate)
        expect(dbFormattedDate.getUTCHours()).toBe(hours)
        expect(dbFormattedDate.getUTCDate()).toBe(date)
        expect(dbFormattedDate.getMonth()).toBe(month)
        expect(dbFormattedDate.getUTCFullYear()).toBe(year)

        date = 18
        year = 1990
        month = 10
        jsDate = new Date(year, month, date)
        dbFormattedDate = scheduleHelpers.toDBDateFormat(jsDate)
        expect(dbFormattedDate.getUTCHours()).toBe(hours)
        expect(dbFormattedDate.getUTCDate()).toBe(date)
        expect(dbFormattedDate.getMonth()).toBe(month)
        expect(dbFormattedDate.getUTCFullYear()).toBe(year)
    })
})

describe("Get specificed date relative to timezone function", () => {

    // TODO
    it("Returns a JS date object with correct timing relative to timezone", () => {
        expect(true).toBe(true)
    })
})