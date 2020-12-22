import helpers from './helpers.js'

export default {
    deepCopy(item) {
        return JSON.parse(JSON.stringify(item))
    },
    stringFormat(string, format='camel', output='title') {
        const casedArray = helpers[format + 'CaseToArray'](string)
        return helpers.arrayToString(casedArray, output)
    }
}