const createRootUser = async () => {
    try {
        const rootAdmin = await $db.root.findOne({}).exec()
        if (!rootAdmin) {
            await new $db.root({
                ...global.CONFIG.rootUserInitialization,
                institutionID: global.CONFIG.rootInstitution._id,
                password: process.env.DEFAULT_ROOT_PASS || '123456',
                email: "none@khateeb-remind.com"
            }).save()
        }
        else
            console.log(`Root user already exists`)
    } catch(err) {
        console.error(`Root user couldn't be created!`, err)
    }
}

module.exports = createRootUser