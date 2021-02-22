const authLevelToUser = (authLevel) => {
    const allowedUserType = []
    switch(authLevel) {
        case 1:
            allowedUserType.push('khateeb')
        case 2:
            allowedUserType.push('institutionAdmin')
        case 3:
            allowedUserType.push('rootInstitutionAdmin')
        case 4:
            allowedUserType.push('sysAdmin')
        case 5:
            allowedUserType.push('root')
    }
    return allowedUserType
}

const permissionGranted = (authLevel, userType) => {
    const allowedUsers = authLevelToUser(authLevel)
    return !!allowedUsers.find(allowedUserType => allowedUserType === userType)
}

module.exports = {
    permissionGranted
}