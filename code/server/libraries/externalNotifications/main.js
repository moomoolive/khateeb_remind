// This library acts the only way khateeb remind sends information to the outside
// world (the exception being PWA notifications). 
// Sending information via text, email, or anything else.

// khateeb remind in general only uses one medium to communicate with the outside
// world.

// The default implemenation is email, using the AWS SES SDK(library)

// If you want to substitute the way khateeb Remind communicates with the
// outside world you only need to make changes here.

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

const helpers = require('./helpers.js')

const ses = new SESClient({
    region: process.env.AWS_HOSTING_REGION,
    credentials: {
        secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
        accessKeyId: process.env.AWS_S3_ACCESS_ID 
    }
})

const Charset = "UTF-8"
const Source = process.env.AWS_SES_EMAIL

const sendExternalNotification = async (toAddress="random@random.com", subject="Default Subject", msg="Default msg", options={}) => {
    try {
        const data = await ses.send(new SendEmailCommand({
            Destination: helpers.createRecipentsObject(toAddress, options),
            Message: {
                Body: {
                    Text: { Charset, Data: `${msg}${global.CONFIG.notifications.automatedNotificationSignature}` }
                },
                Subject: { Charset, Data: subject },
            },
            Source
        }))
        return { code: 0, msgId: data.MessageId }
    } catch(err) {
        console.error(err)
        const errorCode = err.$metadata ? err.$metadata.httpStatusCode : 1
        return {
            code: errorCode < 1 ? 1 : errorCode,
            msg: `Problem sending email. ${err}`
        }
    }
}

module.exports = {
    sendExternalNotification
}