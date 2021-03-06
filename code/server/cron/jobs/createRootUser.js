const cronWrapper = require($DIR + '/cron/cronWrapper.js')

const options = {
    job: async () => {
        try {
            const root = await $db.models.users.findOne({ institutionID: "__ROOT__" }).exec()
            if (!!root) {
                console.log(`Root User Already Exists`)
                return
            }
            const defaultRootUser = {
                ...APP_CONFIG.rootUserInitialization,
                institutionID: '__ROOT__',
                password: process.env.DEFAULT_ROOT_PASS || 'password123',
                confirmed: true,
                phoneNumber: 999_999_9999
            }
            const saved = await new $db.models.root(defaultRootUser).save()
            console.log(`Successfully created root user (id: ${saved._id.toString()}) with username ${saved.username}`)
        } catch(err) {
            console.log(err)
            console.log(`Root User Couldn't be created!`)
        }
    }
}

module.exports = cronWrapper(options)