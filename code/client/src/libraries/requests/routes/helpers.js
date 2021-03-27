import axios from 'axios'

import requestConsts from '@/libraries/requests/consts.js'
import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

const targetURL = (extension) => {
    return requestConsts.API_URL + `/${extension}`
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