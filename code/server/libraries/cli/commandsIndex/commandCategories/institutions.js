const cliCommand = require(global.$dir + '/libraries/cli/command.js')

class view extends cliCommand {
    constructor(input=[], userIdentity={}) {
        super(input, userIdentity, ['unconfirmed', 'all'])
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
            default:
                return this.unknownOption()
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
            const institutions = await $db.institutions.find({}).select(['name']).exec() || []
            return this.formatInstitutions(institutions)
        } catch(err) {
            console.log(err)
        }
    }

    formatInstitutions(institutions=[]) {
        return institutions.map(i => { return { msg: i } })
    }
}

module.exports = {
    view
}