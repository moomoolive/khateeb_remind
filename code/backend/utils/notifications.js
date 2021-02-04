const welcome = async (userInfo) => {
    const welcomeMsg = {
        userID: userInfo._id.toString(),
        tag: 'welcome',
        msg: `Asalam aliakoum ${userInfo.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. Feel free to take a look around, and check out the tutorials if you need any help!`,
        institutionID: userInfo.institutionID
    }
    const note = await new $db.models.generalNotifications(welcomeMsg).save()
}

module.exports = {
    welcome
}