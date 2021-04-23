/*
    All of these values are immutable

    any key that ends with 'Initialization' will be set once the app process
    starts
*/

const appConfig = {
    get rootUserInitialization() {
        return {
            username: 'rootUser',
            firstName: "Mostafa",
            lastName: "Elbannan"
        }
    },
    get rootInstitution() {
        return {
            _id: 'root',
            name: "root",
            abbreviatedName: 'root'
        }
    },
    get testInstitutionInitialization() {
        return {
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
        }
    },
    get network() {
        return {
            port: 80
        }
    },
    get cron() {
        return {
            // can be substituted with any valid 'moment.js' timezone
            timezone: "America/Edmonton"
        }
    },
    get consts() {
        return {
            mongooseIdLength: 24
        }
    },
    get customHeaders() {
        return {
            serviceWorkerCache: { "khateeb-remind-is-cacheable": "true" }
        }
    },
    get notifications() {
        return {
            automatedNotificationSignature: "\n\n🤖 From Khateeb Remind Bot 🤖"
        }
    },
}

module.exports = appConfig