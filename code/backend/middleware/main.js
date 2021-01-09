const jwt = require('jsonwebtoken')

const $utils = require('../utils/index.js')
const env = require('../app.js')
const $db = require('../database/index.js')

const helpers = require('./helpers.js')

const funcs = {
    authAdmin(request, response, next) {
        const token = request.headers.authorization
        jwt.verify(token, env.jwt, (err, decoded) => {
            if (err || decoded.user !== "admin") {
                response.status($utils.hCodes.unauthorized)
                response.json('Unauthorized')
            } else next()  
        })
    },
    isPassword(request, response, next) {
        if (request.body.__t === 'password') {
            helpers.confirmOldPassword(request, response, next)
        } else next()
    },
    generalError(err, request, response, next) {
        console.log(err)
        response.status($utils.hCodes.serverError)
        response.json("Are servers aren't responding right now, try later...")
    },
    noEmptyBody(request, response, next) {
        console.log(request.body)
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
                    console.log(fields)
                    console.log(field)
                    passed = false
                    response.status($utils.hCodes.notAcceptable)
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
        const validationList = $db.models.schemaParams(schemaName)
        console.log(validationList)
        return validationList
    },
}

module.exports = funcs