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
            topMessage: "You're offline",
            bottomMessage: "Some features are unavailable" ,
            closeAfter: 4
        }
    )
}

export default {
    appWillUpdateMessage,
    youAreOffline
}