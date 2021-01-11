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
    }
}