import helpers from './helpers.js'

import axios from 'axios'

const extension = helpers.targetURL('sysAdmin')

const requests = {
    executeCommand(commandArray) {
        return axios.post(extension + '/cli', commandArray)
    }
}

export default requests