const createRootInstitutionAndUser = async () => {
    try {
        let rootInstitution = await $db.institutions.findOne({ name: '__ROOT__' }).exec()
        if (!rootInstitution)
            rootInstitution = await new $db.institutions({
                name: "__ROOT__",
                timezone: global.APP_CONFIG.cron.timezone,
                confirmed: true,
                country: 'none',
                settings: {
                    ...global.APP_CONFIG.rootInstitution.settingsInitial
                }
            }).save()
        else
            console.log(`Root institution already exists`)
        const rootAdmin = await $db.root.findOne({}).exec()
        if (!rootAdmin)
            await rootInstitution.createRootSystemAdmin({
                ...global.APP_CONFIG.rootUserInitialization,
                institutionID: rootInstitution._id.toString(),
                password: process.env.DEFAULT_ROOT_PASS || 'password123',
                confirmed: true,
                phoneNumber: 999_999_9999
            })
        else
            console.log(`Root user already exists`)
    } catch(err) {
        console.log(err)
        console.log(`Root user couldn't be created!`)
    }
}

const createTestInstitution = async () => {
    try {
        let testInstitution = await $db.institutions.findOne({ name: "__TEST__" }).exec()
        if (testInstitution)
            console.log('Test institution already exists')
        else
            testInstitution = await new $db.institutions({
                name: "__TEST__",
                ...global.APP_CONFIG.testInstitutionInitialization.institution,
            }).save()
        let testInstitutionRootAdmin = await $db.rootInstitutionAdmins.findOne({ institutionID: testInstitution._id.toString() }).exec()
        if (testInstitutionRootAdmin)
            return console.log('Test institution admin already exists')
        else
            await testInstitution.createRootAdministrator({
                institutionID: testInstitution._id.toString(),
                ...global.APP_CONFIG.testInstitutionInitialization.rootAdmin,
                phoneNumber: 100_000_0000
            })
    } catch(err) {
        console.log(err)
        console.log(`Couldn't create test school`)
    }
}


module.exports = {
    createRootInstitutionAndUser,
    createTestInstitution
}