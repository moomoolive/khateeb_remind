const noResourceIdentiferFound = (request={}, identifierFoundIn="query") => {
    const identifierSection = request[identifierFoundIn]
    const identifier = identifierSection._id
    const identifierIsNotArrayOrString = ( typeof identifier !== 'string' || !Array.isArray(identifier) )
    return identifierSection === undefined || identifier === undefined && identifierIsNotArrayOrString
}

module.exports = {
    noResourceIdentiferFound
}