module.exports = {
    async confirmOldPassword(request, response, next) {
        const oldPassword = await $db.funcs.getPassword()
        if (request.body.confirm === oldPassword) {
            delete request.body.confirm
            next()
        } else {
            response.status($utils.hCodes.unauthorized)
            response.json('Incorrect Credentials')
        }
    }
}