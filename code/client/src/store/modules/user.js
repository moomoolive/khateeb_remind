import auth from '@/libraries/auth/main.js'
import userIdentification from '@/libraries/userIdentification/main.js'
import localStorageHelpers from '@/libraries/localStorageManagement/main.js'

import axios from 'axios'

export default {
    namespaced: true,
    state: () => ({
        jwToken: localStorage.getItem('token') || null,
        institution: !localStorage.getItem('token') ? {} : { 
            name: "random institution", 
            abbreviatedName: "rand Inst" 
        },
        isBrowsingOnPWA: userIdentification.deviceBrowsingViaPWA(),
        userInfo: !localStorage.getItem('token') ? {} : 
        localStorageHelpers.get("cachedUserCheckIn") ? localStorageHelpers.get("cachedUserCheckIn").userInfo : {
            __t: "khateeb",
            _id: "1234",
            confirmed: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            institutionID: "1234",
            lastLogin: new Date(),
            firstName: "random",
            lastName: "random",
            phoneNumber: 2_000_000_0000,
            username: "randomUser",
            handle: "random"
        }
    }),
    mutations: {
        removeToken(state) {
            state.jwToken = null
        },
        updateToken(state, updated) {
            state.jwToken = updated
        },
        storeInfoFromAPI(state, { institution }) {
            state.institution = institution
        },
        updateUserInfo(state, userInfo={}) {
            userInfo.lastLogin = new Date(userInfo.lastLogin)
            state.userInfo = userInfo
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
        decodedJWT({ jwToken }, { isLoggedIn }) {
            if (!isLoggedIn)
                return { msg: 'no token' }
            const tokenPayload = jwToken.split('.')[1]
            const decodedPayload = window.atob(tokenPayload)
            return JSON.parse(decodedPayload)
        },
        fullName(state) {
            return `${state.userInfo.firstName} ${state.userInfo.lastName}`
        },
        validAuthentication(state, { isLoggedIn, decodedJWT: { exp: tokenExpirationInSeconds } }) {
            if (!isLoggedIn)
                return false
            const oneSecondInMilliseconds = 1_000
            const expirationTimeInUNIXTime = new Date(tokenExpirationInSeconds * oneSecondInMilliseconds).getTime()
            const UNIXTimeNow = new Date().getTime()
            return expirationTimeInUNIXTime > UNIXTimeNow
            
        },
        type(state, { isLoggedIn }) {
            if (isLoggedIn)
                return state.userInfo.__t
            else
                return 'none'
        },
        authLevel(state, { isLoggedIn }) {
            if (isLoggedIn)
                return auth.userTypeToAuthLevel(state.userInfo.__t)
            else
                return 0
        }
    } 
}