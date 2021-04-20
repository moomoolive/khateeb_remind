import helpers from './helpers.js'
import utils from '@/libraries/globalUtilities.js'
import $API from '@/libraries/requests/index.js'

const minLength = (data, name, options) => {
    const min = options.min ? options.min : 1
    const passed = data.length >= min
    let msg = helpers.validatorMsgPackage(min > 1 ? `${utils.stringFormat(name)} cannot be less than ${min} characters` : `${utils.stringFormat(name)} cannot be empty`, passed)
    return {
        state: passed,
        msg 
    }
}

const noAtSymbolChar0 = (data, name) => {
    const state = data[0] !== '@'
    return {
        state,
        msg: helpers.validatorMsgPackage(`${utils.stringFormat(name)} cannot have '@' as first character`, state)
    }
}

const uniqueUsername = async (data) => {
    let state
    try {
        state = await $API.misc.uniqueUsername(data)
    } catch(err) {
        console.log(err)
    }
    return {
        state,
        msg: helpers.validatorMsgPackage(`Username is already taken`, state)
    }
}

const email = (data="a@email.com") => {
    return {
        state: /@.*\..*[a-zA-Z]/g.test(data),
        msg: helpers.validatorMsgPackage(`Invalid email`)
    }
}

export default {
    minLength,
    uniqueUsername,
    noAtSymbolChar0,
    email
}