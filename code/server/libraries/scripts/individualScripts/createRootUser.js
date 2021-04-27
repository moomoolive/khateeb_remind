const { initConfig } = require($rootDir + '/Server.config.js')

const createRootUser = async () => {
    try {
        const rootAdmin = await $db.root.findOne({}).exec()
        if (!rootAdmin) {
            const user = await new $db.root(initConfig.rootUser).save()
            console.log(`Successfully create root user (id: ${user._id})`)
        }
        else
            console.log(`Root user already exists`)
    } catch(err) {
        console.error(`Root user couldn't be created!`, err)
    }
}

module.exports = createRootUser