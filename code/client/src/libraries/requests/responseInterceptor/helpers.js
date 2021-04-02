const responseExtenstion = (response) => {
    return response.request.responseURL
        .split('/')
        .slice(3)
        .reduce((total, urlPart) => `${total}/${urlPart}`)
}

export default {
    responseExtenstion
}