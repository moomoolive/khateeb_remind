import helpers from './helpers.js'
import store from '@/store/index.js'

const appWillUpdateMessage = () => {
    helpers.createFooterPopup(
        'statusUpdate', 
        { 
            gif: 'loading-alternate', 
            color: 'blue',
            topMessage: "Updates Detected",
            bottomMessage: "Reloading in a Moment..." 
        }
    )
}

const youAreOffline = () => {
    helpers.createFooterPopup(
        'statusUpdate',
        { 
            gif: 'confusedDino', 
            color: 'blue',
            topMessage: "You're offline",
            bottomMessage: "Some features are unavailable and data has not been synced since your last visit - therefore may be out of date." ,
            closeAfter: 2
        }
    )
    const oneSecondInMilliseconds = 1_000
    window.setTimeout(() => store.commit("app/offlineMode"), oneSecondInMilliseconds)
}

export default {
    appWillUpdateMessage,
    youAreOffline
}