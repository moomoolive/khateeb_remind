const removeAuthorizationFromUserCommand = (authorizationId="1234") => {
    return {
        $pull: {
            authorizations: { _id: authorizationId }
        }
    }
}

module.exports = {
    removeAuthorizationFromUserCommand
}