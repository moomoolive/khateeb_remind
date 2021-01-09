const env = require('../../app.js')
const $db = require('../../database/index.js')

module.exports = {
    async send(to, msg) {
        const twillioPhone = await $db.funcs.getTwillioPhone()
        return env.text.messages.create({
                body: msg,
                from: `+1${twillioPhone.phoneNumber}`,
                to: `+1${to}`
        })
    }
}