const createTextConnection = (accountSid="ACRandom") => (authToken="random") => {
    return require('twilio')(accountSid, authToken)
}

/* Only supports messaging to american and canadian khateebs.  
    <!-- Do NOT include country code in "sendToPhone" -->
    <!-- MUST include country code in "sentFromPhone" -->
*/
const message = (connection=require('twilio')(accountSid, authToken)) => {
    return (sendToPhone=100_000_0000, sentFromPhone=1_100_000_0000) => {
        return (body="hello from khateeb remind") => {
            return connection.messages.create({
                body: `${body}`,
                to: `+1${sendToPhone}`,
                from: `+${sentFromPhone}`
            })
        }
    }
}


module.exports = {
    createTextConnection,
    message
}