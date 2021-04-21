// This library acts the only way khateeb remind sends information to the outside
// world (the exception being PWA notifications). 
// Sending information via text, email, or anything else.

// khateeb remind in general only uses one medium to communicate with the outside
// world.

// The default implemenation is email, using the AWS SES SDK(library)

// If you want to substitute the way khateeb Remind communicates with the
// outside world you only need to make changes here.

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')

const ses = new SESClient({
    // to change
    region: 'us-east-2',
    credentials: {
        secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
        accessKeyId: process.env.AWS_S3_ACCESS_ID 
    }
})

const params = {
    Destination: {
        ToAddresses: [
            process.env.AWS_SES_EMAIL
        ],
    },
    Message: {
        Body: {
            Text: {
                Charset: "UTF-8",
                Data: "test infomation",
            }
        },
      Subject: {
            Charset: "UTF-8",
            Data: "Test Email",
      },
    },
    Source: process.env.AWS_SES_EMAIL
}



const sendExternalNotification = async () => {
    try {
        const data = await ses.send(new SendEmailCommand(params))
        console.log(data)
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    sendExternalNotification
}