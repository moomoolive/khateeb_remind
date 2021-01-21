const jwt = require('jsonwebtoken')

const helpers = require('./helpers.js')

const funcs = {
    authAdmin(request, response, next) {
        const token = request.headers.authorization
        const secret = process.env.JWT_SECRET || 'secret'
        jwt.verify(token, secret, (err, decoded) => {
            if (err || decoded.user !== "admin") {
                response.status($utils.hCodes.unauthorized)
                response.json('Unauthorized')
            } else next()  
        })
    },
    generalError(err, request, response, next) {
        console.log(err)
        response.status($utils.hCodes.serverError)
        response.json("Server isn't responding right now, try later...")
    },
    noEmptyBody(request, response, next) {
        if (Object.keys(request.body).length === 0 && request.path !== '/text/hub') {
            response.status($utils.hCodes.notAcceptable)
            response.json(`You cannot send an empty request body to this route!`)
        } else next()
    },
    validationCheck(fields=[]) {
        return (request, response, next) => {
            if (typeof(fields) === 'string') {
                fields = funcs[fields + 'VC'](request) 
            }   
            let passed = true
            for (let field of fields ) {
                if (request.body[field] === undefined) {
                    console.log(`Failed on field: ${field}`)
                    passed = false
                    response.status($utils.hCodes.notAcceptable)
                    response.json(`You're missing required information`)
                    break
                }
            }
            if (passed) next()
        }
    }
}

const allowedFields = (fields={}) => {
    return (request, response, next) => {
        let failed = helpers.typeCheckRequest(fields, request.body)
        if (failed.length < 1)
            next()
        else {
            response.status($utils.hCodes.notAcceptable)
            response.json(failed)
        }
    }
}

const auth = (authLevel) => {
    return (request, response, next) => {
        const token = request.headers.authorization
        const secret = process.env.JWT_SECRET || 'secret'
        jwt.verify(token, secret, (err, decoded) => {
            if (err || !helpers.permissionGranted(authLevel, decoded.__t) || !helpers.correctInstitution(authLevel, request.headers.institutionid, decoded.institutionID)) {
                response.status($utils.hCodes.unauthorized)
                response.json('There was an error authorizing account, check if user credentials are correct and if authorization is present in request. If present then this is probably a server issue. Please try again later.')
            } 
            else {
                request.headers.userid = decoded._id
                request.headers.institutionid = decoded.institutionID 
                next()
            }  
        })
    } 
}

const userExists = async (request, response, next) => {
    const user = await $db.models.users.findOne({ username: request.body.username }).select(["-createdAt", "-updatedAt", "-__v"]).exec()
    if (!user){
        response.status($utils.hCodes.unauthorized)
        response.json({  msg: 'unauthorized', token: null })
    } else {
        request.__USER__ = user
        next()
    }

}

module.exports = { ...funcs, allowedFields, userExists, auth }