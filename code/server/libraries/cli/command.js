const cliHelpers = require(global.$dir + '/libraries/cli/main.js')

class cliCommand {
    constructor(input=[], userIdentity={}, optionsList=[]) {
        if (!Array.isArray(input))
            throw TypeError(`cli command input must be an array`)
        else if (Object.keys(userIdentity).length < 1)
            throw TypeError(`User identification cannot be empty`)
        this.rawInput = input
        this.userIdentity = userIdentity
        this.optionsList = optionsList
        this.effectResponses = []
    }

    get commandName() {
        return `${this.rawInput[0]} ${this.rawInput[1]}`
    }

    get options() {
        return this.rawInput.slice(2)
    }

    get allPossibleOptions() {
        return this.optionsList.reduce((total, option) => `${total}, ${option}`)
    }

    preprocessInput() {
        return this.options
    }

    defaultOptions() {
        throw TypeError(`This is a virtual class, set default options in a child class`)
    }

    async execute() {
        let proccessedInput = this.preprocessInput()
        if (proccessedInput.length < 1)
            proccessedInput = this.defaultOptions()
        for (let i = 0; i < proccessedInput.length; i++) {
            const input = proccessedInput[i]
            try {
                const optionRes = await this.indexPossibleOptions(input)
                if (!optionRes) {
                    this.effectResponses.push(cliHelpers.createResponse(`Unknown option "${input}". Please choose from the following options: ${this.allPossibleOptions}`, "extraInfo"))
                    continue
                }
                this.addResponseToResponseList(optionRes)
            } catch(err) {
                console.log(err)
                const errMsg = cliHelpers.createResponse(`An error occurred when executing option "${input}" for command. Error trace: ${err}`)
                this.effectResponses.push(errMsg)
            }
        }
        if (this.effectResponses.length < 1)
            this.effectResponses.push(cliHelpers.createResponse('No results for command', 'extraInfo'))
        return this.effectResponses
    }

    addResponseToResponseList(res={}) {
        const resFunc = ({ msg, status }) => { this.effectResponses.push(cliHelpers.createResponse(msg, status || 'success')) }
        if (Array.isArray(res))
            res.forEach(r => resFunc(r) )
        else
            resFunc(res)
    }

    unknownOption() {
        return null
    }

    indexPossibleOptions(input='option') {
        throw TypeError(`This is a virtual class, set options in child class`)
    }
}

module.exports = cliCommand