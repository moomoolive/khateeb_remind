/*
    any key that ends with 'Initialization' will be set once the app process
    starts
*/

const appConfig = {
    rootUserInitialization: {
        username: 'rootUser',
        firstName: "Mostafa",
        lastName: "Elbannan"
    },
    rootInstitution: {
        settingsInitial: {
            autoConfirmRegistration: false
        }
    },
    testInstitutionInitialization: {
        institution: {
            timezone: "America/Edmonton",
            country: "Canada",
            state: "Alberta"
        },
        rootAdmin: {
            username: "testRoot",
            handle: "testMaster",
            firstName: "Mostafa",
            lastName: "Elbannan",
        },
        locationCount: 3,
        timingsPerLocation: 3,
        khateebCount: 6,
        khateebs: {
            // all created khateebs usernames' will use the format 
            // `${baseUsername}${index + 1}`
            baseUsername: 'testk',
            password: '123456',
        }
    },
    network: {
        port: 80
    },
    cron: {
        // can be substituted with any valid 'moment.js' timezone
        timezone: "America/Edmonton"
    },
    consts: {
        mongooseIdLength: 24
    },
    customHeaders: {
        serviceWorkerCache: { "khateeb-remind-is-cacheable": "true" }
    },
    notifications: {
        automatedNotificationSignature: "\n\n🤖 From Khateeb Remind Bot 🤖"
    }
}

module.exports = appConfig