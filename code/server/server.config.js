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
            textAPIInfo: { textAllowed: false },
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
            password: "password123",
            handle: "testMaster",
            firstName: "Mostafa",
            lastName: "Elbannan",
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
    }
}

module.exports = appConfig