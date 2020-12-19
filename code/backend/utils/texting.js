import env from '../app.js'

export default {
    send(to, msg, response, successMsg="Text was sent") {
        env.text.messages
            .create({
                body: msg,
                from: env.phone,
                to: to
            })
                .then((mes) => {
                    console.log(mes)
                    response.json(successMsg)
                })
    }
}