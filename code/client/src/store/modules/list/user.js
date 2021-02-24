import auth from '@/utils/auth.js'
import userIdentification from '@/utils/userIdentification.js'

import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        jwToken: localStorage.getItem('token') || null,
        lastVisit: new Date(),
        institution: { msg: 'No institution' },
        isBrowsingOnPWA: userIdentification.deviceBrowsingViaPWA(),
        browsingDeviceType: userIdentification.deviceType()
    }),
    mutations: {
        removeToken(state) {
            state.jwToken = null
        },
        updateToken(state, updated) {
            state.jwt = updated
        },
        storeInfoFromAPI(state, { lastVisit: { lastLogin }, institution}) {
            state.lastVisit = new Date(lastLogin)
            state.institution = institution
        }
    },  
    actions: {
        logout({ commit }) {
            localStorage.removeItem('token')
            delete axios.defaults.headers.common['authorization']
            commit('removeToken')
        },
        updateToken({ commit }, updated) {
            commit('updateToken', updated)
            if (localStorage.getItem('rememberMe'))
                localStorage.setItem('token', updated)
            axios.defaults.headers.common.authorization = updated
        }
    },
    getters: {
        isLoggedIn({ jwToken }) {
            return !!jwToken
        },
        allInfo({ jwToken }, { isLoggedIn }) {
            if (!isLoggedIn)
                return { msg: 'no token' }
            const tokenPayload = jwToken.split('.')[1]
            const decodedPayload = window.atob(tokenPayload)
            return JSON.parse(decodedPayload)
        },
        validAuthentication(state, { isLoggedIn, allInfo: { exp: tokenExpirationInSeconds } }) {
            if (!isLoggedIn)
                return false
            const oneSecondInMilliseconds = 1_000
            const expirationTimeInUNIXTime = new Date(tokenExpirationInSeconds * oneSecondInMilliseconds).getTime()
            const UNIXTimeNow = new Date().getTime()
            return expirationTimeInUNIXTime > UNIXTimeNow
            
        },
        type(state, { allInfo: { __t: type }, isLoggedIn }) {
            if (isLoggedIn)
                return type
            else
                return 'none'
        },
        authLevel(state, { allInfo: { __t: type }, isLoggedIn }) {
            if (isLoggedIn)
                return auth.userTypeToAuthLevel(type)
            else
                return 0
        }
    } 
}