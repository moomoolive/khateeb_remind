const express = require('express')
const validator = require('express-validator')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const cliHelpers = require(global.$dir + '/libraries/cli/main.js')
const cliCommandIndex = require(global.$dir + '/libraries/cli/commandsIndex/index.js')

const router = express.Router()

router.use(authMiddleware.authenticate({ min: 4, max: 5 }))

router.post(
    '/cli',
    validationMiddleware.validateRequest([ validator.body("command").isArray({ min: 1 })]),
    async (req, res) => {
        console.log(req.body)
        if (req.body.command[0] === '__PING__')
            return res.json(cliHelpers.pingResponse())
        const commandCategory = req.body.command[0]
        const specificCommand = req.body.command[1]
        if (!cliCommandIndex[commandCategory])
            return res.json(cliHelpers.commandCategoryNotFound(commandCategory))
        else if (!cliCommandIndex[commandCategory][specificCommand])
            return res.json(cliHelpers.commandDoesNotExist(commandCategory, specificCommand))
        try {
            const commandRes = await new cliCommandIndex[commandCategory][specificCommand](req.body.command, req.headers).execute()
            return res.json(commandRes)
        } catch(err) {
            console.log(err)
            return res.json(cliHelpers.generalErrorResponse(err))
        }
    }
)

module.exports = router