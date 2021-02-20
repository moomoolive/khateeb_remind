const jwt = require('jsonwebtoken')
const validator = require('express-validator')

const helpers = require('./helpers.js')

const noEmptyBody = (request, response, next) => {
    if (Object.keys(request.body).length === 0)
        return response.status(_.hCodes.notAcceptable).json(`You cannot send an empty request body to this route!`)
    else 
        next()
}

const generalError = (err, request, response, next) => {
    console.log(err)
    return response.status(_.hCodes.serverError).json("Server isn't responding right now, try later...")
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

const validateRequest = (validators=[], section="body") => {
    return [
        ...validators,
        (req, res, next) => {
            const errors = validator.validationResult(req)
            if (!errors.isEmpty())
                return res.status(406).json(errors.array())
            req[section] = validator.matchedData(req, { includeOptionals: false })
            next()
            
        }
    ]
}

module.exports = { 
    userExists, 
    auth, 
    noEmptyBody, 
    generalError, 
    validateRequest 
}