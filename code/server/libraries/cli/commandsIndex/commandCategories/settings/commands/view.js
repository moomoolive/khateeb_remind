const cliCommand = require(global.$dir + '/libraries/cli/command.js')
const cliHelpers = require(global.$dir + '/libraries/cli/main.js')

class view extends cliCommand {
    constructor(input=[], userIdentity={}, query={}) {
        super(input, userIdentity, query, ['all', /*'options'*/])
    }

    defaultOptions() {
        return ['-a']
    }

    indexPossibleOptions(input='-a') {
        switch(input) {
            case '-a':
            case this.optionsList[0]:
                return this.allSettings()
        }
    }

    async allSettings() {
        try {
            const rootInstitution = await $db.institutions.findOne({ name: "__ROOT__" }).select(["settings"]).exec()
            let response = []
            for (const [key, value] of Object.entries(rootInstitution.settings))
                response.push(cliHelpers.createResponse(`${key}: ${this.createDisplayValue(value)}`, 'okay'))
            return response
        } catch(err) {
            console.log(err)
        }
    }

    createDisplayValue(value) {
        return typeof value === 'object' ? JSON.stringify(value) : value
    }
}

module.exports = view