const textVendorServices = require('./main.js')

class textManager {
    constructor() {
        this.textAllowed = null
        this.accountSid = 'account'
        this.accountAuthToken = 'token'
        this.phoneNumber = '+11000000000'
        this.$textVendorConnection = null
    }

    get allFields() {
        return Object.keys(this).filter(f => f[0] !== "$")
    }

    get allTextVendorFields() {
        return this.allFields.filter(p => p !== 'textAllowed')
    }

    isTextServiceOnline() {
        return this.textAllowed
    }

    async initializeSettings() {
        try {
            const rootInstitution = await $db.institutions.findOne({ name: "__ROOT__" }).select(['settings']).exec()
            if (!rootInstitution)
                return console.log(`Root institution not found`)
            this.refreshSettings(rootInstitution.settings.textAPIInfo)
        } catch(err) {
            console.log(`Couldn't set text manager settings`, err)
        }
    }

    refreshSettings(settings={}) {
        if (settings.textAllowed === undefined)
            return console.log(`Required settings are missing`)
        this.setAllFields(settings)
        if (this.isTextServiceOnline())
            this.createTextVendorConnection()
    }

    createTextVendorConnection() {
        this.$textVendorConnection = textVendorServices.createTextConnection(this.accountSid, this.accountAuthToken)
    }

    setAllFields(textSettings={}) {
        const objectProperties = this.allTextVendorFields
        for (let i = 0; i < objectProperties.length; i++) {
            const property = objectProperties[i]
            if (!textSettings[property]) {
                this.setTextAllowed(false)
                break
            }
            this[property] = textSettings[property]
        }   
        this.setTextAllowed(textSettings.textAllowed)
    }

    setTextAllowed(value=false) {
        this.textAllowed = value
    }

    useVendorService(serviceName="message") {
        if (!this.textAllowed)
            return console.log(`${serviceName} cannot be used because text service is offline`)
        else if (!this.$textVendorConnection)
            return console.log(`Text vendor connection not established`)
        else if (!textVendorServices[serviceName])
            return console.log(`Service does not exist`)
        else
            return textVendorServices[serviceName]
    }

    sendText(to=100_000_0000, body="hello from khateeb remind", withSignature=true) {
        return this.useVendorService('message')(this.$textVendorConnection)(to, this.phoneNumber, `${body}${withSignature ? "\n\n🤖 From Khateeb Remind Bot" : ''}`)
    }

    sendRecoveryText(to=100_000_0000, body="hello from khateeb remind", type="username") {
        return this.sendText(to, `You're recieving this message because you requested help recovering your ${type}.\n\n${body}`)
    }

}

module.exports = textManager