import requestConsts from '@/libraries/requests/consts.js'

const targetURL = (extension) => {
    return requestConsts.API_URL + `/${extension}`
}

export default {
    targetURL
}