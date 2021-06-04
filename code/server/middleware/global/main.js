const noEmptyBody = (request, response, next) => {
    if (Object.keys(request.body).length < 1) {
        return response.status(422).json({ msg: `You cannot send an empty request body to this route!` })
    } else {
        next()
    } 
}

const generalError = (err, _, response, _) => {
    console.error(err)
    return response.status(500).json({ msg: "Server isn't responding right now, try later...", err })
}

module.exports = {
    noEmptyBody,
    generalError
}