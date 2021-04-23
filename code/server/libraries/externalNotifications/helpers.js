const typeCheckingHelpers = require(global.$dir + "/libraries/typeChecking/main.js")

const castToCorrectEmailValueType = (data="hi") => {
    if (!typeCheckingHelpers.isArrayOrString(data))
        throw TypeError(`Email addresses must be an array or string`)
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