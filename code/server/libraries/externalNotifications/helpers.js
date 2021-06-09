const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const castToCorrectEmailValueType = (data="hi") => {
    if (
        !typeCheckingHelpers.isEmail(data) && 
        !typeCheckingHelpers.isArrayOrString(data) && 
        data === $config.consts.randomEmail
    ) {
        throw TypeError(`Input must be an email or any array of emails and cannot be `, $config.consts.randomEmail)
    } else {
        return typeof data === 'string' ? [data] : data
    }
}

const createRecipentsObject = (toAddress="random@random.com", options={}) => {
    return {
        ToAddresses: castToCorrectEmailValueType(toAddress),
        CcAddresses: castToCorrectEmailValueType(options.CcAddresses || []),
        BccAddresses: castToCorrectEmailValueType(options.BccAddresses || [])
    }
}


module.exports = {
    createRecipentsObject
}