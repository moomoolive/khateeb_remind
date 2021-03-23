import helpers from './helpers.js'
import requestQueryHelpers from '@/libraries/requests/queries/main.js'

import axios from 'axios'

const extension = helpers.targetURL('sysAdmin')

const requests = {
    executeCommand(commandArray=["__PING__"], params="x=true&b=false&c=10") {
        return axios.post(extension + '/cli', commandArray, { params: requestQueryHelpers.parse(params) })
    }
}

export default requests