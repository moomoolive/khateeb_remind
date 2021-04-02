const cliHelpers = require(global.$dir + '/libraries/cli/main.js')
const cliCommandIndex = require(global.$dir + '/libraries/cli/commandsIndex/index.js')

const generalErrorResponse = (err=TypeError("unknown error")) => {
    return cliHelpers.createSingleResponseMsg(`A problem occurred when executing command.\nError trace: ${err}`, 'fail')
}

const otherCommandsString = (commandCategory="inst") => {
    return Object.keys(cliCommandIndex[commandCategory]).reduce((total, cmd) => `${total}, ${cmd}`)
}

const helpResponse = (commandCategory="inst") => {
    return cliHelpers.createResponse(`Commands for ${commandCategory} category: ${otherCommandsString(commandCategory)}`, "extraInfo")
}

const exceptionAndNonExistentCommandHandling = (commandCategory="inst", specificCommand="view") => {
    let res = null
    if (commandCategory === '__PING__') 
        res = cliHelpers.createSingleResponseMsg("API is ready for commands 🌐")
    else if (!cliCommandIndex[commandCategory])
        res = cliHelpers.createSingleResponseMsg(`Couldn't find command category "${commandCategory}"`, 'fail')
    else if (specificCommand === 'help' || specificCommand === '-h')
        res = [helpResponse(commandCategory)]
    else if (!cliCommandIndex[commandCategory][specificCommand])
        res = [
            cliHelpers.createResponse(`Couldn't find command "${specificCommand}" in the ${commandCategory} category`, 'fail'),
            helpResponse(commandCategory)
        ]
    return res
}

module.exports = {
    generalErrorResponse,
    otherCommandsString,
    exceptionAndNonExistentCommandHandling
}