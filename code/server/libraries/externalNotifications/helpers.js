const typeCheckingHelpers = require($rootDir + "/libraries/typeChecking/main.js")

const castToCorrectEmailValueType = (data="hi") => {
    if (!typeCheckingHelpers.isEmail(data) || data === $config.consts.randomEmail || !Array.isArray(data))
        throw TypeError(`Email addresses must be an array or string and cannot 'none@khateeb-remind.com'`)
    else
        return typeof data === 'string' ? [data] : data
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