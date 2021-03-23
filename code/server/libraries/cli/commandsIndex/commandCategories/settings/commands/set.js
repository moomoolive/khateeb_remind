const cliCommand = require(global.$dir + '/libraries/cli/command.js')
const cliHelpers = require(global.$dir + '/libraries/cli/main.js')

class set extends cliCommand {
    constructor(input=[], userIdentity={}, query={}) {
        super(input, userIdentity, query, ['initialize', 'options', 'setIndividual'], 5)
    }

    preprocessInput() {
        const options = this.options
        const firstOption = options[0]
        if (firstOption === '-i' || firstOption === 'init' || firstOption === this.optionsList[0])
            return [{ command: this.optionsList[0], overwrite: this.options.find(o => o === '-f' || o === 'force') }]
        else if (firstOption === '-o' || firstOption === this.optionsList[1])
            return [{ command: this.optionsList[1] }]
        else
            return [{ command: 'setIndividual', values: this.userQuery }]
    }

    indexPossibleOptions(input={ command: "initialize" }) {
        switch(input.command) {
            case this.optionsList[0]:
                return this.overwriteSettingsWithInitialValues(input)
            case this.optionsList[1]:
                return cliHelpers.createResponse('Not defined yet', "extraInfo")
            case this.optionsList[2]:
                return this.setIndividualSettings(input)
        }
    }

    async overwriteSettingsWithInitialValues({ overwrite=false }) {
        if (!overwrite)
            return [
                cliHelpers.createResponse(`Are you sure you want to overwrite current settings with default values?`, 'okay'),
                cliHelpers.createResponse(`If so, use the "-f" option`, 'extraInfo')
            ]
        try {
            await $db.institutions.updateOne({ name: "__ROOT__" }, { settings: { ...global.APP_CONFIG.rootInstitution.settingsInitial } })
            return cliHelpers.createResponse('Successfully set settings to default values')
        } catch(err) {
            console.log(err)
        }
    }

    async setIndividualSettings({ values }) {
        try {
            const institution = await $db.institutions.findOne({ name: "__ROOT__" }).select(['settings']).exec()
            const settings = { ...institution.settings, ...values }
            const updated = await $db.institutions.findOneAndUpdate({ _id: institution._id.toString() }, { settings }, { new: true }).exec()
            const updatedSettingsFields = []
            for (const [key, value] of Object.entries(updated.settings))
                updatedSettingsFields.push(cliHelpers.createResponse(`${key}: ${JSON.stringify(value)}`, 'extraInfo'))
            return [
                cliHelpers.createResponse(`Successfully set values.`),
                ...updatedSettingsFields
            ]
        } catch(err) {
            console.log(err)
        }
    }
}

module.exports = set 