const { cronWrapper } = require(global.$dir + '/libraries/cron/main.js')

const options = {
    job: async () => {
        try {
            let rootInstitution = await $db.institutions.findOne({ name: '__ROOT__' }).exec()
            if (!rootInstitution)
                rootInstitution = await new $db.institutions({
                    name: "__ROOT__",
                    timezone: global.APP_CONFIG.cron.timezone,
                    confirmed: true,
                    country: 'none',
                    settings: {
                        textAPIInfo: {}
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
}

module.exports = cronWrapper(options)