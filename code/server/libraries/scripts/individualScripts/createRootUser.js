const { initConfig } = require($rootDir + '/Server.config.js')

const { rootUser } = require($rootDir + "/database/public.js")

const createRootUser = async () => {
    try {
        const rootAdmin = await rootUser.find()
        if (!rootAdmin) {
            const user = await rootUser.createEntry({ entry: initConfig.rootUser })
            console.log(`Successfully create root user (id: ${user._id})`)
        } else {
            console.log(`Root user already exists`)
        }
    } catch(err) {
        console.error(`Root user couldn't be created!`, err)
    }
}

module.exports = createRootUser