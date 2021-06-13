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
    if (fromSystem) {
        info.options.notificationOrigin = 'web-app'
    }
    helpers.createNotification(info)
}

const unauthorizedMsg = (options={}) => {
    const info = {
        type: 'alert',
        options: {
            color: "red",
            icon: "lock",
            msg: "Unauthorized",
            origin: "server",
            ...options
        }
    }
    helpers.createNotification(info)
}

const signOutOfInstitution = (options={}) => {
    const info = {
        type: 'alert',
        options: {
            color: "yellow",
            icon: "lock",
            msg: "Please click 'exit institution' in navigation to login to other institutions",
            textSize: "small",
            origin: "server",
            ...options
        }
    }
    helpers.createNotification(info)
}

const generalServerError = () => {
    const info = {
        type: 'alert',
        options: {
            color: "yellow",
            icon: "question",
            msg: "Our servers aren't responding right now. Try again later!",
            textSize: "small",
            origin: "server"
        }
    }
    helpers.createNotification(info)
}

const serverCaughtError = () => {
    const info = {
        type: 'alert',
        options: {
            color: "yellow",
            icon: "clock",
            msg: "There was an error that occured when contacting the server. Try again later!",
            textSize: "small",
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

export default {
    tutorial,
    unauthorizedMsg,
    generalServerError,
    redirectionOptions,
    confirmationPrompt,
    popupMsg,
    serverCaughtError,
    signOutOfInstitution
}