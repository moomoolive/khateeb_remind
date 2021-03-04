import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('jummahs')

const requests = {
    getJummahs(params) {
        return axios.get(extension, { params })
    }
}

export default requests