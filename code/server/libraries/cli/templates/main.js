const cliHelpers = require(global.$dir + '/libraries/cli/main.js')
const cliCommandIndex = require(global.$dir + '/libraries/cli/commandsIndex/index.js')

const pingResponse = () => {
    return cliHelpers.createSingleResponseMsg("API is ready for commands 🌐")
}

const generalErrorResponse = (err=TypeError("unknown error")) => {
    return cliHelpers.createSingleResponseMsg(`A problem occurred when executing command.\nError trace: ${err}`, 'fail')
}

const commandCategoryNotFound = (category='inst') => {
    return cliHelpers.createSingleResponseMsg(`Couldn't find command category "${category}"`, 'fail')
}

const otherCommandsString = (commandCategory="inst") => {
    return Object.keys(cliCommandIndex[commandCategory]).reduce((total, cmd) => `${total}, ${cmd}`)
}

const commandDoesNotExist = (category='inst', command='view') => {
    return cliHelpers.createSingleResponseMsg(`Couldn't find command "${command}" in the ${category} category. Available commands: ${otherCommandsString(category)}`, 'fail')
}

const helpResponse = (category="inst") => {
    return cliHelpers.createSingleResponseMsg(`Commands for ${category} category: ${otherCommandsString(category)}`, "extraInfo")
}

const exceptionAndNonExistentCommandHandling = (commandCategory="inst", specificCommand="view") => {
    let res = null
    if (commandCategory === '__PING__') 
        res = pingResponse()
    else if (!cliCommandIndex[commandCategory])
        res = commandCategoryNotFound(commandCategory)
    else if (specificCommand === 'help' || specificCommand === '-h')
        res = helpResponse(commandCategory)
    else if (!cliCommandIndex[commandCategory][specificCommand])
        res = commandDoesNotExist(commandCategory, specificCommand)
    return res
}

module.exports = {
    pingResponse,
    generalErrorResponse,
    commandCategoryNotFound,
    commandDoesNotExist,
    otherCommandsString,
    helpResponse,
    exceptionAndNonExistentCommandHandling
}