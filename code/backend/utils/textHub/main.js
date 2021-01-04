import env from '../../app.js'
import $db from '../../database/index.js'

export default {
    async send(to, msg) {
        const twillioPhone = await $db.funcs.getTwillioPhone()
        return env.text.messages.create({
                body: msg,
                from: twillioPhone.phoneNumber,
                to: to
        })
    }
}