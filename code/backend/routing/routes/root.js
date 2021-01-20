const express = require('express')

const middleware = require($DIR + "/middleware/main.js")
const requestTypeChecks = require("./rootTC.json")

const router = express.Router()

router.use(middleware.auth(4))

router.post('/edit/sysAdmin',
    middleware.allowedFields(requestTypeChecks.createSysAdmin),
    async (req, res) => {
    try {
        req.body.institutionID = "__SYS-ADMIN__"
        const sysAdminEntry = await $db.funcs.save('sysAdmins', req.body)
        res.json(`System administrator ${sysAdminEntry.profile.firstName} ${sysAdminEntry.profile.lastName}, has been created (username: ${sysAdminEntry.username}).`)
    } catch(err) {
        console.log(err)
        res.status($utils.hCodes.serverError)
        res.json(`Couldn't create system Administrator - this is probably a server issue. Please try again later`)
    }
})

module.exports = router