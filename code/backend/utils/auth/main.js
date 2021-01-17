const jwt = require('jsonwebtoken')

const helpers = require('./helpers.js')

module.exports = {
    createToken(expiresAfter='30-days', userType="admin", options={}) {
        const secret = process.env.JWT_SECRET || 'secret'
        const expiration = helpers.expirationDate(expiresAfter)
        return jwt.sign({ user:  userType, ...options}, secret, { expiresIn: expiration })
    }
}