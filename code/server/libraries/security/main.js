const crypto = require('crypto')

const { securityConfig } = require($rootDir + "/server.config.js")

const encrypt = (value) => {
    const key =  crypto.createCipher('aes-128-cbc', securityConfig.encryptionKey)
    let val = key.update(value, 'utf8', 'hex')
    val += key.final('hex')
    return val
}
const decrypt = (value) => {
    const key = crypto.createDecipher('aes-128-cbc', securityConfig.encryptionKey)
    let val = key.update(value, 'hex', 'utf8')
    val += key.final('utf-8')
    return val
}

module.exports = { 
    decrypt,
    encrypt,
}