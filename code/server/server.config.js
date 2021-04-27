// **All of these values are IMMUTABLE**

const path = require('path')
const dotenv = require('dotenv')

// set enviromental variables from a .env file at project root
// look at the README for required enviromental factors
if (process.env.NODE_ENV === 'production')
    dotenv.config({ path: path.resolve(__dirname + '/.env') })
else
    dotenv.config({ path: path.resolve(__dirname + '/.env.development') })

const globalConfig = {
    rootInstitution: {
        _id: 'root',
        name: "root",
        abbreviatedName: 'root'
    },
    network: {
        port: 80
    },
    cron: {
        // can be substituted with any valid 'moment.js' timezone
        timezone: "America/Edmonton"
    },
    consts: {
        mongooseIdLength: 24,
        randomEmail: "none@khateeb-remind.com",
        externalNotificationKeyNameInUserSchema: "email",
        nullId: 'none'
    },
    customHeaders: {
        serviceWorkerCache: { "khateeb-remind-is-cacheable": "true" }
    },
    notifications: {
        automatedNotificationSignature: "\n\n🤖 From Khateeb Remind Bot 🤖"
    }
}

const databaseConfig = {
    mongoose: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    },
    URI: process.env.DATABASE
}

const initializationConfig = {
    rootUser: {
        username: 'rootUser',
        firstName: "Mostafa",
        lastName: "Elbannan",
        institutionID: globalConfig.rootInstitution._id,
        password: process.env.DEFAULT_ROOT_PASS,
        email: globalConfig.consts.randomEmail
    },
    testInstitution: {
        institution: {
            timezone: "America/Edmonton",
            country: "Canada",
            state: "Alberta",
            name: "test",
            abbreviatedName: "__TEST__",
            confirmed: true,
        },
        rootAdmin: {
            password: process.env.DEFAULT_TEST_USER_PASS,
            username: "testRoot",
            handle: "testMaster",
            firstName: "Mostafa",
            lastName: "Elbannan",
            email: globalConfig.consts.randomEmail
        },
        locationCount: 3,
        timingsPerLocation: 3,
        khateebCount: 6,
        khateebs: {
            // all created khateebs usernames' will use the format 
            // `${baseUsername}${index + 1}`
            baseUsername: 'testk',
            info: {
                password: '123456',
                password: process.env.DEFAULT_TEST_USER_PASS,
                confirmed: true,
                email: globalConfig.consts.randomEmail,

            }
        }
    },
}

const securityConfig = {
    jwtSecret: process.env.JWT_SECRET,
    thirdPartyServices: {
        AWSAuthCredentials: {
            region: process.env.AWS_HOSTING_REGION,
            credentials: {
                secretAccessKey: process.env.AWS_S3_ACCESS_KEY,
                accessKeyId: process.env.AWS_S3_ACCESS_ID 
            }
        }
    },
    // used for PWA push messages
    vapid: {
        subject: process.env.VAPID_SUBJECT_FIELD,
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY
    }
}

const thirdPartyServicesInfo = {
    AWS: {
        email: process.env.AWS_SES_EMAIL,
        cloudStorageBucketName: process.env.AWS_S3_BUCKET_NAME
    }
}

const networkConfig = {
    port: 80,
    maxJSONSize: '50mb'
}

module.exports = { 
    get globalConfig() {
        return globalConfig
    },
    get initConfig() {
        return initializationConfig
    },
    get databaseConfig() {
        return databaseConfig
    },
    get securityConfig() {
        return securityConfig
    },
    get thirdPartyServicesConfig() {
        return thirdPartyServicesInfo
    },
    get networkConfig() {
        return networkConfig
    }
}