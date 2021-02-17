const jwt = require('jsonwebtoken')

const helpers = require('./helpers.js')

const noEmptyBody = (request, response, next) => {
    if (Object.keys(request.body).length === 0 && request.path !== '/text/hub') {
        response.status(_.hCodes.notAcceptable)
        response.json(`You cannot send an empty request body to this route!`)
    } else next()
}

const generalError = (err, request, response, next) => {
    console.log(err)
    response.status(_.hCodes.serverError)
    response.json("Server isn't responding right now, try later...")
}

const allowedFields = (fields={}) => {
    return (request, response, next) => {
        let failed = helpers.typeCheckRequest(fields, request.body)
        if (failed.length < 1)
            next()
        else {
            console.log(failed)
            response.status(_.hCodes.notAcceptable)
            response.json(failed)
        }
    }
}

const auth = (authLevel) => {
    return (request, response, next) => {
        if (authLevel === 0)
            return next()
        const token = request.headers.authorization
        const secret = process.env.JWT_SECRET || 'secret'
        jwt.verify(token, secret, (err, decoded) => {
            if (err || !helpers.permissionGranted(authLevel, decoded.__t)) {
                response.status(_.hCodes.unauthorized)
                response.json('There was an error authorizing account, check if user credentials are correct and if authorization is present in request. If present then this is probably a server issue. Please try again later.')
            } 
            else {
                request.headers.userid = decoded._id
                request.headers.institutionid = decoded.institutionID
                request.headers.usertype = decoded.__t 
                next()
            }  
        })
    } 
}

const userExists = async (request, response, next) => {
    const user = await $db.models.users.findOne({ username: request.body.username }).select(["-createdAt", "-updatedAt", "-__v"]).exec()
    if (!user){
        response.status(_.hCodes.unauthorized)
        response.json({  msg: 'unauthorized', token: null })
    } else {
        request.__USER__ = user
        next()
    }

}

module.exports = { allowedFields, userExists, auth, noEmptyBody, generalError }