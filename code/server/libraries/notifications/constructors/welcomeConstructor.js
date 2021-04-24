const welcomeNotification = (userInfo={}) => {
    const info = {
        tag: 'welcome',
        msg: `Asalam aliakoum ${userInfo.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. Feel free to take a look around, and ask your administrator if you need any help!`,
        userID: userInfo._id.toString()
    }
    if (userInfo.institutionID !== 'root')
        info.institutionID = userInfo.institutionID.toString()
    return new $db.notifications(info).save()
}

module.exports = welcomeNotification


