const crypto = require('crypto')

const save = async (modelName, toBeSaved) => {
    if (toBeSaved._id)
        return $db.models[modelName].updateOne({ _id: toBeSaved._id }, toBeSaved)
    else
        return new $db.models[modelName](toBeSaved).save()
}

const encrypt = (value) => {
    const key =  crypto.createCipher('aes-128-cbc', process.env.ENCRYPTION_KEY || '1234')
    let val = key.update(value, 'utf8', 'hex')
    val += key.final('hex')
    return val
}
const decrypt = (value) => {
    const key = crypto.createDecipher('aes-128-cbc', process.env.ENCRYPTION_KEY || '1234')
    let val = key.update(value, 'hex', 'utf8')
    val += key.final('utf-8')
    return val
}

module.exports = { decrypt, encrypt,  save}