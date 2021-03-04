const appendUserInfoToBody = (keys=[]) => {
    return (request, response, next) => {
        if (typeof keys === 'string')
            keys = [keys]
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const targetValue = request.headers[key.toLowerCase()]
            if (targetValue === undefined)
                return response.status(403).json(`Insufficent user indentification`)
            request.body[key] = targetValue
        }
        return next()
    }
}

module.exports = {
    appendUserInfoToBody
}