const twilio = async () => {
    try {
        const APIInfo = await $db.funcs.getSetting("textAPI")
        return require("twilio")(APIInfo.options.user, APIInfo.options.key)
    } catch(err) {
        console.log(err)
    }
}

module.exports = {
    async send(to, msg) {
        const text = await twilio()
        const twillioPhone = await $db.funcs.getTwillioPhone()
        return text.messages.create({
                body: msg,
                from: `+1${twillioPhone.phoneNumber}`,
                to: `+1${to}`
        })
    },
    preprocessRequestBody(requestBody) {
        let msg = requestBody.Body
        msg = msg.replace(/ +/, '')
        return msg.toLowerCase()
    },
    isTextConfirmationOrCanceling(textBody) {
        const msg = this.preprocessRequestBody(textBody)
        return msg === 'yes' || msg === 'no'
    },
    updateConfirmation(textBody) {
        const msg = this.preprocessRequestBody(textBody)
        return msg === 'yes'
    },
    stripCountryCode(phoneNumber) {
        return phoneNumber.slice(2)
    },
    async updateTextHub(msg) {
        try {
            const textHub = await $db.models.textHub.findOne({}).select(['data']).exec()
            textHub.data.forEach(location => {
                location.prayers.khateebs.forEach(khateeb => {
                    if (khateeb.confirm.responded === null) 
                        return
                    const phoneNumberWithoutCountryCode = this.stripCountryCode(msg.From)
                    if (khateeb.data.phoneNumber === phoneNumberWithoutCountryCode) {
                        khateeb.confirm.responded = true
                        khateeb.confirm.state = this.updateConfirmation(msg)
                    }
                })
            })
        } catch(err) {
            console.log('There was a problem updating the textHub')
            console.log(err)
        }
    },
    async getSendersName(senderPhoneNumber) {
        try {
            const khateebs = await $db.models.khateebs.find({}).exec()
            let senderName = `unknown number: ${senderPhoneNumber}`
            khateebs.forEach(khateeb => {
                if (this.stripCountryCode(senderPhoneNumber) === khateeb.phoneNumber)
                    senderName = `${khateeb.firstName} ${khateeb.lastName}`
            })
            return senderName
        } catch(err) {
            console.log('there was a problem verifying the sender.')
            console.log(`Error ref\n----------\n${err}`)
        }
    },
    async sendTextToAdmin(textBody) {
        try {
            const admin = await $db.funcs.getSetting('adminProfile')
            const phoneNumber = admin.options.phoneNumber
            const senderName = await this.getSendersName(textBody.From)
            const msg = `From ${senderName}\n---------\n${textBody.Body}`
            this.text.send(phoneNumber, msg) 
        } catch(err) {
            console.log('There was a problem forwarding the message to admin')
            console.log(`Error ref:\n-------------\n${err}`)
        }
    }
}