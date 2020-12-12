import jwt from 'jsonwebtoken'
import $httpCodes from './httpCodes.js'
import $dbModels from '../database/models.js'

const JWT_SECRET = 'secret'

const funcs = {
    authAdmin(request, response, next) {
        const token = request.headers.authorization
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err || decoded.user !== "admin") {
                response.status($httpCodes.unauthorized)
                response.json('Unauthorized')
            } else next()  
        })
    },
    generalError(err, request, response, next) {
        console.log(err)
        response.status($httpCodes.serverError)
        response.json("Are servers aren't responding right now, try later...")
    },
    noEmptyBody(request, response, next) {
        if (Object.keys(request.body).length === 0) {
            response.status($httpCodes.notAcceptable)
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
                    passed = false
                    response.status($httpCodes.notAcceptable)
                    response.json(`You're missing required information`)
                    break
                }
            }
            if (passed) next()
        }
    },
    schemaVC(request) {
        console.log(request.body)
        const urlComponents = request.originalUrl.split('/')
        const schemaName = urlComponents[2]
        const validationList = $dbModels.schemaParams(schemaName)
        console.log(validationList)
        return validationList
    },
}

export { funcs as middleware }