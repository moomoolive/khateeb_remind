// takes a list of fields that should be in dot notation
// examples: "example.parse", "parse.me.please"
// then finds the corresponding fields in target object
// examples { example: { parse: val } }, { parse: { me: { please: val } } }
// and replaces then with dot notation
// { "example.parse": val }, { "parse.me.please": val }
function restoreJSObjectDotNotation(fieldNames=[], targetObject={}) {
    try {
        if (fieldNames.length <= 0) {
            return targetObject
        }
        const obj = {}
        const firstKeys = []
        fieldNames.forEach(f => {
            const objectDepth = f.split(".")
            const val = objectDepth.reduce((total, oD) => total[oD], targetObject)
            if (val !== undefined) {
                targetObject[f] = val
                firstKeys.push(objectDepth[0])
            }
        })
        Object.keys(targetObject)
            // filter out keys with nested objects 
            // then copy them to return object
            .filter(k => !firstKeys.find(fK => fK === k))
            .forEach(k => obj[k] = targetObject[k])
        return obj
    } catch {
        return targetObject
    }
}

module.exports = {
    restoreJSObjectDotNotation
}