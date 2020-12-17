export default {
    deepCopy(item) {
        return JSON.parse(JSON.stringify(item))
    },
    parseCamelCase(camelCase, format='toLower') {
        const parsed = camelCase.split(/(?=[A-Z])/)
        let phrase = ''
        for (let word of parsed) {
            let x = format === 'title' ? 
                word.charAt(0).toUpperCase() + word.slice(1) : word[format + 'Case']()
            phrase += `${x} `
        }
        return phrase
    }
}