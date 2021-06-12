import library from "./main.js"

describe("Tag factory function", () => {

    it("returns correct tags with inputted 'important' announcement", () => {
        const announcement = { important: true }
        const tags = library.tagLoader(announcement)
        const targetTag = tags.find(t => t === "important")
        expect(Boolean(targetTag)).toBe(true)
    })

    it("returns correct tags with inputted 'urgent' announcement", () => {
        const announcement = { urgent: true }
        const tags = library.tagLoader(announcement)
        const targetTag = tags.find(t => t === "urgent")
        expect(Boolean(targetTag)).toBe(true)
    })

    it("returns correct tags with inputted when user's last login was before announcement update date", () => {
        const announcement = { updatedAt: new Date() }
        const lastLogin = new Date("2012-2-20")
        const tags = library.tagLoader(announcement, lastLogin)
        const targetTag = tags.find(t => t === "new")
        expect(Boolean(targetTag)).toBe(true)
    })

    it("returns correct tags with inputted when user's last login was before announcement update date and wiggle option is true", () => {
        const announcement = { updatedAt: new Date() }
        const lastLogin = new Date("2012-2-20")
        const tags = library.tagLoader(announcement, lastLogin, true)
        const targetTag = tags.find(t => t === "new_wiggle")
        expect(Boolean(targetTag)).toBe(true)
    })

    it("Returns multiple tags when announcement fullfills multiple criteria", () => {
        const announcement = { important: true, urgent: true }
        const tags = library.tagLoader(announcement)
        const targetTag1 = tags.find(t => t === "important")
        expect(Boolean(targetTag1)).toBe(true)
        const targetTag2 = tags.find(t => t === "urgent")
        expect(Boolean(targetTag2)).toBe(true)
    })
})

describe("annoucement headline text", () => {

    describe("returns correct headline format part 1", () => {
        const announcement = { updatedAt: new Date("2012-2-20"), headline: "hey" }
        const headline = library.headlineText(announcement)
        expect(headline).toBe("2/20/2012 12:00 AM || hey")
    })

    describe("returns correct headline format part 2", () => {
        const announcement = { updatedAt: new Date("2012-2-20"), headline: "new headline" }
        const headline = library.headlineText(announcement)
        expect(headline).toBe("2/20/2012 12:00 AM || new headline")
    })
})