import auth from '@/libraries/auth/main.js'
import userIdentification from '@/libraries/userIdentification/main.js'
import localStorageHelpers from '@/libraries/localStorageManagement/main.js'
import _utils from '@/libraries/globalUtilities.js'
import requestHelpers from '@/libraries/requests/index.js'

import axios from 'axios'

const userInfoKey = 'userInfo'
const institutionKey = 'institution'
const JWTKey = 'token'

export default {
    namespaced: true,
    state: () => ({
        jwToken: localStorage.getItem(JWTKey) || null,
        institution: localStorage.getItem(JWTKey) ?
            localStorageHelpers.get(institutionKey) || {} :
            {}
        ,
        isBrowsingOnPWA: userIdentification.deviceBrowsingViaPWA(),
        userInfo: localStorage.getItem(JWTKey) ? 
            localStorageHelpers.get(userInfoKey) || {} : 
            {} 
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
        },
        updateInstitutionInfo(state, institution={}) {
            state.institution = institution
        },
        removeInstitutionInformation(state) {
            state.institution = {}
        }
    },  
    actions: {
        logout({ commit }) {
            localStorage.removeItem(JWTKey)
            localStorage.removeItem(institutionKey)
            localStorage.removeItem(userInfoKey)
            delete axios.defaults.headers.common['authorization']
            commit('removeToken')
            _utils.toHomePage()
        },
        updateToken({ commit }, updated) {
            commit('updateToken', updated)
            localStorage.setItem(JWTKey, updated)
            axios.defaults.headers.common.authorization = updated
        },
        updateUserInfo({ commit }, userInfo) {
            localStorageHelpers.commit(userInfoKey, userInfo)
            commit('updateUserInfo', userInfo)
        },
        updateInstitutionInfo({ commit }, institution) {
            localStorageHelpers.commit(institutionKey, institution)
            commit('updateInstitutionInfo')
        },
        async downgradeUserAuthorization({ dispatch, commit }) {
            try {
                const { token } = await requestHelpers.user.downgradeAuthorization()
                if (!token) {
                    return
                }
                dispatch('updateToken', token)
                commit('removeInstitutionInformation')
                localStorage.removeItem(institutionKey)
                return _utils.toHomePage()
            } catch {
                return _utils.alert(`A problem occurred when exiting institution`)
            }
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
        type(state, { isLoggedIn, decodedJWT }) {
            if (isLoggedIn)
                return decodedJWT.__t
            else
                return 'none'
        },
        authLevel(state, { isLoggedIn }) {
            if (isLoggedIn)
                return auth.userTypeToAuthLevel(state.userInfo.__t)
            else
                return 0
        },
        isLoggedInAsGenericUser(state, { decodedJWT }) {
            return !decodedJWT.institutionID
        }
    } 
}