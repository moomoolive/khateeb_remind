const networkConfig = {
    serverURL: process.env.VUE_APP_API_SERVER_URL,
    offlineModeRequestCountThreshold: parseInt(process.env.VUE_APP_INITIATE_OFFLINE_MODE_FAIL_REQUEST_COUNT),
    pwaTestingServerURL: "http://localhost:80",
    defaultIOLoadingTime: parseInt(process.env.VUE_APP_DEFAULT_IO_LOADING_TIME), // in milliseconds
    defaultAuthIOLoadingTime: parseInt(process.env.VUE_APP_DEFAULT_AUTH_IO_LOADING_TIME), // in milliseconds
}

const securityConfig = {
    vapidPublicKey: "BN6MTU8AynubgWW8G2JAssO8llZJnGVQGScLgyuQ-ulZvPqMpwFHPJUyTmRFAH-rQSnevhROy_wpmZ5i6dFsbHE"
}

const thirdPartyServicesConfig = {
    feedbackFormURL: "https://docs.google.com/forms/d/e/1FAIpQLSdoUhgTg8TgnYGCXRtWSIJam0k8MkPbIB4wIoeJDvqL8B3Jjg/viewform?usp=sf_link" 
}

const userRestrictionsConfig = {
    notificationLoopMaxRunCountPerWeek: parseInt(process.env.VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_FOR_WEEK),
    notificationLoopMaxRunCountPerJummah: parseInt(process.env.VUE_APP_MAX_NOTIFICATION_LOOP_RUN_COUNT_INDIVIDAUL_JUMMAH)
}

const globalConfig = {
    nullId: 'none'
}

const routerConfig = {
    animationName: "fade-in-down"
}

const pwaConfig = {
    reloadDelayAfterNewServiceWorkerDetected: 3_000 // in milliseconds
}

export default {
    get networkConfig() {
        return networkConfig
    },
    get securityConfig() {
        return securityConfig
    },
    get thirdPartyServicesConfig() {
        return thirdPartyServicesConfig
    },
    get userRestrictionsConfig() {
        return userRestrictionsConfig
    },
    get globalConfig() {
        return globalConfig
    },
    get routerConfig() {
        return routerConfig
    },
    get pwaConfig() {
        return pwaConfig
    }
}