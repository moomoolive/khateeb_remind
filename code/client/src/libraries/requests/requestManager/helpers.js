const additionalIdentification = ({ additionalIdentifiers = [] }) => {
    if (!Array.isArray(additionalIdentifiers))
        throw TypeError(`Additional identifiers must be in array format`)
    if (additionalIdentifiers.length < 1)
        return ''
    else
        return additionalIdentifiers.reduce(
            (total, identifier) => `${total}-${identifier}`,
            ''
        )
}

export default {
    additionalIdentification
}