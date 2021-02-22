const jwt = require('jsonwebtoken')
const validator = require('express-validator')

const helpers = require('./helpers.js')

const noEmptyBody = (request, response, next) => {
    if (Object.keys(request.body).length === 0)
        return response.status(422).json(`You cannot send an empty request body to this route!`)
    else 
        next()
}

const generalError = (err, request, response, next) => {
    console.log(err)
    return response.status(500).json("Server isn't responding right now, try later...")
}

const auth = (authLevel) => {
    return (request, response, next) => {
        if (authLevel === 0)
            return next()
        const token = request.headers.authorization
        const secret = process.env.JWT_SECRET || 'secret'
        jwt.verify(token, secret, (err, decoded) => {
            if (err || !helpers.permissionGranted(authLevel, decoded.__t)) {
                response.status(401).json('There was an error authorizing account, check if user credentials are correct and if authorization is present in request. If present then this is probably a server issue. Please try again later.')
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

const validateRequest = (validators=[], section="body") => {
    return [
        ...validators,
        (req, res, next) => {

            const errors = validator.validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json(errors.array())
            }
            req[section] = validator.matchedData(req, { includeOptionals: false })
            next()
            
        }
    ]
}

module.exports = { 
    auth, 
    noEmptyBody, 
    generalError, 
    validateRequest 
}