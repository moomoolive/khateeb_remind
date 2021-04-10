import axios from 'axios'

import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

const targetURL = (extension=["misc", "unique-username"]) => {
    const baseURL = process.env.VUE_APP_API_SERVER_URL
    if (Array.isArray(extension))
        return  baseURL + extension.reduce((total, e) => `${total}/${e}` , '')
    else
        return baseURL + `/${extension}`
}

const returnDataTypeFromRequest = (checkFn=Array.isArray) => (returnVal=[]) => {
    return async (requestMethod="get", extensionUrl="khateebs", ...args) => {
        try {
            const { data } = await axios[requestMethod](targetURL(extensionUrl), ...args)
            if (checkFn(data))
                return data
            else
                return returnVal
        } catch(err) {
            return returnVal
        }
    }
}

const returnArrayFromRequest = returnDataTypeFromRequest(Array.isArray)([])

const returnCustomObjectFromRequest = returnDataTypeFromRequest(typeCheckingHelpers.isAnObject)

const returnEmptyObjectFromRequest = returnCustomObjectFromRequest({})

export default {
    targetURL,
    returnArrayFromRequest,
    returnEmptyObjectFromRequest,
    returnCustomObjectFromRequest
}