/*
    any key that ends with 'initialization' will be set once the app process starts
*/

const appConfig = {
    rootUserInitialization: {
        // password is create via enviromental variable DEFAULT_ROOT_PASS
        // or is automatically set to 'password123'
        // phone number is set to random number 
        username: 'rootUser',
        firstName: "Mostafa",
        lastName: "Elbannan"
    },
    testInstitutionInitialization: {
        // name of institution is automatically set to __TEST__
        // and is a reserved institution name
        institution: {
            timezone: "America/Edmonton",
            country: "Canada",
            state: "Alberta"
        },
        // phone number is set to random number 
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
        // any scheduled cron job will be run against this timezone
        // can be substituted with any valid 'moment.js' timezone
        timezone: "America/Edmonton"
    }
}

module.exports = appConfig