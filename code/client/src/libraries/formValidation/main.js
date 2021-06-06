import helpers from './helpers.js'
import validators from './validatorsList.js'

import { nanoid } from 'nanoid'

const getValidators = async (validatorName, data, fieldName) => {
    if (typeof validatorName === 'string')
        validatorName = [validatorName]
    const validationInfo = {
        state: true,
        msgs: []
    }
    validatorName = helpers.includeValidationParams(validatorName)
    for (let [validationName, options] of Object.entries(validatorName)) {
        const validation = await validators[validationName](data, fieldName, options)
        if (typeof validation === 'undefined') {
            validationInfo.state = false
            validationInfo.msgs.push(`Error during validation, try refreshing the page or come back later`)
        }
        else if (!validation.state) {
            validationInfo.state = validation.state
            validationInfo.msgs.push(validation.msg)
        }
    }
    return validationInfo
}

const createFormElementNameHash = (typeOfElement='input') => {
    const idLength = 21
    return `${typeOfElement}-${nanoid(idLength)}-${window.location.pathname}`
}

export default {
    getValidators,
    createFormElementNameHash
}