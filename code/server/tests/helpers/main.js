function testModuleTitle(title="default title", subTitle="Tests will start now") {
    const mainTitle = title.toUpperCase()
    describe(`** ${mainTitle} **`, () => {
        it(subTitle, () => expect(true).toBe(true))
    })
}

module.exports = {
    testModuleTitle
}