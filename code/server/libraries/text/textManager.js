class textManager {
    constructor() {
        this.textAllowed = null
        this.accountSid = 'account'
        this.accountAuthToken = 'token'
        this.phoneNumber = '+11000000000'
        this.textVendorConnection = null
    }

    get allFieldsIncludingNonSettable() {
        return Object.keys(this)
    }

    get allFields() {
        return this.allFieldsIncludingNonSettable.filter(f => f !== 'textVendorConnection')
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
        this.textVendorConnection = require('twilio')(this.accountSid, this.accountAuthToken)
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

    isVendorServiceUsable() {
        return this.textVendorConnection && this.textAllowed
    }

    //only supports messaging to american and canada
    messageVendorService(toBeTextPhoneNumber=100_000_0000, body="hello from khateeb remind") {
        return this.textVendorConnection.messages.create({
            body: `${body}\n\n🤖 From Khateeb Remind Bot`,
            to: `+1${toBeTextPhoneNumber}`,
            from: `+${this.phoneNumber}`
        })
    }

    async sendText(toBeTextPhoneNumber=100_000_0000, body="hello from khateeb remind") {
        try {
            if (!this.isVendorServiceUsable())
                throw TypeError(`Vendor services are not active right now`)
            const vendorRes = await this.messageVendorService(toBeTextPhoneNumber, body)
            return vendorRes
        } catch(err) {
            console.log(err)
            return { msg: `There was an error that occured when sending your text` }
        }
    }

}

module.exports = textManager