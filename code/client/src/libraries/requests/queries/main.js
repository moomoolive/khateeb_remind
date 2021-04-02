import qs from 'qs'

const stringify = (params) => {
    return qs.stringify(params, { encode: false, arrayFormat: 'indices' })
}

const parse = (paramsString) => {
    return qs.parse(paramsString, { comma: true })
}

export default {
    stringify,
    parse
}