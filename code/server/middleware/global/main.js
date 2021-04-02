const noEmptyBody = (request, response, next) => {
    if (Object.keys(request.body).length === 0)
        return response.status(422).json({ msg: `You cannot send an empty request body to this route!` })
    else 
        next()
}

const generalError = (err, request, response, next) => {
    console.log(err)
    return response.status(500).json({ msg: "Server isn't responding right now, try later..." })
}

module.exports = {
    noEmptyBody,
    generalError
}