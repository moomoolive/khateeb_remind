// This library acts the only way khateeb remind sends information to the outside
// world (the exception being PWA notifications). 
// Sending information via text, email, or anything else.

// khateeb remind in general only uses one medium to communicate with the outside
// world.

// The default implemenation is email, using the AWS SES SDK(library)

// If you want to substitute the way khateeb Remind communicates with the
// outside world you only need to make changes here.

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

const { securityConfig, thirdPartyServicesConfig } = require($rootDir + '/server.config.js')

const helpers = require('./helpers.js')

const ses = new SESClient(securityConfig.thirdPartyServices.AWSAuthCredentials)

const Charset = "UTF-8"

const sendExternalNotification = async (toAddress="random@random.com", subject="Default Subject", msg="Default msg", options={}) => {
    try {
        const data = await ses.send(new SendEmailCommand({
            Destination: helpers.createRecipentsObject(toAddress, options),
            Message: {
                Body: {
                    Text: { Charset, Data: `${msg}${$config.notifications.automatedNotificationSignature}` }
                },
                Subject: { Charset, Data: subject },
            },
            Source: thirdPartyServicesConfig.AWS.email
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

// msgInfo field here must be configured for each notification constructor
// if you are to change the default external notification implementation
const sendExternalNotificationFromNotificationConstructor = async (userInfo={}, msgInfo={}) => {
    const targetUserField = userInfo[$config.consts.externalNotificationKeyNameInUserSchema]
    const res = await sendExternalNotification(targetUserField, msgInfo.subject, msgInfo.body)
    return res
}

module.exports = {
    sendExternalNotification,
    sendExternalNotificationFromNotificationConstructor
}