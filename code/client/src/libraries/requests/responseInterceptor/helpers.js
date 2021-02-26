const responseExtenstion = (response) => {
    return response.request.responseURL
        .split('/')
        .slice(2)
        .reduce((total, urlPart) => `${total}/${urlPart}`, '/')
}

const unauthorizedNotificationTemplate = () => {
    return {
        type: 'alert',
        options: {
            color: "red",
            icon: "locked",
            msg: "Unauthorized"
        }
    }
}

const serverErrorNotificationTemplate = () => {
    return {
        type: 'alert',
        options: {
            color: "yellow",
            icon: "unknown",
            msg: "Our servers aren't responding right now. Try again later!",
            textSize: "small"
        }
    }
}

export default {
    unauthorizedNotificationTemplate,
    serverErrorNotificationTemplate,
    responseExtenstion
}