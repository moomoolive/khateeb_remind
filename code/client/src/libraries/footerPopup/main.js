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

export default {
    appWillUpdateMessage
}