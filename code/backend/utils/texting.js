import env from '../app.js'
import $db from '../database/funcs.js'

export default {
    async send(to, msg, response, successMsg="text was sent") {
        try {
            const twillioPhone = await $db.getTwillioPhone()
            env.text.messages.create({
                    body: msg,
                    from: twillioPhone.phoneNumber,
                    to: to
                })
                    .then((mes) => {
                        console.log('texted')
                        response.json(successMsg)
                    })
        } catch {
            response.json('text service offline')
        }
    }
}