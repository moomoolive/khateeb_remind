const findInstitutionAdmins = async (institutionID) => {
    const rootAdmin = await $db.models.rootInstitutionAdmins.findOne({ institutionID }).exec()
    const otherAdmins = await $db.models.institutionAdmins.find({ institutionID }).exec()
    otherAdmins.push(rootAdmin)
    return otherAdmins
}

const khateebName = (khateebInfo) => {
    let base = `${khateebInfo.firstName} ${khateebInfo.lastName}`
    if (khateebInfo.title !== 'none')
        base = `${khateebInfo.title} ` + base
    return base
}

const welcome = async (userInfo) => {
    const welcomeMsg = {
        userID: userInfo._id.toString(),
        tag: 'welcome',
        msg: `Asalam aliakoum ${userInfo.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. Feel free to take a look around, and check out the tutorials if you need any help!`,
        institutionID: userInfo.institutionID
    }
    const note = await new $db.models.generalNotifications(welcomeMsg).save()
    return 'success'
}

const khateebSignup = async (khateebInfo, autoConfirm=false) => {
    const name = khateebName(khateebInfo)
    const msg = {
        userID: null,
        tag: 'khateebs',
        msg: autoConfirm ? `${name} is now a khateeb at your institution! If you want to manually register khateebs turn off auto-confirm in settings` : `${name} wants to become a khateeb at your institution! Confirm them by heading to Admin Central and press the khateebs tab.`,
        institutionID: khateebInfo.institutionID
    }
    const otherAdmins = await findInstitutionAdmins(khateebInfo.institutionID)
    for (let i = 0; i < otherAdmins.length; i++) {
        const admin = otherAdmins[i]
        msg.userID = admin._id.toString()
        const note = await new $db.models.generalNotifications(msg).save()
    }
    return 'success'
}

const khateebDropOut = async (khateebInfo) => {
    const admins = await findInstitutionAdmins(khateebInfo.institutionID)
    const name = khateebName(khateebInfo)
    const msg = {
        userID: null,
        tag: 'khateebs',
        msg: `${name} has cancel his assigned jummah this week! Khateeb Remind will be messaging other backups if applicable.`,
        institutionID: khateebInfo.institutionID,
        meta: { dropout: true }
    }
    for (let i = 0; i < admins.length; i++) {
        const admin = admins[i]
        msg.userID = admin._id.toString()
        const note = await new $db.models.generalNotifications(msg).save()
    }
    return 'success'
}

module.exports = {
    welcome,
    khateebSignup,
    khateebDropOut
}