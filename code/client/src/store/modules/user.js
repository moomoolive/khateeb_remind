import auth from '@/libraries/auth/main.js'
import userIdentification from '@/libraries/userIdentification/main.js'

import axios from 'axios'
import DeviceDetector from 'device-detector-js'

export default {
    namespaced: true,
    state: () => ({
        jwToken: localStorage.getItem('token') || null,
        lastLogin: new Date(),
        institution: { msg: 'No institution' },
        isBrowsingOnPWA: userIdentification.deviceBrowsingViaPWA(),
        browsingDevice: new DeviceDetector().parse(window.navigator.userAgent)
    }),
    mutations: {
        removeToken(state) {
            state.jwToken = null
        },
        updateToken(state, updated) {
            state.jwToken = updated
        },
        storeInfoFromAPI(state, { lastLogin , institution }) {
            state.lastLogin = new Date(lastLogin)
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
        fullName(state, { allInfo }) {
            return `${allInfo.firstName} ${allInfo.lastName}`
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
        },
        deviceType({ browsingDevice }) {
            return browsingDevice.device.type
        },
        browserBrand({ browsingDevice }) {
            const brand = browsingDevice.client.name
            if (browsingDevice.client.type === 'browser')
                return brand
            else
                return 'unknown'
        },
        deviceBrand({ browsingDevice }) {
            if (browsingDevice.device.brand)
                return browsingDevice.device.brand
            else
                return 'unknown'
        }
    } 
}