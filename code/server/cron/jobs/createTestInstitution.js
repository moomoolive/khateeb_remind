const { cronWrapper } = require(global.$dir + '/libraries/cron/main.js')

const options = {
    job: async () => {
        try {
            const testInstitution = await $db.institutions.findOne({ name: "__TEST__" }).exec()
            if (!!testInstitution)
                return console.log('Test institution Already Exists')
            const testTemplate = {
                name: "__TEST__",
                abbreviatedName: "__TEST__",
                ...global.APP_CONFIG.testInstitutionInitialization.institution,
            }
            const saved = await new $db.institutions(testTemplate).save()
            const adminTemplate = {
                institutionID: saved._id.toString(),
                ...global.APP_CONFIG.testInstitutionInitialization.rootAdmin,
                phoneNumber: 100_000_0000
            }
            await new $db.rootInstitutionAdmins(adminTemplate).save()
            console.log(`Created test institution`)
        } catch(err) {
            console.log(err)
            console.log(`Couldn't create test school`)
        }
    }
}

module.exports = cronWrapper(options)