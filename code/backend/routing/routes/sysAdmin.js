const express = require('express')

const middleware = require($DIR + "/middleware/main.js")
const requestTypeChecks = require('./sysAdminTC.json')

const router = express.Router()

router.use(middleware.auth(3))

const inst = {
    async view(options) {
        if (options[0] === 'unconfirmed' || options[0] === '-uc') {
            const pendingInstitutions = await $db.models.institutions.find({ confirmed: false })
            const returnMsg = []
            pendingInstitutions.forEach(inst => {
                returnMsg.push({ msg: inst, status: "okay", from: "a" })
            })
            return returnMsg
        }
        return { msg: "You must provide valid options. Available options: 'unconfirmed'." }    
    },
    async confirm(options) {
        try {
            const toConfirm = options.shift()
            if (options.find(opt => opt === '-u' || opt === 'user')) {
                const updatedAdmin = await $db.models.institutionAdmins.updateOne({ institutionID: toConfirm }, { confirmed: true })
            }
            const updated = await $db.models.institutions.updateOne({ _id: toConfirm }, { confirmed: true })
            return { msg: `Updated institution ${toConfirm} status` }
        } catch(err) {
            console.log(err)
            return { msg: `Couldn't update`, status: 'fail', from: 'a' }
        }
    }
}

const targetDatas = {
    inst
}

const cli = {
    createCommand(commandArray) {
        const targetData = commandArray.shift()
        const verb = commandArray.shift()
        const options = $utils.general.deepCopy(commandArray)
        return {
            targetData,
            verb,
            options
        }
    },
    findCommand(targetData, verb) {
        return targetDatas[targetData][verb]
    }
}

router.post('/cli',
    middleware.allowedFields(requestTypeChecks.cli),
    async (req, res) => {
        try {
            const command = cli.createCommand(req.body.command)
            const found = cli.findCommand(command.targetData, command.verb)
            if (found) {
                const data = await found(command.options)
                res.json(data)
            } else {
                res.json({ msg: "Command not found", status: "fail", from: "a" })
            }
        } catch(err) {
            console.log(err)
            res.json({ msg: `A problem occurred when executing command.\nError trace: ${err}`, status: 'fail', from: 'a' })
        }
    }
)

module.exports = router