// current the text implemenation of this server uses the API-to-text service
// provide by Twilio
const createTextConnection = (accountSid="ACRandom", authToken="random") => {
    return require('twilio')(accountSid, authToken)
}

/* 
Only supports messaging to american and canadian khateebs.  
    <!-- Do NOT include country code in "to" -->
    <!-- MUST include country code in "from" -->
*/
const message = (connection=createTextConnection()()) => {
    return (to=100_000_0000, from=1_100_000_0000, body="hello from khateeb remind") => {
        return connection.messages.create({
            body,
            to: `+1${to}`,
            from: `+${from}`
        })
    }
}

module.exports = {
    createTextConnection,
    message
}