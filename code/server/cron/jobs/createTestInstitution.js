const { cronWrapper } = require(global.$dir + '/libraries/cron/main.js')

const options = {
    job: async () => {
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
}

module.exports = cronWrapper(options)