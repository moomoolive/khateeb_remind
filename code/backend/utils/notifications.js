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
    const name = `${khateebInfo.title !== 'none' ? `${khateebInfo.title} ` : '' }${khateebInfo.firstName} ${khateebInfo.lastName}`
    const rootAdmin = await $db.models.rootInstitutionAdmins.findOne({ institutionID: khateebInfo.institutionID }).exec()
    const otherAdmins = await $db.models.institutionAdmins.find({ institutionID: khateebInfo.institutionID }).exec()
    otherAdmins.push(rootAdmin)
    const msg = {
        userID: null,
        tag: 'khateebs',
        msg: autoConfirm ? `${name} is now a khateeb at your institution! If you want to manually register khateebs turn off auto-confirm in settings` : `${name} wants to become a khateeb at your institution! Confirm them by heading to Admin Central and press the khateebs tab.`,
        institutionID: khateebInfo.institutionID
    }
    for (let i = 0; i < otherAdmins.length; i++) {
        const admin = otherAdmins[i]
        msg.userID = admin._id.toString()
        const note = await new $db.models.generalNotifications(msg).save()
    }
    return 'success'
} 

module.exports = {
    welcome,
    khateebSignup
}