import helpers from './helpers.js'

const tutorial = (category, number, fromSystem=false) => {
    const info = {
        type: "tutorial",
        options: {
            category,
            number,
            color: "grey"
        }
    }
    if (fromSystem)
        info.options.notificationOrigin = 'web-app'
    helpers.createNotification(info)
}

const unauthorizedMsg = () => {
    const info = {
        type: 'alert',
        options: {
            color: "red",
            icon: "locked",
            msg: "Unauthorized",
            origin: "server"
        }
    }
    helpers.createNotification(info)
}

const generalServerError = () => {
    const info = {
        type: 'alert',
        options: {
            color: "yellow",
            icon: "unknown",
            msg: "Our servers aren't responding right now. Try again later!",
            textSize: "small",
            origin: "server"
        }
    }
    helpers.createNotification(info)
}

const redirectionOptions = (redirections, options={}) => {
    if (!Array.isArray(redirections))
        throw TypeError(`Redirections must be in array format`)
    const info = {
        type: 'redirect',
        options: {
            redirections,
            color: options.color || 'green'
        }
    }
    helpers.createNotification(info)
}

const confirmationPrompt = (msg, options) => {
    return new Promise(resolve => {
        const info = {
            type: 'confirm',
            options: {
                msg,
                ...options,
                resolve,
                reject: resolve
            }
        }
        helpers.createNotification(info)
    })
}

const popupMsg = (msg, options) => {
    const info = {
        type: 'alert',
        options: {
            msg,
            textSize: 'small',
            ...options
        }
    }
    helpers.createNotification(info)
}

const downloadAppPrompt = () => {
    const options = {
        picture: 'downloadApp',
        rejectButtonText: 'Later',
        confirmButtonText: 'Install',
        color: 'blue'
    }
    return confirmationPrompt(`Install the free Khateeb Remind app:\n- Looks and feels better\n- Reminds you about khutbahs`, options)
}

export default {
    tutorial,
    unauthorizedMsg,
    generalServerError,
    redirectionOptions,
    confirmationPrompt,
    popupMsg,
    downloadAppPrompt
}