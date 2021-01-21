import axios from 'axios'

import API_URL from './consts.js'

const baseUrl = API_URL + '/auth'

const funcs = {
    err(err) {
        console.log(err)
        return err
    }
}

export default {
    authenticate(credentials) {
        return axios.post(baseUrl + '/', credentials)
            .then(res => res.data)
            //.catch(funcs.err)
    }
}