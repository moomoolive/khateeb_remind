const twillio = require('twilio')(process.env.TWILIO_USER, process.env.TWILIO_KEY)

const $db = require('../../database/index.js')

module.exports = {
    async send(to, msg) {
        const twillioPhone = await $db.funcs.getTwillioPhone()
        return twillio.messages.create({
                body: msg,
                from: `+1${twillioPhone.phoneNumber}`,
                to: `+1${to}`
        })
    }
}