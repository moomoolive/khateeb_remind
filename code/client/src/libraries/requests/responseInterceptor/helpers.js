const responseExtenstion = (response) => {
    return response.request.responseURL
        .split('/')
        .slice(2)
        .reduce((total, urlPart) => `${total}/${urlPart}`, '/')
}

export default {
    responseExtenstion
}