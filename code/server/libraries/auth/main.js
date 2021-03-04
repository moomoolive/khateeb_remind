const jwt = require('jsonwebtoken')

const helpers = require('./helpers.js')

const createToken = (info={}, expiresAfter='60-days') => {
    const secret = process.env.JWT_SECRET || 'secret'
    const expiration = helpers.expirationDate(expiresAfter)
    return jwt.sign(info, secret, { expiresIn: expiration })
}

const refreshToken = async (userId) => {
    try {
        const unwantedFields = ["-password", "-__v", "-confirmed"]
        let user = await $db.users.findOne({ _id: userId }).select(unwantedFields).exec()
        user = JSON.parse(JSON.stringify(user))
        return createToken(user)
    } catch(err) {
        console.log(err)
        return err
    }
}

module.exports = {
    createToken,
    refreshToken
}