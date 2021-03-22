const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const cliResponseTemplates = require(global.$dir + '/libraries/cli/templates/main.js')
const cliCommandIndex = require(global.$dir + '/libraries/cli/commandsIndex/index.js')

const router = express.Router()

router.use(authMiddleware.authenticate({ min: 4, max: 5 }))

router.post(
    '/cli',
    validationMiddleware.validateRequest([ validator.body("command").isArray({ min: 1 })]),
    async (req, res) => {
        console.log(req.body)
        const commandCategory = req.body.command[0]
        const specificCommand = req.body.command[1]
        const errOrException = cliResponseTemplates.exceptionAndNonExistentCommandHandling(commandCategory, specificCommand)
        if (errOrException)
            return res.json(errOrException)
        try {
            const commandRes = await new cliCommandIndex[commandCategory][specificCommand](req.body.command, req.headers).execute()
            return res.json(commandRes)
        } catch(err) {
            console.log(err)
            return res.json(cliResponseTemplates.generalErrorResponse(err))
        }
    }
)

module.exports = router