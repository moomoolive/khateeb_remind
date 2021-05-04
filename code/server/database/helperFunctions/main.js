const removeAuthorizationFromUserCommand = (authorizationId="1234") => {
    return {
        $pull: {
            authorizations: { _id: authorizationId }
        }
    }
}

const getUserScheduleRestrictionsAssociatedWithInstitution = async (userId="1234", institutionId="1234") => {
    try {
        const scheduleRestrictions = await $db.userScheduleRestrictions
            .find({ user: userId, institution: institutionId })
            .exec()
        return scheduleRestrictions.map(sR => sR._id)
    } catch(err) {
        console.error(err)
        return []
    }
}

module.exports = {
    removeAuthorizationFromUserCommand,
    getUserScheduleRestrictionsAssociatedWithInstitution,
}