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

/*
router.get('/pending-institutions', async (req, res) => {
    try {
        const pendingInstitutions = await $db.models.institutions.find({ confirmed: false })
        res.json(pendingInstitutions)
    } catch(err) {
        console.log('there was an error retrieving pending institions')
        console.log(err)
        res.json('there was an error retrieving pending institions')
    }
})

router.post('/institution-status',
    middleware.allowedFields(requestTypeChecks.institutionStatus),
    async (req, res) => {
        try {
            if (req.body.confirmed) {
                const updated = await $db.models.institutions.updateOne({ _id: req.body._id }, req.body)
                if (req.body.users) {
                    const updatedAdmin = await $db.models.institutionAdmins.updateOne({ institutionID: req.body._id }, { confirmed: true })
                }
                res.json(`Successfully confirmed status of institution ${req.body._id}${req.body.users ? ` and it's administrator` : ''}`)
            } else {
                const updated = await $db.models.institutions.updateOne({ _id: req.body._id }, req.body)
                if (req.body.users) {
                    const updatedUsers = await $db.models.users.updateMany({ institutionID: req.body._id }, { confirmed: false })
                }
                res.json(`Successfully disconfirmed status of institution ${req.body._id} and all of it's users`)
            }
        } catch(err) {
            console.log(`there was a problem updating the status of institution: ${req.body._id}`)
            console.log(err)
            res.json(`there was a problem updating the status of institution: ${req.body._id}`)
        }
    }
)
*/

router.post('/user/username', 
    middleware.allowedFields(requestTypeChecks.userUsername),
    async (req, res) => {
    try {
        const userEntry = await $db.models.sysAdmins.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user/password', 
    middleware.allowedFields(requestTypeChecks.userPassword),
    async (req, res) => {
    try {
        const userEntry = await $db.models.sysAdmins.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully username information!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user info`)
    }
})

router.post('/user/profile', async (req, res) => {
    try {
        const updated = await $db.models.sysAdmins.updateOne({ _id: req.headers.userid }, req.body)
        res.json(`Successfully updated user profile!`)
    } catch(err) {
        console.log(err)
        res.json(`Couldn't update user profile`)
    }
})

module.exports = router