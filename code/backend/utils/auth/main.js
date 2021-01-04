import jwt from 'jsonwebtoken'
import env from '../../app.js'
import helpers from './helpers.js'

export default {
    createToken(expiresAfter='30-days', userType="admin") {
        const expiration = helpers.expirationDate(expiresAfter)
        return jwt.sign({ user:  userType}, env.jwt, { expiresIn: expiration })
    }
}