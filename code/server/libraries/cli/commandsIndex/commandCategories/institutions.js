const cliCommand = require(global.$dir + '/libraries/cli/command.js')
const cliHelpers = require(global.$dir + '/libraries/cli/main.js')

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
        return institutions.map(i => cliHelpers.createResponse(i, 'okay'))
    }
}

class confirm extends cliCommand {
    constructor(input=[], userIdentity={}) {
        super(input, userIdentity, ['nouser', 'all'])
    }

    preprocessInput() {
        const options = this.options.map(o => o.toLowerCase())
        const updatedInput = { }
        if (options[0] === 'all' || options[0] === '-a')
            updatedInput.confirmAll = true    
        else if (!options[0])
            return [{}]
        else if (options[0].length !== global.APP_CONFIG.consts.mongooseIdLength)
            return [{ invalidId: true }]
        else
            updatedInput.id = options[0]
        updatedInput.withRootAdmin = options[1] !== '-nu' && options[1] !== 'nouser'
        return [updatedInput]
    }

    indexPossibleOptions(input={}) {
        if (input.invalidId)
            return cliHelpers.createResponse(`invalid id format, please provide a valid id`, 'fail')
        if (input.confirmAll)
            return this.confirmInstitutions({ confirmed: false }, input)
        else if (input.id)
            return this.confirmInstitutions({ _id: input.id }, input)

    }

    async confirmInstitutions(query={}, { withRootAdmin }) {
        try {
            const toBeConfirmedInstitutions = await $db.institutions.find(query).exec()
            if (toBeConfirmedInstitutions.length < 1)
                return cliHelpers.createResponse(`All institutions already confirmed`, 'extraInfo')
            let numberConfirmed = 0
            for (let i = 0; i < toBeConfirmedInstitutions.length; i++) {
                const targetInstitution = toBeConfirmedInstitutions[i]
                await $db.institutions.updateOne({ _id: targetInstitution._id.toString() }, { confirmed: true })
                    if (withRootAdmin)
                        await targetInstitution.confirmRootAdmin()
                numberConfirmed++
            }
            return cliHelpers.createResponse(`Confirmed ${numberConfirmed} institutions, with${withRootAdmin ? '' : 'out'} their respective root admin`, 'okay')
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = {
    view,
    confirm
}