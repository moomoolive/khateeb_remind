const express = require('express')

const middleware = require($DIR + "/middleware/main.js")
const requestTypeChecks = require('./sysAdminTC.json')

const router = express.Router()

router.use(middleware.auth(3))

const inst = {
    async view(options) {
        if (options.length < 1)
            options[0] = '-uc'
        const msgs = []
        for (let i = 0; i < options.length; i++) {
            switch(options[i]) {
                case 'all':
                case '-a':
                    const allInstitutions = await $db.models.institutions.find({}).select(['name', 'country', 'state']).exec()
                    allInstitutions.forEach(inst => {
                        msgs.push({ msg: inst, status: "okay", from: "a" })
                    })
                    break
                case '-uc':
                case 'unconfirmed':
                    const pendingInstitutions = await $db.models.institutions.find({ confirmed: false }).select(['name', 'country', 'state']).exec()
                    pendingInstitutions.forEach(inst => {
                        msgs.push({ msg: inst, status: "okay", from: "a" })
                    })
                    break
                default:
                    const msg = { 
                        msg: `"${options[i]}" option doesn't exist. Available options: -uc. Check documentation for more details.`, 
                        status: 'extraInfo',
                        from: 'a' 
                    }
                    msgs.push(msg)
            }
        }
        if (msgs.length < 1)
            msgs.push(
                { 
                    msg: `No results`, 
                    status: 'extraInfo',
                    from: 'a' 
                }
            )
        return msgs
    },
    async confirm(options) {
        const mongooseIdLength = 24
        if (options.length < 1)
            return [
                { 
                    msg: `You must provide an id as the first option`, 
                    status: 'extraInfo',
                    from: 'a' 
                }
            ]
        else if (options[0].length !== mongooseIdLength) 
            return [
                { 
                    msg: `You must provide a valid mongoose id.`, 
                    status: 'extraInfo',
                    from: 'a' 
                }
            ]
        const msgs = []
        const id = options[0]
        const instOptions = options.slice(1)
        if (instOptions.length < 1)
            instOptions.push('-s')
        for (let i = 0; i < instOptions.length; i++) {
            switch(instOptions[i]) {
                case "-s":
                case "setting":
                    const previousSettings = await $db.models.settings.find({ institutionID: id }).exec()
                    if (previousSettings.length < 1) {
                        const settings = {
                            institutionID: id,
                            twilioUser: 'TBD',
                            twilioKey: 'TBD',
                            autoConfirmKhateebs: false,
                            textAllowed: false
                        }
                        const saved = await new $db.models.settings(settings).save()
                        msgs.push(
                            { 
                                msg: `Created settings for institution ${id}`,
                                status: 'okay',
                                from: 'a' 
                            }
                        )
                    }
                case '-l':
                case 'location':
                    const previousLocations = await $db.models.locations.find({ institutionID: id }).exec()
                    if (previousLocations.length < 1) {
                        const location = {
                            institutionID: id,
                            name: 'Unknown Location 1',
                            address: "Unknown Address 1"
                        }
                        const savedLocation = await new $db.models.locations(location).save()
                        const timing = {
                            institutionID: id,
                            locationID: savedLocation._id.toString(),
                            hour: 12,
                            minute: 30
                        }
                        const savedTiming = await new $db.models.timings(timing).save()
                        msgs.push(
                            { 
                                msg: `Created timing and location for institution ${id}`,
                                status: 'okay',
                                from: 'a' 
                            }
                        )
                    }
                case "user":
                case "-u":
                    const updatedAdmin = await $db.models.institutionAdmins.updateOne({ institutionID: id }, { confirmed: true })
                    msgs.push(
                        { 
                            msg: `Confirmed institution ${id}'s admin status`,
                            status: 'okay',
                            from: 'a' 
                        }
                    )
                case 'institution':
                case '-i':
                    const updated = await $db.models.institutions.updateOne({ _id: id }, { confirmed: true })
                    msgs.push(
                        { 
                            msg: `Confirmed institution ${id}'s status`,
                            status: 'okay',
                            from: 'a' 
                        }
                    )
                    break
                default:
                    const msg = { 
                        msg: `"${instOptions[i]}" option doesn't exist. Available options: -u, -s, -l, -i. Check documentation for more details.`, 
                        status: 'extraInfo',
                        from: 'a' 
                    }
                    msgs.push(msg)
            }
        }
        if (msgs.length < 1)
            msgs.push(
                { 
                    msg: `No actions were performed`, 
                    status: 'extraInfo',
                    from: 'a' 
                }
            )
        return msgs
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
        if (!targetDatas[targetData] || !targetDatas[targetData][verb])
            return [{ msg: "Command not found", status: "fail", from: "a" }]
        else
            return targetDatas[targetData][verb]
    }
}

router.post('/cli',
    middleware.allowedFields(requestTypeChecks.cli),
    async (req, res) => {
        try {
            if (req.body.command[0] === '__PING__') {
                const msg = {
                    msg: "API is ready for commands 🌐",
                    status: "success",
                    from: 'a'
                }
                res.json([msg])
            }
            else {
                const dataType = req.body.command[0]
                const verb = req.body.command[1]
                const found = cli.findCommand(dataType, verb)
                if (found.status === 'fail')
                    res.json(found)
                else {
                    const options =  req.body.command.slice(2)
                    const cmdRes = await found(options)
                    console.log(cmdRes)
                    res.json(cmdRes)
                }
            }
        } catch(err) {
            console.log(err)
            const cliRes = { 
                msg: `A problem occurred when executing command.\nError trace: ${err}`,
                status: 'fail', 
                from: 'a' 
            }
            res.json([cliRes])
        }
    }
)

module.exports = router