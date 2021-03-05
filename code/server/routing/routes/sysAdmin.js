const express = require('express')

const authMiddleware = require(global.$dir + '/middleware/auth/main.js')
const validationMiddleware = require(global.$dir + '/middleware/validation/main.js')

const router = express.Router()

router.use(authMiddleware.authenticate({ min: 4, max: 5 }))

const notificationConstructors = require(global.$dir + '/libraries/notifications/index.js')
const scheduleHelpers = require(global.$dir + '/libraries/schedules/main.js')

const inst = {
    async view(options) {
        if (options.length < 1)
            options[0] = '-uc'
        const msgs = []
        for (let i = 0; i < options.length; i++) {
            switch(options[i]) {
                case 'all':
                case '-a':
                    const allInstitutions = await $db.institutions.find({}).select(['name', 'country', 'state']).exec()
                    allInstitutions.forEach(inst => {
                        msgs.push({ msg: inst, status: "okay", from: "a" })
                    })
                    break
                case '-uc':
                case 'unconfirmed':
                    const pendingInstitutions = await $db.institutions.find({ confirmed: false }).select(['name', 'country', 'state']).exec()
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
                    const previousSettings = await $db.settings.find({ institutionID: id }).exec()
                    if (previousSettings.length < 1) {
                        const settings = {
                            institutionID: id,
                            twilioUser: 'TBD',
                            twilioKey: 'TBD',
                            twilioPhoneNumber: '+10001112222',
                            autoConfirmRegistration: false,
                            textAllowed: false
                        }
                        const saved = await new $db.settings(settings).save()
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
                    const previousLocations = await $db.locations.find({ institutionID: id }).exec()
                    if (previousLocations.length < 1) {
                        const location = {
                            institutionID: id,
                            name: 'Unknown Location 1',
                            address: "Unknown Address 1"
                        }
                        const savedLocation = await new $db.locations(location).save()
                        const timing = {
                            institutionID: id,
                            locationID: savedLocation._id.toString(),
                            hour: 12,
                            minute: 30
                        }
                        const savedTiming = await new $db.timings(timing).save()
                        const associatedJummahs = await scheduleHelpers.createAssociatedJummahs(
                            savedLocation._id.toString(), 
                            savedTiming._id.toString(), 
                            id
                        )
                        msgs.push(
                            { 
                                msg: `Created timing, location, first jummahs for institution ${id}`,
                                status: 'okay',
                                from: 'a' 
                            }
                        )
                    }
                case "user":
                case "-u":
                    const rootAdmin = await $db.rootInstitutionAdmins.findOne({ institutionID: id }).exec()
                    const updatedRootAdmin = await $db.rootInstitutionAdmins.updateOne({ _id: rootAdmin._id.toString() }, { confirmed: true })
                    const welcomeMsg = new notificationConstructors.WelcomeNotificationConstructor(rootAdmin)
                    const saved = await welcomeMsg.create()
                    msgs.push(
                        { 
                            msg: `Confirmed institution ${id}'s admin status`,
                            status: 'okay',
                            from: 'a' 
                        }
                    )
                case 'institution':
                case '-i':
                    const updated = await $db.institutions.updateOne({ _id: id }, { confirmed: true })
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

const expandSyntax = (items, skipIncrement) => {
    const copy = global.utils.deepCopy(items)
    const increment = 1 + skipIncrement
    for (let i = skipIncrement; i < copy.length; i += increment) {
        const item = copy[i]
        if (item[0] === "`") {
            let str = item
            if (str.slice(-1) !== '`') {
                let sameString = true
                while(sameString) {
                    const currentIndex = i + 1
                    str += ` ${copy[currentIndex]}`
                    if (copy[currentIndex].slice(-1) === "`")
                        sameString = false
                    copy.splice(currentIndex , 1)
                }
            }
            copy[i] = str.replace(/`/g, "")
        }
        else if (item === 'f' || item === 'false')
            copy[i] = false
        else if (item === 't' || item === 'true')
            copy[i] = true
        else {
            const num = parseInt(item)
            if (!global.utils.isNumeric(item) || num === NaN)
                throw SyntaxError(`${item} is not a valid type. Supported types str, true, false, int`)
            else
                copy[i] = num
        }
    }
    return copy
}

const securityHelpers = require(global.$dir + '/libraries/security/main.js')

const sett = {
    async view(options) {
        const msgs = []
        if (options.length < 1)
            options.push('-r')
        for (let i = 0; i < options.length; i++) {
            switch(options[i]) {
                case 'root':
                case '-r':
                    const settings = await $db.settings.findOne({ institutionID: '__ROOT__' }).exec()
                    if (!settings)
                        msgs.push({ 
                            msg: `Root account settings doesn't exist yet. Use 'sett init' to initialize`, 
                            status: 'extraInfo',
                            from: 'a' 
                        })
                    else {
                        settings.twilioUser = securityHelpers.decrypt(settings.twilioUser)
                        settings.twilioKey = securityHelpers.decrypt(settings.twilioKey)
                        msgs.push({ 
                            msg: settings, 
                            status: 'extraInfo',
                            from: 'a' 
                        }) 
                    } 
                    break
                case 'options':
                case '-o':
                    msgs.push({ 
                            msg: `Type 'sett set <target value>'. Possible options: twilioUser <str>, twilioKey <str>, textAllowed <bool>, twilioPhoneNumber <str>.`, 
                            status: 'extraInfo',
                            from: 'a' 
                    })
                    break
                default:
                    msgs.push({ 
                            msg: `"${options[i]}" option doesn't exist. Available options: -r, -o. Check documentation for more details.`, 
                            status: 'extraInfo',
                            from: 'a' 
                    })
            }
        }
        return msgs
    },
    async init(options) {
        const msgs = []
        if (options.length < 1)
            options.push('-e')
        const newSettings = {
            twilioKey: 'TBD',
            twilioUser: 'TBD',
            textAllowed: false,
            institutionID: '__ROOT__',
            twilioPhoneNumber: '+10001112222',
            autoConfirmRegistration: false
        }
        for (let i = 0; i < options.length; i++) {
            switch(options[i]) {
                case 'elegant':
                case '-e':
                    const settings = await $db.settings.findOne({ institutionID: '__ROOT__' }).exec()
                    if (settings)
                        msgs.push({ 
                            msg: `Already exists. Use -f option to overwrite`, 
                            status: 'extraInfo',
                            from: 'a' 
                        })
                    else {
                        const saved = await new $db.settings(newSettings).save()
                        msgs.push({ 
                            msg: `Successfully initialized settings`, 
                            status: 'extraInfo',
                            from: 'a' 
                        })
                    } 
                    break
                /*
                case 'force':
                case '-f':
                    const oldSettings = await $db.settings.findOne({ institutionID: '__ROOT__' }).exec()
                    const toBeAdded = global.utils.deepCopy(newSettings)
                    if (oldSettings) {
                        toBeAdded._id = oldSettings._id.toString()
                    }
                    let forced = await $db.funcs.save('settings', toBeAdded)
                    msgs.push({ 
                            msg: `Successfully ${oldSettings ? 'overwrote' : 'initialized'} settings with default values`, 
                            status: 'extraInfo',
                            from: 'a' 
                    })
                    break
                */
                default:
                    msgs.push({ 
                            msg: `"${options[i]}" option doesn't exist. Available options: -r, -o. Check documentation for more details.`, 
                            status: 'extraInfo',
                            from: 'a' 
                    })
            }
        }
        return msgs
    },
    async set(options) {
        const msgs = []
        if (options.length < 1) {
            msgs.push({ 
                msg: `Options must be provided. Format: <property name> <value> <property name> <value>`, 
                status: 'extraInfo',
                from: 'a' 
            })
            return msgs
        }
        options = expandSyntax(options, 1)
        const settings = await $db.settings.findOne({ institutionID: '__ROOT__' }).exec()
        const saveObj = {}
        for (let i = 0; i < options.length; i += 2) {
            const targetData = options[i]
            const val = options[i + 1]
            if (typeof settings[targetData] === 'undefined')
                throw ReferenceError(`${targetData} is not a valid setting`)
            saveObj[targetData] = val
            msgs.push({ 
                msg: `Successfully set ${targetData} to ${val}`, 
                status: 'success',
                from: 'a' 
            })
        }
        const saved = await $db.settings.updateOne({ institutionID: '__ROOT__' }, saveObj)
        return msgs
    }
}

const targetDatas = {
    inst,
    sett
}

const cli = {
    createCommand(commandArray) {
        const targetData = commandArray.shift()
        const verb = commandArray.shift()
        const options = global.utils.deepCopy(commandArray)
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

const validator = require('express-validator')

router.post(
    '/cli',
    validationMiddleware.validateRequest(
        [
            validator.body("command").isArray(),
        ]
    ),
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