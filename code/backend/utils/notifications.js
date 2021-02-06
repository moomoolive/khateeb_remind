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
        msg: `Asalam aliakoum ${userInfo.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. Feel free to take a look around, and ask your administrator if you need any help!`,
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

const createJummahMessage = async (jummah, preference=1) => {
    try {
        const targetPreference = jummah.khateebPreference[preference - 1]
        const khateeb = await $db.models.khateebs.findOne({ _id: targetPreference.khateebID })
        const jummahTiming = await $db.models.timings.findOne({ _id: jummah.timingID }).exec()
        const jummahLocation = await $db.models.locations.findOne({ _id: jummah.locationID }).exec()
        const hour = jummahTiming.hour > 12 ? jummahTiming.hour - 12 : jummahTiming.hour
        const min = jummahTiming.minute
        const amOrPm = jummahTiming.hour > 11 ? 'PM' : 'AM'
        const msgTiming = `${hour}:${min} ${amOrPm}`
        const msgPreference1 = `You're scheduled to give the ${msgTiming} khutbah at ${jummahLocation.name} (${jummahLocation.address}) this week. Click here to confirm your attendance, JAK!`
        const msgPreferenceOver1 = `Are you able to give the ${msgTiming} khutbah at ${jummahLocation.name} (${jummahLocation.address}) this week? Click here to confirm your attendance, JAK!`
        const msg = {
            userID: khateeb._id.toString(),
            institutionID: jummah.institutionID,
            tag: 'jummah',
            msg: preference > 1 ? msgPreferenceOver1 : msgPreference1 ,
            actionPerformed: false,
            actionLink: `/jummah/confirm/jummah=${jummah._id.toString()}/note=__ID__`,
            buttonText: 'Confirm',
            meta: {
                jummahID: jummah._id.toString()
            }
        }
        const saved = await $db.models.actionNotifications(msg).save()
        console.log(saved)
        targetPreference.notified = true
        const savedJummah = await $db.models.jummahs.updateOne({ _id: jummah._id.toString() }, { khateebPreference: jummah.khateebPreference })
    } catch(err) {
        console.log(err)
        return err
    }
}

module.exports = {
    welcome,
    khateebSignup,
    khateebDropOut,
    createJummahMessage
}