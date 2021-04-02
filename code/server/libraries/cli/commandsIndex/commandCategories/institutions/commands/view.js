const cliCommand = require(global.$dir + '/libraries/cli/command.js')
const cliHelpers = require(global.$dir + '/libraries/cli/main.js')

class view extends cliCommand {
    constructor(input=[], userIdentity={}, query={}) {
        super(input, userIdentity, query, ['unconfirmed', 'all'])
    }

    defaultOptions() {
        return ['-uc']
    }

    indexPossibleOptions(input='-uc') {
        switch(input) {
            case '-uc':
            case this.optionsList[0]:
                return this.unconfirmedInstitutions()
            case '-a':
            case this.optionsList[1]:
                return this.allInstitutions()
        }
    }

    async unconfirmedInstitutions() {
        try {
            const unconfirmedInstitutions = await $db.institutions.find({ confirmed: false }).select(['name']).exec() || []
            return this.formatInstitutions(unconfirmedInstitutions)
        } catch(err) {
            console.log(err)
        }
    }

    async allInstitutions() {
        try {
            const institutions = await $db.institutions.find({}).select(['name', "confirmed"]).exec() || []
            return this.formatInstitutions(institutions)
        } catch(err) {
            console.log(err)
        }
    }

    formatInstitutions(institutions=[]) {
        return institutions.map(i => cliHelpers.createResponse(i, 'okay'))
    }
}

module.exports = view