const jwt = require('jsonwebtoken')

const helpers = require('./helpers.js')

module.exports = {
    createToken(expiresAfter='30-days', info={}) {
        const secret = process.env.JWT_SECRET || 'secret'
        const expiration = helpers.expirationDate(expiresAfter)
        return jwt.sign(info, secret, { expiresIn: expiration })
    }
}