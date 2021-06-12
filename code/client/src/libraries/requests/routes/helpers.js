import axios from 'axios'

import typeCheckingHelpers from '@/libraries/typeChecking/main.js'

import Config from 'config$'

const APIUrl = process.env.VUE_APP_PWA ? 
    Config.networkConfig.pwaTestingServerURL : Config.networkConfig.serverURL

const targetURL = (extension=["misc", "unique-username"]) => {
    const baseURL = APIUrl
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
        } catch {
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