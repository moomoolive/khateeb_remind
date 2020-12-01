import state from './state'

export default {
    tokenExists(state) {
        return !!state.JWT_TOKEN
    },
    isJWTValid(state, getters) {
        if (getters.tokenExists) {
            const oneSecond = 1_000
            const expirationTime = new Date(getters.decodedJWT.exp * oneSecond)
            const timeNow = new Date()
            const isNotExpired = timeNow < expirationTime
            return isNotExpired
        } else return false
    },
    decodedJWT: (state, getters) => {
        if (getters.tokenExists) {
            const token = state.JWT_TOKEN
            const tokenInfoSection = token.split('.')[1]
            const decodedTokenInfo = atob(tokenInfoSection)
            const jsonTokenInfo = JSON.parse(decodedTokenInfo)
            return jsonTokenInfo
        } else return null
    }
}