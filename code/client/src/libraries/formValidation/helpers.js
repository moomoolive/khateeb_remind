const compoundValidations = {
    handle: {
        noAtSymbolChar0: {},
        minLength: { min: 1 }
    },
    minLength: {
        min: 1
    },
    username: {
        uniqueUsername: {},
        minLength: { min: 6 }
    },
    email: {
        email: {}
    }
}

const includeValidationParams = (validations) => {
    const copy = JSON.parse(JSON.stringify(validations))
    const params = {}
    for (let i = 0; i < copy.length; i++) {
        if (typeof copy[i] !== 'string' && copy[i].name)
            params[copy[i].name] = copy[i]
        else if (typeof copy[i] === 'string' && compoundValidations[copy[i]])
            Object.assign(params, compoundValidations[copy[i]]) 
    }
    return params
}


const validatorMsgPackage = (msg, passed) => { 
    if (!passed) 
        return msg
}


export default {
    validatorMsgPackage,
    includeValidationParams,
    compoundValidations
}