const validator = require('express-validator')

const JSObjectRestructuringHelpers = require($rootDir + "/libraries/JSObjectRestructuring/main.js")

const validateRequest = (validators=[], section="body", options={}) => {
    return [
        ...validators,
        (req, res, next) => {
            const errors = validator.validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json(errors.array())
            }
            const containsDotInKeyName = /\./g
            const dotNotationFields = Object
                .keys(req[section])
                .filter(k => containsDotInKeyName.test(k))
            req[section] = validator.matchedData(req, { includeOptionals: false })
            if (options.doNotParseObjectSyntax) {
                req[section] = JSObjectRestructuringHelpers.restoreJSObjectDotNotation(dotNotationFields, req[section])
            }
            next()
            
        }
    ]
}

module.exports = {
    validateRequest
}