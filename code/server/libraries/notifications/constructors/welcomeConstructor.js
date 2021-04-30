const welcomeNotification = (userInfo={}) => {
    return new $db.notifications({
        tag: 'welcome',
        msg: `Asalam aliakoum ${userInfo.firstName}, welcome to khateeb remind! We hope you enjoy your experience insha'Allah. Feel free to take a look around, and ask your administrator if you need any help!`,
        userID: userInfo._id.toString()
    }).save()
}

module.exports = welcomeNotification


