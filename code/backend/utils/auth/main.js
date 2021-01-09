const jwt = require('jsonwebtoken')
const env = require('../../app.js')
const helpers = require('./helpers.js')

module.exports = {
    createToken(expiresAfter='30-days', userType="admin") {
        const expiration = helpers.expirationDate(expiresAfter)
        return jwt.sign({ user:  userType}, env.jwt, { expiresIn: expiration })
    }
}