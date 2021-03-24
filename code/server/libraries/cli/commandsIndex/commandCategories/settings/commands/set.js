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
                return this.listOptions()
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

    filteredTextSettings(settingsUpdate={}) {
        const textSettings = settingsUpdate.textAPIInfo
        if (!textSettings)
            return settingsUpdate
        const filteredTextSettings = {}
        const allTextFields = global.textManager.allFields
        allTextFields.forEach(f => {
            if (textSettings[f] !== undefined)
                filteredTextSettings[f] = textSettings[f]
        })
        return filteredTextSettings
    }

    async setIndividualSettings({ values }) {
        try {
            const institution = await $db.institutions.findOne({ name: "__ROOT__" }).select(['settings']).exec()
            const filteredValues = this.filteredTextSettings(values)
            const settings = { 
                ...institution.settings, 
                textAPIInfo: { ...institution.settings.textAPIInfo, ...filteredValues} 
            }
            const updated = await $db.institutions.findOneAndUpdate({ _id: institution._id.toString() }, { settings }, { new: true }).exec()
            global.textManager.refreshSettings(updated.settings.textAPIInfo)
            return [
                cliHelpers.createResponse(`Successfully set values.`),
                ...this.createUpdatesArray(updated.settings)
            ]
        } catch(err) {
            console.log(err)
        }
    }

    createUpdatesArray(updated={}) {
        const updatedSettingsFields = []
        for (const [key, value] of Object.entries(updated))
            updatedSettingsFields.push(cliHelpers.createResponse(`${key}: ${JSON.stringify(value)}`, 'extraInfo'))
        return updatedSettingsFields
    }

    listOptions() {
        const textOptions = global.textManager.allFields
            .reduce((total, f) => `${total}, textAPIInfo[${f}]`, '')
            .slice(1)
        return cliHelpers.createResponse(`autoConfirmRegistration, ${textOptions}`, 'extraInfo')
    }
}

module.exports = set 