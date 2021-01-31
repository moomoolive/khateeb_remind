import utils from '@/utils/general/main.js'
import $API from '@/utils/API/index.js'

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

const validators = {
    minLength(data, name, options) {
        const min = options.min ? options.min : 1
        const passed = data.length >= min
        let msg = validatorMsgPackage(min > 1 ? `${utils.stringFormat(name)} cannot be less than ${min} characters` : `${utils.stringFormat(name)} cannot be empty`, passed)
        return {
            state: passed,
            msg 
        }
    },
    noAtSymbolChar0(data, name) {
        const state = data[0] !== '@'
        return {
            state,
            msg: validatorMsgPackage(`${utils.stringFormat(name)} cannot have '@' as first character`, state)
        }
    },
    async uniqueUsername(data) {
        let state
        try {
            state = await $API.misc.uniqueUsername(data)
        } catch(err) {
            console.log(err)
        }
        return {
            state,
            msg: validatorMsgPackage(`Username is already taken`, state)
        }
    }
}

export default {
    async getValidators(validatorName, data, fieldName) {
        if (typeof validatorName === 'string')
            validatorName = [validatorName]
        const validationInfo = {
            state: true,
            msgs: []
        }
        validatorName = includeValidationParams(validatorName)
        for (let [validationName, options] of Object.entries(validatorName)) {
            let validation
            try {
                validation = await validators[validationName](data, fieldName, options)
            } catch(err) {
                console.log(err)
            }
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
}