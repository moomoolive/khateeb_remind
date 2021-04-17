import helpers from './helpers.js'

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
            topMessage: "You're Offline!",
            bottomMessage: "Some features are unavailable and data is not synced - therefore may be out of date." ,
            closeAfter: 9
        }
    )
}

const backOnline = () => {
    helpers.createFooterPopup(
        'statusUpdate',
        { 
            gif: 'connectedWifi', 
            color: 'green',
            topMessage: "You're Back Online!",
            bottomMessage: "Reloading in A Moment...",
            closeAfter: 5
        }
    )
}

export default {
    appWillUpdateMessage,
    youAreOffline,
    backOnline
}