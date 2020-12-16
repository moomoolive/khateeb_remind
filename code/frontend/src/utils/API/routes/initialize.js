import axios from 'axios'

const API_SERVER = process.env.VUE_APP_API_SERVER_URL || 'http://localhost:5000'
const baseUrl = API_SERVER + '/initialize'

export default {
    async initializePassword(payload) {
        let responseData
        await axios.post(baseUrl + '/password', payload)
            .then((res) => {
                console.log(res)
                responseData = res.data
            })
            .catch((err) => { console.log(err) })
        return responseData
    },
    async passwordExists() {
        let responseData
        await axios.get(baseUrl + '/pass-exists')
            .then((res) => {
                responseData = res.data
                console.log(res)
            })
            .catch((err) => { console.log(err) })
        return responseData
    }
}